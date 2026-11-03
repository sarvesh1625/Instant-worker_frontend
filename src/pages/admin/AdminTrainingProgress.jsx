import { useState, useEffect } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T } from './adminTheme';
import { Title, Card, Chip, Empty, fmtDate } from './adminUi';

function Content() {
  const [vids, setVids] = useState(null);
  const [open, setOpen] = useState('');
  useEffect(() => { adminAxios.get('/api/admin/ops/training').then(r => setVids(r.data.videos)).catch(() => setVids([])); }, []);
  if (!vids) return <p style={{ color: T.textTertiary }}>Loading...</p>;

  return (
    <div>
      <Title title="Training progress" sub="Who has watched each active video, and who has not." />
      {vids.length === 0 && <Empty>No active training videos</Empty>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {vids.map(v => (
          <Card key={v.id}>
            <button onClick={() => setOpen(open === v.id ? '' : v.id)} style={{ all: 'unset', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', gap: 10 }}>
              <span style={{ color: T.text, fontWeight: 700, fontSize: 14 }}>{v.title} <Chip>{v.audience}</Chip></span>
              <span style={{ color: T.textSecondary, fontSize: 13 }}>{v.done} / {v.total} done · {v.total - v.done} not yet</span>
            </button>
            {open === v.id && (
              <div style={{ marginTop: 12 }}>
                {v.pending.length === 0 && <p style={{ fontSize: 12.5, color: T.textTertiary }}>Everyone has watched it.</p>}
                {v.pending.map(p => (
                  <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0', color: T.textSecondary }}>
                    <span>{p.name} · {p.phone}</span><span>{p.city || '—'} · joined {fmtDate(p.createdAt)}</span>
                  </div>
                ))}
                {v.total - v.done > 100 && <p style={{ fontSize: 11, color: T.textTertiary }}>Showing the newest 100.</p>}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminTrainingProgress() {
  return <AdminAuthGuard><AdminLayout><Content /></AdminLayout></AdminAuthGuard>;
}