import { useState, useEffect } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, inputStyle } from './adminTheme';
import { Title, Card, Chip, Empty, Pager, fmt } from './adminUi';

const LABELS = {
  payment_confirm: 'Payment confirmed', job_close: 'Job closed', chat_read: 'Chat opened', chat_list: 'Chat list opened',
  deletion_approved: 'Deletion approved', deletion_rejected: 'Deletion rejected', unlock_account: 'Login unlocked', clear_code_locks: 'Code locks cleared', user_view: 'Profile viewed', review_edit: 'Review edited', cancel_waived: 'Late cancel waived',
};

function Content() {
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const [d, setD] = useState({ actions: [], pages: 1, total: 0 });
  useEffect(() => {
    adminAxios.get(`/api/admin/ops/actions?page=${page}${action ? '&action=' + action : ''}`).then(r => setD(r.data)).catch(() => {});
  }, [page, action]);

  return (
    <div>
      <Title title="Admin action log" sub="Everything an admin changed, and every time a private chat was opened. Cannot be edited." />
      <select value={action} onChange={e => { setAction(e.target.value); setPage(1); }} style={{ ...inputStyle, width: 'auto', marginBottom: 16, cursor: 'pointer' }}>
        <option value="">All actions</option>
        {Object.entries(LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {d.actions.map(a => (
          <Card key={a._id} style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: T.text, fontWeight: 600 }}>{a.summary || LABELS[a.action] || a.action}</p>
                {a.reason && <p style={{ margin: '3px 0 0', fontSize: 12, color: T.textSecondary }}>Reason: {a.reason}</p>}
                <p style={{ margin: '3px 0 0', fontSize: 11, color: T.textTertiary }}>{a.admin?.name || 'Admin'} · {fmt(a.createdAt)} · {a.targetType} {a.targetId}</p>
              </div>
              <Chip>{LABELS[a.action] || a.action}</Chip>
            </div>
          </Card>
        ))}
        {d.actions.length === 0 && <Empty>Nothing logged yet</Empty>}
      </div>
      <Pager page={page} pages={d.pages} setPage={setPage} />
    </div>
  );
}

export default function AdminActions() {
  return <AdminAuthGuard><AdminLayout><Content /></AdminLayout></AdminAuthGuard>;
}