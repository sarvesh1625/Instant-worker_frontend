import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, inputStyle } from './adminTheme';
import { Title, Card, Chip, Btn, Empty, Pager, fmt, errMsg } from './adminUi';

const Stars = ({ n }) => <span style={{ color: '#FBBF24', letterSpacing: 1 }}>{'★'.repeat(n)}<span style={{ color: T.border }}>{'★'.repeat(5 - n)}</span></span>;

function Content() {
  const [sp] = useSearchParams();
  const [s, setS] = useState('');
  const [rating, setRating] = useState('');
  const [page, setPage] = useState(1);
  const [d, setD] = useState({ reviews: [], pages: 1, total: 0 });
  const [edit, setEdit] = useState(null);   // { id, rating, comment, reason }
  const [busy, setBusy] = useState(false);
  const userId = sp.get('userId') || '';

  const load = () => {
    const q = new URLSearchParams({ page });
    if (s.trim()) q.set('s', s.trim());
    if (rating) q.set('rating', rating);
    if (userId) q.set('userId', userId);
    adminAxios.get(`/api/admin/ops/reviews?${q}`).then(r => setD(r.data)).catch(() => {});
  };
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [page, s, rating, userId]);   // eslint-disable-line

  const save = async () => {
    if (!edit.reason || edit.reason.trim().length < 3) { alert('Please write a reason'); return; }
    setBusy(true);
    try {
      await adminAxios.patch(`/api/admin/ops/reviews/${edit.id}`, { rating: edit.rating, comment: edit.comment, reason: edit.reason });
      setEdit(null); load();
    } catch (e) { alert(errMsg(e)); } finally { setBusy(false); }
  };

  return (
    <div>
      <Title title="Ratings & reviews" sub="Search anyone by name or phone, and fix a rating or comment. The person's average is recalculated, and every change is saved in the Action log with your reason." />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <input placeholder="Search name or phone…" value={s} onChange={e => { setS(e.target.value); setPage(1); }} style={{ ...inputStyle, flex: 1, minWidth: 200 }} />
        <select value={rating} onChange={e => { setRating(e.target.value); setPage(1); }} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="">All ratings</option>
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {d.reviews.map(r => (
          <Card key={r._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>
                  {r.reviewedBy?.name || 'Deleted user'} <span style={{ color: T.textTertiary, fontWeight: 400 }}>→</span> {r.reviewedUser?.name || 'Deleted user'}
                  <span style={{ color: T.textTertiary, fontWeight: 400 }}> · {r.reviewedUser?.phone}</span>
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: T.textTertiary }}>{r.job?.title ? `${r.job.title} · ` : ''}{fmt(r.createdAt)}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Chip>{r.reviewedUser?.role}</Chip>
                <span style={{ fontSize: 15 }}><Stars n={r.rating} /></span>
              </div>
            </div>
            {r.comment ? <p style={{ margin: '8px 0 0', fontSize: 13, color: T.textSecondary, lineHeight: 1.55 }}>{r.comment}</p> : null}

            {edit?.id === r._id ? (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setEdit({ ...edit, rating: n })} style={{
                      width: 38, height: 38, borderRadius: 10, border: `1px solid ${edit.rating === n ? T.accent : T.border}`,
                      background: edit.rating === n ? T.accent : 'transparent', color: edit.rating === n ? '#fff' : T.textSecondary, fontWeight: 800, cursor: 'pointer',
                    }}>{n}</button>
                  ))}
                </div>
                <textarea rows={3} maxLength={400} value={edit.comment} onChange={e => setEdit({ ...edit, comment: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Comment (can be emptied)" />
                <input value={edit.reason} onChange={e => setEdit({ ...edit, reason: e.target.value })} style={inputStyle} placeholder="Reason for the change (required, saved in the log)" />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save'}</Btn>
                  <Btn kind="ghost" onClick={() => setEdit(null)}>Cancel</Btn>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 10 }}>
                <Btn kind="ghost" onClick={() => setEdit({ id: r._id, rating: r.rating, comment: r.comment || '', reason: '' })}>Edit</Btn>
              </div>
            )}
          </Card>
        ))}
        {d.reviews.length === 0 && <Empty>No reviews found</Empty>}
      </div>
      <Pager page={page} pages={d.pages} setPage={setPage} />
    </div>
  );
}

export default function AdminReviews() {
  return <AdminAuthGuard><AdminLayout><Content /></AdminLayout></AdminAuthGuard>;
}