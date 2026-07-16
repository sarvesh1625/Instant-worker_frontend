import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppShell from '../components/AppShell';
import LocationPicker from '../components/LocationPicker';
import '../styles/theme.css';

const SKILLS = ['Labour','Painter','Carpenter','Electrician','Mechanic','Farmer','Driver','Plumber','Welder','Other'];
const CITIES = ['Hyderabad','Visakhapatnam','Vijayawada','Warangal','Tirupati','Bengaluru','Chennai','Mumbai','Delhi','Pune'];

const JOB_TYPES = [
  { value: 'regular',   icon: 'ti-briefcase', color: '#059669', bg: '#ECFDF5', label: 'Regular',   desc: 'Normal job, review applicants and choose' },
  { value: 'urgent',    icon: 'ti-bolt',      color: '#EF4444', bg: '#FEF2F2', label: 'Urgent',    desc: 'Need someone NOW — first to accept is confirmed' },
  { value: 'part_time', icon: 'ti-clock',     color: '#EA580C', bg: '#FFF7ED', label: 'Part-time', desc: 'A few hours, not a full day' },
];

export default function PostJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', skill: '', description: '',
    city: '', area: '', wage: '', workersNeeded: 1,
    duration: '', startDate: '', startTime: '',
    jobType: 'regular', urgentWithinHours: 2,
  });
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = { ...form };
      if (coords) { payload.lat = coords.lat; payload.lng = coords.lng; }

      const { data } = await axios.post('/api/jobs', payload);
      if (form.jobType === 'urgent') {
        alert('Urgent job posted! Nearby available workers have been alerted.');
      }
      navigate('/jobs/my');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post job');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally { setLoading(false); }
  };

  const isUrgent = form.jobType === 'urgent';
  const today = new Date().toISOString().split('T')[0];

  return (
    <AppShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '22px 18px 30px' }}>

        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Post a Job
        </h1>
        <p style={{ margin: '0 0 22px', fontSize: 13.5, color: 'var(--text-secondary)' }}>
          Kaam post karo — describe the work you need done
        </p>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid #fecaca', borderRadius: 12, padding: '11px 15px', marginBottom: 18 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>
              <i className="ti ti-alert-circle" style={{ marginRight: 6, verticalAlign: -2 }} aria-hidden="true"></i>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ── Job type selector ── */}
          <div className="il-card il-card-pad" style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>
              What kind of job is this?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {JOB_TYPES.map(jt => {
                const selected = form.jobType === jt.value;
                return (
                  <button
                    key={jt.value}
                    type="button"
                    onClick={() => setForm({ ...form, jobType: jt.value })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '15px 16px', cursor: 'pointer', textAlign: 'left',
                      borderRadius: 14, fontFamily: 'var(--font)',
                      border: selected ? `1.5px solid ${jt.color}` : '1.5px solid var(--border)',
                      background: selected ? jt.bg : '#fff',
                      transition: 'all .15s',
                    }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: selected ? '#fff' : jt.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <i className={`ti ${jt.icon}`} style={{ fontSize: 22, color: jt.color }} aria-hidden="true"></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: selected ? jt.color : 'var(--text)' }}>{jt.label}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{jt.desc}</p>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      border: selected ? `6px solid ${jt.color}` : '2px solid var(--border-strong)',
                      background: '#fff',
                    }}></div>
                  </button>
                );
              })}
            </div>

            {isUrgent && (
              <div style={{ marginTop: 14, background: 'var(--danger-bg)', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 10 }}>
                <i className="ti ti-info-circle" style={{ fontSize: 17, color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} aria-hidden="true"></i>
                <p style={{ margin: 0, fontSize: 12, color: '#991B1B', lineHeight: 1.6 }}>
                  Urgent jobs alert every available worker with this skill near your job location immediately.
                  The first worker to accept is <strong>auto-confirmed</strong> — no review step. Chat and live tracking open right away.
                </p>
              </div>
            )}
          </div>

          {/* ── Job details ── */}
          <div className="il-card il-card-pad" style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Job details</p>

            <div className="il-field">
              <label className="il-label">Job title <span className="il-required">*</span></label>
              <input className="il-input" name="title" value={form.title} onChange={handleChange} required
                placeholder="e.g. Painter needed for 2 BHK flat" maxLength={100} />
            </div>

            <div className="il-grid-2">
              <div className="il-field">
                <label className="il-label">Skill needed <span className="il-required">*</span></label>
                <select className="il-select" name="skill" value={form.skill} onChange={handleChange} required>
                  <option value="">Select skill</option>
                  {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="il-field">
                <label className="il-label">Workers needed <span className="il-required">*</span></label>
                <input className="il-input" name="workersNeeded" type="number" min="1" max="50"
                  value={form.workersNeeded} onChange={handleChange} required />
              </div>
            </div>

            <div className="il-field">
              <label className="il-label">Describe the work</label>
              <textarea className="il-textarea" name="description" value={form.description} onChange={handleChange}
                rows={3} maxLength={500} placeholder="What exactly needs to be done? Any tools or materials provided?" />
            </div>
          </div>

          {/* ── Location & wage ── */}
          <div className="il-card il-card-pad" style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Location & wage</p>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: 'var(--text-tertiary)' }}>
              Setting the exact location helps nearby workers find this job — within 6km when possible.
            </p>

            <div className="il-field">
              <LocationPicker value={coords} onChange={setCoords} city={form.city} />
            </div>

            <div className="il-grid-2">
              <div className="il-field">
                <label className="il-label">City <span className="il-required">*</span></label>
                <select className="il-select" name="city" value={form.city} onChange={handleChange} required>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="il-field">
                <label className="il-label">Area / locality</label>
                <input className="il-input" name="area" value={form.area} onChange={handleChange} placeholder="e.g. Madhapur" />
              </div>
            </div>

            <div className="il-field">
              <label className="il-label">Daily wage per worker (₹) <span className="il-required">*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, fontWeight: 700, color: 'var(--text-tertiary)' }}>₹</span>
                <input className="il-input" name="wage" type="number" min="1" value={form.wage} onChange={handleChange} required
                  placeholder="800" style={{ paddingLeft: 32 }} />
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 11.5, color: 'var(--text-tertiary)' }}>
                Fair wages attract better workers. Payment is direct — we take no commission.
              </p>
            </div>
          </div>

          {/* ── Schedule ── */}
          <div className="il-card il-card-pad" style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>When is the work?</p>

            <div className="il-grid-2">
              <div className="il-field">
                <label className="il-label">Start date</label>
                <input className="il-input" name="startDate" type="date" min={today} value={form.startDate} onChange={handleChange} />
              </div>
              <div className="il-field">
                <label className="il-label">Start time</label>
                <input className="il-input" name="startTime" type="time" value={form.startTime} onChange={handleChange} />
              </div>
            </div>

            <div className="il-field" style={{ marginBottom: isUrgent ? 16 : 0 }}>
              <label className="il-label">How long will it take?</label>
              <input className="il-input" name="duration" value={form.duration} onChange={handleChange}
                placeholder="e.g. 2 days, 1 week, half day" />
            </div>

            {isUrgent && (
              <div className="il-field" style={{ marginBottom: 0 }}>
                <label className="il-label">Need worker within (hours)</label>
                <select className="il-select" name="urgentWithinHours" value={form.urgentWithinHours} onChange={handleChange}>
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={6}>6 hours</option>
                </select>
              </div>
            )}
          </div>

          {/* ── Submit ── */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => navigate('/jobs/my')} className="il-btn il-btn-outline" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className={`il-btn ${isUrgent ? 'il-btn-secondary' : 'il-btn-primary'}`}
              style={{ flex: 2, padding: 14, fontSize: 15 }}>
              {loading
                ? <><span className="il-spinner"></span> Posting...</>
                : <><i className={`ti ${isUrgent ? 'ti-bolt' : 'ti-send'}`} style={{ fontSize: 18 }} aria-hidden="true"></i>
                    {isUrgent ? 'Post Urgent Job' : 'Post Job'}</>}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}