import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UrgentJobBanner() {
  const navigate = useNavigate();
  const [urgentJobs, setUrgentJobs] = useState([]);
  const [applying, setApplying]     = useState({});
  const [confirmed, setConfirmed]   = useState({});

  const load = async () => {
    try {
      const { data } = await axios.get('/api/jobs/urgent');
      setUrgentJobs(data.jobs || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    load();
    // Poll every 20s for new urgent jobs
    const iv = setInterval(load, 20000);
    return () => clearInterval(iv);
  }, []);

  const handleQuickApply = async (jobId) => {
    setApplying(p => ({ ...p, [jobId]: true }));
    try {
      const { data } = await axios.post(`/api/jobs/${jobId}/apply`);
      if (data.autoAccepted) {
        setConfirmed(p => ({ ...p, [jobId]: true }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not respond');
    } finally {
      setApplying(p => ({ ...p, [jobId]: false }));
    }
  };

  if (urgentJobs.length === 0) return null;

  return (
    <div style={{ background: '#fef2f2', borderBottom: '2px solid #fecaca', padding: '12px 12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', display: 'inline-block', animation: 'urgent-pulse 1.2s infinite' }}></span>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#991b1b' }}>
          {urgentJobs.length} urgent job{urgentJobs.length > 1 ? 's' : ''} near you — respond fast!
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {urgentJobs.slice(0, 3).map(job => {
          const isConfirmed = confirmed[job._id];
          const accepted = job.applicants?.filter(a => a.status === 'accepted').length || 0;
          const full = accepted >= job.workersNeeded;

          return (
            <div key={job._id} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #fecaca', padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111827' }}>{job.title}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6b7280' }}>
                    {job.skill} · {job.location?.city} · ₹{job.wage}/day
                  </p>
                </div>
                <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 12, whiteSpace: 'nowrap' }}>
                  <i className="ti ti-bolt" style={{ fontSize: 10, marginRight: 2 }} aria-hidden="true"></i>
                  URGENT
                </span>
              </div>

              {isConfirmed ? (
                <div style={{ background: '#dcfce7', borderRadius: 8, padding: '7px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#15803d' }}>
                    <i className="ti ti-check" style={{ marginRight: 4, fontSize: 13 }} aria-hidden="true"></i>
                    You're confirmed!
                  </span>
                  <button onClick={() => navigate(`/chat/${job.postedBy?._id}`)} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                    Open chat
                  </button>
                </div>
              ) : full ? (
                <div style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', padding: '6px 0' }}>Already filled</div>
              ) : (
                <button
                  onClick={() => handleQuickApply(job._id)}
                  disabled={applying[job._id]}
                  style={{
                    width: '100%', background: '#dc2626', color: '#fff', border: 'none',
                    borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 700,
                    cursor: applying[job._id] ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                  <i className="ti ti-bolt" style={{ fontSize: 14 }} aria-hidden="true"></i>
                  {applying[job._id] ? 'Confirming...' : "I'm coming — confirm now"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes urgent-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}