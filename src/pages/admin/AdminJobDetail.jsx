import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, STATUS_COLOR, inputStyle } from './adminTheme';
import { Title, Card, Chip, Btn, Empty, fmt, errMsg } from './adminUi';

function Content() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => adminAxios.get(`/api/admin/ops/jobs/${id}`).then(r => setD(r.data)).catch(e => setErr(errMsg(e)));
  useEffect(() => { load(); }, [id]);   // eslint-disable-line

  const need = () => { if (reason.trim().length < 5) { alert('Write a reason first (at least 5 characters). It is saved in the action log.'); return false; } return true; };
  const act = async (fn, okText) => {
    if (!need() || busy) return;
    setBusy(true);
    try { await fn(); setReason(''); await load(); alert(okText); }
    catch (e) { alert(errMsg(e)); } finally { setBusy(false); }
  };
  const confirmPay = (wid) => confirm('Confirm that this worker was paid? The poster will be able to post again and contact closes.') &&
    act(() => adminAxios.post(`/api/admin/ops/payments/${id}/${wid}/confirm`, { reason }), 'Payment confirmed');
  const closeJob = () => confirm('Close this job? Nobody can apply after this.') &&
    act(() => adminAxios.post(`/api/admin/ops/jobs/${id}/close`, { reason }), 'Job closed');

  if (err) return <p style={{ color: '#F87171' }}>{err}</p>;
  if (!d) return <p style={{ color: T.textTertiary }}>Loading...</p>;
  const j = d.job;
  const sc = STATUS_COLOR[j.status] || { color: T.textTertiary, bg: 'rgba(148,163,184,.14)' };

  return (
    <div>
      <button onClick={() => navigate('/admin/jobs')} style={{ background: 'none', border: 'none', color: T.textSecondary, cursor: 'pointer', marginBottom: 10, fontFamily: T.font }}>← Jobs</button>
      <Title title={j.title} sub={`${j.skill} · ${j.location?.area ? j.location.area + ', ' : ''}${j.location?.city} · ₹${j.wage}/day · ${j.workersNeeded} needed`} />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <Chip color={sc.color} bg={sc.bg}>{j.status}</Chip>
        {j.jobType === 'urgent' && <Chip color="#F87171" bg={T.dangerBg}>URGENT</Chip>}
        <Chip>Posted {fmt(j.createdAt)}</Chip>
        <Chip>Poster: {j.postedBy?.name} · {j.postedBy?.phone}</Chip>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: T.text }}>Admin action</p>
        <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (required, saved in the action log)" style={{ ...inputStyle, marginBottom: 10 }} />
        {j.status !== 'closed' && <Btn kind="danger" disabled={busy} onClick={closeJob}>Close this job</Btn>}
      </Card>

      <h3 style={{ color: T.text, fontSize: 14, margin: '0 0 8px' }}>Applicants ({j.applicants?.length || 0})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {(j.applicants || []).map(a => (
          <Card key={a._id} style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{a.worker?.name || 'Deleted user'} <span style={{ color: T.textTertiary, fontWeight: 400 }}>· {a.worker?.phone}</span></p>
                <p style={{ margin: '3px 0 0', fontSize: 11.5, color: T.textTertiary }}>
                  Applied {fmt(a.appliedAt)}{a.workStartedAt ? ` · Started ${fmt(a.workStartedAt)}` : ''}{a.workCompletedAt ? ` · Completed ${fmt(a.workCompletedAt)}` : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip>{a.status}</Chip>
                <Chip>{(a.workStatus || 'not_started').replace('_', ' ')}</Chip>
                {a.paymentStatus === 'pending' && <Chip color={T.warning} bg={T.warningBg}>payment pending</Chip>}
                {a.paymentStatus === 'confirmed' && <Chip color={T.success} bg={T.successBg}>paid{a.paymentResolvedByAdmin ? ' (admin)' : ''}</Chip>}
                {a.paymentStatus === 'pending' && a.worker && <Btn disabled={busy} onClick={() => confirmPay(a.worker._id)}>Confirm payment</Btn>}
              </div>
            </div>
          </Card>
        ))}
        {!(j.applicants || []).length && <Empty>No applicants yet</Empty>}
      </div>

      {d.reports?.length > 0 && (
        <>
          <h3 style={{ color: T.text, fontSize: 14, margin: '0 0 8px' }}>Reports on this job</h3>
          {d.reports.map(r => (
            <Card key={r._id} style={{ padding: 12, marginBottom: 8 }}>
              <p style={{ margin: 0, fontSize: 12.5, color: T.textSecondary }}>{r.reportedBy?.name} reported {r.reportedUser?.name}: {String(r.reason).replace(/_/g, ' ')} — {r.status}</p>
            </Card>
          ))}
        </>
      )}

      <h3 style={{ color: T.text, fontSize: 14, margin: '16px 0 8px' }}>Timeline</h3>
      <Card>
        {d.timeline.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: i < d.timeline.length - 1 ? `1px solid ${T.border}` : 'none' }}>
            <span style={{ fontSize: 11.5, color: T.textTertiary, minWidth: 100 }}>{fmt(t.at)}</span>
            <span style={{ fontSize: 12.5, color: T.textSecondary }}>{t.text}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default function AdminJobDetail() {
  return <AdminAuthGuard><AdminLayout><Content /></AdminLayout></AdminAuthGuard>;
}