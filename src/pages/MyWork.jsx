import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/AppShell';
import RateWorkModal from '../components/RateWorkModal';
import WorkerLocationPanel from '../components/WorkerLocationPanel';
import '../styles/theme.css';

const STATUS_CONFIG = {
  not_started: { key: 'notStarted', bg: '#F8FAFC', color: '#475569', icon: 'ti-hourglass-empty' },
  in_progress: { key: 'inProgress', bg: '#FFF7ED', color: '#EA580C', icon: 'ti-clock-play' },
  completed:   { key: 'completed',  bg: '#ECFDF5', color: '#059669', icon: 'ti-circle-check' },
};

const getWorkStatus = (j) => j?.workStatus || 'not_started';

export default function MyWork() {
  const navigate    = useNavigate();
  const { t }       = useLang();
  const { user }    = useAuth();
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [myReviews, setMyReviews] = useState({});
  const [rateModal, setRateModal] = useState({ open: false, job: null });

  const load = async () => {
    try {
      const { data } = await axios.get('/api/jobs/my/work');
      setJobs(data.jobs || []);
      const checks = await Promise.all(
        (data.jobs || []).filter(j => getWorkStatus(j) === 'completed').map(async (j) => {
          try {
            const res = await axios.get(`/api/reviews/${j.postedBy?._id}`);
            const already = res.data.reviews?.some(r => (r.job?._id || r.job) === j._id);
            return [j._id, already];
          } catch { return [j._id, false]; }
        })
      );
      setMyReviews(Object.fromEntries(checks));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); const iv = setInterval(load, 15000); return () => clearInterval(iv); }, []);

  const openRateModal = (job) => setRateModal({ open: true, job });
  const handleRated   = (job) => { setRateModal({ open: false, job: null }); setMyReviews(prev => ({ ...prev, [job._id]: true })); };

  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '22px 18px 30px' }}>

        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>{t('myWork')}</h1>
        <p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'var(--text-secondary)' }}>Mera kaam — jobs you were accepted for</p>

        {loading && <p className="il-muted" style={{ textAlign: 'center', padding: '40px 0', fontSize: 13.5 }}>Loading...</p>}

        {!loading && jobs.length === 0 && (
          <div className="il-empty">
            <i className="ti ti-briefcase-off" aria-hidden="true"></i>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>No accepted jobs yet</p>
            <p style={{ fontSize: 12.5, marginTop: 5 }}>Apply to jobs and once accepted they will show here</p>
            <button onClick={() => navigate('/jobs')} className="il-btn il-btn-primary" style={{ marginTop: 16 }}>{t('findWork')}</button>
          </div>
        )}

        <div className="mywork-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
          {jobs.map(job => {
            const ws = getWorkStatus(job);
            const cfg = STATUS_CONFIG[ws] || STATUS_CONFIG.not_started;
            const statusText = t(cfg.key);
            const alreadyRated = myReviews[job._id];

            return (
              <div key={job._id} className="il-card" style={{ overflow: 'hidden', alignSelf: 'start' }}>
                <div style={{ background: cfg.bg, padding: '11px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className={`ti ${cfg.icon}`} style={{ fontSize: 18, color: cfg.color }} aria-hidden="true"></i>
                  <span style={{ fontSize: 13, fontWeight: 800, color: cfg.color }}>{statusText}</span>
                  {ws === 'in_progress' && <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: cfg.color, animation: 'il-pulse 1.5s infinite' }}></span>}
                </div>

                <div style={{ padding: '16px 18px' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: 15.5, fontWeight: 800, color: 'var(--text)' }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className="ti ti-map-pin" aria-hidden="true"></i>{job.location?.city}{job.location?.area ? `, ${job.location.area}` : ''}
                    </span>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--primary-dark)' }}>₹{job.wage}/day</span>
                  </div>

                  {/* Timeline */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    {['not_started', 'in_progress', 'completed'].map((step, i) => {
                      const order = ['not_started', 'in_progress', 'completed'];
                      const currentIdx = order.indexOf(ws);
                      const stepIdx = order.indexOf(step);
                      const isDone = stepIdx <= currentIdx;
                      return (
                        <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: isDone ? 'var(--primary)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {isDone && <i className="ti ti-check" style={{ fontSize: 12, color: '#fff' }} aria-hidden="true"></i>}
                          </div>
                          {i < 2 && <div style={{ flex: 1, height: 2, background: stepIdx < currentIdx ? 'var(--primary)' : 'var(--border)', margin: '0 4px' }}></div>}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: 'var(--text-tertiary)', marginBottom: 14, padding: '0 1px' }}>
                    <span>Accepted</span><span>Started</span><span>Completed</span>
                  </div>

                  {(ws === 'not_started' || ws === 'in_progress') && (
                    <div style={{ marginBottom: 14 }}><WorkerLocationPanel job={job} /></div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div className="il-avatar" style={{ width: 30, height: 30, fontSize: 12.5 }}>{job.postedBy?.name?.charAt(0).toUpperCase()}</div>
                      <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{job.postedBy?.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {job.postedBy?.phone && (
                        <a href={`tel:${job.postedBy.phone}`} className="il-btn il-btn-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '6px 10px' }}>
                          <i className="ti ti-phone" style={{ fontSize: 13 }} aria-hidden="true"></i>
                        </a>
                      )}
                      <button onClick={() => navigate(`/chat/${job.postedBy?._id}`)} className="il-btn il-btn-sm" style={{ background: 'var(--info-bg)', color: '#0369A1', padding: '6px 10px' }}>
                        <i className="ti ti-message-circle" style={{ fontSize: 13 }} aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>

                  {ws === 'completed' && !alreadyRated && (
                    <button onClick={() => openRateModal(job)} style={{
                      width: '100%', marginTop: 12, background: 'var(--accent-light)', border: '1.5px solid #FDE68A',
                      borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 700, color: '#854D0E',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontFamily: 'var(--font)', animation: 'il-glow 2s ease-in-out infinite',
                    }}>
                      <i className="ti ti-star" style={{ fontSize: 16 }} aria-hidden="true"></i> {t('rateContractor')}
                    </button>
                  )}

                  {ws === 'completed' && alreadyRated && (
                    <div style={{ width: '100%', marginTop: 12, background: 'var(--primary-light)', border: '1px solid #A7F3D0', borderRadius: 10, padding: 10, fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <i className="ti ti-circle-check" style={{ fontSize: 14 }} aria-hidden="true"></i> You rated this job
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <RateWorkModal open={rateModal.open} job={rateModal.job} targetUser={rateModal.job?.postedBy}
        onClose={() => setRateModal({ open: false, job: null })} onSubmitted={() => handleRated(rateModal.job)} />

      <style>{`
        @media (min-width: 900px) {
          .mywork-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </AppShell>
  );
}