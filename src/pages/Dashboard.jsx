import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import AppShell from '../components/AppShell';
import '../styles/theme.css';

// NOTE: labels/subs are now resolved via t() at render time inside the
// component (see WORKER_ACTIONS/USER_ACTIONS below), not hardcoded here,
// so the whole card set switches language correctly.
const WORKER_ACTIONS = [
  { icon: 'ti-search',         color: '#059669', bg: '#ECFDF5', labelKey: 'findWorkTitle',     subKey: 'findWorkSub',     to: '/jobs' },
  { icon: 'ti-briefcase',      color: '#EA580C', bg: '#FFF7ED', labelKey: 'myWorkTitle',        subKey: 'myWorkSub',       to: '/my-work' },
  { icon: 'ti-photo',          color: '#8B5CF6', bg: '#F5F3FF', labelKey: 'portfolioTitle',     subKey: 'portfolioSub',    to: '/portfolio' },
  { icon: 'ti-shield-check',   color: '#CA8A04', bg: '#FEFCE8', labelKey: 'verificationTitle',  subKey: 'verificationSub', to: '/verification' },
];

const USER_ACTIONS = [
  { icon: 'ti-plus',           color: '#059669', bg: '#ECFDF5', labelKey: 'postJobTitle',      subKey: 'postJobSub',      to: '/jobs/post' },
  { icon: 'ti-clipboard-list', color: '#EA580C', bg: '#FFF7ED', labelKey: 'myJobPostsTitle',    subKey: 'myJobPostsSub',   to: '/jobs/my' },
  { icon: 'ti-users',          color: '#8B5CF6', bg: '#F5F3FF', labelKey: 'findWorkersTitle',   subKey: 'findWorkersSub',  to: '/workers' },
  { icon: 'ti-shield-check',   color: '#CA8A04', bg: '#FEFCE8', labelKey: 'verificationTitle',  subKey: 'verificationSub', to: '/verification' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLang();
  const isWorker = user?.role === 'worker';

  const [profile, setProfile]       = useState(null);
  const [wallet, setWallet]         = useState({ totalEarned: 0, totalSpent: 0 });
  const [availability, setAvailability] = useState(true);
  const [toggling, setToggling]     = useState(false);

  useEffect(() => {
    axios.get('/api/profile/me')
      .then(({ data }) => {
        setProfile(data.user);
        if (data.user?.worker) setAvailability(data.user.worker.availability);
      })
      .catch(() => {});
    axios.get('/api/wallet')
      .then(({ data }) => setWallet(data))
      .catch(() => {});
  }, []);

  const toggleOnline = async () => {
    setToggling(true);
    try {
      const { data } = await axios.patch('/api/profile/availability');
      setAvailability(data.availability);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update status');
    } finally { setToggling(false); }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 17 ? t('goodAfternoon') : t('goodEvening');
  const actions = isWorker ? WORKER_ACTIONS : USER_ACTIONS;

  const skillLabel = profile?.worker?.skill || t('yourSkill');

  return (
    <AppShell>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '22px 18px 30px' }}>

        {/* ── Greeting ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div className="il-avatar" style={{ width: 52, height: 52, fontSize: 20 }}>
            {user?.profilePhoto
              ? <img src={user.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              : user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>{greeting},</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>{user?.name}</p>
          </div>
          <span className="il-badge" style={{
            marginLeft: 'auto',
            background: isWorker ? 'var(--primary-light)' : 'var(--secondary-light)',
            color: isWorker ? 'var(--primary-dark)' : 'var(--secondary-dark)',
          }}>
            <i className={`ti ${isWorker ? 'ti-hammer' : 'ti-user-search'}`} style={{ fontSize: 13 }} aria-hidden="true"></i>
            {isWorker ? t('worker') : t('user')}
          </span>
        </div>

        {/* ── ONLINE / OFFLINE banner — workers only ── */}
        {isWorker && (
          <div style={{
            background: availability
              ? 'linear-gradient(120deg, #059669, #10B981)'
              : 'linear-gradient(120deg, #475569, #64748B)',
            borderRadius: 18, padding: '20px 22px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            boxShadow: availability ? '0 8px 24px rgba(16,185,129,.35)' : '0 8px 24px rgba(71,85,105,.25)',
            transition: 'all .3s',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 15, flexShrink: 0,
              background: 'rgba(255,255,255,.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className={`ti ${availability ? 'ti-briefcase' : 'ti-briefcase-off'}`} style={{ fontSize: 26, color: '#fff' }} aria-hidden="true"></i>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 11, height: 11, borderRadius: '50%', flexShrink: 0,
                  background: availability ? '#4ADE80' : '#94A3B8',
                  boxShadow: availability ? '0 0 0 3px rgba(74,222,128,.3)' : 'none',
                  animation: availability ? 'il-pulse 1.6s infinite' : 'none',
                }}></span>
                {availability ? t('online') : t('offline')}
              </p>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: 'rgba(255,255,255,.8)' }}>
                {availability ? t('readyToReceive', skillLabel) : t('notReceiving')}
              </p>
            </div>
            <button
              onClick={toggleOnline}
              disabled={toggling}
              style={{
                background: '#fff', border: 'none', cursor: toggling ? 'wait' : 'pointer',
                borderRadius: 999, padding: '13px 26px',
                fontSize: 14, fontWeight: 800, fontFamily: 'var(--font)',
                color: availability ? '#059669' : '#475569',
                boxShadow: '0 4px 14px rgba(0,0,0,.15)',
                flexShrink: 0, transition: 'transform .1s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {toggling ? `${t('loading')}` : availability ? t('goOffline') : t('goOnline')}
            </button>
          </div>
        )}

        {/* ── Stats row ── */}
        <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          <div className="il-card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <i className="ti ti-currency-rupee" style={{ fontSize: 17, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)' }}>
                {isWorker ? t('totalEarned') : t('totalPaid')}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
              ₹{(isWorker ? wallet.totalEarned : wallet.totalSpent).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="il-card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <i className="ti ti-briefcase" style={{ fontSize: 17, color: 'var(--secondary-dark)' }} aria-hidden="true"></i>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)' }}>
                {isWorker ? t('jobsDone') : t('jobsPosted')}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
              {isWorker ? (profile?.worker?.totalJobsDone ?? 0) : (profile?.poster?.totalJobsPosted ?? 0)}
            </p>
          </div>

          <div className="il-card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <i className="ti ti-star" style={{ fontSize: 17, color: '#CA8A04' }} aria-hidden="true"></i>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)' }}>{t('rating')}</span>
            </div>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
              {(isWorker ? profile?.worker?.rating?.average : profile?.poster?.rating?.average) || '—'}
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginLeft: 4 }}>
                ({(isWorker ? profile?.worker?.rating?.count : profile?.poster?.rating?.count) || 0})
              </span>
            </p>
          </div>
        </div>

        {/* ── Quick actions ── */}
        <p style={{ margin: '0 0 12px', fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>{t('quickActions')}</p>
        <div className="dash-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {actions.map(a => (
            <button key={a.labelKey} onClick={() => navigate(a.to)} className="il-card" style={{
              padding: '18px 16px', cursor: 'pointer', textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 12,
              transition: 'transform .15s, box-shadow .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`ti ${a.icon}`} style={{ fontSize: 23, color: a.color }} aria-hidden="true"></i>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: 'var(--text)' }}>{t(a.labelKey)}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--text-tertiary)' }}>{t(a.subKey)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 720px) {
          .dash-actions { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .dash-stats { grid-template-columns: 1fr 1fr 1fr !important; gap: 8px !important; }
        }
      `}</style>
    </AppShell>
  );
}