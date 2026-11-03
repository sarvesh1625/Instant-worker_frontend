import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppShell from '../components/AppShell';
import '../styles/theme.css';

// Account deletion page. Uses the existing routes GET/POST/DELETE /api/account/delete-request.
// The request is reviewed by our team (within 7 days); the account is not removed instantly.
export default function DeleteAccount() {
  const navigate = useNavigate();
  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const load = async () => {
    try { const { data } = await axios.get('/api/account/delete-request'); setReq(data.request); }
    catch { setReq(null); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const pending = req?.status === 'pending';
  const ready = confirmText.trim().toUpperCase() === 'DELETE';

  const submit = async () => {
    if (!ready || busy) return;
    setBusy(true); setError(''); setOk('');
    try {
      const { data } = await axios.post('/api/account/delete-request', { reason });
      setReq(data.request); setReason(''); setConfirmText('');
      setOk('Request sent. Our team will review it within 7 days.');
    } catch (e) { setError(e.response?.data?.message || 'Could not send the request. Try again.'); }
    finally { setBusy(false); }
  };

  const cancel = async () => {
    if (!confirm('Cancel your account deletion request?')) return;
    setBusy(true); setError(''); setOk('');
    try { await axios.delete('/api/account/delete-request'); setReq(null); setOk('Request cancelled. Your account stays active.'); }
    catch (e) { setError(e.response?.data?.message || 'Failed'); }
    finally { setBusy(false); }
  };

  return (
    <AppShell>
      <div className="il-page">
        <div className="il-topbar il-topbar-brand">
          <div className="il-topbar-inner" style={{ maxWidth: 640 }}>
            <button onClick={() => navigate(-1)} className="il-back-btn"><i className="ti ti-arrow-left" aria-hidden="true"></i></button>
            <h1 className="il-topbar-title">Delete my account</h1>
          </div>
        </div>

        <div className="il-shell" style={{ maxWidth: 640 }}>
          <div className="il-card il-card-pad">
            {loading ? <p className="il-muted">Loading...</p> : pending ? (
              <div style={{ textAlign: 'center' }}>
                <i className="ti ti-clock" style={{ fontSize: 34, color: '#B45309' }} aria-hidden="true"></i>
                <h2 style={{ margin: '8px 0 6px', fontSize: 17 }}>Deletion request under review</h2>
                <p className="il-muted" style={{ margin: '0 0 16px', fontSize: 13.5, lineHeight: 1.7 }}>
                  Sent on {new Date(req.requestedAt).toLocaleDateString('en-IN')}. Our team will process it within 7 days.
                </p>
                <button className="il-btn il-btn-outline" onClick={cancel} disabled={busy}>Cancel my request</button>
              </div>
            ) : (
              <>
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 14, marginBottom: 18 }}>
                  <p style={{ margin: 0, fontSize: 13.5, color: '#991B1B', lineHeight: 1.7 }}>
                    Deleting your account removes your profile, job history and personal data. Once approved it cannot be undone.
                  </p>
                  <p style={{ margin: '8px 0 0', fontSize: 13.5, color: '#991B1B', lineHeight: 1.7, fontWeight: 700 }}>
                    Before you ask: finish or close your active jobs, and settle any pending payment.
                  </p>
                </div>

                <label className="il-label">Why are you leaving? (optional)</label>
                <textarea className="il-textarea" rows={3} maxLength={500} value={reason} onChange={e => setReason(e.target.value)} placeholder="Your feedback helps us improve" />

                <label className="il-label" style={{ marginTop: 14 }}>Type DELETE to confirm</label>
                <input className="il-input" value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="DELETE" />

                <button onClick={submit} disabled={!ready || busy} style={{
                  width: '100%', marginTop: 18, padding: '13px 16px', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 14,
                  color: '#fff', background: ready ? 'var(--danger)' : 'var(--border-strong)', cursor: ready && !busy ? 'pointer' : 'not-allowed',
                }}>
                  {busy ? 'Sending...' : 'Request account deletion'}
                </button>
              </>
            )}
            {error && <p style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600, textAlign: 'center', marginTop: 14 }}>{error}</p>}
            {ok && <p style={{ color: 'var(--success, #16a34a)', fontSize: 13, fontWeight: 600, textAlign: 'center', marginTop: 14 }}>{ok}</p>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}