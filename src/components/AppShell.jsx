import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import '../styles/theme.css';

const LANGS = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'हि', full: 'हिन्दी' },
  { code: 'te', label: 'తె', full: 'తెలుగు' },
];

const WORKER_NAV = [
  { to: '/dashboard',     icon: 'ti-layout-dashboard', key: 'dashboard' },
  { to: '/jobs',          icon: 'ti-search',           key: 'findWork' },
  { to: '/my-work',       icon: 'ti-briefcase',        key: 'myWork' },
  { to: '/wallet',        icon: 'ti-wallet',           key: 'wallet' },
  { to: '/history',       icon: 'ti-history',          key: 'history' },
  { to: '/conversations', icon: 'ti-message-circle',   key: 'messages' },
  { to: '/portfolio',     icon: 'ti-photo',            key: 'portfolio' },
  { to: '/notifications', icon: 'ti-bell',             key: 'notifications', badge: true },
  { to: '/profile-setup', icon: 'ti-user-circle',      key: 'myProfile' },
  { to: '/verification',  icon: 'ti-shield-check',     key: 'verification' },
  { to: '/help',          icon: 'ti-headset',          key: 'help' },
];

const USER_NAV = [
  { to: '/dashboard',     icon: 'ti-layout-dashboard', key: 'dashboard' },
  { to: '/jobs/post',     icon: 'ti-plus',             key: 'postJob' },
  { to: '/jobs/my',       icon: 'ti-clipboard-list',   key: 'myJobPosts' },
  { to: '/workers',       icon: 'ti-users',            key: 'findWorkers' },
  { to: '/wallet',        icon: 'ti-wallet',           key: 'wallet' },
  { to: '/history',       icon: 'ti-history',          key: 'history' },
  { to: '/conversations', icon: 'ti-message-circle',   key: 'messages' },
  { to: '/notifications', icon: 'ti-bell',             key: 'notifications', badge: true },
  { to: '/profile',       icon: 'ti-user-circle',      key: 'myProfile' },
  { to: '/verification',  icon: 'ti-shield-check',     key: 'verification' },
  { to: '/help',          icon: 'ti-headset',          key: 'help' },
];

const WORKER_BOTTOM = [
  { to: '/dashboard',     icon: 'ti-home',        key: 'home' },
  { to: '/jobs',          icon: 'ti-search',      key: 'findWork' },
  { to: '/my-work',       icon: 'ti-briefcase',   key: 'myWork' },
  { to: '/notifications', icon: 'ti-bell',        key: 'notifications', badge: true },
  { to: '/profile-setup', icon: 'ti-user-circle', key: 'profile' },
];

