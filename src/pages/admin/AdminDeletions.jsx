import { useState, useEffect } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, inputStyle } from './adminTheme';
import { Title, Card, Chip, Btn, Empty, fmt, fmtDate, errMsg } from './adminUi';

function Content() {
  const [status, setStatus] = useState('pending');
  const [list, setList] = useState([]);
  const [note, setNote] = useState({});
  const load = () => adminAxios.get(`/api/admin/ops/deletions?status=${status}`).then(r => setList(r.data.requests)).catch(() => {});
  useEffect(() => { load(); }, [status]);   // eslint-disable-line

  const review = async (id, st) => {
    if (!confirm(st === 'approved' ? 'Mark as approved? The account is NOT deleted automatically — delete it from the Users page after checking.' : 'Reject this request?')) return;
    try { await adminAxios.patch(`/api/admin/ops/deletions/${id}`, { status: st, note: note[id] || '' }); load(); }
    catch (e) { alert(errMsg(e)); }
  };

  return (
    <div>
      <Title title="Deletion requests" sub="People who asked to delete their account. Check they have no unfinished work first." />
      <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inputStyle, width: 'auto', marginBottom: 16, cursor: 'pointer' }}>
        {['pending', 'approved', 'rejected', 'all'].map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map(d => (
          <Card key={d._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{d.user?.name || 'Deleted user'} <span style={{ color: T.textTertiary, fontWeight: 400 }}>· {d.user?.phone} · {d.user?.role}</span></p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: T.textSecondary }}>Requested {fmt(d.requestedAt)} · joined {fmtDate(d.user?.createdAt)}</p>
                {d.reason && <p style={{ margin: '3px 0 0', fontSize: 12, color: T.textSecondary }}>Reason: {d.reason}</p>}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <Chip>{d.status}</Chip>
                {d.openJobs > 0 && <Chip color={T.warning} bg={T.warningBg}>{d.openJobs} unfinished job(s)</Chip>}
              </div>
            </div>
            {d.status === 'pending' ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <input placeholder="Note (optional)" value={note[d._id] || ''} onChange={e => setNote({ ...note, [d._id]: e.target.value })} style={{ ...inputStyle, flex: 1, minWidth: 160 }} />
                <Btn onClick={() => review(d._id, 'approved')}>Approve</Btn>
                <Btn kind="danger" onClick={() => review(d._id, 'rejected')}>Reject</Btn>
              </div>
            ) : d.adminNote ? <p style={{ margin: '8px 0 0', fontSize: 12, color: T.textTertiary }}>Note: {d.adminNote}</p> : null}
          </Card>
        ))}
        {list.length === 0 && <Empty>No requests</Empty>}
      </div>
    </div>
  );
}

export default function AdminDeletions() {
  return <AdminAuthGuard><AdminLayout><Content /></AdminLayout></AdminAuthGuard>;
}