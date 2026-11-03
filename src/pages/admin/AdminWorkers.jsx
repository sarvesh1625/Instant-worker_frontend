import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, inputStyle } from './adminTheme';
import { Title, Card, Chip, Empty, Pager, fmt } from './adminUi';

function Content() {
  const navigate = useNavigate();
  const [f, setF] = useState({ q: '', city: '', area: '', skill: '', online: '' });
  const [page, setPage] = useState(1);
  const [d, setD] = useState({ workers: [], onlineAreas: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page });
      Object.entries(f).forEach(([k, v]) => { if (v) p.append(k, v); });
      const { data } = await adminAxios.get(`/api/admin/ops/workers?${p}`);
      setD(data);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [page, tick]);   // eslint-disable-line
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const search = (e) => { e.preventDefault(); setPage(1); setTick(t => t + 1); };

  return (
    <div>
      <Title title="Workers" sub="Find workers by city, area and skill. Tap a worker to open the full profile. “Online” = available and location known." />

      <form onSubmit={search} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <input placeholder="Name or phone" value={f.q} onChange={set('q')} style={{ ...inputStyle, width: 170 }} />
        <input placeholder="City" value={f.city} onChange={set('city')} style={{ ...inputStyle, width: 130 }} />
        <input placeholder="Area" value={f.area} onChange={set('area')} style={{ ...inputStyle, width: 130 }} />
        <input placeholder="Skill" value={f.skill} onChange={set('skill')} style={{ ...inputStyle, width: 130 }} />
        <select value={f.online} onChange={e => { setF({ ...f, online: e.target.value }); setPage(1); setTick(t => t + 1); }} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="">All workers</option><option value="true">Online now</option>
        </select>
        <button type="submit" style={{ background: T.accent, color: '#fff', border: 'none', borderRadius: T.radiusSm, padding: '0 18px', fontWeight: 700, cursor: 'pointer' }}>Search</button>
      </form>

      {d.onlineAreas.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px', fontSize: 12.5, color: T.textSecondary, fontWeight: 700 }}>Online right now, by area (tap to filter)</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {d.onlineAreas.map((a, i) => (
              <button key={i} onClick={() => { setF({ ...f, city: a.city, area: a.area, online: 'true' }); setPage(1); setTick(t => t + 1); }}
                style={{ background: T.surfaceElevated, border: `1px solid ${T.border}`, color: T.text, borderRadius: 999, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: T.font }}>
                {a.area || 'No area'}, {a.city || '—'} · <b>{a.n}</b>
              </button>
            ))}
          </div>
        </Card>
      )}

      <p style={{ color: T.textTertiary, fontSize: 12.5 }}>{loading ? 'Loading...' : `${d.total} workers`}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {d.workers.map(w => (
          <Card key={w._id} style={{ padding: 14, cursor: 'pointer' }}><div onClick={() => navigate(`/admin/users/${w._id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{w.name} <span style={{ color: T.textTertiary, fontWeight: 400 }}>· {w.phone}</span></p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: T.textSecondary }}>
                  {(w.worker?.skills?.length ? w.worker.skills : [w.worker?.skill]).filter(Boolean).join(', ') || 'No skill'} · {[w.area, w.city].filter(Boolean).join(', ') || 'No location'} · ★ {w.worker?.rating?.average?.toFixed?.(1) || '0.0'} · {w.worker?.totalJobsDone || 0} jobs
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 11, color: T.textTertiary }}>Location updated {fmt(w.worker?.locationUpdatedAt)}</p>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                {w.worker?.availability ? <Chip color={T.success} bg={T.successBg}>Available</Chip> : <Chip>Offline</Chip>}
                {w.accountStatus !== 'active' && <Chip color="#F87171" bg={T.dangerBg}>{w.accountStatus}</Chip>}
              </div>
            </div>
          </div></Card>
        ))}
        {!loading && d.workers.length === 0 && <Empty>No workers match</Empty>}
      </div>
      <Pager page={page} pages={d.pages} setPage={setPage} />
    </div>
  );
}

export default function AdminWorkers() {
  return <AdminAuthGuard><AdminLayout><Content /></AdminLayout></AdminAuthGuard>;
}