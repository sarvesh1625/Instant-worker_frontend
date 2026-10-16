import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/theme.css';

/**
 * mode="enter" (poster): types the 6-digit code the worker tells them.
 * mode="show"  (worker): reads their code from the server and shows it.
 */
export default function PaymentCodeModal({ open, mode, jobId, workerId, otherName, wage, onClose, onDone }) {
  const [code, setCode]   = useState('');
  const [shown, setShown] = useState('');
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState('');
  const [done, setDone]   = useState(false);

  useEffect(() => {
    if (!open) return;
    setCode(''); setShown(''); setError(''); setDone(false);
    if (mode === 'show' && jobId) {
      setBusy(true);
      axios.get(`/api/jobs/${jobId}/payment-otp`)
        .then(({ data }) => setShown(data.otp || ''))
        .catch(err => setError(err.response?.data?.message || 'Could not load your code'))
        .finally(() => setBusy(false));
    }
  }, [open, mode, jobId]);

  if (!open) return null;

  const submit = async () => {
    if (!/^\d{6}$/.test(code)) { setError('Enter the 6-digit code'); return; }
    setBusy(true); setError('');
    try {
      await axios.post(`/api/jobs/${jobId}/applicants/${workerId}/confirm-payment`, { otp: code });
      setDone(true);
      onDone && onDone();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not confirm payment');
    } finally { setBusy(false); }
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 380, textAlign: 'center' }}>
        {mode === 'show' ? (
          <>
            <h3 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 800 }}>Your payment code</h3>
            {busy ? <p className="il-muted">Loading...</p> : !!shown && (
              <>
                <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: 6, color: 'var(--primary-dark)', margin: '14px 0' }}>{shown.slice(0, 3)} {shown.slice(3)}</div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 6px' }}>Tell this code to the poster only after you have received ₹{wage}.</p>
                <p style={{ fontSize: 12, color: '#A16207', fontWeight: 700, margin: 0 }}>Say it out loud — do not send it before you are paid.</p>
              </>
            )}
          </>
        ) : done ? (
          <>
            <div style={{ fontSize: 40 }}>✅</div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>Payment confirmed. This job is finished and chat and call are closed.</p>
          </>
        ) : (
          <>
            <h3 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 800 }}>Confirm payment</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 14px' }}>
              After you pay {otherName || 'the worker'}, ask them for the 6-digit code shown in their app and type it here.
            </p>
            <input
              value={code} inputMode="numeric" autoFocus maxLength={6} placeholder="6-digit code"
              onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
              style={{ width: '100%', boxSizing: 'border-box', fontSize: 26, fontWeight: 800, letterSpacing: 8, textAlign: 'center', padding: '12px 8px', border: '1.5px solid var(--border-strong, #CBD5E1)', borderRadius: 12, marginBottom: 12 }}
            />
            <button onClick={submit} disabled={busy || code.length !== 6} className="il-btn il-btn-primary il-btn-block" style={{ padding: 13 }}>
              {busy ? 'Checking...' : 'Confirm payment'}
            </button>
          </>
        )}
        {!!error && <p style={{ color: 'var(--danger, #EF4444)', fontSize: 13, fontWeight: 700, margin: '12px 0 0' }}>{error}</p>}
        <button onClick={onClose} style={{ marginTop: 14, background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer' }}>Close</button>
      </div>
    </div>
  );
}