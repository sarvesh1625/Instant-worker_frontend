import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ReportUserModal from '../components/ReportUserModal';
import '../styles/theme.css';

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <i className="ti ti-star-filled" style={{ fontSize: 32, color: s <= value ? '#FACC15' : '#E2E8F0', transition: 'color .1s' }} aria-hidden="true"></i>
        </button>
      ))}
    </div>
  );
}

function Stars({ rating = 0, size = 13 }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1,2,3,4,5].map(s => (
        <i key={s} className="ti ti-star-filled" style={{ fontSize: size, color: s <= Math.round(rating) ? '#FACC15' : '#E2E8F0' }} aria-hidden="true"></i>
      ))}
    </div>
  );
}

const RATING_LABEL = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very good', 5: 'Excellent' };

export default function PublicProfile() {
  const { userId }    = useParams();
  const { user: me }  = useAuth();
  const navigate      = useNavigate();

  const [profile,  setProfile]  = useState(null);
  const [reviews,  setReviews]  = useState([]);
  const [rating,   setRating]   = useState({ average: 0, count: 0 });
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  const [showReportModal, setShowReportModal] = useState(false);
  const [showMenu,        setShowMenu]        = useState(false);
  const [isBlocked,       setIsBlocked]       = useState(false);

  const isOwnProfile = me?._id === userId;

  const load = async () => {
    try {
      const [profRes, revRes] = await Promise.all([
        axios.get(`/api/profile/${userId}`),
        axios.get(`/api/reviews/${userId}`),
      ]);
      setProfile(profRes.data.user);
      setReviews(revRes.data.reviews || []);
      setRating(revRes.data.rating || { average: 0, count: 0 });
    } catch { } finally { setLoading(false); }
  };

  const checkBlockStatus = async () => {
    try {
      const { data } = await axios.get(`/api/blocks/check/${userId}`);
      setIsBlocked(data.blocked);
    } catch { }
  };

  useEffect(() => { load(); if (!isOwnProfile) checkBlockStatus(); }, [userId]);

  const submitReview = async (e) => {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      await axios.post(`/api/reviews/${userId}`, form);
      setSuccess('Review submitted! Shukriya!');
      setShowForm(false);
      setForm({ rating: 5, comment: '' });
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>Loading...</div>
  );
  if (!profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>Profile not found</div>
  );

  const isWorker   = profile.role === 'worker';
  const ratingData = (isWorker ? profile.worker?.rating : profile.poster?.rating) || rating;
  const canReview  = me && !isOwnProfile;
  const alreadyReviewed = reviews.some(r => (r.reviewedBy?._id || r.reviewedBy) === me?._id);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', maxWidth: 640, margin: '0 auto', paddingBottom: 40 }}>

      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(150deg, #059669, #10B981)', padding: '16px 18px 26px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,.18)', border: 'none', borderRadius: 10, width: 38, height: 38, color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-arrow-left" aria-hidden="true"></i>
          </button>

          {!isOwnProfile && me && (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowMenu(m => !m)} style={{
                background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 10,
                width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff', fontSize: 18,
              }}>
                <i className="ti ti-dots-vertical" aria-hidden="true"></i>
              </button>
              {showMenu && (
                <>
                  <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }}></div>
                  <div style={{ position: 'absolute', top: 44, right: 0, zIndex: 100, background: '#fff', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: 180, overflow: 'hidden' }}>
                    <button onClick={() => { setShowMenu(false); setShowReportModal(true); }} style={{
                      width: '100%', padding: '12px 16px', background: 'none', border: 'none',
                      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left',
                    }}>
                      <i className="ti ti-flag" style={{ fontSize: 17, color: 'var(--secondary)' }} aria-hidden="true"></i>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Report or block</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.5)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {profile.profilePhoto
              ? <img src={profile.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={profile.name}/>
              : <i className="ti ti-user" style={{ fontSize: 40, color: 'rgba(255,255,255,0.8)' }} aria-hidden="true"></i>}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <p style={{ margin: 0, fontSize: 21, fontWeight: 800, color: '#fff' }}>{profile.name}</p>
              {profile.idVerification?.status === 'approved' && (
                <i className="ti ti-rosette-discount-check-filled" style={{ fontSize: 19, color: '#fff' }} title="ID Verified" aria-hidden="true"></i>
              )}
            </div>
            <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'rgba(255,255,255,0.85)', textTransform: 'capitalize' }}>
              {isWorker ? 'Worker' : 'User'}{isWorker && profile.worker?.skill ? ` · ${profile.worker.skill}` : ''}
            </p>
            {(profile.city || profile.area) && (
              <p style={{ margin: '5px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <i className="ti ti-map-pin" style={{ fontSize: 13 }} aria-hidden="true"></i>
                {profile.city}{profile.area ? `, ${profile.area}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Stat chips */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>
              {ratingData.average > 0 ? ratingData.average.toFixed(1) : '—'} <span style={{ color: '#FACC15' }}>★</span>
            </p>
            <p style={{ margin: 0, fontSize: 10.5, color: 'rgba(255,255,255,0.75)' }}>{ratingData.count} reviews</p>
          </div>
          {isWorker && profile.worker?.wagePerDay > 0 && (
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>₹{profile.worker.wagePerDay}</p>
              <p style={{ margin: 0, fontSize: 10.5, color: 'rgba(255,255,255,0.75)' }}>per day</p>
            </div>
          )}
          {isWorker && (
            <div style={{ flex: 1, background: profile.worker?.availability ? 'rgba(250,204,21,0.28)' : 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff' }}>
                {profile.worker?.availability ? 'Available' : 'Busy'}
              </p>
              <p style={{ margin: 0, fontSize: 10.5, color: 'rgba(255,255,255,0.75)' }}>status</p>
            </div>
          )}
          {isWorker && (
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>{profile.worker?.totalJobsDone || 0}</p>
              <p style={{ margin: 0, fontSize: 10.5, color: 'rgba(255,255,255,0.75)' }}>jobs done</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {success && (
          <div style={{ background: 'var(--primary-light)', border: '1px solid #A7F3D0', borderRadius: 12, padding: '11px 15px', marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#065F46', fontWeight: 600 }}>
              <i className="ti ti-circle-check" style={{ marginRight: 6, verticalAlign: -2 }} aria-hidden="true"></i>{success}
            </p>
          </div>
        )}

        {profile.bio && (
          <div className="il-card" style={{ padding: 16, marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{profile.bio}</p>
          </div>
        )}

        {/* Details */}
        <div className="il-card" style={{ padding: 16, marginBottom: 12 }}>
          <p style={{ margin: '0 0 12px', fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>Details</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {profile.age && <Row icon="ti-calendar" label="Age" value={`${profile.age} years`} />}
            {profile.gender && <Row icon="ti-user" label="Gender" value={profile.gender} />}
            {profile.languages?.length > 0 && <Row icon="ti-language" label="Languages" value={profile.languages.join(', ')} />}
            {isWorker && profile.worker?.experience > 0 && <Row icon="ti-clock" label="Experience" value={`${profile.worker.experience} years`} />}
            {isWorker && profile.worker?.skills?.length > 0 && <Row icon="ti-hammer" label="Skills" value={profile.worker.skills.join(', ')} />}
            {!profile.age && !profile.gender && !profile.languages?.length && (
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-tertiary)' }}>No additional details added yet</p>
            )}
          </div>
        </div>

        {/* Contact actions */}
        {!isOwnProfile && profile.phone && !isBlocked && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <a href={`tel:${profile.phone}`} className="il-btn" style={{ flex: 1, background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: 13 }}>
              <i className="ti ti-phone" style={{ fontSize: 18 }} aria-hidden="true"></i> Call
            </a>
            <button onClick={() => navigate(`/chat/${userId}`)} className="il-btn" style={{ flex: 1, background: 'var(--info-bg)', color: '#0369A1', padding: 13 }}>
              <i className="ti ti-message-circle" style={{ fontSize: 18 }} aria-hidden="true"></i> Message
            </button>
          </div>
        )}

        {!isOwnProfile && isBlocked && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid #fecaca', borderRadius: 12, padding: '12px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-ban" style={{ fontSize: 18, color: 'var(--danger)' }} aria-hidden="true"></i>
            <p style={{ margin: 0, fontSize: 12.5, color: '#991b1b' }}>You can't contact this user</p>
          </div>
        )}

        {/* Reviews */}
        <div className="il-card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: 'var(--text)' }}>Reviews ({reviews.length})</p>
            {canReview && !alreadyReviewed && !showForm && (
              <button onClick={() => setShowForm(true)} className="il-btn il-btn-primary il-btn-sm">
                <i className="ti ti-star" style={{ fontSize: 14 }} aria-hidden="true"></i>
                Give Review
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={submitReview} style={{ background: 'var(--surface)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Your rating</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <StarPicker value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-dark)' }}>{RATING_LABEL[form.rating]}</span>
              </div>
              <textarea
                value={form.comment}
                onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                rows={3} placeholder="Share your experience... (optional)"
                className="il-textarea"
                maxLength={400}
              />
              {error && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: 'var(--danger)' }}>{error}</p>}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="button" onClick={() => { setShowForm(false); setError(''); }} className="il-btn il-btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={submitting} className="il-btn il-btn-primary" style={{ flex: 2 }}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}

          {reviews.length === 0 && !showForm && (
            <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13, padding: '20px 0' }}>No reviews yet</p>
          )}

          {reviews.map(r => (
            <div key={r._id} style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div className="il-avatar" style={{ width: 34, height: 34, fontSize: 14 }}>
                  {r.reviewedBy?.profilePhoto
                    ? <img src={r.reviewedBy.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt=""/>
                    : r.reviewedBy?.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{r.reviewedBy?.name}</p>
                  <p style={{ margin: 0, fontSize: 10.5, color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{r.reviewerRole || 'user'}</p>
                </div>
                <Stars rating={r.rating} size={13} />
              </div>
              {r.comment && <p style={{ margin: '4px 0', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{r.comment}</p>}
              <p style={{ margin: 0, fontSize: 10.5, color: 'var(--text-tertiary)' }}>
                {new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
              </p>
            </div>
          ))}
        </div>

        {/* Portfolio link (workers) */}
        {isWorker && (
          <button onClick={() => navigate(`/portfolio/${userId}`)} className="il-card" style={{
            width: '100%', padding: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font)',
          }}>
            <i className="ti ti-photo" style={{ fontSize: 18, color: '#CA8A04' }} aria-hidden="true"></i>
            View Past Work / Portfolio
          </button>
        )}
      </div>

      <ReportUserModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetUser={profile}
        onDone={(action) => { if (action === 'blocked') setIsBlocked(true); }}
      />
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <i className={`ti ${icon}`} style={{ fontSize: 16, color: 'var(--text-tertiary)', width: 20, flexShrink: 0 }} aria-hidden="true"></i>
      <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', minWidth: 85 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, textTransform: 'capitalize' }}>{value}</span>
    </div>
  );
}