import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/theme.css';

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)} style={{
          background: 'none', border: 'none', cursor: 'pointer', fontSize: 30, lineHeight: 1,
          color: s <= value ? '#F79009' : '#E4E7EC', transition: 'color .1s', padding: 0,
        }}>★</button>
      ))}
    </div>
  );
}
function StarDisplay({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ fontSize: size, color: s <= Math.round(rating) ? '#F79009' : '#E4E7EC' }}>★</span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { workerId } = useParams();
  const { user }      = useAuth();
  const navigate       = useNavigate();

  const [reviews, setReviews]       = useState([]);
  const [form, setForm]             = useState({ rating: 5, comment: '' });
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [profileName, setProfileName] = useState('');

  const load = async () => {
    try {
      const { data } = await axios.get(`/api/reviews/${workerId}`);
      setReviews(data.reviews);
      // FIX: reviews are shaped { reviewedBy, reviewedUser, ... } — there is
      // no `worker` field on a review. The person being reviewed is not on
      // the review itself; the endpoint also returns `user` (the profile
      // being viewed) separately, which is what should be used for the title.
      if (data.user?.name) setProfileName(data.user.name);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { load(); }, [workerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await axios.post(`/api/reviews/${workerId}`, form);
      setSuccess('Review submitted!');
      setForm({ rating: 5, comment: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally { setLoading(false); }
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
  // FIX: 'worker' is no longer the only non-reviewable role — anyone can
  // review anyone except themselves, direction is handled by the backend.
  const canReview = user && user._id !== workerId;

  return (
    <div className="il-page">
      <div className="il-topbar">
        <div className="il-topbar-inner" style={{ maxWidth: 720 }}>
          <button onClick={() => navigate(-1)} className="il-back-btn"><i className="ti ti-arrow-left" aria-hidden="true"></i></button>
          <h1 className="il-topbar-title" style={{ color: 'var(--text)' }}>
            {profileName ? `Reviews for ${profileName}` : 'Reviews'}
          </h1>
        </div>
      </div>

      <div className="il-shell" style={{ maxWidth: 640 }}>

        {reviews.length > 0 && (
          <div className="il-card il-card-pad" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 28 }}>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <p style={{ margin: 0, fontSize: 40, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{avgRating}</p>
              <div style={{ margin: '6px 0' }}><StarDisplay rating={Number(avgRating)} size={16} /></div>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-tertiary)' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[5,4,3,2,1].map(star => {
                const count = reviews.filter(r => r.rating === star).length;
                const pct   = reviews.length ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span style={{ width: 10 }}>{star}</span>
                    <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 99, height: 6 }}>
                      <div style={{ width: `${pct}%`, background: '#F79009', height: 6, borderRadius: 99 }}></div>
                    </div>
                    <span style={{ width: 16, textAlign: 'right' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {canReview && (
          <div className="il-card il-card-pad" style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 14, fontSize: 14.5 }}>Leave a review</p>
            {error   && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: 12.5, padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>{error}</div>}
            {success && <div style={{ background: 'var(--success-bg)', color: 'var(--success)', fontSize: 12.5, padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="il-field">
                <label className="il-label">Your rating</label>
                <StarPicker value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
              </div>
              <div className="il-field">
                <label className="il-label">Comment (optional)</label>
                <textarea className="il-textarea" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  rows={3} placeholder="How was the work quality?" />
              </div>
              <button type="submit" disabled={loading} className="il-btn il-btn-primary il-btn-block">
                {loading ? 'Submitting...' : 'Submit review'}
              </button>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13.5, padding: '32px 0' }}>No reviews yet</p>}
          {reviews.map(r => (
            <div key={r._id} className="il-card il-card-pad">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="il-avatar" style={{ width: 32, height: 32, fontSize: 12.5, background: 'var(--purple-bg)', color: 'var(--purple)' }}>
                    {r.reviewedBy?.name?.charAt(0).toUpperCase()}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{r.reviewedBy?.name}</p>
                </div>
                <StarDisplay rating={r.rating} />
              </div>
              {r.comment && <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.comment}</p>}
              <p style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--text-tertiary)' }}>
                {new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}