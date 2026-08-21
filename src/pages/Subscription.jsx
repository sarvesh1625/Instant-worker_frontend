import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLang } from '../context/LangContext';
import AppShell from '../components/AppShell';
import '../styles/theme.css';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const cycleLabel = (months) => {
  if (months === 1)  return '/month';
  if (months === 12) return '/year';
  return `/${months} months`;
};

export default function Subscription() {
  const navigate = useNavigate();
  const { t } = useLang();

  const [enabled, setEnabled]   = useState(null);
  const [plans, setPlans]       = useState([]);
  const [mySub, setMySub]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [processing, setProcessing] = useState(false);
  const [confirming, setConfirming] = useState(false); // NEW — distinct "verifying your payment" state
  const [error, setError]       = useState('');

  const load = async () => {
    try {
      const statusRes = await axios.get('/api/subscriptions/status');
      setEnabled(statusRes.data.enabled);

      if (statusRes.data.enabled) {
        const [plansRes, myRes] = await Promise.all([
          axios.get('/api/subscriptions/plans'),
          axios.get('/api/subscriptions/my'),
        ]);
        setPlans(plansRes.data.plans || []);
        setMySub(myRes.data.subscription);
      }
    } catch (err) {
      console.error(err);
      setEnabled(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const handleSubscribe = async (planId) => {
    setError(''); setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Could not load payment gateway. Check your connection and try again.');
        setProcessing(false);
        return;
      }

      const { data } = await axios.post('/api/subscriptions/checkout', { planId });

      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        subscription_id: data.razorpaySubscriptionId,
        name: 'Instant Worker',
        description: `${data.plan.name} — ₹${data.plan.price}${cycleLabel(data.plan.intervalMonths)}`,
        theme: { color: '#059669' },

        // FIX: this now receives Razorpay's actual response object —
        // razorpay_payment_id, razorpay_subscription_id, and
        // razorpay_signature — and verifies+activates immediately via
        // /api/subscriptions/verify, instead of just waiting a few seconds
        // and hoping the webhook arrived. The webhook still exists as a
        // backup for renewals, but the FIRST activation no longer depends
        // on it at all.
        handler: async function (response) {
          setProcessing(false);
          setConfirming(true);
          try {
            await axios.post('/api/subscriptions/verify', {
              razorpay_payment_id:      response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature:       response.razorpay_signature,
            });
            await load(); // refresh — should now show as active immediately
          } catch (err) {
            setError(err.response?.data?.message || 'Payment succeeded but we could not confirm it automatically. Contact support with your payment ID: ' + response.razorpay_payment_id);
          } finally {
            setConfirming(false);
          }
        },

        modal: {
          ondismiss: function () { setProcessing(false); },
        },
      });

      rzp.on('payment.failed', function (resp) {
        setError(resp.error?.description || 'Payment failed. Please try again.');
        setProcessing(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start checkout');
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel your subscription? You will keep access until your current period ends.')) return;
    setProcessing(true);
    try {
      const { data } = await axios.post('/api/subscriptions/cancel');
      alert(data.message);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 18px', textAlign: 'center' }}>
          <span className="il-spinner"></span>
        </div>
      </AppShell>
    );
  }

  if (!enabled) {
    return (
      <AppShell>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '60px 18px', textAlign: 'center' }}>
          <i className="ti ti-crown-off" style={{ fontSize: 40, color: 'var(--text-tertiary)' }} aria-hidden="true"></i>
          <p style={{ marginTop: 14, fontSize: 14.5, color: 'var(--text-secondary)' }}>
            Subscriptions aren't available right now.
          </p>
          <button onClick={() => navigate('/dashboard')} className="il-btn il-btn-outline" style={{ marginTop: 18 }}>
            Back to Dashboard
          </button>
        </div>
      </AppShell>
    );
  }

  // NEW — full-screen confirming state, shown the instant checkout succeeds
  // while /verify is running (usually under a second, but worth a clear
  // "hold on" state rather than nothing).
  if (confirming) {
    return (
      <AppShell>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 18px', textAlign: 'center' }}>
          <span className="il-spinner" style={{ width: 30, height: 30 }}></span>
          <p style={{ marginTop: 18, fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Confirming your payment...</p>
          <p style={{ marginTop: 4, fontSize: 12.5, color: 'var(--text-tertiary)' }}>This only takes a moment.</p>
        </div>
      </AppShell>
    );
  }

  const isActive = mySub?.status === 'active';
  const isCancelledButLive = mySub?.status === 'cancelled' && mySub.currentPeriodEnd && new Date(mySub.currentPeriodEnd) > new Date();

  const bestValueId = plans.length > 1
    ? plans.reduce((best, p) => (p.price / p.intervalMonths) < (best.price / best.intervalMonths) ? p : best, plans[0])._id
    : null;

  return (
    <AppShell>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '22px 18px 40px' }}>

        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          <i className="ti ti-crown" style={{ fontSize: 24, color: '#F59E0B', marginRight: 8, verticalAlign: -2 }} aria-hidden="true"></i>
          Subscription
        </h1>
        <p style={{ margin: '0 0 22px', fontSize: 13.5, color: 'var(--text-secondary)' }}>
          Get instant access to new jobs the moment they're posted
        </p>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid #fecaca', borderRadius: 12, padding: '11px 15px', marginBottom: 18 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>{error}</p>
          </div>
        )}

        {(isActive || isCancelledButLive) && mySub && (
          <div className="il-card il-card-pad" style={{
            marginBottom: 24, background: 'linear-gradient(135deg, #059669, #10B981)', border: 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="ti ti-circle-check-filled" style={{ fontSize: 24, color: '#fff' }} aria-hidden="true"></i>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#fff' }}>
                  You're on {mySub.plan?.name} {isCancelledButLive && '(cancelling)'}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,.85)' }}>
                  {isCancelledButLive
                    ? `Access continues until ${new Date(mySub.currentPeriodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                    : `Renews ${new Date(mySub.currentPeriodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                </p>
              </div>
              {isActive && !isCancelledButLive && (
                <button onClick={handleCancel} disabled={processing} style={{
                  background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)',
                  borderRadius: 10, padding: '8px 14px', color: '#fff', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', flexShrink: 0,
                }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {mySub?.status === 'pending' && (
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '13px 16px', marginBottom: 24, display: 'flex', gap: 10 }}>
            <i className="ti ti-clock" style={{ fontSize: 17, color: '#B45309', flexShrink: 0, marginTop: 1 }} aria-hidden="true"></i>
            <p style={{ margin: 0, fontSize: 12.5, color: '#92400E' }}>
              Your payment is being confirmed. This usually takes a few seconds — refresh if it doesn't update shortly.
            </p>
          </div>
        )}

        {!isActive && (
          <>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px', marginBottom: 20 }}>
              <p style={{ margin: '0 0 10px', fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>What you get:</p>
              {[
                'Instant access to every new job — regular and urgent',
                'A real head start on urgent jobs, which confirm the first worker to accept',
                'No change to anything else — same zero-commission, same free application, same everything',
              ].map(line => (
                <div key={line} style={{ display: 'flex', gap: 9, marginBottom: 7, alignItems: 'flex-start' }}>
                  <i className="ti ti-circle-check-filled" style={{ fontSize: 16, color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} aria-hidden="true"></i>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{line}</span>
                </div>
              ))}
            </div>

            {plans.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13, padding: '20px 0' }}>
                No plans available right now.
              </p>
            )}

            <div className="sub-plans-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              {plans.map(plan => {
                const isBest = plan._id === bestValueId && plans.length > 1;
                const perMonth = Math.round(plan.price / plan.intervalMonths);
                return (
                  <div key={plan._id} className="il-card il-card-pad" style={{
                    position: 'relative', textAlign: 'center',
                    border: isBest ? '2px solid var(--primary)' : undefined,
                  }}>
                    {isBest && (
                      <span style={{
                        position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--primary)', color: '#fff', fontSize: 10, fontWeight: 800,
                        padding: '3px 12px', borderRadius: 999, whiteSpace: 'nowrap',
                      }}>
                        BEST VALUE
                      </span>
                    )}
                    <p style={{ margin: '6px 0 2px', fontSize: 14.5, fontWeight: 800, color: 'var(--text)' }}>{plan.name}</p>
                    <p style={{ margin: '10px 0 2px', fontSize: 30, fontWeight: 800, color: 'var(--primary-dark)' }}>
                      ₹{plan.price}
                    </p>
                    <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--text-tertiary)' }}>
                      {cycleLabel(plan.intervalMonths)}
                    </p>
                    {plan.intervalMonths > 1 && (
                      <p style={{ margin: '0 0 14px', fontSize: 11, color: 'var(--text-tertiary)' }}>
                        (₹{perMonth}/month)
                      </p>
                    )}
                    <button
                      onClick={() => handleSubscribe(plan._id)}
                      disabled={processing}
                      className="il-btn il-btn-primary il-btn-block"
                      style={{ marginTop: plan.intervalMonths > 1 ? 0 : 14 }}
                    >
                      {processing ? 'Please wait...' : 'Subscribe'}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <p style={{ textAlign: 'center', marginTop: 26, fontSize: 11.5, color: 'var(--text-tertiary)' }}>
          Payments are processed securely by Razorpay. You can cancel anytime — you'll keep access until your current billing period ends.
        </p>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .sub-plans-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </AppShell>
  );
}