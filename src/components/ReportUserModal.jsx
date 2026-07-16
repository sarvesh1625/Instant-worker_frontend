import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Reasons shared by everyone
const SHARED_REASONS = [
  { value: 'no_show',         label: "Didn't show up",        icon: 'ti-user-off' },
  { value: 'unsafe_behavior', label: 'Unsafe / threatening behavior', icon: 'ti-alert-triangle' },
  { value: 'fake_profile',    label: 'Fake or scam profile',  icon: 'ti-user-x' },
  { value: 'wrong_info',      label: 'False job / profile info', icon: 'ti-info-circle' },
  { value: 'spam',            label: 'Spam',                  icon: 'ti-mail-x' },
];

// FIX: merged from the old 4-role system (worker/contractor/customer/vendor)
// into the current two-role system (worker/user). Previously, a logged-in
// 'user' had no matching key here at all, so job posters silently lost
// access to the most relevant reasons for reporting a worker (left midway,
// poor quality, damaged property, asked for extra money).
const ROLE_SPECIFIC_REASONS = {
  worker: [
    { value: 'no_payment',         label: "Didn't pay after work",   icon: 'ti-cash-off' },
    { value: 'underpaid',          label: 'Paid less than agreed',   icon: 'ti-coin-off' },
    { value: 'unsafe_worksite',    label: 'Worksite was unsafe',     icon: 'ti-shield-x' },
    { value: 'job_misrepresented', label: 'Job was different than described', icon: 'ti-file-x' },
  ],
  user: [
    { value: 'left_early',          label: 'Worker left midway',     icon: 'ti-door-exit' },
    { value: 'poor_quality_work',   label: 'Poor quality work',      icon: 'ti-thumb-down' },
    { value: 'damaged_property',    label: 'Damaged tools / property', icon: 'ti-tool' },
    { value: 'asked_extra_money',   label: 'Asked for extra money',  icon: 'ti-cash' },
  ],
};

const ALWAYS_LAST = { value: 'other', label: 'Other', icon: 'ti-dots' };

// Optional quick-message templates per reason
const QUICK_MESSAGES = {
  no_show:              ['They never arrived at the agreed time.', "I waited over an hour and they didn't come."],
  unsafe_behavior:      ['They made me feel unsafe.', 'They used threatening language.'],
  fake_profile:         ['The photo and details look fake.', "This doesn't seem like a real person."],
  wrong_info:           ['The job details did not match reality.', 'Profile information was inaccurate.'],
  spam:                 ['Repeated unwanted messages.', 'Looks like a spam/promotional account.'],
  no_payment:           ['Work was completed but I was never paid.', "It's been days and payment hasn't come."],
  underpaid:            ['Paid less than the agreed daily wage.', 'Final payment was lower than promised.'],
  unsafe_worksite:      ['No safety equipment was provided.', 'The site had serious safety hazards.'],
  job_misrepresented:   ['The actual work was very different from the post.', 'Wage/duration described was inaccurate.'],
  left_early:           ['Worker left without finishing the job.', 'Left after a couple of hours without notice.'],
  poor_quality_work:    ['Work quality was below expectations.', 'Had to redo the work afterwards.'],
  damaged_property:     ['Tools/equipment were damaged during work.', 'Caused damage to the property.'],
  asked_extra_money:    ['Asked for extra cash beyond the agreed wage.', 'Demanded more money mid-job.'],
  other:                [],
};

