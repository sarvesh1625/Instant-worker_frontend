import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import '../styles/theme.css';

const unslugify = (slug) =>
  slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// Always-shown trust content — genuine value props, NOT fabricated stats.
// Bro4u-style pages lean on big numbers ("19,795 customers") you don't
// have yet; faking that is a real reputational risk the moment anyone
// checks. This fills the page with real substance instead: how the
// platform actually works and why it's different, true regardless of
// how many workers are listed in any one city today.
const HOW_IT_WORKS = [
  { n: '1', title: 'Post what you need', desc: 'Describe the job, your city, and your budget — takes under a minute.' },
  { n: '2', title: 'Connect directly', desc: 'Message verified workers directly in the app — no agency, no middleman.' },
  { n: '3', title: 'Pay zero commission', desc: 'Agree a price and pay the worker directly. Instant Worker never takes a cut.' },
];

const WHY_US = [
  { icon: '🛡️', title: 'ID-verified workers', desc: 'Every profile is checked before they can accept jobs.' },
  { icon: '💬', title: 'Direct messaging', desc: 'Chat unlocks once a job is agreed — no spam, no cold calls.' },
  { icon: '📍', title: 'Live job tracking', desc: 'See your worker en route once the job starts.' },
  { icon: '💰', title: 'Zero commission', desc: 'Workers keep 100% of what they earn, always.' },
];

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

  const hasWorkers = !loading && workers.length > 0;
  const pageTitle = `${skill} in ${city}`;
  const pageDescription = `Find verified ${skill.toLowerCase()} services in ${city}. Zero commission, direct contact, live job tracking on Instant Worker.`;

  return (
    <div className="il-page">
      <SEO
        title={pageTitle}
        description={pageDescription}
        path={`/workers/${skillSlug}/${citySlug}`}
        noindex={!loading && !hasWorkers}
      />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
          {skill} in {city}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 600 }}>
          Verified {skill.toLowerCase()} services in {city}. Contact directly — zero commission, ever.
        </p>

        {loading ? (
          <p style={{ color: 'var(--text-tertiary)' }}>Loading…</p>
        ) : hasWorkers ? (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', marginBottom: 48 }}>
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
        ) : (
          <div className="il-card il-card-pad" style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              We don't have {skill.toLowerCase()} workers listed in {city} yet — be the first.
            </p>
            <Link to="/register" className="il-btn il-btn-primary" style={{ marginTop: 16, textDecoration: 'none' }}>
              Sign up as a worker
            </Link>
          </div>
        )}

        {/* Always-shown trust content — real value props, not fabricated numbers */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center' }}>
            How Instant Worker works
          </h2>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {HOW_IT_WORKS.map(step => (
              <div key={step.n} className="il-card il-card-pad">
                <div style={{
                  width: 32, height: 32, borderRadius: 16, background: 'var(--primary-light)',
                  color: 'var(--primary-dark)', fontWeight: 800, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: 10,
                }}>{step.n}</div>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>{step.title}</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center' }}>
            Why choose Instant Worker
          </h2>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {WHY_US.map(item => (
              <div key={item.title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{item.title}</p>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--text-tertiary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
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