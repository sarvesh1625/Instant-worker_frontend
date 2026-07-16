import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T } from './Admintheme ';

function StatCard({ icon, color, bg, label, value, sub }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusMd,
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className={`ti ${icon}`} style={{ fontSize: 21, color }} aria-hidden="true"></i>
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 23, fontWeight: 800, color: T.text, lineHeight: 1.1 }}>{value ?? '—'}</p>
          <p style={{ margin: '2px 0 0', fontSize: 11.5, color: T.textSecondary, fontWeight: 600 }}>{label}</p>
          {sub && <p style={{ margin: '2px 0 0', fontSize: 10, color: T.textTertiary }}>{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function NavCard({ icon, color, bg, label, sub, to, badge, navigate }) {
  return (
    <button onClick={() => navigate(to)} style={{
      padding: '17px 18px', cursor: 'pointer', textAlign: 'left', width: '100%',
      display: 'flex', alignItems: 'center', gap: 14,
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusMd,
      transition: 'transform .15s, border-color .15s', fontFamily: T.font,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = T.borderStrong; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = T.border; }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className={`ti ${icon}`} style={{ fontSize: 21, color }} aria-hidden="true"></i>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: T.textTertiary }}>{sub}</p>
      </div>
      {badge > 0 && (
        <span style={{ background: T.danger, color: '#fff', fontSize: 11, fontWeight: 800, minWidth: 22, height: 22, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', flexShrink: 0 }}>
          {badge}
        </span>
      )}
      <i className="ti ti-chevron-right" style={{ fontSize: 17, color: T.textTertiary, flexShrink: 0 }} aria-hidden="true"></i>
    </button>
  );
}

function DashboardContent() {
  const navigate = useNavigate();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    adminAxios.get('/api/admin/dashboard')
      .then(({ data }) => setStats(data.stats))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Dashboard</h1>
      <p style={{ margin: '0 0 26px', fontSize: 13.5, color: T.textTertiary }}>Platform overview at a glance</p>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: 82, borderRadius: T.radiusMd, background: T.surface, border: `1px solid ${T.border}`, opacity: .5 }}></div>)}
        </div>
      )}

      {error && (
        <div style={{ background: T.dangerBg, border: '1px solid rgba(239,68,68,.3)', borderRadius: T.radiusSm, padding: '11px 15px', marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: 13, color: '#FCA5A5' }}>{error}</p>
        </div>
      )}

      {stats && (
        <>
          <p style={{ margin: '0 0 12px', fontSize: 12.5, fontWeight: 800, color: T.textSecondary, textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 7 }}>
            <i className="ti ti-users" style={{ fontSize: 15, color: T.accent }} aria-hidden="true"></i>
            Users
          </p>
          <div className="admin-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 26 }}>
            <StatCard icon="ti-users"       color={T.accent}  bg={T.accentBg}  label="Total accounts"   value={stats.users?.total} sub={`+${stats.users?.newThisWeek ?? 0} this week`} />
            <StatCard icon="ti-hammer"      color={T.cyan}    bg={T.cyanBg}    label="Workers"          value={stats.users?.workers} />
            <StatCard icon="ti-user-search" color={T.purple}  bg={T.purpleBg}  label="Users (posters)"  value={stats.users?.posters} />
            <StatCard icon="ti-user-off"    color={T.danger}  bg={T.dangerBg}  label="Suspended/Banned" value={stats.users?.suspended} />
          </div>

          <p style={{ margin: '0 0 12px', fontSize: 12.5, fontWeight: 800, color: T.textSecondary, textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 7 }}>
            <i className="ti ti-briefcase" style={{ fontSize: 15, color: T.accent }} aria-hidden="true"></i>
            Jobs
          </p>
          <div className="admin-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 26 }}>
            <StatCard icon="ti-briefcase"     color={T.accent}  bg={T.accentBg}  label="Total jobs" value={stats.jobs?.total} sub={`+${stats.jobs?.newThisWeek ?? 0} this week`} />
            <StatCard icon="ti-door-enter"    color={T.success} bg={T.successBg} label="Open"        value={stats.jobs?.open} />
            <StatCard icon="ti-circle-check"  color={T.cyan}    bg={T.cyanBg}    label="Completed"   value={stats.jobs?.completed} />
            <StatCard icon="ti-bolt"          color={T.warning} bg={T.warningBg} label="Urgent"      value={stats.jobs?.urgent} />
          </div>

          <p style={{ margin: '0 0 12px', fontSize: 12.5, fontWeight: 800, color: T.textSecondary, textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 7 }}>
            <i className="ti ti-list-check" style={{ fontSize: 15, color: T.accent }} aria-hidden="true"></i>
            Manage
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <NavCard navigate={navigate} icon="ti-id-badge"  color={T.warning} bg={T.warningBg} label="ID Verifications" sub="Review submitted documents"        to="/admin/verifications" badge={stats.pending?.verifications} />
            <NavCard navigate={navigate} icon="ti-flag"      color={T.danger}  bg={T.dangerBg}  label="Reports"          sub="User complaints and safety issues" to="/admin/reports"       badge={stats.pending?.reports} />
            <NavCard navigate={navigate} icon="ti-users"     color={T.accent}  bg={T.accentBg}  label="All Users"        sub="Search, edit, suspend, ban, delete" to="/admin/users" />
            <NavCard navigate={navigate} icon="ti-briefcase" color={T.purple}  bg={T.purpleBg}  label="All Jobs"         sub="Moderate and remove job posts"     to="/admin/jobs" />
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 720px) {
          .admin-grid-4 { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <DashboardContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}