export default function ReportUserModal({ open, onClose, targetUser, job, onDone }) {
  const { user: me } = useAuth();
  const [step, setStep]       = useState('choose');
  const [reason, setReason]   = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]     = useState('');

  if (!open) return null;

  const myRole = me?.role || 'user';
  const roleReasons = ROLE_SPECIFIC_REASONS[myRole] || [];
  const ALL_REASONS = [...roleReasons, ...SHARED_REASONS, ALWAYS_LAST];

  const reset = () => { setStep('choose'); setReason(''); setDescription(''); setError(''); };
  const handleClose = () => { reset(); onClose(); };

  const handleReasonSelect = (val) => setReason(val);
  const applyQuickMessage = (msg) => setDescription(msg);

  const submitReport = async () => {
    if (!reason) { setError('Please select a reason'); return; }
    setError(''); setSubmitting(true);
    try {
      await axios.post('/api/reports', {
        reportedUserId: targetUser._id,
        jobId: job?._id,
        reason,
        description,
      });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const submitBlock = async () => {
    setSubmitting(true);
    try {
      await axios.post('/api/blocks', { userId: targetUser._id });
      setStep('done');
      onDone && onDone('blocked');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to block user');
    } finally {
      setSubmitting(false);
    }
  };

  const quickMsgs = QUICK_MESSAGES[reason] || [];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      fontFamily: 'var(--font-sans, sans-serif)',
    }} onClick={handleClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 480,
        padding: '20px 20px 28px', maxHeight: '88vh', overflowY: 'auto',
        animation: 'rsm-slide .25s ease-out',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: '#e5e7eb', margin: '0 auto 18px' }}></div>

        {step === 'choose' && (
          <>
            <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: '#111827', textAlign: 'center' }}>
              {targetUser?.name}
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
              What would you like to do?
            </p>
            <button onClick={() => setStep('report')} style={{
              width: '100%', padding: 14, borderRadius: 14, border: '1.5px solid #fed7aa',
              background: '#fff7ed', display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', marginBottom: 10,
            }}>
              <i className="ti ti-flag" style={{ fontSize: 22, color: '#ea580c' }} aria-hidden="true"></i>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#9a3412' }}>Report this user</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#c2410c' }}>Our team will review your report</p>
              </div>
            </button>
            <button onClick={() => setStep('block-confirm')} style={{
              width: '100%', padding: 14, borderRadius: 14, border: '1.5px solid #fecaca',
              background: '#fef2f2', display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', marginBottom: 14,
            }}>
              <i className="ti ti-ban" style={{ fontSize: 22, color: '#dc2626' }} aria-hidden="true"></i>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#991b1b' }}>Block this user</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#b91c1c' }}>They won't be able to contact you</p>
              </div>
            </button>
            <button onClick={handleClose} style={{ width: '100%', padding: 12, background: 'none', border: 'none', fontSize: 13, color: '#9ca3af', cursor: 'pointer' }}>
              Cancel
            </button>
          </>
        )}

        {step === 'report' && (
          <>
            <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: '#111827' }}>Report {targetUser?.name}</h2>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: '#9ca3af' }}>{job?.title ? `Related to: ${job.title}` : 'Select a reason'}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {ALL_REASONS.map(r => (
                <button key={r.value} type="button" onClick={() => handleReasonSelect(r.value)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                  borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                  border: reason === r.value ? '2px solid #dc2626' : '1.5px solid #e5e7eb',
                  background: reason === r.value ? '#fef2f2' : '#fff',
                }}>
                  <i className={`ti ${r.icon}`} style={{ fontSize: 18, color: reason === r.value ? '#dc2626' : '#9ca3af' }} aria-hidden="true"></i>
                  <span style={{ fontSize: 13, fontWeight: 600, color: reason === r.value ? '#991b1b' : '#374151' }}>{r.label}</span>
                  {reason === r.value && <i className="ti ti-circle-check" style={{ fontSize: 16, color: '#dc2626', marginLeft: 'auto' }} aria-hidden="true"></i>}
                </button>
              ))}
            </div>

            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="ti ti-message-2" style={{ fontSize: 14 }} aria-hidden="true"></i>
                Add a message (optional)
              </p>

              {quickMsgs.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {quickMsgs.map(msg => (
                    <button key={msg} type="button" onClick={() => applyQuickMessage(msg)} style={{
                      fontSize: 11, padding: '6px 10px', borderRadius: 20,
                      border: description === msg ? '1.5px solid #dc2626' : '1px solid #e5e7eb',
                      background: description === msg ? '#fef2f2' : '#fff',
                      color: description === msg ? '#991b1b' : '#6b7280',
                      cursor: 'pointer', textAlign: 'left',
                    }}>
                      {msg}
                    </button>
                  ))}
                </div>
              )}

              <textarea
                value={description} onChange={e => setDescription(e.target.value)}
                rows={3} placeholder="Describe what happened, or tap a suggestion above..."
                style={{
                  width: '100%', fontSize: 13, padding: '11px 13px', borderRadius: 10,
                  border: '1.5px solid #e5e7eb', outline: 'none', resize: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff',
                }}
              />
            </div>

            {error && <p style={{ margin: '0 0 12px', fontSize: 12, color: '#dc2626', textAlign: 'center' }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('choose')} style={{ flex: 1, padding: 13, borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 14, fontWeight: 600, color: '#6b7280', cursor: 'pointer' }}>
                Back
              </button>
              <button onClick={submitReport} disabled={submitting || !reason} style={{
                flex: 2, padding: 13, borderRadius: 12, border: 'none',
                background: !reason ? '#d1d5db' : '#dc2626', color: '#fff',
                fontSize: 14, fontWeight: 700, cursor: !reason || submitting ? 'not-allowed' : 'pointer',
              }}>
                {submitting ? 'Submitting...' : 'Submit report'}
              </button>
            </div>
          </>
        )}

        {step === 'block-confirm' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <i className="ti ti-ban" style={{ fontSize: 40, color: '#dc2626' }} aria-hidden="true"></i>
              <h2 style={{ margin: '10px 0 4px', fontSize: 17, fontWeight: 700, color: '#111827' }}>Block {targetUser?.name}?</h2>
              <p style={{ margin: 0, fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                You won't see their jobs or messages, and they won't be able to contact you. You can unblock them anytime from settings.
              </p>
            </div>
            {error && <p style={{ margin: '0 0 12px', fontSize: 12, color: '#dc2626', textAlign: 'center' }}>{error}</p>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('choose')} style={{ flex: 1, padding: 13, borderRadius: 12, border: '1.5px solid #e5e7eb', background: '#fff', fontSize: 14, fontWeight: 600, color: '#6b7280', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={submitBlock} disabled={submitting} style={{
                flex: 2, padding: 13, borderRadius: 12, border: 'none', background: '#dc2626', color: '#fff',
                fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
              }}>
                {submitting ? 'Blocking...' : 'Yes, block user'}
              </button>
            </div>
          </>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <i className="ti ti-circle-check" style={{ fontSize: 48, color: '#16a34a' }} aria-hidden="true"></i>
            <h2 style={{ margin: '14px 0 4px', fontSize: 17, fontWeight: 700, color: '#111827' }}>Done</h2>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#6b7280' }}>
              {reason ? 'Thanks for the report — our team will look into it.' : 'User has been blocked.'}
            </p>
            <button onClick={handleClose} style={{
              width: '100%', padding: 13, borderRadius: 12, border: 'none',
              background: '#10B981', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>
              Close
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes rsm-slide { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}