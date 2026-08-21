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

// NEW — only ever spliced into a worker's nav conditionally, at runtime,
// when the platform's subscription toggle is actually on. Never present in
// the base array, so it can never accidentally leak into the nav via a
// missed conditional somewhere.
const SUBSCRIPTION_NAV_ITEM = { to: '/subscription', icon: 'ti-crown', key: 'subscription' };

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
  const [subscriptionsOn, setSubscriptionsOn] = useState(false);

  const isWorker = user?.role === 'worker';

  // Build nav lists at render time so the subscription item can be
  // conditionally appended — never present unless the platform toggle
  // (checked below) says it should be, and only ever for workers, since
  // the early-access delay only ever affects the worker side.
  const sideNav   = isWorker
    ? (subscriptionsOn ? [...WORKER_NAV, SUBSCRIPTION_NAV_ITEM] : WORKER_NAV)
    : USER_NAV;
  const bottomNav = isWorker ? WORKER_BOTTOM : USER_BOTTOM; // kept off the bottom nav even when on — 5 slots is already full, reachable via sidebar/menu instead

  const loadUnread = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      const count = (data.notifications || []).filter(n => !n.read).length;
      setUnread(count);
    } catch { /* silent — badge just stays as-is */ }
  };

  // Checked once per app load — a public, lightweight endpoint (no auth
  // needed) that just says whether the subscription system is on
  // platform-wide. This is what actually keeps the nav item invisible until
  // an admin flips the toggle, not just "we forgot to link to it".
  const checkSubscriptionStatus = async () => {
    try {
      const { data } = await axios.get('/api/subscriptions/status');
      setSubscriptionsOn(!!data.enabled);
    } catch { /* silent — defaults to false/hidden if this fails */ }
  };

  useEffect(() => {
    loadUnread();
    if (isWorker) checkSubscriptionStatus();
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
          <img
            src="https://res.cloudinary.com/dxdjlyq72/image/upload/v1786430441/InstantWorker_Logo_pljqcg.png"
            alt="InstantWorker"
            style={{ height: 56, width: 'auto', display: 'block' }}
          />
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
              <i className={`ti ${item.icon}`} style={item.key === 'subscription' ? { color: '#F59E0B' } : undefined} aria-hidden="true"></i>
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
        <img
          src="https://res.cloudinary.com/dxdjlyq72/image/upload/v1786430441/InstantWorker_Logo_pljqcg.png"
          alt="InstantWorker"
          style={{ height: 32, width: 'auto', display: 'block', flex: 1, maxWidth: 140, objectFit: 'contain', objectPosition: 'left' }}
        />

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

        <button onClick={handleLogout} title={t('logout')} style={{
          background: 'var(--danger-bg)', border: '1px solid #fecaca', borderRadius: 10,
          width: 36, height: 36, cursor: 'pointer', color: 'var(--danger)', fontSize: 17,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <i className="ti ti-logout" aria-hidden="true"></i>
        </button>
      </div>

      {/* ══ Mobile subscription banner — only spot it appears on mobile,
          since the bottom nav's 5 slots stay unchanged. Small, dismissible-
          feeling, never blocks anything. ══ */}
      {isWorker && subscriptionsOn && (
        <button onClick={() => navigate('/subscription')} className="iw-mobile-sub-banner" style={{
          display: 'none', width: '100%', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #059669, #10B981)',
          padding: '9px 16px', alignItems: 'center', gap: 8, fontFamily: 'var(--font)',
        }}>
          <i className="ti ti-crown" style={{ fontSize: 15, color: '#fff' }} aria-hidden="true"></i>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', flex: 1, textAlign: 'left' }}>{t('subscription')}</span>
          <i className="ti ti-chevron-right" style={{ fontSize: 15, color: 'rgba(255,255,255,.8)' }} aria-hidden="true"></i>
        </button>
      )}

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

      <style>{`
        @media (max-width: 1023px) {
          .iw-mobile-sub-banner { display: flex !important; }
        }
      `}</style>
    </div>
  );
}