import { useNavigate } from 'react-router-dom';
import SpeakButton from './SpeakButton';

/**
 * Reusable JobCard with speak button.
 * Used in Dashboard feed and BrowseJobs.
 *
 * `full` — computed as:
 *   const acceptedCount = job.applicants?.filter(a => a.status === 'accepted').length || 0;
 *   const full = acceptedCount >= (job.workersNeeded || 1);
 *
 * `distanceKm` — optional, only present when the job list came from a
 * radius-based (geo) search. Shown as a small badge next to the location.
 */
export default function JobCard({ job, onApply, applied, accepted, full, role, distanceKm }) {
  const navigate = useNavigate();

  const timeAgo = (d) => {
    const diff = Date.now() - new Date(d);
    if (diff < 3600000)  return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    return `${Math.floor(diff/86400000)}d ago`;
  };

  return (
    <div style={{ background:'#fff', borderRadius:14, border:'1.5px solid #e5e7eb', marginBottom:10, overflow:'hidden', opacity: (full && !accepted) ? 0.75 : 1 }}>

      {/* Top: skill badge + time */}
      <div style={{ background:'#eff6ff', padding:'6px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ background:'#dbeafe', color:'#1d4ed8', fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>
          {job.skill}
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {accepted && (
            <span style={{ background:'#dcfce7', color:'#16a34a', fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:12 }}>
              ✓ Accepted
            </span>
          )}
          {full && !accepted && (
            <span style={{ background:'#f3f4f6', color:'#6b7280', fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:12 }}>
              Job Full
            </span>
          )}
          <span style={{ fontSize:10, color:'#6b7280' }}>
            <i className="ti ti-clock" style={{ fontSize:11, marginRight:2 }} aria-hidden="true"></i>
            {timeAgo(job.createdAt)}
          </span>
        </div>
      </div>

      <div style={{ padding:'10px 12px' }}>
        {/* Title + speak button side by side */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:4 }}>
          <p style={{ margin:0, fontSize:14, fontWeight:700, color:'#111827', flex:1 }}>{job.title}</p>
          <SpeakButton job={job} id={job._id} compact />
        </div>

        <div style={{ display:'flex', gap:8, marginBottom:8, flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ fontSize:12, color:'#6b7280', display:'flex', alignItems:'center', gap:3 }}>
            <i className="ti ti-map-pin" style={{ fontSize:13 }} aria-hidden="true"></i>
            {job.location?.city}{job.location?.area ? `, ${job.location.area}` : ''}
          </span>
          {typeof distanceKm === 'number' && (
            <span style={{ background:'#f0fdf4', color:'#16a34a', fontSize:10.5, fontWeight:700, padding:'2px 8px', borderRadius:20, display:'flex', alignItems:'center', gap:3 }}>
              <i className="ti ti-walk" style={{ fontSize:11 }} aria-hidden="true"></i>
              {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m away` : `${distanceKm}km away`}
            </span>
          )}
          <span style={{ fontSize:14, fontWeight:700, color:'#16a34a' }}>₹{job.wage}/day</span>
          {job.startDate && (
            <span style={{ fontSize:11, color:'#ca8a04', display:'flex', alignItems:'center', gap:3 }}>
              <i className="ti ti-calendar" style={{ fontSize:12 }} aria-hidden="true"></i>
              {new Date(job.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
              {job.startTime ? ` ${job.startTime}` : ''}
            </span>
          )}
        </div>

        <div style={{ display:'flex', gap:8, alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:11, color:'#9ca3af' }}>By {job.postedBy?.name} · {job.workersNeeded} needed</span>
          <div style={{ display:'flex', gap:6 }}>
            {accepted && job.postedBy?.phone && (
              <a href={`tel:${job.postedBy.phone}`} style={{ background:'#dcfce7', color:'#16a34a', borderRadius:8, padding:'5px 10px', fontSize:12, fontWeight:600, textDecoration:'none', display:'flex', alignItems:'center', gap:3 }}>
                <i className="ti ti-phone" style={{ fontSize:13 }} aria-hidden="true"></i> Call
              </a>
            )}
            {accepted && (
              <button onClick={() => navigate(`/chat/${job.postedBy?._id}`)} style={{ background:'#dbeafe', color:'#1d4ed8', border:'none', borderRadius:8, padding:'5px 10px', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:3 }}>
                <i className="ti ti-message-circle" style={{ fontSize:13 }} aria-hidden="true"></i> Chat
              </button>
            )}
            {role === 'worker' && !accepted && full && (
              <span style={{
                background:'#f3f4f6', color:'#9ca3af', border:'1.5px solid #e5e7eb',
                borderRadius:8, padding:'5px 12px', fontSize:12, fontWeight:600,
                display:'flex', alignItems:'center', gap:3,
              }}>
                <i className="ti ti-lock" style={{ fontSize:13 }} aria-hidden="true"></i>
                Job Full
              </span>
            )}
            {role === 'worker' && !accepted && !full && (
              <button onClick={() => onApply(job._id)} disabled={applied} style={{
                background: applied ? '#f3f4f6' : '#1a56db',
                color: applied ? '#6b7280' : '#fff',
                border: applied ? '1.5px solid #e5e7eb' : 'none',
                borderRadius:8, padding:'5px 12px', fontSize:12, fontWeight:600,
                cursor: applied ? 'default' : 'pointer',
                display:'flex', alignItems:'center', gap:3, minWidth:72, justifyContent:'center',
              }}>
                <i className={`ti ${applied ? 'ti-clock' : 'ti-send'}`} style={{ fontSize:13 }} aria-hidden="true"></i>
                {applied ? 'Applied' : 'Apply'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}