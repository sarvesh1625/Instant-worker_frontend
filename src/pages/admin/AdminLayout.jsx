import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { T } from './adminTheme';

// ── Dedicated axios instance just for admin requests ─────────────────────────
export const adminAxios = axios.create();

// FIX: this instance never had a baseURL set, so every relative call like
// '/api/admin/login' resolved against the CURRENT PAGE'S origin — the
// Vercel frontend itself — instead of the Render backend. Same class of
// bug as AuthContext.jsx and SocketContext.jsx, just missed on this file.
// Falls back to localhost only when VITE_API_URL isn't set (local dev).
adminAxios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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

const NAV_ITEMS = [
  { icon: 'ti-layout-dashboard', label: 'Dashboard',     path: '/admin/dashboard' },
  { icon: 'ti-users',            label: 'Users',         path: '/admin/users' },
  { icon: 'ti-shield-check',     label: 'Verifications', path: '/admin/verifications' },
  { icon: 'ti-flag',             label: 'Reports',       path: '/admin/reports' },
  { icon: 'ti-briefcase',        label: 'Jobs',          path: '/admin/jobs' },
];

const BOTTOM_ITEMS = [
  { icon: 'ti-layout-dashboard', label: 'Home',    path: '/admin/dashboard' },
  { icon: 'ti-users',            label: 'Users',    path: '/admin/users' },
  { icon: 'ti-flag',             label: 'Reports',  path: '/admin/reports' },
  { icon: 'ti-briefcase',        label: 'Jobs',     path: '/admin/jobs' },
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
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (!confirm('Log out of the admin panel?')) return;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.font, display: 'flex' }}>

      <aside className="admin-sidebar-desktop" style={{
        width: 240, background: T.surface, borderRight: `1px solid ${T.border}`,
        padding: '22px 14px 18px', display: 'none', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 6, padding: '0 8px' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: `linear-gradient(135deg, ${T.accentDark}, ${T.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 14px ${T.accentBg}`,
          }}>
            <i className="ti ti-shield-lock" style={{ fontSize: 19, color: '#fff' }} aria-hidden="true"></i>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: T.text, letterSpacing: '-0.01em' }}>Admin Panel</p>
            <p style={{ margin: 0, fontSize: 10.5, color: T.textTertiary }}>Instant Worker</p>
          </div>
        </div>

        <div style={{ height: 1, background: T.border, margin: '16px 8px 14px' }}></div>

        {NAV_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%',
              padding: '11px 14px', marginBottom: 3, borderRadius: T.radiusSm,
              border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: T.font,
              background: active ? T.accentBg : 'transparent',
              transition: 'background .15s',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.surfaceHover; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
              <i className={`ti ${item.icon}`} style={{ fontSize: 18, color: active ? T.accent : T.textTertiary }} aria-hidden="true"></i>
              <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 500, color: active ? T.text : T.textSecondary }}>{item.label}</span>
            </button>
          );
        })}

        <div style={{ flex: 1 }}></div>

        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14, padding: '14px 8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: T.accentBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: T.accent, flexShrink: 0,
            }}>
              {adminUser?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: T.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {adminUser?.name || 'Admin'}
            </p>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '9px 12px', borderRadius: T.radiusSm,
            background: T.dangerBg, border: 'none', color: '#FCA5A5',
            fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7, fontFamily: T.font,
          }}>
            <i className="ti ti-logout" style={{ fontSize: 15 }} aria-hidden="true"></i>
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-topbar-mobile" style={{
        position: 'sticky', top: 0, zIndex: 30, width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 16px', background: 'rgba(19,26,44,.92)', backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `linear-gradient(135deg, ${T.accentDark}, ${T.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="ti ti-shield-lock" style={{ fontSize: 16, color: '#fff' }} aria-hidden="true"></i>
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: T.text }}>Admin</span>
        </div>
        <button onClick={() => setMenuOpen(m => !m)} style={{
          background: T.surfaceElevated, border: `1px solid ${T.border}`, borderRadius: 9,
          width: 34, height: 34, color: T.text, fontSize: 17, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className={`ti ti-${menuOpen ? 'x' : 'menu-2'}`} aria-hidden="true"></i>
        </button>
      </div>

      {menuOpen && (
        <div className="admin-topbar-mobile" style={{
          position: 'fixed', top: 60, left: 0, right: 0, zIndex: 29,
          background: T.surface, borderBottom: `1px solid ${T.border}`, padding: '8px 12px 14px',
        }}>
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path);
            return (
              <button key={item.path} onClick={() => { navigate(item.path); setMenuOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 12px', borderRadius: T.radiusSm, marginBottom: 4,
                background: active ? T.accentBg : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: T.font,
              }}>
                <i className={`ti ${item.icon}`} style={{ fontSize: 17, color: active ? T.accent : T.textTertiary }} aria-hidden="true"></i>
                <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 500, color: active ? T.text : T.textSecondary }}>{item.label}</span>
              </button>
            );
          })}
          <button onClick={handleLogout} style={{
            width: '100%', marginTop: 6, padding: '11px 12px', borderRadius: T.radiusSm,
            background: T.dangerBg, border: 'none', color: '#FCA5A5',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, fontFamily: T.font,
          }}>
            <i className="ti ti-logout" style={{ fontSize: 15 }} aria-hidden="true"></i> Logout
          </button>
        </div>
      )}

      <div className="admin-main" style={{ flex: 1, minWidth: 0, paddingBottom: 76 }}>
        <div style={{ padding: '22px 20px 30px' }}>
          {children}
        </div>
      </div>

      <nav className="admin-bottomnav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: T.surface, borderTop: `1px solid ${T.border}`,
        display: 'flex', padding: '6px 4px calc(6px + env(safe-area-inset-bottom))',
        boxShadow: '0 -4px 16px rgba(0,0,0,.3)',
      }}>
        {BOTTOM_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              flex: 1, background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '6px 2px', fontFamily: T.font,
            }}>
              <i className={`ti ${item.icon}`} style={{ fontSize: 21, color: active ? T.accent : T.textTertiary }} aria-hidden="true"></i>
              <span style={{ fontSize: 9.5, fontWeight: active ? 700 : 600, color: active ? T.text : T.textTertiary }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @media (min-width: 900px) {
          .admin-sidebar-desktop { display: flex !important; }
          .admin-topbar-mobile { display: none !important; }
          .admin-bottomnav { display: none !important; }
          .admin-main { margin-left: 240px; padding-bottom: 0; }
        }
      `}</style>
    </div>
  );
}