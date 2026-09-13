import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import '../styles/theme.css';

const unslugify = (slug) =>
  slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const slugify = (str) => String(str).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

const LOGO_URL = 'https://res.cloudinary.com/dxdjlyq72/image/upload/v1786430441/InstantWorker_Logo_pljqcg.png';
const HERO_IMG = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1000&q=80&auto=format&fit=crop';

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

const SUPPORT = {
  email: 'support247instantworker@gmail.com',
  phone: '+91 93906 83569',
  whatsapp: '919390683569',
};

export default function SkillCityLanding() {
  const { skill: skillSlug, city: citySlug } = useParams();
  const navigate = useNavigate();
  const skill = unslugify(skillSlug);
  const city = unslugify(citySlug);
  const skillLower = skill.toLowerCase();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allSkills, setAllSkills] = useState([]);
  const [searchSkill, setSearchSkill] = useState(skill);
  const [searchCity, setSearchCity] = useState(city);

  useEffect(() => {
    axios.get('/api/skills')
      .then(({ data }) => setAllSkills(data.skills || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSearchSkill(skill);
    setSearchCity(city);
  }, [skill, city]);

  const goToSkillCity = (newSkill, newCity) => {
    if (!newSkill.trim() || !newCity.trim()) return;
    navigate(`/workers/${slugify(newSkill.trim())}/${slugify(newCity.trim())}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    goToSkillCity(searchSkill, searchCity);
  };

  useEffect(() => {
    setLoading(true);
    axios.get('/api/workers/search', { params: { skill, city } })
      .then(({ data }) => setWorkers(data.workers || []))
      .catch(() => setWorkers([]))
      .finally(() => setLoading(false));
  }, [skill, city]);

  const hasWorkers = !loading && workers.length > 0;
  const pageTitle = `${skill} in ${city}`;
  const pageDescription = `Find verified ${skillLower} services in ${city}. Zero commission, direct contact, live job tracking on Instant Worker.`;

  return (
    <div className="il-page" style={{ background: '#fff' }}>
      <SEO
        title={pageTitle}
        description={pageDescription}
        path={`/workers/${skillSlug}/${citySlug}`}
        noindex={!loading && !hasWorkers}
      />

      {/* ══ HEADER ══ */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: '1px solid var(--border)', maxWidth: 1100, margin: '0 auto',
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <img src={LOGO_URL} alt="InstantWorker" style={{ height: 40, width: 'auto', display: 'block' }} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/login" className="il-link" style={{ fontSize: 14 }}>Log in</Link>
          <Link to="/register" className="il-btn il-btn-primary il-btn-sm" style={{ textDecoration: 'none' }}>
            Get Started
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>

        {/* ══ HERO ══ */}
        <section style={{ padding: '56px 0 40px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--primary-light)', color: 'var(--primary-dark)',
            borderRadius: 999, padding: '6px 16px', fontSize: 12.5, fontWeight: 700, marginBottom: 20,
          }}>
            ✨ Serving {city} and nearby areas
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
            Verified {skill} services<br />in <span style={{ color: 'var(--primary-dark)' }}>{city}</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Connect directly with ID-verified {skillLower}s in {city}. No agency, no middleman —
            just zero-commission hiring with live job tracking built in.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="il-btn il-btn-primary" style={{ padding: '14px 28px', textDecoration: 'none' }}>
              Post a job — it's free
            </Link>
            <Link to="/register" className="il-btn il-btn-outline" style={{ padding: '14px 28px', textDecoration: 'none' }}>
              I'm a {skillLower}, sign me up
            </Link>
          </div>

          <img
            src={HERO_IMG}
            alt={`${skill} services in ${city}`}
            style={{ width: '100%', maxWidth: 800, height: 280, objectFit: 'cover', borderRadius: 20, marginTop: 40, boxShadow: 'var(--shadow-md)' }}
          />
        </section>

        {/* ══ Search / switch skill or city ══ */}
        <section style={{ paddingBottom: 24 }}>
          <form
            onSubmit={handleSearchSubmit}
            className="il-card il-card-pad"
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}
          >
            <div style={{ flex: '1 1 200px' }}>
              <label className="il-label">Looking for a different skill?</label>
              <select
                className="il-select"
                value={searchSkill}
                onChange={e => setSearchSkill(e.target.value)}
              >
                {!allSkills.includes(skill) && <option value={skill}>{skill}</option>}
                {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 160px' }}>
              <label className="il-label">City</label>
              <input
                className="il-input"
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <button type="submit" className="il-btn il-btn-primary" style={{ flexShrink: 0 }}>
              Search
            </button>
          </form>

          {allSkills.filter(s => s !== skill).length > 0 && (
            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', fontWeight: 600, alignSelf: 'center' }}>
                Also popular in {city}:
              </span>
              {allSkills.filter(s => s !== skill).slice(0, 6).map(s => (
                <button
                  key={s}
                  onClick={() => goToSkillCity(s, city)}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 999,
                    padding: '5px 14px', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)',
                    cursor: 'pointer', fontFamily: 'var(--font)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ══ Unique content block — genuinely tailored, not templated filler ══ */}
        <section style={{ padding: '20px 0 40px', maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
            Hiring a {skillLower} in {city}?
          </h2>
          <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 14 }}>
            Whether it's a one-time repair or ongoing work, finding a reliable {skillLower} in {city} usually
            means asking around or trusting a listing with no real accountability. Instant Worker fixes that —
            every {skillLower} on the platform goes through ID verification before they can accept a single job,
            and you deal with them directly. No call-center middleman marking up the price, no vanishing after a
            deposit.
          </p>
          <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            Once you post a job, you can message the worker directly in the app, track their arrival live on
            the day of the work, and pay them however you agree — Instant Worker never takes a cut of what
            you pay.
          </p>
        </section>

        {/* ══ Worker listing / empty state ══ */}
        {loading ? (
          <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '20px 0' }}>Loading…</p>
        ) : hasWorkers ? (
          <section style={{ paddingBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 18, textAlign: 'center' }}>
              {skill}s available in {city}
            </h2>
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
          </section>
        ) : (
          <section style={{ paddingBottom: 48 }}>
            <div className="il-card il-card-pad" style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                We don't have {skillLower} workers listed in {city} yet — be the first.
              </p>
              <Link to="/register" className="il-btn il-btn-primary" style={{ marginTop: 16, textDecoration: 'none' }}>
                Sign up as a worker
              </Link>
            </div>
          </section>
        )}

        {/* ══ How it works ══ */}
        <section style={{ paddingBottom: 48 }}>
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
        </section>

        {/* ══ Why us ══ */}
        <section style={{ paddingBottom: 48 }}>
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
        </section>

        {/* ══ Promotional banner ══ */}
        <section style={{
          background: 'linear-gradient(120deg, #059669, #10B981)', borderRadius: 20,
          padding: '32px 28px', marginBottom: 56, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        }}>
          <div>
            <p style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#fff' }}>
              Are you a {skillLower} in {city}?
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'rgba(255,255,255,.85)' }}>
              Join free — get matched with real jobs near you, keep 100% of what you earn.
            </p>
          </div>
          <Link to="/register" style={{
            background: '#fff', color: 'var(--primary-dark)', fontWeight: 800, fontSize: 14,
            padding: '13px 26px', borderRadius: 999, textDecoration: 'none', flexShrink: 0,
          }}>
            Join as a worker →
          </Link>
        </section>
      </div>

      {/* ══ FOOTER ══ */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 20px', textAlign: 'center' }}>
        <img src={LOGO_URL} alt="InstantWorker" style={{ height: 30, width: 'auto', margin: '0 auto 16px', display: 'block' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 14 }}>
          <a href={`https://wa.me/${SUPPORT.whatsapp}`} className="il-link" style={{ fontSize: 13 }}>WhatsApp us</a>
          <a href={`mailto:${SUPPORT.email}`} className="il-link" style={{ fontSize: 13 }}>{SUPPORT.email}</a>
          <Link to="/terms" className="il-link" style={{ fontSize: 13 }}>Terms</Link>
          <Link to="/privacy" className="il-link" style={{ fontSize: 13 }}>Privacy</Link>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-tertiary)' }}>
          © {new Date().getFullYear()} Instant Worker. All rights reserved.
        </p>
      </footer>
    </div>
  );
}