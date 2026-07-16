import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/AppShell';
import CameraCapture from '../components/CameraCapture';
import '../styles/theme.css';

const SKILLS = ['Labour','Painter','Carpenter','Electrician','Mechanic','Farmer','Driver','Plumber','Welder','Other'];
const CITIES = ['Hyderabad','Visakhapatnam','Vijayawada','Warangal','Tirupati','Bengaluru','Chennai','Mumbai','Delhi','Pune'];

export default function MyProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isWorker = user?.role === 'worker';

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '', age: '', gender: '', city: '', area: '', state: '', bio: '', languages: '',
    skill: '', experience: '', wagePerDay: '',
  });
  const [photo, setPhoto] = useState('');

  // Account deletion
  const [delRequest, setDelRequest] = useState(null);
  const [showDelModal, setShowDelModal] = useState(false);
  const [delReason, setDelReason] = useState('');
  const [delConfirm, setDelConfirm] = useState('');
  const [delSubmitting, setDelSubmitting] = useState(false);

  const load = async () => {
    try {
      const { data } = await axios.get('/api/profile/me');
      const u = data.user;
      setProfile(u);
      setPhoto(u.profilePhoto || '');
      setForm({
        name: u.name || '', age: u.age || '', gender: u.gender || '',
        city: u.city || '', area: u.area || '', state: u.state || '',
        bio: u.bio || '', languages: (u.languages || []).join(', '),
        skill: u.worker?.skill || '',
        experience: u.worker?.experience || '',
        wagePerDay: u.worker?.wagePerDay || '',
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadDelRequest = async () => {
    try {
      const { data } = await axios.get('/api/account/delete-request');
      setDelRequest(data.request);
    } catch { setDelRequest(null); }
  };

  useEffect(() => { load(); loadDelRequest(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSaving(true);
    try {
      await axios.put('/api/profile/me', form);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDeleteRequest = async () => {
    if (delConfirm.trim().toUpperCase() !== 'DELETE') {
      setError('Type DELETE to confirm'); return;
    }
    setDelSubmitting(true); setError('');
    try {
      const { data } = await axios.post('/api/account/delete-request', { reason: delReason });
      setDelRequest(data.request);
      setShowDelModal(false);
      setDelReason(''); setDelConfirm('');
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit request');
    } finally { setDelSubmitting(false); }
  };

  const handleCancelDeletion = async () => {
    if (!confirm('Cancel your account deletion request?')) return;
    try {
      await axios.delete('/api/account/delete-request');
      setDelRequest(null);
      setSuccess('Deletion request cancelled. Your account stays active.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel');
    }
  };

  const verifStatus = profile?.idVerification?.status;
  const rating = isWorker ? profile?.worker?.rating : profile?.poster?.rating;

  const Field = ({ label, value }) => (
    <div>
      <p style={{ margin: 0, fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</p>
      <p style={{ margin: '4px 0 0', fontSize: 14.5, color: 'var(--text)', fontWeight: 600 }}>{value || '—'}</p>
    </div>
  );

  if (loading) return (
    <AppShell>
      <p className="il-muted" style={{ textAlign: 'center', padding: '60px 0', fontSize: 14 }}>Loading profile...</p>
    </AppShell>
  );

  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '22px 18px 30px' }}>

        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>My Profile</h1>
        <p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'var(--text-secondary)' }}>Meri profile</p>

        {success && (
          <div style={{ background: 'var(--primary-light)', border: '1px solid #A7F3D0', borderRadius: 12, padding: '11px 15px', marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#065F46', fontWeight: 600 }}>
              <i className="ti ti-circle-check" style={{ marginRight: 6, verticalAlign: -2 }} aria-hidden="true"></i>{success}
            </p>
          </div>
        )}
        {error && !showDelModal && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid #fecaca', borderRadius: 12, padding: '11px 15px', marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>{error}</p>
          </div>
        )}

        {/* ── Rating banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #CA8A04, #FACC15)',
          borderRadius: 18, padding: '20px 24px', marginBottom: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
          boxShadow: '0 8px 22px rgba(202,138,4,.25)',
        }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,.9)', fontWeight: 600 }}>Your Rating</p>
            <p style={{ margin: '4px 0 0', fontSize: 36, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1 }}>
              {rating?.average?.toFixed(1) || '0.0'}
              <i className="ti ti-star-filled" style={{ fontSize: 28 }} aria-hidden="true"></i>
            </p>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'rgba(255,255,255,.85)' }}>
              Based on {rating?.count || 0} review{rating?.count !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', gap: 3, justifyContent: 'flex-end', marginBottom: 6 }}>
              {[1,2,3,4,5].map(s => (
                <i key={s} className={`ti ${s <= Math.round(rating?.average || 0) ? 'ti-star-filled' : 'ti-star'}`}
                   style={{ fontSize: 19, color: '#fff', opacity: s <= Math.round(rating?.average || 0) ? 1 : .45 }} aria-hidden="true"></i>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,.85)' }}>
              {isWorker ? `${profile?.worker?.totalJobsDone || 0} jobs completed` : `${profile?.poster?.totalJobsPosted || 0} jobs posted`}
            </p>
          </div>
        </div>

        {/* ── Profile card ── */}
        <div className="il-card il-card-pad" style={{ marginBottom: 18 }}>

          {/* Photo + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              {editing ? (
                <CameraCapture currentPhoto={photo} onUpload={(url) => setPhoto(url)} userId={user?._id} />
              ) : (
                <div className="il-avatar" style={{ width: 76, height: 76, fontSize: 30 }}>
                  {photo
                    ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    : profile?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{profile?.name}</p>
              <p style={{ margin: '3px 0 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>{profile?.phone}</p>
              <div style={{ display: 'flex', gap: 7, marginTop: 8, flexWrap: 'wrap' }}>
                <span className="il-badge" style={{
                  background: isWorker ? 'var(--primary-light)' : 'var(--secondary-light)',
                  color: isWorker ? 'var(--primary-dark)' : 'var(--secondary-dark)',
                }}>
                  <i className={`ti ${isWorker ? 'ti-hammer' : 'ti-user-search'}`} style={{ fontSize: 13 }} aria-hidden="true"></i>
                  {isWorker ? 'Worker' : 'User'}
                </span>
                {verifStatus === 'approved' && (
                  <span className="il-badge" style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
                    <i className="ti ti-shield-check" style={{ fontSize: 13 }} aria-hidden="true"></i>Verified
                  </span>
                )}
                {verifStatus === 'pending' && (
                  <span className="il-badge" style={{ background: 'var(--secondary-light)', color: 'var(--secondary-dark)' }}>
                    <i className="ti ti-clock" style={{ fontSize: 13 }} aria-hidden="true"></i>Verification pending
                  </span>
                )}
                {(!verifStatus || verifStatus === 'not_submitted') && (
                  <button onClick={() => navigate('/verification')} className="il-badge" style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px dashed var(--border-strong)', cursor: 'pointer' }}>
                    <i className="ti ti-shield-plus" style={{ fontSize: 13 }} aria-hidden="true"></i>Get verified
                  </button>
                )}
              </div>
            </div>
            {!editing && (
              <button onClick={() => setEditing(true)} className="il-btn il-btn-outline" style={{ flexShrink: 0 }}>
                <i className="ti ti-pencil" style={{ fontSize: 16 }} aria-hidden="true"></i>
                Edit Profile
              </button>
            )}
          </div>

          <hr className="il-divider" />

          {/* ── View mode ── */}
          {!editing && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="profile-fields">
              <Field label="Full name" value={profile?.name} />
              <Field label="Phone number" value={profile?.phone} />
              <Field label="Age" value={profile?.age} />
              <Field label="Gender" value={profile?.gender} />
              <Field label="City" value={profile?.city} />
              <Field label="Area" value={profile?.area} />
              <Field label="Languages" value={(profile?.languages || []).join(', ')} />
              {isWorker && <Field label="Skill" value={profile?.worker?.skill} />}
              {isWorker && <Field label="Experience" value={profile?.worker?.experience ? `${profile.worker.experience} years` : '—'} />}
              {isWorker && <Field label="Daily wage" value={profile?.worker?.wagePerDay ? `₹${profile.worker.wagePerDay}/day` : '—'} />}
              {profile?.bio && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="About" value={profile.bio} />
                </div>
              )}
            </div>
          )}

          {/* ── Edit mode ── */}
          {editing && (
            <form onSubmit={handleSave}>
              <div className="il-grid-2">
                <div className="il-field">
                  <label className="il-label">Full name</label>
                  <input className="il-input" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="il-field">
                  <label className="il-label">Age</label>
                  <input className="il-input" name="age" type="number" min="18" max="70" value={form.age} onChange={handleChange} />
                </div>
              </div>

              <div className="il-grid-2">
                <div className="il-field">
                  <label className="il-label">Gender</label>
                  <select className="il-select" name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="il-field">
                  <label className="il-label">City</label>
                  <select className="il-select" name="city" value={form.city} onChange={handleChange}>
                    <option value="">Select</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="il-grid-2">
                <div className="il-field">
                  <label className="il-label">Area</label>
                  <input className="il-input" name="area" value={form.area} onChange={handleChange} placeholder="e.g. Kukatpally" />
                </div>
                <div className="il-field">
                  <label className="il-label">Languages</label>
                  <input className="il-input" name="languages" value={form.languages} onChange={handleChange} placeholder="Telugu, Hindi, English" />
                </div>
              </div>

              {isWorker && (
                <>
                  <hr className="il-divider" />
                  <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>Work details</p>
                  <div className="il-field">
                    <label className="il-label">Skill <span className="il-required">*</span></label>
                    <select className="il-select" name="skill" value={form.skill} onChange={handleChange} required>
                      <option value="">Select</option>
                      {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="il-grid-2">
                    <div className="il-field">
                      <label className="il-label">Experience (years)</label>
                      <input className="il-input" name="experience" type="number" min="0" value={form.experience} onChange={handleChange} />
                    </div>
                    <div className="il-field">
                      <label className="il-label">Daily wage (₹) <span className="il-required">*</span></label>
                      <input className="il-input" name="wagePerDay" type="number" min="0" value={form.wagePerDay} onChange={handleChange} required />
                    </div>
                  </div>
                </>
              )}

              <div className="il-field">
                <label className="il-label">About yourself</label>
                <textarea className="il-textarea" name="bio" value={form.bio} onChange={handleChange} rows={3} maxLength={300} placeholder="Tell people about your work experience..." />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => { setEditing(false); setError(''); load(); }} className="il-btn il-btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="il-btn il-btn-primary" style={{ flex: 2 }}>
                  {saving ? <><span className="il-spinner"></span> Saving...</> : <><i className="ti ti-check" style={{ fontSize: 17 }} aria-hidden="true"></i> Save changes</>}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Danger zone — account deletion ── */}
        <div className="il-card" style={{ border: '1.5px solid #FECACA', background: '#FFFBFB', padding: 20 }}>
          <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: 18 }} aria-hidden="true"></i>
            Danger zone
          </p>

          {delRequest?.status === 'pending' ? (
            <>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Your account deletion request is <strong>under review</strong>. Submitted on{' '}
                {new Date(delRequest.requestedAt).toLocaleDateString('en-IN')}. Our team will process it within 7 days.
                You can cancel this request any time before then.
              </p>
              <button onClick={handleCancelDeletion} className="il-btn il-btn-outline">
                <i className="ti ti-arrow-back-up" style={{ fontSize: 16 }} aria-hidden="true"></i>
                Cancel deletion request
              </button>
            </>
          ) : (
            <>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Requesting account deletion will remove your profile, job history, portfolio, and personal data
                within 30 days of approval. This cannot be undone. You must have no active jobs.
              </p>
              <button onClick={() => { setShowDelModal(true); setError(''); }} className="il-btn il-btn-danger-ghost">
                <i className="ti ti-trash" style={{ fontSize: 16 }} aria-hidden="true"></i>
                Request account deletion
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Deletion modal ── */}
      {showDelModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(17,24,39,.55)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18,
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setShowDelModal(false); }}>
          <div className="il-card il-card-pad" style={{ maxWidth: 440, width: '100%', background: '#fff' }}>
            <div style={{ width: 54, height: 54, borderRadius: 15, background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="ti ti-alert-triangle" style={{ fontSize: 27, color: 'var(--danger)' }} aria-hidden="true"></i>
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 800, color: 'var(--text)', textAlign: 'center' }}>
              Delete your account?
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.65 }}>
              This will be reviewed by our team. Once approved, your profile, ratings, portfolio and history
              are permanently deleted within 30 days.
            </p>

            {error && (
              <div style={{ background: 'var(--danger-bg)', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 12.5, color: 'var(--danger)' }}>{error}</p>
              </div>
            )}

            <div className="il-field">
              <label className="il-label">Why are you leaving? (optional)</label>
              <textarea className="il-textarea" rows={2} maxLength={500} value={delReason}
                onChange={e => setDelReason(e.target.value)} placeholder="Your feedback helps us improve..." />
            </div>

            <div className="il-field">
              <label className="il-label">Type <strong style={{ color: 'var(--danger)' }}>DELETE</strong> to confirm</label>
              <input className="il-input" value={delConfirm} onChange={e => setDelConfirm(e.target.value)} placeholder="DELETE" />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setShowDelModal(false); setError(''); setDelConfirm(''); }} className="il-btn il-btn-outline" style={{ flex: 1 }}>
                Keep my account
              </button>
              <button
                onClick={handleDeleteRequest}
                disabled={delSubmitting || delConfirm.trim().toUpperCase() !== 'DELETE'}
                className="il-btn"
                style={{
                  flex: 1,
                  background: delConfirm.trim().toUpperCase() === 'DELETE' ? 'var(--danger)' : 'var(--border-strong)',
                  color: '#fff',
                  cursor: delConfirm.trim().toUpperCase() === 'DELETE' ? 'pointer' : 'not-allowed',
                }}>
                {delSubmitting ? 'Submitting...' : 'Request deletion'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .profile-fields { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AppShell>
  );
}