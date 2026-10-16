import { useState, useEffect, useCallback } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T } from './adminTheme';

const btn = (bg, color, border) => ({
  padding: '8px 12px', borderRadius: T.radiusSm, border: border || 'none', background: bg, color,
  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.font,
});

function PaymentsContent() {
  const [enabled, setEnabled]   = useState(true);
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [busy, setBusy]         = useState('');

  const load = useCallback(async () => {
    try {
      const [s, p] = await Promise.all([
        adminAxios.get('/api/admin/settings'),
        adminAxios.get('/api/admin/payments'),
      ]);
      setEnabled(s.data.settings?.paymentOtpEnabled !== false);
      setRows(p.data.payments || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggle = async () => {
    if (!confirm(enabled
      ? 'Turn OFF payment codes? Completed jobs will go back to the old flow (no code, no posting block).'
      : 'Turn ON payment codes?')) return;
    setBusy('toggle');
    try {
      const { data } = await adminAxios.patch('/api/admin/settings/payment-otp', { enabled: !enabled });
      setEnabled(data.settings.paymentOtpEnabled);
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setBusy(''); }
  };

  const resolve = async (r) => {
    if (!confirm(`Confirm payment for "${r.title}" on behalf of ${r.poster?.name}? Chat/call between them will close.`)) return;
    setBusy(`r-${r.jobId}-${r.worker?._id}`);
    try {
      await adminAxios.patch(`/api/admin/payments/${r.jobId}/${r.worker._id}/resolve`);
      await load();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setBusy(''); }
  };

  const setOverride = async (r, allow) => {
    setBusy(`o-${r.poster._id}`);
    try {
      await adminAxios.patch(`/api/admin/users/${r.poster._id}/posting-override`, { allow });
      await load();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setBusy(''); }
  };

  if (loading) return <p style={{ color: T.textTertiary, fontSize: 13.5 }}>Loading...</p>;

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Payments</h1>
      <p style={{ margin: '0 0 22px', fontSize: 13.5, color: T.textTertiary }}>
        Workers give a 6-digit code after they are paid. Until the poster enters it, the poster cannot post new jobs.
      </p>

      <div style={{ background: T.surface, border: `1px solid ${enabled ? T.accent : T.border}`, borderRadius: T.radiusMd, padding: 18, maxWidth: 640, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: T.text }}>Payment code rule: {enabled ? 'ON' : 'OFF'}</p>
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: T.textSecondary }}>
            ON: code needed, posting blocked while unpaid, chat/call close after the code. OFF: old behaviour.
          </p>
        </div>
        <button onClick={toggle} disabled={busy === 'toggle'} style={btn(enabled ? T.danger : T.accent, '#fff')}>
          {enabled ? 'Turn off' : 'Turn on'}
        </button>
      </div>

      <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 800, color: T.text }}>Waiting for a payment code ({rows.length})</h2>
      {rows.length === 0 && <p style={{ color: T.textTertiary, fontSize: 13.5 }}>Nothing is waiting.</p>}

      <div style={{ display: 'grid', gap: 10 }}>
        {rows.map(r => {
          const key = `${r.jobId}-${r.worker?._id}`;
          const overridden = !!r.poster?.postingOverride;
          return (
            <div key={key} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, color: T.text }}>{r.title} · ₹{r.wage}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 12.5, color: T.textSecondary }}>
                    Poster: {r.poster?.name} ({r.poster?.phone}) → Worker: {r.worker?.name} ({r.worker?.phone})
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11.5, color: T.textTertiary }}>
                    Completed {r.completedAt ? new Date(r.completedAt).toLocaleString() : '—'}{r.locked ? ' · poster locked out (too many wrong codes)' : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <button onClick={() => resolve(r)} disabled={busy === `r-${key}`} style={btn(T.accent, '#fff')}>Confirm payment</button>
                  {overridden
                    ? <button onClick={() => setOverride(r, false)} disabled={busy === `o-${r.poster._id}`} style={btn('transparent', T.textSecondary, `1px solid ${T.border}`)}>Remove posting allowance</button>
                    : <button onClick={() => setOverride(r, true)}  disabled={busy === `o-${r.poster._id}`} style={btn('transparent', T.success, `1px solid ${T.success}`)}>Let poster post again</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminPayments() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <PaymentsContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}