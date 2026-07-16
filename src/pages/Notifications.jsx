import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppShell from '../components/AppShell';
import '../styles/theme.css';

const typeConfig = {
  job_applied:        { bg: '#ECFDF5', color: '#059669', icon: 'ti-file-text' },
  applicant_accepted: { bg: '#ECFDF5', color: '#059669', icon: 'ti-circle-check' },
  applicant_rejected: { bg: '#FEF2F2', color: '#EF4444', icon: 'ti-circle-x' },
  new_message:        { bg: '#F5F3FF', color: '#8B5CF6', icon: 'ti-message-circle' },
  new_review:         { bg: '#FEFCE8', color: '#CA8A04', icon: 'ti-star' },
  job_closed:         { bg: '#F8FAFC', color: '#475569', icon: 'ti-lock' },
  work_started:       { bg: '#FFF7ED', color: '#EA580C', icon: 'ti-player-play' },
  work_completed:     { bg: '#ECFDF5', color: '#059669', icon: 'ti-circle-check' },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);

  const load = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      setNotifications(data.notifications || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleRead = async (id) => {
    await axios.patch(`/api/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };
  const handleReadAll = async () => {
    await axios.patch('/api/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    await axios.delete(`/api/notifications/${id}`);
    setNotifications(prev => prev.filter(n => n._id !== id));
  };
  const handleClearAll = async () => {
    if (!confirm('Delete all notifications?')) return;
    try {
      // Delete each (no bulk endpoint assumed) — falls back gracefully
      await Promise.all(notifications.map(n => axios.delete(`/api/notifications/${n._id}`).catch(() => {})));
      setNotifications([]);
    } catch { load(); }
  };
  const handleClick = async (notif) => {
    if (!notif.read) await handleRead(notif._id);
    navigate(notif.link || '/dashboard');
  };

  const formatTime = (d) => {
    const diff = Date.now() - new Date(d);
    if (diff < 60000)    return 'Just now';
    if (diff < 3600000)  return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '22px 18px 30px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 150 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 9 }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{ background: 'var(--danger)', color: '#fff', fontSize: 12, fontWeight: 800, minWidth: 24, height: 24, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 7px' }}>
                  {unreadCount}
                </span>
              )}
            </h1>
            <p style={{ margin: '3px 0 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>Suchnaye — stay updated</p>
          </div>
          {notifications.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {unreadCount > 0 && (
                <button onClick={handleReadAll} className="il-btn il-btn-outline il-btn-sm">
                  <i className="ti ti-checks" style={{ fontSize: 15 }} aria-hidden="true"></i>
                  Mark all read
                </button>
              )}
              <button onClick={handleClearAll} className="il-btn il-btn-sm" style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid #fecaca' }}>
                <i className="ti ti-trash" style={{ fontSize: 15 }} aria-hidden="true"></i>
                Clear
              </button>
            </div>
          )}
        </div>

        {loading && <p className="il-muted" style={{ textAlign: 'center', fontSize: 13.5, padding: '40px 0' }}>Loading...</p>}

        {!loading && notifications.length === 0 && (
          <div className="il-empty">
            <i className="ti ti-bell-off" aria-hidden="true"></i>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>No notifications yet</p>
            <p style={{ fontSize: 12.5, marginTop: 5 }}>Job updates and messages will appear here</p>
          </div>
        )}

        {notifications.length > 0 && (
          <div className="il-card" style={{ overflow: 'hidden', padding: 0 }}>
            {notifications.map((notif, idx) => {
              const cfg = typeConfig[notif.type] || { bg: '#F8FAFC', color: '#475569', icon: 'ti-bell' };
              return (
                <div key={notif._id} onClick={() => handleClick(notif)} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '15px 18px', cursor: 'pointer',
                  background: !notif.read ? 'var(--primary-light)' : '#fff',
                  borderBottom: idx < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background .15s',
                }}
                onMouseEnter={e => { if (notif.read) e.currentTarget.style.background = 'var(--surface)'; }}
                onMouseLeave={e => { if (notif.read) e.currentTarget.style.background = '#fff'; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`ti ${cfg.icon}`} style={{ fontSize: 20, color: cfg.color }} aria-hidden="true"></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: !notif.read ? 800 : 700, color: 'var(--text)' }}>{notif.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{formatTime(notif.createdAt)}</span>
                        <button onClick={(e) => handleDelete(notif._id, e)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 18, cursor: 'pointer', padding: 0, lineHeight: 1, width: 20, height: 20 }}>×</button>
                      </div>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{notif.body}</p>
                  </div>
                  {!notif.read && <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 6 }}></span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}