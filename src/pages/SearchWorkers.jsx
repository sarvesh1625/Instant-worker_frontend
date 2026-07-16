import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppShell from '../components/AppShell';
import '../styles/theme.css';

const SKILLS = ['', 'Labour', 'Painter', 'Carpenter', 'Electrician', 'Mechanic', 'Farmer', 'Driver', 'Plumber', 'Welder', 'Other'];
const CITIES = ['', 'Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Warangal', 'Tirupati', 'Bengaluru', 'Chennai', 'Mumbai', 'Delhi', 'Pune'];

function Stars({ rating = 0, size = 13 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <i key={s}
           className={`ti ${s <= Math.round(rating) ? 'ti-star-filled' : 'ti-star'}`}
           style={{ fontSize: size, color: s <= Math.round(rating) ? '#FACC15' : 'var(--border-strong)' }}
           aria-hidden="true"></i>
      ))}
      <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginLeft: 4, fontWeight: 600 }}>
        {rating > 0 ? rating.toFixed(1) : 'New'}
      </span>
    </div>
  );
}

export default function SearchWorkers() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ skill: '', city: '', availability: 'true' });
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(0);

  const search = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.skill)        params.append('skill', filters.skill);
      if (filters.city)         params.append('city', filters.city);
      if (filters.availability) params.append('availability', filters.availability);

      const { data } = await axios.get(`/api/workers/search?${params.toString()}`);
      setWorkers(data.workers || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      setWorkers([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { search(); }, []);

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const clearFilters = () => {
    setFilters({ skill: '', city: '', availability: '' });
    setTimeout(search, 0);
  };

  return (
    <AppShell>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '22px 18px 30px' }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Find Workers
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>
            Worker dhundo — {loading ? 'searching...' : `${total} worker${total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Filters */}
        <div className="il-card il-card-pad" style={{ marginBottom: 20 }}>
          <div className="sw-filter-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <div>
              <label className="il-label" style={{ fontSize: 12 }}>Skill</label>
              <select className="il-select" name="skill" value={filters.skill} onChange={handleFilter}>
                {SKILLS.map(s => <option key={s} value={s}>{s || 'All skills'}</option>)}
              </select>
            </div>
            <div>
              <label className="il-label" style={{ fontSize: 12 }}>City</label>
              <select className="il-select" name="city" value={filters.city} onChange={handleFilter}>
                {CITIES.map(c => <option key={c} value={c}>{c || 'All cities'}</option>)}
              </select>
            </div>
            <div>
              <label className="il-label" style={{ fontSize: 12 }}>Availability</label>
              <select className="il-select" name="availability" value={filters.availability} onChange={handleFilter}>
                <option value="">All workers</option>
                <option value="true">Available now</option>
                <option value="false">Not available</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button onClick={search} className="il-btn il-btn-primary" style={{ flex: 1 }}>
              <i className="ti ti-search" style={{ fontSize: 17 }} aria-hidden="true"></i>
              Search workers
            </button>
            <button onClick={clearFilters} className="il-btn il-btn-outline">Clear</button>
          </div>
        </div>

        {loading && <p className="il-muted" style={{ textAlign: 'center', padding: '40px 0', fontSize: 13.5 }}>Searching workers...</p>}

        {!loading && workers.length === 0 && (
          <div className="il-empty">
            <i className="ti ti-users" aria-hidden="true"></i>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>No workers found</p>
            <p style={{ fontSize: 12.5, marginTop: 5 }}>Try removing some filters, or post a job and let workers apply to you</p>
            <button onClick={() => navigate('/jobs/post')} className="il-btn il-btn-primary" style={{ marginTop: 16 }}>
              Post a job instead
            </button>
          </div>
        )}

        {/* Worker cards */}
        <div className="sw-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
          {workers.map(w => {
            const isVerified = w.idVerification?.status === 'approved';
            const available  = w.worker?.availability;

            return (
              <div key={w._id} className="il-card il-card-pad">
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                    <div className="il-avatar" style={{ width: 50, height: 50, fontSize: 20 }}>
                      {w.profilePhoto
                        ? <img src={w.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        : w.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <p style={{ margin: 0, fontSize: 15.5, fontWeight: 800, color: 'var(--text)' }}>{w.name}</p>
                        {isVerified && (
                          <i className="ti ti-rosette-discount-check-filled"
                             title="ID verified"
                             style={{ fontSize: 17, color: 'var(--primary)' }} aria-hidden="true"></i>
                        )}
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                        {w.worker?.skill || '—'} · {w.city || '—'}{w.area ? `, ${w.area}` : ''}
                      </p>
                      <div style={{ marginTop: 5 }}>
                        <Stars rating={w.worker?.rating?.average || 0} />
                      </div>
                    </div>
                  </div>

                  <span className="il-badge" style={{
                    flexShrink: 0,
                    background: available ? 'var(--primary-light)' : 'var(--surface)',
                    color: available ? 'var(--primary-dark)' : 'var(--text-tertiary)',
                    border: available ? 'none' : '1px solid var(--border)',
                  }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: available ? 'var(--primary)' : 'var(--text-tertiary)',
                      animation: available ? 'il-pulse 1.8s infinite' : 'none',
                    }}></span>
                    {available ? 'Available' : 'Busy'}
                  </span>
                </div>

                {/* Meta strip */}
                <div style={{
                  display: 'flex', gap: 0, background: 'var(--bg)',
                  border: '1px solid var(--border)', borderRadius: 12,
                  padding: '10px 0', marginBottom: 14,
                }}>
                  <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--primary-dark)' }}>
                      ₹{w.worker?.wagePerDay || 0}
                    </p>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--text-tertiary)' }}>per day</p>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>
                      {w.worker?.experience || 0}
                    </p>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--text-tertiary)' }}>years exp</p>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>
                      {w.worker?.totalJobsDone || 0}
                    </p>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--text-tertiary)' }}>jobs done</p>
                  </div>
                </div>

                {w.bio && (
                  <p style={{
                    margin: '0 0 14px', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{w.bio}</p>
                )}

                {w.languages?.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {w.languages.slice(0, 3).map(l => (
                      <span key={l} className="il-badge" style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontSize: 10.5 }}>
                        {l}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => navigate(`/profile/${w._id}`)} className="il-btn il-btn-outline" style={{ flex: 1 }}>
                    <i className="ti ti-user" style={{ fontSize: 16 }} aria-hidden="true"></i>
                    View profile
                  </button>
                  <button onClick={() => navigate(`/portfolio/${w._id}`)} className="il-btn il-btn-outline" style={{ flex: 1 }}>
                    <i className="ti ti-photo" style={{ fontSize: 16 }} aria-hidden="true"></i>
                    Portfolio
                  </button>
                </div>

                <p style={{ margin: '12px 0 0', fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  <i className="ti ti-info-circle" style={{ marginRight: 4, verticalAlign: -1 }} aria-hidden="true"></i>
                  Contact opens after you accept them for a job
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (min-width: 720px) {
          .sw-filter-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .sw-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 1200px) {
          .sw-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </AppShell>
  );
}