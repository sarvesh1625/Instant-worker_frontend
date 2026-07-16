import { useState, useEffect } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, STATUS_COLOR, inputStyle } from './Admintheme ';

function JobsContent() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [jobType, setJobType] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (jobType) params.append('jobType', jobType);
      const { data } = await adminAxios.get(`/api/admin/jobs?${params}`);
      setJobs(data.jobs);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [status, jobType]);

  const handleDelete = async (jobId) => {
    if (!confirm('Remove this job posting permanently?')) return;
    try {
      await adminAxios.delete(`/api/admin/jobs/${jobId}`);
      setJobs(prev => prev.filter(j => j._id !== jobId));
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const statusC = (s) => STATUS_COLOR[s] || { color: T.textTertiary, bg: 'rgba(148,163,184,.14)' };

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Jobs</h1>
      <p style={{ margin: '0 0 20px', fontSize: 13.5, color: T.textTertiary }}>Moderate job postings across the platform</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 140, cursor: 'pointer' }}>
          <option value="">All status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="completed">Completed</option>
        </select>
        <select value={jobType} onChange={e => setJobType(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 140, cursor: 'pointer' }}>
          <option value="">All types</option>
          <option value="regular">Regular</option>
          <option value="urgent">Urgent</option>
          <option value="part_time">Part-time</option>
        </select>
      </div>

      {loading && <p style={{ color: T.textTertiary, fontSize: 13.5 }}>Loading...</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {jobs.map(job => {
          const sc = statusC(job.status);
          return (
            <div key={job._id} style={{ background: T.surface, borderRadius: T.radiusMd, border: `1px solid ${T.border}`, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: T.text }}>{job.title}</p>
                    {job.jobType === 'urgent' && (
                      <span style={{ background: T.dangerBg, color: '#F87171', fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 10, letterSpacing: '.04em' }}>URGENT</span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, color: T.textSecondary }}>
                    {job.skill} · {job.location?.city} · ₹{job.wage}/day · {job.applicants?.length || 0} applicants
                  </p>
                  <p style={{ margin: '5px 0 0', fontSize: 11.5, color: T.textTertiary }}>
                    Posted by {job.postedBy?.name} ({job.postedBy?.phone})
                    {job.postedBy?.accountStatus !== 'active' && (
                      <span style={{ color: '#F87171', fontWeight: 700 }}> · poster is {job.postedBy?.accountStatus}</span>
                    )}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                  <span style={{ background: sc.bg, color: sc.color, fontSize: 10.5, fontWeight: 700, padding: '4px 11px', borderRadius: 999, textTransform: 'capitalize' }}>{job.status}</span>
                  <button onClick={() => handleDelete(job._id)} style={{ background: 'none', border: 'none', color: '#F87171', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: T.font, fontWeight: 600 }}>
                    <i className="ti ti-trash" style={{ fontSize: 14 }} aria-hidden="true"></i> Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {!loading && jobs.length === 0 && (
          <p style={{ textAlign: 'center', padding: 40, color: T.textTertiary, fontSize: 13 }}>No jobs found</p>
        )}
      </div>
    </div>
  );
}

export default function AdminJobs() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <JobsContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}