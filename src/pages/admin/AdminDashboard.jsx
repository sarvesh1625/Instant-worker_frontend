import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T } from './adminTheme';
import { Title, Card, Empty } from './adminUi';

function Stat({ icon, color, bg, label, value, sub }) {
  return (
    <Card style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className={`ti ${icon}`} style={{ fontSize: 20, color }} aria-hidden="true"></i>
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text, lineHeight: 1.1 }}>{value ?? '—'}</p>
          <p style={{ margin: '2px 0 0', fontSize: 11.5, color: T.textSecondary, fontWeight: 600 }}>{label}</p>
          {sub && <p style={{ margin: '2px 0 0', fontSize: 10, color: T.textTertiary }}>{sub}</p>}
        </div>
      </div>
    </Card>
  );
}

function Attn({ label, n, to, navigate, hot }) {
  return (
    <button onClick={() => navigate(to)} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', cursor: 'pointer',
      padding: '12px 14px', borderRadius: T.radiusSm, fontFamily: T.font, textAlign: 'left',
      background: n > 0 && hot ? T.dangerBg : T.surfaceElevated, border: `1px solid ${n > 0 && hot ? T.danger : T.border}`,
    }}>
      <span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 16, fontWeight: 800, color: n > 0 ? (hot ? '#F87171' : T.warning) : T.textTertiary }}>{n}</span>
    </button>
  );
}

function Bars({ rows, label, value }) {
  const max = Math.max(1, ...rows.map(r => r[value]));
  if (!rows.length) return <Empty>No one is online right now</Empty>;
  return rows.map(r => (
    <div key={r[label]} style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.textSecondary, marginBottom: 3 }}>
        <span>{r[label]}</span><b style={{ color: T.text }}>{r[value]}</b>
      </div>
      <div style={{ height: 6, background: T.surfaceElevated, borderRadius: 3 }}>
        <div style={{ width: `${(r[value] / max) * 100}%`, height: '100%', background: T.accent, borderRadius: 3 }} />
      </div>
    </div>
  ));
}

function SignupChart({ data }) {
  const max = Math.max(1, ...data.map(d => d.worker + d.user));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 110 }}>
      {data.map(d => (
        <div key={d.date} title={`${d.date}: ${d.worker} workers, ${d.user} posters`} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
          <div style={{ height: `${(d.user / max) * 100}%`, background: T.purple, borderRadius: '3px 3px 0 0' }} />
          <div style={{ height: `${(d.worker / max) * 100}%`, background: T.cyan }} />
        </div>
      ))}
    </div>
  );
}

function Content() {
  const navigate = useNavigate();
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    adminAxios.get('/api/admin/ops/overview').then(r => setD(r.data)).catch(e => setErr(e.response?.data?.message || 'Could not load'));
  }, []);

  if (err) return <p style={{ color: '#F87171' }}>{err}</p>;
  if (!d) return <p style={{ color: T.textTertiary }}>Loading...</p>;
  const a = d.attention, u = d.users, j = d.jobs, au = d.auth;

  return (
    <div>
      <Title title="Dashboard" sub="What needs you today, and what is happening now" />

      <h3 style={{ color: T.text, fontSize: 14, margin: '0 0 10px' }}>Needs attention</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 10, marginBottom: 24 }}>
        <Attn navigate={navigate} hot label="Payments pending over 24 hours" n={a.payments24} to="/admin/payments" />
        <Attn navigate={navigate} label="All pending payments" n={a.paymentsAll} to="/admin/payments" />
        <Attn navigate={navigate} label="ID verifications waiting" n={a.verifPending} to="/admin/verifications" />
        <Attn navigate={navigate} label="Open reports" n={a.reportsOpen} to="/admin/reports" />
        <Attn navigate={navigate} label="Account deletion requests" n={a.deletionsPending} to="/admin/deletions" />
        <Attn navigate={navigate} label="Jobs 2+ days old with no applicants" n={a.jobsStale} to="/admin/jobs" />
      </div>

      <h3 style={{ color: T.text, fontSize: 14, margin: '0 0 10px' }}>People</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 24 }}>
        <Stat icon="ti-hammer" color={T.cyan} bg={T.cyanBg} label="Workers" value={u.totalWorkers} />
        <Stat icon="ti-user-search" color={T.purple} bg={T.purpleBg} label="Posters" value={u.totalPosters} />
        <Stat icon="ti-circle-check" color={T.success} bg={T.successBg} label="Workers online now" value={u.onlineNow} sub="available + location known" />
        <Stat icon="ti-user-plus" color={T.accent} bg={T.accentBg} label="New today" value={u.newToday} sub={`${u.new7} in 7 days`} />
      </div>

      <h3 style={{ color: T.text, fontSize: 14, margin: '0 0 10px' }}>Jobs</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 24 }}>
        <Stat icon="ti-door-enter" color={T.success} bg={T.successBg} label="Open" value={j.open} />
        <Stat icon="ti-player-play" color={T.warning} bg={T.warningBg} label="In progress" value={j.inProgress} />
        <Stat icon="ti-calendar-plus" color={T.accent} bg={T.accentBg} label="Posted today" value={j.postedToday} />
      </div>

      <h3 style={{ color: T.text, fontSize: 14, margin: '0 0 4px' }}>Logins today</h3>
      <p style={{ margin: '0 0 10px', fontSize: 11.5, color: T.textTertiary }}>Counted from the day the activity log was deployed.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 24 }}>
        <Stat icon="ti-login" color={T.success} bg={T.successBg} label="Successful logins" value={au.loginsToday} />
        <Stat icon="ti-alert-triangle" color={T.danger} bg={T.dangerBg} label="Failed logins" value={au.failedToday} />
        <Stat icon="ti-key" color={T.warning} bg={T.warningBg} label="Forgot password" value={au.forgotToday} />
        <Stat icon="ti-user-check" color={T.accent} bg={T.accentBg} label="Registrations" value={au.registeredToday} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14, marginBottom: 24 }}>
        <Card><h3 style={{ color: T.text, fontSize: 14, margin: '0 0 12px' }}>Online workers by city</h3><Bars rows={d.onlineByCity} label="city" value="n" /></Card>
        <Card><h3 style={{ color: T.text, fontSize: 14, margin: '0 0 12px' }}>Online workers by skill</h3><Bars rows={d.onlineBySkill} label="skill" value="n" /></Card>
        <Card>
          <h3 style={{ color: T.text, fontSize: 14, margin: '0 0 4px' }}>Sign-ups, last 14 days</h3>
          <p style={{ margin: '0 0 10px', fontSize: 11, color: T.textTertiary }}><span style={{ color: T.cyan }}>■</span> workers &nbsp;<span style={{ color: T.purple }}>■</span> posters</p>
          <SignupChart data={d.signups} />
        </Card>
      </div>

      <Card>
        <h3 style={{ color: T.text, fontSize: 14, margin: '0 0 12px' }}>Training completion</h3>
        {d.training.length === 0 && <Empty>No active training videos</Empty>}
        {d.training.map(t => (
          <div key={t.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: T.textSecondary, marginBottom: 3 }}>
              <span>{t.title} <i style={{ color: T.textTertiary }}>({t.audience})</i></span><b style={{ color: T.text }}>{t.done}/{t.total}</b>
            </div>
            <div style={{ height: 6, background: T.surfaceElevated, borderRadius: 3 }}>
              <div style={{ width: `${t.total ? (t.done / t.total) * 100 : 0}%`, height: '100%', background: T.success, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  return <AdminAuthGuard><AdminLayout><Content /></AdminLayout></AdminAuthGuard>;
}