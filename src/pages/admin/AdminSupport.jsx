import { useState } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, inputStyle } from './adminTheme';
import { Title, Card, Chip, Btn, fmt, fmtDate, errMsg } from './adminUi';

function Row({ k, v }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12.5, borderBottom: `1px solid ${T.border}` }}><span style={{ color: T.textTertiary }}>{k}</span><span style={{ color: T.text }}>{v}</span></div>;
}

function Content() {
  const [phone, setPhone] = useState('');
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const find = async (e) => {
    e && e.preventDefault();
    setErr(''); setD(null);
    try { const { data } = await adminAxios.get(`/api/admin/ops/support/lookup?phone=${encodeURIComponent(phone)}`); setD(data); }
    catch (x) { setErr(errMsg(x)); }
  };
  const act = async (path, label) => {
    const reason = prompt(`${label} — write a reason (saved in the action log):`);
    if (!reason || reason.trim().length < 5) return;
    setBusy(true);
    try { await adminAxios.post(`/api/admin/ops/support/${d.user._id}/${path}`, { reason }); await find(); alert('Done'); }
    catch (x) { alert(errMsg(x)); } finally { setBusy(false); }
  };

  const u = d?.user, s = d?.stats || {};
  return (
    <div>
      <Title title="Support" sub="Look up a person by phone number and fix common problems." />
      <form onSubmit={find} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" style={{ ...inputStyle, maxWidth: 260 }} />
        <Btn onClick={find}>Find</Btn>
      </form>
      {err && <p style={{ color: '#F87171', fontSize: 13 }}>{err}</p>}
      {d && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
          <Card>
            <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 800, color: T.text }}>{u.name} <span style={{ fontWeight: 400, color: T.textTertiary }}>· {u.role}</span></p>
            <Row k="Phone" v={u.phone} />
            <Row k="City / area" v={[u.area, u.city].filter(Boolean).join(', ') || '—'} />
            <Row k="Joined" v={fmtDate(u.createdAt)} />
            <Row k="Account" v={u.accountStatus} />
            <Row k="Login locked" v={d.locked ? 'Yes' : 'No'} />
            <Row k="ID verification" v={u.idVerification?.status || 'not_submitted'} />
            <Row k="Jobs posted / applied" v={`${d.jobsPosted} / ${d.jobsApplied}`} />
            <Row k="Jobs with payment pending" v={d.pendingPay} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <Btn disabled={busy} onClick={() => act('unlock', 'Unlock login')}>Unlock login</Btn>
              <Btn kind="ghost" disabled={busy} onClick={() => act('clear-code-locks', 'Clear start/payment code locks')}>Clear code locks</Btn>
            </div>
          </Card>
          <Card>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: T.text }}>Login activity <span style={{ fontWeight: 400, color: T.textTertiary }}>(since logging started)</span></p>
            <Row k="Successful logins" v={s.loginCount || 0} />
            <Row k="Failed logins" v={s.failedLoginCount || 0} />
            <Row k="Forgot-password requests" v={s.forgotPasswordCount || 0} />
            <Row k="Last login" v={fmt(s.lastLoginAt)} />
            <p style={{ margin: '12px 0 6px', fontSize: 12.5, color: T.textSecondary, fontWeight: 700 }}>Recent events</p>
            {d.events.length === 0 && <p style={{ fontSize: 12, color: T.textTertiary }}>None recorded</p>}
            {d.events.map(e => (
              <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0' }}>
                <span style={{ color: T.textSecondary }}>{e.type.replace('_', ' ')}</span>
                <span><Chip color={e.success ? T.success : '#F87171'} bg={e.success ? T.successBg : T.dangerBg}>{e.success ? 'ok' : 'failed'}</Chip> <span style={{ color: T.textTertiary }}>{fmt(e.createdAt)}</span></span>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

export default function AdminSupport() {
  return <AdminAuthGuard><AdminLayout><Content /></AdminLayout></AdminAuthGuard>;
}