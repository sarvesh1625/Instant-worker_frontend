import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T } from './adminTheme';

const PERIODS = [
  { value: 'week',     label: 'This Week' },
  { value: 'month',    label: 'This Month' },
  { value: '3months',  label: 'Last 3 Months' },
];

const MEDAL_COLORS = ['#F59E0B', '#94A3B8', '#B45309']; // gold, silver, bronze

function LeaderboardContent() {
  const navigate = useNavigate();
  const [period, setPeriod]   = useState('month');
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminAxios.get(`/api/admin/leaderboard?period=${period}`);
      setRows(data.leaderboard || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [period]);

  const periodLabel = PERIODS.find(p => p.value === period)?.label;

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Top Workers</h1>
      <p style={{ margin: '0 0 22px', fontSize: 13.5, color: T.textTertiary }}>
        Ranked by jobs completed — use this to identify who to reward
      </p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {PERIODS.map(p => (
          <button key={p.value} onClick={() => setPeriod(p.value)} style={{
            padding: '9px 18px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, fontFamily: T.font,
            border: period === p.value ? `1px solid ${T.accent}` : `1px solid ${T.border}`,
            background: period === p.value ? T.accentBg : 'transparent',
            color: period === p.value ? '#A5B4FC' : T.textTertiary,
            cursor: 'pointer',
          }}>
            {p.label}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: T.textTertiary, fontSize: 13.5 }}>Loading...</p>}

      {!loading && rows.length === 0 && (
        <p style={{ textAlign: 'center', padding: 40, color: T.textTertiary, fontSize: 13 }}>
          No completed jobs in this period yet.
        </p>
      )}

      {!loading && rows.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((row, i) => (
            <div key={row.workerId} style={{
              background: T.surface, border: `1px solid ${i < 3 ? MEDAL_COLORS[i] : T.border}`,
              borderRadius: T.radiusMd, padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: i < 3 ? MEDAL_COLORS[i] + '22' : T.surfaceElevated,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 800, color: i < 3 ? MEDAL_COLORS[i] : T.textTertiary,
              }}>
                {i < 3 ? <i className="ti ti-trophy" style={{ fontSize: 17 }} aria-hidden="true"></i> : `#${i + 1}`}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: T.text }}>{row.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11.5, color: T.textTertiary }}>
                  {row.phone} {row.skill ? `· ${row.skill}` : ''} {row.rating?.average ? `· ★ ${row.rating.average.toFixed(1)}` : ''}
                </p>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.text }}>{row.jobsCompleted}</p>
                <p style={{ margin: 0, fontSize: 10.5, color: T.textTertiary }}>jobs · ₹{row.totalEarned?.toLocaleString('en-IN') || 0} earned</p>
              </div>

              <button
                onClick={() => navigate('/admin/subscriptions')}
                title="Reward this worker"
                style={{
                  background: T.accentBg, border: `1px solid ${T.accent}`, borderRadius: 8,
                  padding: '8px 12px', color: '#A5B4FC', fontSize: 11.5, fontWeight: 700,
                  cursor: 'pointer', fontFamily: T.font, flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <i className="ti ti-gift" style={{ fontSize: 14 }} aria-hidden="true"></i>
                Reward
              </button>
            </div>
          ))}
        </div>
      )}

      <p style={{ marginTop: 20, fontSize: 11, color: T.textTertiary, textAlign: 'center' }}>
        Showing top {rows.length} of workers with completed jobs in the selected period ({periodLabel}).
      </p>
    </div>
  );
}

export default function AdminLeaderboard() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <LeaderboardContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}