import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import '../styles/theme.css';

const unslugify = (slug) =>
  slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export default function SkillCityLanding() {
  const { skill: skillSlug, city: citySlug } = useParams();
  const skill = unslugify(skillSlug);
  const city = unslugify(citySlug);

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/workers/search', { params: { skill, city } })
      .then(({ data }) => setWorkers(data.workers || []))
      .catch(() => setWorkers([]))
      .finally(() => setLoading(false));
  }, [skill, city]);

  const pageTitle = `${skill}s in ${city}`;
  const pageDescription = `Find verified, ID-checked ${skill.toLowerCase()}s in ${city}. Zero commission, direct contact, live job tracking. Post a job or browse profiles on Instant Worker.`;

  return (
    <div className="il-page">
      <SEO title={pageTitle} description={pageDescription} path={`/workers/${skillSlug}/${citySlug}`} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
          {skill}s in {city}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 600 }}>
          Verified, ID-checked {skill.toLowerCase()}s available in {city}. Contact directly — zero commission, ever.
        </p>

        {loading ? (
          <p style={{ color: 'var(--text-tertiary)' }}>Loading…</p>
        ) : workers.length === 0 ? (
          <div className="il-card il-card-pad" style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              No {skill.toLowerCase()}s listed in {city} yet.
            </p>
            <Link to="/register" className="il-btn il-btn-primary" style={{ marginTop: 16, textDecoration: 'none' }}>
              Be the first — Sign up
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {workers.map(w => (
              <Link key={w._id} to={`/worker/${w._id}`} className="il-card il-card-pad" style={{ textDecoration: 'none', display: 'block' }}>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>{w.name}</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {w.worker?.experience || 0} yrs experience · ₹{w.worker?.wagePerDay || '—'}/day
                </p>
                {w.worker?.rating?.average > 0 && (
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-tertiary)' }}>
                    ⭐ {w.worker.rating.average.toFixed(1)} ({w.worker.rating.count})
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Need to hire a {skill.toLowerCase()} in {city}?
          </p>
          <Link to="/register" className="il-btn il-btn-primary" style={{ textDecoration: 'none' }}>
            Post a job — it's free
          </Link>
        </div>
      </div>
    </div>
  );
}