import { useState, useEffect } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, inputStyle } from './adminTheme';
import { Title, Card, Chip, Empty, Pager, fmt, fmtDate } from './adminUi';

const TYPES = { login: 'Login', register: 'Register', forgot_password: 'Forgot password', reset_password: 'Password reset' };

function Content() {
  const [f, setF] = useState({ type: '', success: '', days: '7' });
  const [page, setPage] = useState(1);
  const [d, setD] = useState({ events: [], summary: [], topForgot: [], recent: [], pages: 1 });
  useEffect(() => {
    const p = new URLSearchParams({ page, days: f.days });
    if (f.type) p.append('type', f.type);
    if (f.success) p.append('success', f.success);
    adminAxios.get(`/api/admin/ops/activity?${p}`).then(r => setD(r.data)).catch(() => {});
  }, [f, page]);

  const sum = (t, s) => (d.summary.find(x => x.type === t && x.success === s) || {}).n || 0;
  return (
    <div>
      <Title title="Activity" sub="Logins, sign-ups and forgot-password. Recorded from the day this was deployed; earlier history does not exist." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10, marginBottom: 16 }}>
        {Object.entries(TYPES).map(([t, l]) => (
          <Card key={t} style={{ padding: 12 }}>
            <p style={{ margin: 0, fontSize: 11.5, color: T.textSecondary }}>{l} ({f.days}d)</p>
            <p style={{ margin: '3px 0 0', fontSize: 18, fontWeight: 800, color: T.text }}>{sum(t, true)} <span style={{ fontSize: 12, color: '#F87171', fontWeight: 600 }}>{sum(t, false)} failed</span></p>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14, marginBottom: 18 }}>
        <Card>
          <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: T.text }}>Most forgot-password requests</p>
          {d.topForgot.length === 0 && <p style={{ fontSize: 12, color: T.textTertiary }}>None yet</p>}
          {d.topForgot.map(x => <div key={x._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '3px 0', color: T.textSecondary }}><span>{x.user?.name} · {x.user?.phone}</span><b style={{ color: T.text }}>{x.forgotPasswordCount}</b></div>)}
        </Card>
        <Card>
          <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: T.text }}>Newest accounts (join date)</p>
          {d.recent.map(x => <div key={x._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '3px 0', color: T.textSecondary }}><span>{x.name} · {x.role}</span><span>{fmtDate(x.createdAt)}</span></div>)}
        </Card>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <select value={f.type} onChange={e => { setF({ ...f, type: e.target.value }); setPage(1); }} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="">All types</option>{Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={f.success} onChange={e => { setF({ ...f, success: e.target.value }); setPage(1); }} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="">Any result</option><option value="true">Succeeded</option><option value="false">Failed</option>
        </select>
        <select value={f.days} onChange={e => { setF({ ...f, days: e.target.value }); setPage(1); }} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="1">Last 24 hours</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {d.events.map(e => (
          <Card key={e._id} style={{ padding: '9px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', fontSize: 12.5 }}>
              <span style={{ color: T.text }}>{TYPES[e.type]} · {e.user?.name || 'Unknown'} <span style={{ color: T.textTertiary }}>{e.phone}</span></span>
              <span><Chip color={e.success ? T.success : '#F87171'} bg={e.success ? T.successBg : T.dangerBg}>{e.success ? 'ok' : 'failed'}</Chip> <span style={{ color: T.textTertiary }}>{fmt(e.createdAt)}</span></span>
            </div>
          </Card>
        ))}
        {d.events.length === 0 && <Empty>No events in this range</Empty>}
      </div>
      <Pager page={page} pages={d.pages} setPage={setPage} />
    </div>
  );
}

export default function AdminActivity() {
  return <AdminAuthGuard><AdminLayout><Content /></AdminLayout></AdminAuthGuard>;
}