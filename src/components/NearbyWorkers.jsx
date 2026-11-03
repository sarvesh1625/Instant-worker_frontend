import { useState, useEffect } from 'react';
import axios from 'axios';

// While posting: how many workers with this skill are ONLINE near the job. Only numbers come from the server.
// It is a guide, not a promise: people go online and offline all day.
// Use:  <NearbyWorkers skill={form.skill} coords={coords} city={form.city} needed={form.workersNeeded} />
export default function NearbyWorkers({ skill, coords, city, needed }) {
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!skill) { setD(null); return undefined; }
    let alive = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = { skill };
        if (coords) { params.lat = coords.lat; params.lng = coords.lng; }
        if (city && city.trim().length > 2) params.city = city.trim();
        const { data } = await axios.get('/api/nearby/workers', { params });
        if (alive) setD(data);
      } catch { if (alive) setD(null); }
      finally { if (alive) setLoading(false); }
    }, 500);
    return () => { alive = false; clearTimeout(timer); };
  }, [skill, coords?.lat, coords?.lng, city]);   // eslint-disable-line react-hooks/exhaustive-deps

  const box = (bg, bd) => ({ background: bg, border: `1px solid ${bd}`, borderRadius: 14, padding: 16, margin: '4px 0 16px' });

  if (!skill) {
    return (
      <div style={box('var(--surface, #F8FAFC)', 'var(--border, #E2E8F0)')}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-tertiary)' }}>
          <i className="ti ti-users" style={{ marginRight: 7 }} aria-hidden="true"></i>Choose a skill to see how many workers are nearby.
        </p>
      </div>
    );
  }

  const total = d ? (d.hasPoint ? d.within25 : d.cityOnline) : null;
  const need = Math.max(1, Number(needed) || 1);
  const none = total === 0, enough = total !== null && total >= need;
  const good = total !== null && !none && enough;
  const tone = total === null ? 'var(--text-tertiary)' : good ? '#047857' : '#B45309';
  const bg = total === null ? 'var(--surface, #F8FAFC)' : good ? '#ECFDF5' : '#FFFBEB';
  const bd = total === null ? 'var(--border, #E2E8F0)' : good ? '#A7F3D0' : '#FDE68A';

  return (
    <div style={box(bg, bd)}>
      <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: tone }}>
        <i className="ti ti-users" style={{ marginRight: 7 }} aria-hidden="true"></i>Workers near you {loading ? '…' : ''}
      </p>
      {d && d.hasPoint && (
        <>
          <p style={{ margin: '8px 0', fontSize: 17, fontWeight: 800, color: tone }}>{total} workers online now (within 25 km)</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['Within 6 km', d.within6], ['Within 15 km', d.within15], ['Within 25 km', d.within25]].map(([l, n]) => (
              <div key={l} style={{ flex: 1, background: '#fff', borderRadius: 10, padding: '8px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>{n}</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 700 }}>{l}</div>
              </div>
            ))}
          </div>
        </>
      )}
      {d && !d.hasPoint && d.cityOnline !== null && (
        <>
          <p style={{ margin: '8px 0 2px', fontSize: 17, fontWeight: 800, color: tone }}>{d.cityOnline} online in {city.trim()}</p>
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>Use “current location” below to see workers near your exact place.</p>
        </>
      )}
      {d && total !== null && (
        <p style={{ margin: '10px 0 0', fontSize: 13, color: tone, lineHeight: 1.6 }}>
          {none ? 'No worker is online nearby right now. Your job will reach workers as they come online.'
            : enough ? 'Good — enough workers are online nearby.'
            : `You need ${need} workers but only ${total} are online nearby. You can still post — more may come online.`}
        </p>
      )}
    </div>
  );
}