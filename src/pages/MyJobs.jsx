import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppShell from '../components/AppShell';
import RateWorkModal from '../components/RateWorkModal';
import LiveTrackingMap from '../components/LiveTrackingMap';
import '../styles/theme.css';

const WORK_STATUS = {
  not_started: { label: 'Not Started',      bg: '#F8FAFC', color: '#475569', icon: 'ti-hourglass-empty' },
  in_progress: { label: 'Work in progress', bg: '#FFF7ED', color: '#EA580C', icon: 'ti-clock-play' },
  completed:   { label: 'Work completed',   bg: '#ECFDF5', color: '#059669', icon: 'ti-circle-check' },
};

// Treat undefined/null as 'not_started' — legacy applicants may lack the field
const getWorkStatus = (a) => a?.workStatus || 'not_started';

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [actioning, setActioning]     = useState({});
  const [myReviews, setMyReviews]     = useState({});
  const [filter, setFilter]           = useState('all');
  const [trackingKey, setTrackingKey] = useState(null);
  const [rateModal, setRateModal]     = useState({ open: false, job: null, worker: null });

  const load = async () => {
    try {
      const { data } = await axios.get('/api/jobs/my/postings');
      setJobs(data.jobs || []);

      const checks = [];
      for (const job of data.jobs || []) {
        for (const a of job.applicants || []) {
          if (getWorkStatus(a) === 'completed' && a.worker?._id) {
            checks.push(
              axios.get(`/api/reviews/${a.worker._id}`)
                .then(res => {
                  const already = res.data.reviews?.some(r => (r.job?._id || r.job) === job._id);
                  return [`${job._id}-${a.worker._id}`, already];
                })
                .catch(() => [`${job._id}-${a.worker._id}`, false])
            );
          }
        }
      }
      const results = await Promise.all(checks);
      setMyReviews(Object.fromEntries(results));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 15000);
    return () => clearInterval(iv);
  }, []);

  const handleDecision = async (jobId, workerId, status) => {
    try {
      await axios.patch(`/api/jobs/${jobId}/applicants/${workerId}`, { status });
      load();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleStartWork = async (jobId, workerId) => {
    const key = `start-${jobId}-${workerId}`;
    setActioning(p => ({ ...p, [key]: true }));
    try {
      await axios.patch(`/api/jobs/${jobId}/applicants/${workerId}/start-work`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start work');
    } finally {
      setActioning(p => ({ ...p, [key]: false }));
    }
  };

  const handleCompleteWork = async (jobId, workerId) => {
    if (!confirm('Mark this work as completed? The wage will be recorded in both wallets.')) return;
    const key = `complete-${jobId}-${workerId}`;
    setActioning(p => ({ ...p, [key]: true }));
    try {
      await axios.patch(`/api/jobs/${jobId}/applicants/${workerId}/complete-work`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete work');
    } finally {
      setActioning(p => ({ ...p, [key]: false }));
    }
  };

  const handleCloseJob = async (jobId) => {
    if (!confirm('Close this job post? No new workers can apply.')) return;
    try {
      await axios.patch(`/api/jobs/${jobId}/close`);
      load();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const openRateModal = (job, worker) => setRateModal({ open: true, job, worker });
  const handleRated = () => {
    const key = `${rateModal.job._id}-${rateModal.worker._id}`;
    setMyReviews(prev => ({ ...prev, [key]: true }));
    setRateModal({ open: false, job: null, worker: null });
  };

  const toggleTracking = (jobId, workerId) => {
    const k = `${jobId}-${workerId}`;
    setTrackingKey(prev => prev === k ? null : k);
  };

  // Split into active work vs awaiting decision
  const acceptedCards = [];
  jobs.forEach(job => {
    (job.applicants || []).forEach(a => {
      if (a.status === 'accepted') acceptedCards.push({ job, applicant: a });
    });
  });

  const pendingJobs = jobs.filter(job => !(job.applicants || []).some(a => a.status === 'accepted'));
  const filteredAccepted = acceptedCards.filter(({ job }) => filter === 'all' ? true : job.status === filter);

  return (
    <AppShell>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '22px 18px 30px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>My Job Posts</h1>
            <p style={{ margin: '3px 0 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>Mere jobs — manage your posted work</p>
          </div>
          <button onClick={() => navigate('/jobs/post')} className="il-btn il-btn-primary">
            <i className="ti ti-plus" style={{ fontSize: 17 }} aria-hidden="true"></i>
            Post a Job
          </button>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {['all', 'open', 'closed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 700,
              fontFamily: 'var(--font)', cursor: 'pointer',
              border: filter === f ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
              background: filter === f ? 'var(--primary-light)' : '#fff',
              color: filter === f ? 'var(--primary-dark)' : 'var(--text-secondary)',
              textTransform: 'capitalize',
            }}>{f}</button>
          ))}
        </div>

        {loading && <p className="il-muted" style={{ textAlign: 'center', padding: '40px 0', fontSize: 13.5 }}>Loading...</p>}

        {!loading && jobs.length === 0 && (
          <div className="il-empty">
            <i className="ti ti-briefcase-off" aria-hidden="true"></i>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>No job posts yet</p>
            <p style={{ fontSize: 12.5, marginTop: 5 }}>Post your first job and workers will start applying</p>
            <button onClick={() => navigate('/jobs/post')} className="il-btn il-btn-primary" style={{ marginTop: 16 }}>
              Post your first job
            </button>
          </div>
        )}

        {/* ── Active work ── */}
        {filteredAccepted.length > 0 && (
          <>
            <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
              <i className="ti ti-briefcase-2" style={{ fontSize: 18, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
              Active Work
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
              {filteredAccepted.map(({ job, applicant: a }) => {
                const ws          = getWorkStatus(a);            // never undefined
                const cfg         = WORK_STATUS[ws] || WORK_STATUS.not_started;
                const workerId    = a.worker?._id;
                const startKey    = `start-${job._id}-${workerId}`;
                const completeKey = `complete-${job._id}-${workerId}`;
                const cardKey     = `${job._id}-${workerId}`;
                const alreadyRated = myReviews[cardKey];
                const isTracking   = trackingKey === cardKey;
                const canTrack     = ws === 'not_started' || ws === 'in_progress';

                return (
                  <div key={cardKey} className="il-card" style={{ overflow: 'hidden' }}>
                    <div style={{ background: cfg.bg, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <i className={`ti ${cfg.icon}`} style={{ fontSize: 17, color: cfg.color }} aria-hidden="true"></i>
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: cfg.color }}>{cfg.label}</span>
                      {ws === 'in_progress' && (
                        <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: cfg.color, animation: 'il-pulse 1.5s infinite' }}></span>
                      )}
                    </div>

                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                        <div style={{ minWidth: 0 }}>
                          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{job.title}</h3>
                          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                            <i className="ti ti-map-pin" style={{ marginRight: 4 }} aria-hidden="true"></i>
                            {job.location?.city}{job.location?.area ? `, ${job.location.area}` : ''}
                          </p>
                        </div>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--primary-dark)', flexShrink: 0 }}>₹{job.wage}/day</p>
                      </div>

                      {/* Timeline */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        {['not_started', 'in_progress', 'completed'].map((step, i) => {
                          const order = ['not_started', 'in_progress', 'completed'];
                          const done = order.indexOf(step) <= order.indexOf(ws);
                          const lineDone = order.indexOf(step) < order.indexOf(ws);
                          return (
                            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                              <div style={{
                                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                background: done ? 'var(--primary)' : 'var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                {done && <i className="ti ti-check" style={{ fontSize: 12, color: '#fff' }} aria-hidden="true"></i>}
                              </div>
                              {i < 2 && <div style={{ flex: 1, height: 2, background: lineDone ? 'var(--primary)' : 'var(--border)', margin: '0 5px' }}></div>}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: 'var(--text-tertiary)', marginBottom: 14 }}>
                        <span>Accepted</span><span>Started</span><span>Completed</span>
                      </div>

                      {/* Worker row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 13, marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                          <div className="il-avatar" style={{ width: 34, height: 34, fontSize: 14 }}>
                            {a.worker?.profilePhoto
                              ? <img src={a.worker.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                              : a.worker?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{a.worker?.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-tertiary)' }}>Worker</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          {a.worker?.phone && (
                            <a href={`tel:${a.worker.phone}`} className="il-btn il-btn-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '7px 11px' }}>
                              <i className="ti ti-phone" style={{ fontSize: 14 }} aria-hidden="true"></i>
                            </a>
                          )}
                          <button onClick={() => navigate(`/chat/${workerId}`)} className="il-btn il-btn-sm" style={{ background: 'var(--info-bg)', color: '#0369A1', padding: '7px 11px' }}>
                            <i className="ti ti-message-circle" style={{ fontSize: 14 }} aria-hidden="true"></i>
                          </button>
                          <button onClick={() => navigate(`/profile/${workerId}`)} className="il-btn il-btn-sm" style={{ background: 'var(--purple-bg)', color: 'var(--purple)', padding: '7px 11px' }}>
                            <i className="ti ti-user" style={{ fontSize: 14 }} aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>

                      {/* Track button */}
                      {canTrack && (
                        <button onClick={() => toggleTracking(job._id, workerId)} className="il-btn il-btn-block" style={{
                          marginBottom: 10,
                          background: isTracking ? 'var(--danger-bg)' : 'var(--primary-light)',
                          color: isTracking ? 'var(--danger)' : 'var(--primary-dark)',
                          border: `1.5px solid ${isTracking ? '#fecaca' : '#A7F3D0'}`,
                          boxShadow: 'none',
                        }}>
                          <i className={`ti ${isTracking ? 'ti-eye-off' : 'ti-map-pin'}`} style={{ fontSize: 16 }} aria-hidden="true"></i>
                          {isTracking ? 'Hide map' : 'Track worker live'}
                        </button>
                      )}

                      {isTracking && canTrack && (
                        <div style={{ marginBottom: 12, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <LiveTrackingMap job={job} worker={a.worker} />
                        </div>
                      )}

                      {/* ── Action buttons ── */}
                      {ws === 'not_started' && (
                        <button
                          onClick={() => handleStartWork(job._id, workerId)}
                          disabled={actioning[startKey]}
                          className="il-btn il-btn-primary il-btn-block"
                          style={{ padding: 13 }}>
                          {actioning[startKey]
                            ? <><span className="il-spinner"></span> Starting...</>
                            : <><i className="ti ti-player-play" style={{ fontSize: 17 }} aria-hidden="true"></i> Mark Work as Started</>}
                        </button>
                      )}

                      {ws === 'in_progress' && (
                        <button
                          onClick={() => handleCompleteWork(job._id, workerId)}
                          disabled={actioning[completeKey]}
                          className="il-btn il-btn-secondary il-btn-block"
                          style={{ padding: 13 }}>
                          {actioning[completeKey]
                            ? <><span className="il-spinner"></span> Completing...</>
                            : <><i className="ti ti-circle-check" style={{ fontSize: 17 }} aria-hidden="true"></i> Mark Work as Completed</>}
                        </button>
                      )}

                      {ws === 'completed' && !alreadyRated && (
                        <button onClick={() => openRateModal(job, a.worker)} className="il-btn il-btn-block" style={{
                          background: 'var(--accent-light)', border: '1.5px solid #FDE68A',
                          color: '#854D0E', padding: 13, boxShadow: 'none',
                          animation: 'il-glow 2s ease-in-out infinite',
                        }}>
                          <i className="ti ti-star" style={{ fontSize: 17 }} aria-hidden="true"></i>
                          Rate Worker
                        </button>
                      )}

                      {ws === 'completed' && alreadyRated && (
                        <div style={{
                          background: 'var(--primary-light)', border: '1px solid #A7F3D0', borderRadius: 12,
                          padding: 12, fontSize: 12.5, fontWeight: 700, color: 'var(--primary-dark)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        }}>
                          <i className="ti ti-circle-check" style={{ fontSize: 15 }} aria-hidden="true"></i>
                          You rated this worker
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Awaiting decision ── */}
        {filter !== 'closed' && pendingJobs.length > 0 && (
          <>
            <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
              <i className="ti ti-hourglass-empty" style={{ fontSize: 18, color: 'var(--secondary-dark)' }} aria-hidden="true"></i>
              Awaiting Decision
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {pendingJobs
                .filter(job => filter === 'all' ? true : job.status === filter)
                .map(job => {
                  const pending = (job.applicants || []).filter(a => a.status === 'pending');
                  return (
                    <div key={job._id} className="il-card" style={{ overflow: 'hidden' }}>
                      <div style={{ background: 'var(--surface)', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="ti ti-list-details" style={{ fontSize: 17, color: 'var(--text-secondary)' }} aria-hidden="true"></i>
                        <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-secondary)' }}>
                          {pending.length > 0 ? `${pending.length} applicant${pending.length !== 1 ? 's' : ''} waiting` : 'No applicants yet'}
                        </span>
                        <span className="il-badge" style={{
                          marginLeft: 'auto',
                          background: job.status === 'open' ? 'var(--primary-light)' : 'var(--surface)',
                          color: job.status === 'open' ? 'var(--primary-dark)' : 'var(--text-tertiary)',
                          border: '1px solid var(--border)',
                        }}>{job.status}</span>
                      </div>

                      <div style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                          <div>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{job.title}</h3>
                            <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                              <i className="ti ti-map-pin" style={{ marginRight: 4 }} aria-hidden="true"></i>
                              {job.location?.city}{job.location?.area ? `, ${job.location.area}` : ''} · {job.skill}
                            </p>
                          </div>
                          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--primary-dark)', flexShrink: 0 }}>₹{job.wage}/day</p>
                        </div>

                        {pending.length === 0 && (
                          <p style={{ margin: '10px 0', fontSize: 12.5, color: 'var(--text-tertiary)', textAlign: 'center' }}>
                            Waiting for workers to apply
                          </p>
                        )}

                        {pending.map(a => (
                          <div key={a.worker?._id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                            borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12, flexWrap: 'wrap',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className="il-avatar" style={{ width: 34, height: 34, fontSize: 14 }}>
                                {a.worker?.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{a.worker?.name}</p>
                                <button onClick={() => navigate(`/profile/${a.worker?._id}`)} className="il-link" style={{ background: 'none', border: 'none', padding: 0, fontSize: 11, cursor: 'pointer' }}>
                                  View profile
                                </button>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => handleDecision(job._id, a.worker?._id, 'accepted')} className="il-btn il-btn-primary il-btn-sm">
                                Accept
                              </button>
                              <button onClick={() => handleDecision(job._id, a.worker?._id, 'rejected')} className="il-btn il-btn-danger-ghost il-btn-sm">
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}

                        {job.status === 'open' && (
                          <button onClick={() => handleCloseJob(job._id)} className="il-btn il-btn-outline il-btn-block" style={{ marginTop: 14 }}>
                            <i className="ti ti-lock" style={{ fontSize: 15 }} aria-hidden="true"></i>
                            Close this job post
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>

      <RateWorkModal
        open={rateModal.open}
        job={rateModal.job}
        targetUser={rateModal.worker}
        onClose={() => setRateModal({ open: false, job: null, worker: null })}
        onSubmitted={handleRated}
      />
    </AppShell>
  );
}