const USER_BOTTOM = [
  { to: '/dashboard',     icon: 'ti-home',           key: 'home' },
  { to: '/jobs/post',     icon: 'ti-square-plus',    key: 'postJob' },
  { to: '/jobs/my',       icon: 'ti-clipboard-list', key: 'myJobPosts' },
  { to: '/notifications', icon: 'ti-bell',           key: 'notifications', badge: true },
  { to: '/profile',       icon: 'ti-user-circle',    key: 'profile' },
];

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLang();

  const [unread, setUnread] = useState(0);

  const isWorker  = user?.role === 'worker';
  const sideNav   = isWorker ? WORKER_NAV : USER_NAV;
  const bottomNav = isWorker ? WORKER_BOTTOM : USER_BOTTOM;

  const loadUnread = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      const count = (data.notifications || []).filter(n => !n.read).length;
      setUnread(count);
    } catch { /* silent — badge just stays as-is */ }
  };

  useEffect(() => {
    loadUnread();
    const iv = setInterval(loadUnread, 20000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (location.pathname === '/notifications') {
      const t = setTimeout(loadUnread, 1200);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  const isActive = (to) => {
    if (to === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  const handleLogout = () => {
    if (confirm('Logout from Instant Worker?')) {
      logout();
      navigate('/');
    }
  };

  const LangSwitcher = ({ compact = false }) => (
    <div style={{
      display: 'flex', gap: 3, padding: 3,
      background: '#EEF2F6', borderRadius: 999,
      border: '1px solid var(--border)', flexShrink: 0,
    }}>
      {LANGS.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.full}
          style={{
            flex: compact ? 'none' : 1,
            minWidth: compact ? 32 : 'auto',
            padding: compact ? '5px 0' : '6px 4px',
            border: 'none', borderRadius: 999, cursor: 'pointer',
            fontFamily: 'var(--font)',
            fontSize: compact ? 11.5 : 12.5, fontWeight: 800,
            background: lang === l.code ? 'var(--primary)' : 'transparent',
            color: lang === l.code ? '#fff' : 'var(--text-secondary)',
            boxShadow: lang === l.code ? '0 2px 8px rgba(16,185,129,.35)' : 'none',
            transition: 'all .15s',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="iw-app">

      {/* ══ Sidebar (desktop) ══ */}
      <aside className="iw-sidebar">
        <div className="iw-side-logo">
          <div className="iw-side-logo-icon">
            <i className="ti ti-bolt" style={{ fontSize: 22, color: '#fff' }} aria-hidden="true"></i>
          </div>
          <span className="iw-side-logo-text">Instant<span>Worker</span></span>
        </div>

        <span className="iw-portal-badge">
          <i className={`ti ${isWorker ? 'ti-hammer' : 'ti-user-search'}`} style={{ fontSize: 13 }} aria-hidden="true"></i>
          {isWorker ? 'Worker Portal' : 'User Portal'}
        </span>

        {sideNav.map(item => (
          <button
            key={item.to}
            className={`iw-side-item ${isActive(item.to) ? 'active' : ''}`}
            onClick={() => navigate(item.to)}
            style={{ position: 'relative' }}
          >
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className={`ti ${item.icon}`} aria-hidden="true"></i>
              {item.badge && unread > 0 && (
                <span style={{
                  position: 'absolute', top: -2, right: -3,
                  width: 9, height: 9, borderRadius: '50%',
                  background: '#EF4444',
                  border: '2px solid var(--surface)',
                }}></span>
              )}
            </span>
            {t(item.key)}
            {item.badge && unread > 0 && (
              <span style={{
                marginLeft: 'auto',
                background: '#EF4444', color: '#fff',
                fontSize: 10.5, fontWeight: 800,
                minWidth: 20, height: 20, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 6px',
              }}>
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>
        ))}

        <div className="iw-side-spacer"></div>

        <div style={{ padding: '0 8px 10px' }}>
          <p style={{ margin: '0 0 8px', fontSize: 10.5, fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '.07em', textTransform: 'uppercase' }}>
            <i className="ti ti-language" style={{ fontSize: 13, marginRight: 5, verticalAlign: -2 }} aria-hidden="true"></i>
            Language / भाषा
          </p>
          <LangSwitcher />
        </div>

        <hr className="iw-side-divider" />
        <button className="iw-side-item danger" onClick={handleLogout}>
          <i className="ti ti-logout" aria-hidden="true"></i>
          {t('logout')}
        </button>
      </aside>

      {/* ══ Mobile top bar ══ */}
      <div className="iw-mobile-top">
        <div className="iw-side-logo-icon" style={{ width: 34, height: 34, borderRadius: 10 }}>
          <i className="ti ti-bolt" style={{ fontSize: 19, color: '#fff' }} aria-hidden="true"></i>
        </div>
        <span className="iw-side-logo-text" style={{ fontSize: 16, flex: 1 }}>Instant<span>Worker</span></span>

        <LangSwitcher compact />

        <button onClick={() => navigate('/notifications')} style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
          width: 36, height: 36, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 17,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, position: 'relative',
        }}>
          <i className="ti ti-bell" aria-hidden="true"></i>
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 5, right: 6,
              width: 9, height: 9, borderRadius: '50%',
              background: '#EF4444', border: '2px solid var(--surface)',
            }}></span>
          )}
        </button>

        {/* FIX: Logout was only ever reachable from the desktop sidebar,
            which is hidden below 1024px — mobile users (the large majority
            of this app's actual audience) had no way to log out at all. */}
        <button onClick={handleLogout} title={t('logout')} style={{
          background: 'var(--danger-bg)', border: '1px solid #fecaca', borderRadius: 10,
          width: 36, height: 36, cursor: 'pointer', color: 'var(--danger)', fontSize: 17,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <i className="ti ti-logout" aria-hidden="true"></i>
        </button>
      </div>

      {/* ══ Page content ══ */}
      <main className="iw-main">{children}</main>

      {/* ══ Bottom nav (mobile) ══ */}
      <nav className="iw-bottomnav">
        {bottomNav.map(item => (
          <button
            key={item.to}
            className={`iw-bottom-item ${isActive(item.to) ? 'active' : ''}`}
            onClick={() => navigate(item.to)}
          >
            <span style={{ position: 'relative', display: 'flex' }}>
              <i className={`ti ${item.icon}`} aria-hidden="true"></i>
              {item.badge && unread > 0 && (
                <span style={{
                  position: 'absolute', top: -1, right: -4,
                  minWidth: 16, height: 16, borderRadius: 8,
                  background: '#EF4444', color: '#fff',
                  fontSize: 9, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px', border: '2px solid #fff',
                }}>
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </span>
            {t(item.key)}
          </button>
        ))}
      </nav>
    </div>
  );
}