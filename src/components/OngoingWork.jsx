import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PaymentCodeModal from './PaymentCodeModal';
import '../styles/theme.css';

// "Ongoing work" card for the dashboard — poster and worker.
export default function OngoingWork() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isWorker = user?.role === 'worker';
  const [items, setItems] = useState([]);
  const [blocked, setBlocked] = useState(false);
  const [pending, setPending] = useState(0);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/jobs/my/ongoing');
      setItems(data.items || []);
      setBlocked(!!data.postingBlocked);
      setPending(data.pendingPayments || 0);
    } catch (e) { /* dashboard still works without this card */ }
  }, []);

  useEffect(() => { load(); const iv = setInterval(load, 20000); return () => clearInterval(iv); }, [load]);

  if (items.length === 0 && !blocked) return null;

  const stage = (it) => {
    if (it.paymentStatus === 'pending') return isWorker
      ? { label: 'Waiting for payment code', bg: '#FEFCE8', color: '#A16207' }
      : { label: 'Payment code needed',      bg: '#FEFCE8', color: '#A16207' };
    if (it.workStatus === 'in_progress') return { label: 'In progress', bg: '#FFF7ED', color: '#EA580C' };
    return { label: 'Not started yet', bg: '#F8FAFC', color: '#475569' };
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ margin: '0 0 12px', fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>Ongoing work</p>

      {blocked && (
        <div style={{ background: 'var(--danger-bg, #FEF2F2)', color: 'var(--danger, #EF4444)', borderRadius: 12, padding: '10px 14px', fontSize: 12.5, fontWeight: 800, marginBottom: 10 }}>
          ⛔ Posting paused — {pending} payment(s) waiting for a code
        </div>
      )}

      {items.map(it => {
        const st = stage(it);
        const needsCode = it.paymentStatus === 'pending';
        return (
          <div key={`${it.jobId}-${it.other?._id}`} className="il-card" onClick={() => navigate(isWorker ? '/my-work' : '/jobs/my')}
            style={{ padding: '14px 16px', marginBottom: 10, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--text)' }}>{it.title}</span>
              <span style={{ background: st.bg, color: st.color, fontSize: 10.5, fontWeight: 800, padding: '3px 10px', borderRadius: 999 }}>{st.label}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              {it.skill} · ₹{it.wage} · {it.location?.city} · {isWorker ? 'Poster' : 'Worker'}: {it.other?.name}
            </div>
            {needsCode && (
              <button className="il-btn il-btn-primary il-btn-block" style={{ marginTop: 10, padding: 10 }}
                onClick={(e) => { e.stopPropagation(); setModal({ mode: isWorker ? 'show' : 'enter', it }); }}>
                {isWorker ? 'Show my payment code' : 'Enter payment code'}
              </button>
            )}
          </div>
        );
      })}

      <PaymentCodeModal
        open={!!modal} mode={modal?.mode} jobId={modal?.it?.jobId} workerId={modal?.it?.other?._id}
        otherName={modal?.it?.other?.name} wage={modal?.it?.wage}
        onClose={() => { setModal(null); load(); }} onDone={load}
      />
    </div>
  );
}