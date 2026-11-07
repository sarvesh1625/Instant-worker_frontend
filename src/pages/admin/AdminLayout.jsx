import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { T } from './adminTheme';

export const adminAxios = axios.create();
adminAxios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const msg = error.response?.data?.message || '';
      if (msg.toLowerCase().includes('admin')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Sidebar groups. Order matters: most-used first.
const NAV_GROUPS = [
  { title: 'Overview', items: [
    { icon: 'ti-layout-dashboard', label: 'Dashboard', path: '/admin/dashboard' },
  ] },
  { title: 'People', items: [
    { icon: 'ti-users',        label: 'Users',         path: '/admin/users' },
    { icon: 'ti-map-pin',      label: 'Workers',       path: '/admin/workers' },
    { icon: 'ti-shield-check', label: 'Verifications', path: '/admin/verifications' },
    { icon: 'ti-lifebuoy',     label: 'Support',       path: '/admin/support' },
    { icon: 'ti-user-x',       label: 'Deletions',     path: '/admin/deletions' },
  ] },
  { title: 'Work', items: [
    { icon: 'ti-briefcase', label: 'Jobs',              path: '/admin/jobs' },
    { icon: 'ti-tools',     label: 'Skills',            path: '/admin/skills' },
    { icon: 'ti-video',     label: 'Training videos',   path: '/admin/training' },
    { icon: 'ti-school',    label: 'Training progress', path: '/admin/training-progress' },
  ] },
  { title: 'Money', items: [
    { icon: 'ti-cash',   label: 'Payments',      path: '/admin/payments' },
    { icon: 'ti-crown',  label: 'Subscriptions', path: '/admin/subscriptions' },
    { icon: 'ti-trophy', label: 'Top Workers',   path: '/admin/leaderboard' },
  ] },
  { title: 'Safety & logs', items: [
    { icon: 'ti-flag',     label: 'Reports',    path: '/admin/reports' },
    { icon: 'ti-star',     label: 'Reviews',       path: '/admin/reviews' },
    { icon: 'ti-user-off', label: 'Cancellations', path: '/admin/cancellations' },
    { icon: 'ti-activity', label: 'Activity',   path: '/admin/activity' },
    { icon: 'ti-history',  label: 'Action log', path: '/admin/actions' },
  ] },
  { title: 'Platform', items: [
    { icon: 'ti-settings', label: 'Settings', path: '/admin/settings' },
  ] },
];
const ALL_ITEMS = NAV_GROUPS.flatMap(g => g.items);

const BOTTOM_ITEMS = [
  { icon: 'ti-layout-dashboard', label: 'Home',    path: '/admin/dashboard' },
  { icon: 'ti-users',            label: 'Users',   path: '/admin/users' },
  { icon: 'ti-map-pin',          label: 'Workers', path: '/admin/workers' },
  { icon: 'ti-briefcase',        label: 'Jobs',    path: '/admin/jobs' },
];

export function AdminAuthGuard({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/admin/login'); return; }
    setChecking(false);
  }, []);

  if (checking) return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textSecondary, fontFamily: T.font, fontSize: 13.5, gap: 10 }}>
      <span style={{
        width: 16, height: 16, borderRadius: '50%',
        border: `2px solid ${T.border}`, borderTopColor: T.accent,
        animation: 'admin-spin .7s linear infinite',
      }}></span>
      Checking access...
      <style>{`@keyframes admin-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return children;
}

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const adminUser = (() => { try { return JSON.parse(localStorage.getItem('adminUser') || '{}'); } catch { return {}; } })();

  // /admin/users/123 keeps "Users" highlighted, /admin/jobs/123 keeps "Jobs", and so on.
  const isActive = (path) => location.pathname === path || (path !== '/admin/dashboard' && location.pathname.startsWith(path + '/'))
    || (path === '/admin/dashboard' && location.pathname === '/admin');
  const current = ALL_ITEMS.find(i => isActive(i.path));

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    if (!confirm('Log out of the admin panel?')) return;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const Brand = ({ size = 38 }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: 11, flexShrink: 0,
        background: `linear-gradient(135deg, ${T.accentDark}, ${T.accent})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${T.accentBg}`,
      }}>
        <i className="ti ti-shield-lock" style={{ fontSize: size * 0.5, color: '#fff' }} aria-hidden="true"></i>
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: T.text, letterSpacing: '-0.01em' }}>Admin Panel</p>
        <p style={{ margin: 0, fontSize: 10.5, color: T.textTertiary }}>Instant Worker</p>
      </div>
    </div>
  );

  // The scrolling list of groups + the fixed account/logout footer. Used by the desktop sidebar AND the mobile drawer.
  const NavBody = () => (
    <>
      <nav className="admin-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 12px' }}>
        {NAV_GROUPS.map(g => (
          <div key={g.title} style={{ marginBottom: 14 }}>
            <p style={{ margin: '10px 10px 6px', fontSize: 10, fontWeight: 800, letterSpacing: '.09em', textTransform: 'uppercase', color: T.textTertiary }}>{g.title}</p>
            {g.items.map(item => {
              const active = isActive(item.path);
              return (
                <button key={item.path} onClick={() => navigate(item.path)} className="admin-navbtn" style={{
                  position: 'relative', display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '10px 12px', marginBottom: 2, borderRadius: T.radiusSm,
                  border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: T.font,
                  background: active ? T.accentBg : 'transparent',
                }}>
                  {active && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 3, background: T.accent }} />}
                  <i className={`ti ${item.icon}`} style={{ fontSize: 18, color: active ? T.accent : T.textTertiary }} aria-hidden="true"></i>
                  <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 500, color: active ? T.text : T.textSecondary }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ borderTop: `1px solid ${T.border}`, padding: '12px 14px calc(12px + env(safe-area-inset-bottom))', background: T.surface }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', background: T.accentBg, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: T.accent,
          }}>{adminUser?.name?.charAt(0).toUpperCase() || 'A'}</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminUser?.name || 'Admin'}</p>
            <p style={{ margin: 0, fontSize: 10.5, color: T.textTertiary }}>Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '10px 12px', borderRadius: T.radiusSm, background: T.dangerBg,
          border: '1px solid rgba(239,68,68,.25)', color: '#FCA5A5', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: T.font,
        }}>
          <i className="ti ti-logout" style={{ fontSize: 16 }} aria-hidden="true"></i> Log out
        </button>
      </div>
    </>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.font, display: 'flex' }}>

      {/* Desktop sidebar: only the middle scrolls, header and Log out stay in view */}
      <aside className="admin-sidebar-desktop" style={{
        width: 256, background: T.surface, borderRight: `1px solid ${T.border}`,
        display: 'none', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
      }}>
        <div style={{ padding: '20px 20px 14px' }}><Brand /></div>
        <NavBody />
      </aside>

      {/* Mobile / tablet top bar */}
      <header className="admin-topbar-mobile" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 30, height: 56,
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px',
        background: 'rgba(19,26,44,.94)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${T.border}`,
      }}>
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{
          background: T.surfaceElevated, border: `1px solid ${T.border}`, borderRadius: 10, width: 38, height: 38,
          color: T.text, fontSize: 19, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}><i className="ti ti-menu-2" aria-hidden="true"></i></button>
        <p style={{ margin: 0, flex: 1, minWidth: 0, fontSize: 15, fontWeight: 800, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {current ? current.label : 'Admin'}
        </p>
        <button onClick={handleLogout} aria-label="Log out" style={{
          background: T.dangerBg, border: '1px solid rgba(239,68,68,.25)', borderRadius: 10, height: 38, padding: '0 12px',
          color: '#FCA5A5', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: T.font,
          display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
        }}><i className="ti ti-logout" style={{ fontSize: 16 }} aria-hidden="true"></i> Log out</button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="admin-topbar-mobile" style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
          <div onClick={() => setMenuOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)' }} />
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, width: 'min(300px, 86vw)', background: T.surface,
            display: 'flex', flexDirection: 'column', boxShadow: '8px 0 30px rgba(0,0,0,.5)', animation: 'admin-slide .18s ease-out',
          }}>
            <div style={{ padding: '16px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Brand size={34} />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{
                background: T.surfaceElevated, border: `1px solid ${T.border}`, borderRadius: 9, width: 34, height: 34,
                color: T.text, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><i className="ti ti-x" aria-hidden="true"></i></button>
            </div>
            <NavBody />
          </div>
        </div>
      )}

      <main className="admin-main" style={{ flex: 1, minWidth: 0 }}>
        <div className="admin-content">{children}</div>
      </main>

      {/* Mobile bottom bar */}
      <nav className="admin-bottomnav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: T.surface, borderTop: `1px solid ${T.border}`,
        display: 'flex', padding: '6px 4px calc(6px + env(safe-area-inset-bottom))', boxShadow: '0 -4px 16px rgba(0,0,0,.3)',
      }}>
        {BOTTOM_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, padding: '6px 2px', fontFamily: T.font,
            }}>
              <i className={`ti ${item.icon}`} style={{ fontSize: 21, color: active ? T.accent : T.textTertiary }} aria-hidden="true"></i>
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 600, color: active ? T.text : T.textTertiary }}>{item.label}</span>
            </button>
          );
        })}
        <button onClick={() => setMenuOpen(true)} style={{
          flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 3, padding: '6px 2px', fontFamily: T.font,
        }}>
          <i className="ti ti-layout-grid" style={{ fontSize: 21, color: T.textTertiary }} aria-hidden="true"></i>
          <span style={{ fontSize: 10, fontWeight: 600, color: T.textTertiary }}>More</span>
        </button>
      </nav>

      <style>{`
        @keyframes admin-slide { from { transform: translateX(-100%); } to { transform: none; } }
        .admin-main { padding-top: 56px; padding-bottom: 76px; }
        .admin-content { padding: 18px 14px 28px; max-width: 1280px; margin: 0 auto; }
        .admin-navbtn:hover { background: ${T.surfaceHover} !important; }
        .admin-scroll::-webkit-scrollbar { width: 6px; }
        .admin-scroll::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        .admin-main input, .admin-main select, .admin-main textarea { max-width: 100%; box-sizing: border-box; }
        .admin-main h1 { word-break: break-word; }
        @media (min-width: 600px) { .admin-content { padding: 22px 22px 32px; } }
        @media (min-width: 900px) {
          .admin-sidebar-desktop { display: flex !important; }
          .admin-topbar-mobile { display: none !important; }
          .admin-bottomnav { display: none !important; }
          .admin-main { margin-left: 256px; padding-top: 0; padding-bottom: 0; }
          .admin-content { padding: 28px 32px 40px; }
        }
      `}</style>
    </div>
  );
}