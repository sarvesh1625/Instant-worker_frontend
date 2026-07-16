import { useState } from 'react';
import axios from 'axios';

function Star({ filled, onClick, onHover, size = 32 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
      <i
        className="ti ti-star-filled"
        style={{ fontSize: size, color: filled ? '#fbbf24' : '#e5e7eb', transition: 'color .12s' }}
        aria-hidden="true"
      ></i>
    </button>
  );
}

/**
 * RateWorkModal — full-screen overlay for rating someone after a job is done.
 */
export default function RateWorkModal({ open, onClose, onSubmitted, targetUser, job }) {
  const [rating, setRating]   = useState(0);
  const [hover,  setHover]    = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState('');

  if (!open) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a star rating');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const { data } = await axios.post(`/api/reviews/${targetUser._id}`, {
        rating,
        comment,
        jobId: job?._id,
      });
      onSubmitted && onSubmitted(data.review);
      setRating(0);
      setComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // FIX: two-role system only — 'worker' or 'user' (job poster). The old
  // map (worker/contractor/vendor/customer) meant the label silently went
  // blank whenever a worker rated a job poster, since 'user' was never a key.
  const roleLabel = {
    worker: 'Worker',
    user:   'Job poster',
  }[targetUser?.role] || '';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      fontFamily: 'var(--font-sans, sans-serif)',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '24px 24px 0 0',
          width: '100%', maxWidth: 480, padding: '24px 20px 28px',
          animation: 'rate-slide-up .25s ease-out',
        }}>

        <div style={{ width: 40, height: 4, borderRadius: 2, background: '#e5e7eb', margin: '0 auto 18px' }}></div>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: '#ECFDF5', margin: '0 auto 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, color: '#059669', overflow: 'hidden',
          }}>
            {targetUser?.profilePhoto ? (
              <img src={targetUser.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            ) : targetUser?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 700, color: '#111827' }}>
            Rate {targetUser?.name}
          </h2>
          <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
            {roleLabel}{job?.title ? ` · ${job.title}` : ''}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <Star
              key={n}
              filled={n <= (hover || rating)}
              onClick={() => setRating(n)}
              onHover={() => setHover(n)}
            />
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginBottom: 20, minHeight: 16 }}>
          {rating === 0 && 'Tap a star to rate'}
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very good'}
          {rating === 5 && 'Excellent'}
        </p>

        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience (optional)..."
          style={{
            width: '100%', fontSize: 14, padding: '12px 14px',
            borderRadius: 12, border: '1.5px solid #e5e7eb',
            outline: 'none', resize: 'none', boxSizing: 'border-box',
            fontFamily: 'inherit', lineHeight: 1.5, marginBottom: 12,
          }}
        />

        {error && (
          <p style={{ margin: '0 0 12px', fontSize: 12, color: '#dc2626', textAlign: 'center' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '13px', borderRadius: 12,
              border: '1.5px solid #e5e7eb', background: '#fff',
              fontSize: 14, fontWeight: 600, color: '#6b7280', cursor: 'pointer',
            }}>
            Skip for now
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            style={{
              flex: 2, padding: '13px', borderRadius: 12, border: 'none',
              background: rating === 0 ? '#d1d5db' : '#10B981',
              color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: rating === 0 || submitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
            {submitting ? 'Submitting...' : (
              <>
                <i className="ti ti-star" style={{ fontSize: 16 }} aria-hidden="true"></i>
                Submit Rating
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes rate-slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}