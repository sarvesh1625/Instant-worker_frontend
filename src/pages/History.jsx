import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/AppShell';
import RateWorkModal from '../components/RateWorkModal';
import '../styles/theme.css';

export default function History() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isWorker = user?.role === 'worker';

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rated, setRated]     = useState({});   // jobId-otherId -> true
  const [rateModal, setRateModal] = useState({ open: false, job: null, target: null });

  const load = async () => {
    try {
      const { data } = await axios.get('/api/jobs/history');
      const items = data.history || [];
      setHistory(items);

      // Check which ones I've already reviewed
      const checks = items
        .filter(h => h.otherParty?._id)
        .map(h =>
          axios.get(`/api/reviews/${h.otherParty._id}`)
            .then(res => {
              const already = res.data.reviews?.some(r =>
                (r.reviewedBy?._id || r.reviewedBy) === user._id &&
                (r.job?._id || r.job) === h.jobId
              );
              return [`${h.jobId}-${h.otherParty._id}`, already];
            })
            .catch(() => [`${h.jobId}-${h.otherParty._id}`, false])
        );
      const results = await Promise.all(checks);
      setRated(Object.fromEntries(results));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openRate = (h) => {
    setRateModal({
      open: true,
      job: { _id: h.jobId, title: h.title },
      target: h.otherParty,
    });
  };

  const handleRated = () => {
    const key = `${rateModal.job._id}-${rateModal.target._id}`;
    setRated(prev => ({ ...prev, [key]: true }));
    setRateModal({ open: false, job: null, target: null });
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const totalAmount = history.reduce((s, h) => s + (Number(h.wage) || 0), 0);

  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '22px 18px 30px' }}>

        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          History
        </h1>
        <p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'var(--text-secondary)' }}>Purane kaam — your completed jobs</p>

        {!loading && history.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div className="il-card" style={{ padding: '16px 18px' }}>
              <p style={{ margin: 0, fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700 }}>Completed jobs</p>
              <p style={{ margin: '4px 0 0', fontSize: 25, fontWeight: 800, color: 'var(--text)' }}>{history.length}</p>
            </div>
            <div className="il-card" style={{ padding: '16px 18px' }}>
              <p style={{ margin: 0, fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700 }}>{isWorker ? 'Total earned' : 'Total paid'}</p>
              <p style={{ margin: '4px 0 0', fontSize: 25, fontWeight: 800, color: isWorker ? 'var(--primary-dark)' : 'var(--text)' }}>₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}

        {loading && <p className="il-muted" style={{ textAlign: 'center', padding: '30px 0', fontSize: 13.5 }}>Loading...</p>}

        {!loading && history.length === 0 && (
          <div className="il-empty">
            <i className="ti ti-history-off" aria-hidden="true"></i>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>No completed jobs yet</p>
            <p style={{ fontSize: 12.5, marginTop: 5 }}>
              {isWorker ? 'Finish your first job and it will appear here' : 'Once a worker completes a job, it will appear here'}
            </p>
            <button onClick={() => navigate(isWorker ? '/jobs' : '/jobs/post')} className="il-btn il-btn-primary" style={{ marginTop: 16 }}>
              {isWorker ? 'Find work' : 'Post a job'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {history.map((h, i) => {
            const key = `${h.jobId}-${h.otherParty?._id}`;
            const isRated = rated[key];
            return (
              <div key={`${h.jobId}-${i}`} className="il-card" style={{ overflow: 'hidden' }}>
                <div style={{ background: 'var(--primary-light)', padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <i className="ti ti-circle-check" style={{ fontSize: 15, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)' }}>Completed · {formatDate(h.completedAt)}</span>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{h.title}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                        <i className="ti ti-map-pin" style={{ marginRight: 4 }} aria-hidden="true"></i>
                        {h.location?.city}{h.location?.area ? `, ${h.location.area}` : ''} · {h.skill}
                      </p>
                    </div>
                    <p style={{ margin: 0, fontSize: 16.5, fontWeight: 800, color: isWorker ? 'var(--primary-dark)' : 'var(--text)', flexShrink: 0 }}>
                      {isWorker ? '+' : ''}₹{Number(h.wage).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12, gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div className="il-avatar" style={{ width: 30, height: 30, fontSize: 12.5 }}>
                        {h.otherParty?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{h.otherParty?.name}</p>
                        <p style={{ margin: 0, fontSize: 10.5, color: 'var(--text-tertiary)' }}>{isWorker ? 'You worked for' : 'Worker'}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => navigate(`/profile/${h.otherParty?._id}`)} className="il-btn il-btn-outline il-btn-sm">
                        Profile
                      </button>
                      {isRated ? (
                        <span className="il-badge" style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '7px 12px' }}>
                          <i className="ti ti-circle-check" style={{ fontSize: 14 }} aria-hidden="true"></i>
                          Rated
                        </span>
                      ) : (
                        <button onClick={() => openRate(h)} className="il-btn il-btn-sm" style={{
                          background: 'var(--accent-light)', color: '#854D0E', border: '1.5px solid #FDE68A',
                        }}>
                          <i className="ti ti-star" style={{ fontSize: 14 }} aria-hidden="true"></i>
                          {isWorker ? 'Rate poster' : 'Rate worker'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <RateWorkModal
        open={rateModal.open}
        job={rateModal.job}
        targetUser={rateModal.target}
        onClose={() => setRateModal({ open: false, job: null, target: null })}
        onSubmitted={handleRated}
      />
    </AppShell>
  );
}