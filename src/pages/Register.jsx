import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Msg91OtpWidget from '../components/Msg91OtpWidget';
import '../styles/theme.css';

const SKILLS = ['Labour','Painter','Carpenter','Electrician','Mechanic','Farmer','Driver','Plumber','Welder','Other'];

// From your MSG91 dashboard — tokenAuth is safe to expose client-side,
// unlike the account authkey (which stays server-only, see authController).
const MSG91_WIDGET_ID  = import.meta.env.VITE_MSG91_WIDGET_ID;
const MSG91_TOKEN_AUTH = import.meta.env.VITE_MSG91_TOKEN_AUTH;

export default function Register() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); // reuse token/user-setting logic after registration

  const [step, setStep] = useState(1); // 1: role, 2: details, 3: verifying
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', password: '', skill: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [widgetTrigger, setWidgetTrigger] = useState(0);
  const [verifying, setVerifying] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const selectRole = (r) => { setRole(r); setStep(2); };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    // Trigger MSG91's popup for this phone number — the widget shows its
    // own OTP-entry UI, then calls onVerified/onError below.
    setStep(3);
    setVerifying(true);
    setWidgetTrigger(t => t + 1);
  };

  const handleVerified = async (accessToken) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/api/auth/register-msg91', {
        accessToken,
        name: form.name,
        password: form.password,
        role,
        skill: role === 'worker' ? form.skill : undefined,
      });
      // Same finish as AuthContext.login/register — store token, set header
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      window.location.href = '/dashboard'; // full reload so AuthContext picks up the new session cleanly
    } catch (err) {
      setError(err.response?.data?.message || 'Could not complete registration');
      setStep(2); // let them retry from details, e.g. if phone was already registered
      setVerifying(false);
    } finally {
      setLoading(false);
    }
  };

  const handleWidgetError = (err) => {
    setVerifying(false);
    setError(err?.message || 'Phone verification failed or was cancelled. Please try again.');
    setStep(2);
  };

  if (!MSG91_WIDGET_ID || !MSG91_TOKEN_AUTH) {
    return (
      <div className="il-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20 }}>
        <div className="il-card il-card-pad" style={{ maxWidth: 420, textAlign: 'center' }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: 32, color: 'var(--danger)' }} aria-hidden="true"></i>
          <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text)' }}>
            Registration is temporarily unavailable — missing OTP configuration. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: 'var(--font)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 26 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #047857, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-bolt" style={{ fontSize: 21, color: '#fff' }} aria-hidden="true"></i>
          </div>
          <span style={{ fontSize: 19, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Instant<span style={{ color: '#059669' }}>Worker</span>
          </span>
        </button>

        {/* ── Step 1: role ── */}
        {step === 1 && (
          <>
            <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Create your account</h1>
            <p style={{ margin: '0 0 22px', fontSize: 14, color: 'var(--text-secondary)' }}>How will you use Instant Worker?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => selectRole('worker')} className="il-card il-card-pad" style={{ cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-hammer" style={{ fontSize: 23, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
                </div>
                <div><p style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>I want to work</p><p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-tertiary)' }}>Find jobs near you</p></div>
              </button>
              <button onClick={() => selectRole('user')} className="il-card il-card-pad" style={{ cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-user-search" style={{ fontSize: 23, color: 'var(--secondary-dark)' }} aria-hidden="true"></i>
                </div>
                <div><p style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>I need workers</p><p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-tertiary)' }}>Post jobs and hire</p></div>
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: details ── */}
        {step === 2 && (
          <>
            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
              <i className="ti ti-arrow-left" aria-hidden="true"></i> Back
            </button>
            <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Your details</h1>
            <p style={{ margin: '0 0 22px', fontSize: 14, color: 'var(--text-secondary)' }}>We'll verify your number with an OTP next</p>

            {error && (
              <div style={{ background: 'var(--danger-bg)', border: '1px solid #fecaca', borderRadius: 12, padding: '11px 15px', marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleDetailsSubmit}>
              <div className="il-field">
                <label className="il-label">Full name</label>
                <input className="il-input" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
              </div>
              <div className="il-field">
                <label className="il-label">Mobile number</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', fontSize: 14, fontWeight: 700, color: 'var(--text-tertiary)' }}>+91</span>
                  <input className="il-input" name="phone" value={form.phone} onChange={handleChange} required
                    placeholder="10-digit number" inputMode="numeric" maxLength={10} style={{ paddingLeft: 52 }} />
                </div>
              </div>
              <div className="il-field">
                <label className="il-label">Password</label>
                <input className="il-input" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="At least 6 characters" />
              </div>
              {role === 'worker' && (
                <div className="il-field">
                  <label className="il-label">Your main skill</label>
                  <select className="il-select" name="skill" value={form.skill} onChange={handleChange} required>
                    <option value="">Select skill</option>
                    {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
              <button type="submit" className="il-btn il-btn-primary il-btn-block" style={{ marginTop: 8, padding: 14 }}>
                Continue to verification <i className="ti ti-arrow-right" style={{ fontSize: 17 }} aria-hidden="true"></i>
              </button>
            </form>
          </>
        )}

        {/* ── Step 3: MSG91 widget handles OTP entry in its own popup ── */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <span className="il-spinner" style={{ width: 28, height: 28, borderWidth: 3, borderTopColor: 'var(--primary)', borderColor: 'var(--primary-light)' }}></span>
            <p style={{ marginTop: 16, fontSize: 14, color: 'var(--text-secondary)' }}>
              {loading ? 'Creating your account...' : 'Enter the OTP sent to your phone in the popup...'}
            </p>
            {error && (
              <div style={{ background: 'var(--danger-bg)', border: '1px solid #fecaca', borderRadius: 12, padding: '11px 15px', margin: '16px auto 0', maxWidth: 340 }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>{error}</p>
              </div>
            )}
            {verifying && (
              <Msg91OtpWidget
                widgetId={MSG91_WIDGET_ID}
                tokenAuth={MSG91_TOKEN_AUTH}
                identifier={`91${form.phone.trim()}`}
                trigger={widgetTrigger}
                onVerified={handleVerified}
                onError={handleWidgetError}
              />
            )}
          </div>
        )}

        {step !== 3 && (
          <p style={{ textAlign: 'center', marginTop: 26, fontSize: 13, color: 'var(--text-tertiary)' }}>
            Already have an account? <Link to="/login" className="il-link">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
}