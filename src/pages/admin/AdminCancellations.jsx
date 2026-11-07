import { useState, useEffect } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, inputStyle } from './adminTheme';
import { Title, Card, Chip, Btn, Empty, Pager, fmt, errMsg } from './adminUi';

function Content() {
  const [lateOnly, setLateOnly] = useState(true);
  const [page, setPage] = useState(1);
  const [d, setD] = useState({ items: [], pages: 1, total: 0, rule: { limit: 3, windowDays: 30 } });
  const load = () => adminAxios.get(`/api/admin/ops/cancellations?page=${page}${lateOnly ? '&late=1' : ''}`).then(r => setD(r.data)).catch(() => {});
  useEffect(() => { load(); }, [page, lateOnly]);   // eslint-disable-line

  const waive = async (id) => {
    const reason = prompt('Why waive this late cancel? (it will stop counting towards the pause)');
    if (!reason || reason.trim().length < 3) return;
    try { await adminAxios.patch(`/api/admin/ops/cancellations/${id}/waive`, { reason }); load(); }
    catch (e) { alert(errMsg(e)); }
  };

  return (
    <div>
      <Title
        title="Cancellations"
        sub={`A late cancel = cancelled after the worker said "on the way". ${d.rule.limit} late cancels in ${d.rule.windowDays} days pauses that person from applying (workers) or posting (posters) for a few days.`}
      />
      <select value={lateOnly ? '1' : '0'} onChange={e => { setLateOnly(e.target.value === '1'); setPage(1); }} style={{ ...inputStyle, width: 'auto', marginBottom: 16, cursor: 'pointer' }}>
        <option value="1">Late cancels only</option>
        <option value="0">All cancellations</option>
      </select>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {d.items.map(i => (
          <Card key={i._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>
                  {i.cancelledById?.name || 'Unknown'} <span style={{ color: T.textTertiary, fontWeight: 400 }}>· {i.cancelledById?.phone} · {i.cancelledBy}</span>
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: T.textSecondary }}>
                  Job: {i.job?.title || '—'} · worker: {i.worker?.name || '—'} · {fmt(i.cancelledAt)}
                </p>
                {i.cancelReason && <p style={{ margin: '3px 0 0', fontSize: 12, color: T.textSecondary }}>Reason: {i.cancelReason}</p>}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {i.lateCancel ? <Chip color={T.warning} bg={T.warningBg}>Late</Chip> : i.waivedAt ? <Chip>Waived</Chip> : <Chip>Early</Chip>}
                {i.recentLate > 0 && (
                  <Chip color={i.recentLate >= d.rule.limit ? '#F87171' : T.textSecondary} bg={i.recentLate >= d.rule.limit ? T.dangerBg : undefined}>
                    {i.recentLate}/{d.rule.limit} late in {d.rule.windowDays} days
                  </Chip>
                )}
              </div>
            </div>
            {i.lateCancel && (
              <div style={{ marginTop: 10 }}><Btn kind="ghost" onClick={() => waive(i._id)}>Waive (don't count)</Btn></div>
            )}
          </Card>
        ))}
        {d.items.length === 0 && <Empty>No cancellations</Empty>}
      </div>
      <Pager page={page} pages={d.pages} setPage={setPage} />
    </div>
  );
}

export default function AdminCancellations() {
  return <AdminAuthGuard><AdminLayout><Content /></AdminLayout></AdminAuthGuard>;
}