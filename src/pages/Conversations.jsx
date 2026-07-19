import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useLang } from '../context/LangContext';
import AppShell from '../components/AppShell';
import '../styles/theme.css';

export default function Conversations() {
  const { user }        = useAuth();
  const { onlineUsers } = useSocket();
  const { t }           = useLang();
  const navigate        = useNavigate();

  const [convs, setConvs]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [acceptedUsers, setAcceptedUsers] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/chat/conversations');
      const existing = data.conversations || [];
      setConvs(existing);

      if (user?.role !== 'worker') {
        const jobsRes = await axios.get('/api/jobs/my/postings');
        const jobs = jobsRes.data.jobs || [];
        const accepted = [];
        jobs.forEach(job => {
          job.applicants?.forEach(a => {
            if (a.status === 'accepted' && a.worker) {
              const alreadyInConv = existing.find(c => c.otherUser?._id === (a.worker._id || a.worker));
              if (!alreadyInConv) {
                accepted.push({
                  conversationId: `new_${a.worker._id || a.worker}`,
                  otherUser: a.worker,
                  lastMessage: t('chatUnlockedSayHello'),
                  lastTime: job.updatedAt,
                  unread: 0, isNew: true, jobTitle: job.title,
                });
              }
            }
          });
        });
        setAcceptedUsers(accepted);
      } else {
        const jobsRes = await axios.get('/api/jobs?limit=50');
        const jobs = jobsRes.data.jobs || [];
        const accepted = [];
        for (const job of jobs) {
          const myApp = job.applicants?.find(a => (a.worker?._id || a.worker) === user._id && a.status === 'accepted');
          if (myApp) {
            const poster = job.postedBy;
            const alreadyInConv = existing.find(c => c.otherUser?._id === (poster?._id || poster));
            if (!alreadyInConv && poster) {
              accepted.push({
                conversationId: `new_${poster._id || poster}`,
                otherUser: poster,
                lastMessage: t('acceptedFor', job.title),
                lastTime: job.updatedAt,
                unread: 0, isNew: true, jobTitle: job.title,
              });
            }
          }
        }
        setAcceptedUsers(accepted);
      }
    } catch (err) { console.error('Conversations error:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [user]);
  useEffect(() => {
    const handleFocus = () => load();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const formatTime = (d) => {
    if (!d) return '';
    const diff = Date.now() - new Date(d);
    if (diff < 60000)    return t('justNow');
    if (diff < 3600000)  return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const allChats = [...convs, ...acceptedUsers];
  const userId = (conv) => conv.otherUser?._id || conv.otherUser;

  return (
    <AppShell>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '22px 18px 30px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>{t('messagesTitle')}</h1>
            <p style={{ margin: '3px 0 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>{t('messagesTagline')}</p>
          </div>
          <button onClick={load} className="il-btn il-btn-outline il-btn-sm">
            <i className="ti ti-refresh" style={{ fontSize: 16 }} aria-hidden="true"></i>
            {t('refresh')}
          </button>
        </div>

        {loading && <p className="il-muted" style={{ textAlign: 'center', padding: '40px 0', fontSize: 13.5 }}>{t('loading')}</p>}

        {!loading && allChats.length === 0 && (
          <div className="il-empty">
            <i className="ti ti-message-off" aria-hidden="true"></i>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{t('noConversations')}</p>
            <p style={{ marginTop: 6, fontSize: 12.5 }}>{t('chatOpensAfter')}</p>
            <button onClick={() => navigate(user?.role === 'worker' ? '/jobs' : '/jobs/my')} className="il-btn il-btn-primary" style={{ marginTop: 16 }}>
              {user?.role === 'worker' ? t('findWork') : t('viewMyJobs')}
            </button>
          </div>
        )}

        {allChats.length > 0 && (
          <div className="il-card" style={{ overflow: 'hidden', padding: 0 }}>
            {allChats.map((conv, idx) => {
              const otherId  = userId(conv);
              const isOnline = onlineUsers?.includes(otherId);
              const hasUnread = conv.unread > 0;
              const isNew = conv.isNew;

              return (
                <button key={conv.conversationId} onClick={() => navigate(`/chat/${otherId}`)} style={{
                  width: '100%',
                  background: hasUnread ? 'var(--primary-light)' : isNew ? 'var(--success-bg)' : '#fff',
                  border: 'none',
                  borderBottom: idx < allChats.length - 1 ? '1px solid var(--border)' : 'none',
                  padding: '15px 18px', display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', textAlign: 'left', transition: 'background .15s',
                }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div className="il-avatar" style={{
                      width: 50, height: 50, fontSize: 19,
                      background: isNew ? 'var(--success-bg)' : 'var(--primary-light)',
                      color: isNew ? 'var(--primary-dark)' : 'var(--primary-dark)',
                      overflow: 'hidden',
                    }}>
                      {conv.otherUser?.profilePhoto
                        ? <img src={conv.otherUser.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        : (conv.otherUser?.name?.charAt(0).toUpperCase() || '?')}
                    </div>
                    {isOnline && <span style={{ position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: '50%', background: '#22C55E', border: '2px solid #fff' }}></span>}
                    {isNew && <span style={{ position: 'absolute', top: -3, right: -4, background: 'var(--primary)', color: '#fff', fontSize: 8, fontWeight: 800, padding: '2px 5px', borderRadius: 6 }}>{t('newBadge')}</span>}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <p style={{ margin: 0, fontSize: 14.5, fontWeight: hasUnread ? 800 : 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.otherUser?.name || 'Unknown'}
                      </p>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0, marginLeft: 8 }}>{formatTime(conv.lastTime)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{
                        margin: 0, fontSize: 12.5,
                        color: isNew ? 'var(--primary-dark)' : hasUnread ? 'var(--text)' : 'var(--text-tertiary)',
                        fontWeight: isNew ? 600 : 400,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260,
                      }}>{conv.lastMessage}</p>
                      {hasUnread && (
                        <span style={{ background: 'var(--primary)', color: '#fff', fontSize: 10, fontWeight: 800, minWidth: 20, height: 20, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px', flexShrink: 0, marginLeft: 8 }}>{conv.unread}</span>
                      )}
                    </div>
                  </div>
                  <i className="ti ti-chevron-right" style={{ fontSize: 17, color: 'var(--border-strong)', flexShrink: 0 }} aria-hidden="true"></i>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}