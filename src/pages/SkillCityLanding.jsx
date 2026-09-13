import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import '../styles/theme.css';

const unslugify = (slug) =>
  slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
const slugify = (str) => String(str).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

const LOGO_URL = 'https://res.cloudinary.com/dxdjlyq72/image/upload/v1786430441/InstantWorker_Logo_pljqcg.png';
const HERO_IMG = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80&auto=format&fit=crop';

const STEPS = [
  { n: '01', title: 'Post the job', desc: 'What you need, where, and your budget.' },
  { n: '02', title: 'Worker responds', desc: 'A verified worker near you takes the job.' },
  { n: '03', title: 'Pay direct', desc: 'No commission — settle up between the two of you.' },
];

const SUPPORT = {
  email: 'support247instantworker@gmail.com',
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
    axios.get('/api/skills').then(({ data }) => setAllSkills(data.skills || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setSearchSkill(skill);
    setSearchCity(city);
  }, [skill, city]);

  const goToSkillCity = (s, c) => {
    if (!s.trim() || !c.trim()) return;
    navigate(`/workers/${slugify(s.trim())}/${slugify(c.trim())}`);
  };

  const hasWorkers = !loading && workers.length > 0;

  useEffect(() => {
    setLoading(true);
    axios.get('/api/workers/search', { params: { skill, city } })
      .then(({ data }) => setWorkers(data.workers || []))
      .catch(() => setWorkers([]))
      .finally(() => setLoading(false));
  }, [skill, city]);

  return (
    <div style={{ background: '#fff', fontFamily: 'var(--font)' }}>
      <SEO
        title={`${skill} in ${city}`}
        description={`Find verified ${skillLower} services in ${city}. Zero commission, direct contact, live job tracking on Instant Worker.`}
        path={`/workers/${skillSlug}/${citySlug}`}
        noindex={!loading && !hasWorkers}
      />

      {/* ══ Header ══ */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 24px', maxWidth: 1080, margin: '0 auto',
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <img src={LOGO_URL} alt="InstantWorker" style={{ height: 36, width: 'auto', display: 'block' }} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/login" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Log in</Link>
          <Link to="/register" style={{
            fontSize: 14, fontWeight: 700, color: '#fff', background: 'var(--primary-dark)',
            padding: '9px 18px', borderRadius: 8, textDecoration: 'none',
          }}>
            Get started
          </Link>
        </div>
      </header>

      {/* ══ Hero — split, left-aligned, search built in ══ */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto', padding: '40px 24px 56px',
          display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center',
        }} className="scl-hero-grid">
          <div>
            <p style={{ margin: '0 0 10px', fontSize: 13.5, fontWeight: 700, color: 'var(--primary-dark)' }}>
              {city}
            </p>
            <h1 style={{
              margin: '0 0 18px', fontSize: 'clamp(32px, 4vw, 46px)', fontWeight: 800,
              color: 'var(--text)', lineHeight: 1.08, letterSpacing: '-0.02em',
            }}>
              Find a {skillLower} you can actually trust
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 440, marginBottom: 28 }}>
              Every {skillLower} on Instant Worker is ID-verified before they can take a job in {city}.
              You message them directly and pay them directly — no agency taking a cut in between.
            </p>

            {/* Search bar, part of the hero, not a floating card */}
            <form
              onSubmit={(e) => { e.preventDefault(); goToSkillCity(searchSkill, searchCity); }}
              style={{
                display: 'flex', border: '2px solid var(--text)', borderRadius: 10, overflow: 'hidden', maxWidth: 460,
              }}
            >
              <select
                value={searchSkill}
                onChange={e => setSearchSkill(e.target.value)}
                style={{
                  border: 'none', borderRight: '1px solid var(--border)', padding: '13px 12px',
                  fontSize: 14, fontFamily: 'var(--font)', color: 'var(--text)', background: '#fff', flex: '1 1 40%',
                }}
              >
                {!allSkills.includes(skill) && <option value={skill}>{skill}</option>}
                {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
                placeholder="City"
                style={{
                  border: 'none', padding: '13px 12px', fontSize: 14, fontFamily: 'var(--font)',
                  flex: '1 1 40%', outline: 'none', minWidth: 0,
                }}
              />
              <button type="submit" style={{
                border: 'none', background: 'var(--text)', color: '#fff', fontWeight: 700,
                fontSize: 14, padding: '0 22px', cursor: 'pointer', flexShrink: 0,
              }}>
                Search
              </button>
            </form>

            {allSkills.filter(s => s !== skill).length > 0 && (
              <p style={{ marginTop: 14, fontSize: 13, color: 'var(--text-tertiary)' }}>
                Also searched in {city}:{' '}
                {allSkills.filter(s => s !== skill).slice(0, 5).map((s, i, arr) => (
                  <span key={s}>
                    <Link to={`/workers/${slugify(s)}/${citySlug}`} style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>
                      {s}
                    </Link>
                    {i < arr.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            )}
          </div>

          <img
            src={HERO_IMG}
            alt={`${skill} in ${city}`}
            style={{ width: '100%', height: 380, objectFit: 'cover', borderRadius: 14 }}
          />
        </div>
      </section>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>

        {/* ══ Worker directory — ledger style, not card grid ══ */}
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
          {loading ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Loading…</p>
          ) : hasWorkers ? (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
                {skill}s in {city}
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--text-tertiary)', marginBottom: 22 }}>
                {workers.length} verified worker{workers.length !== 1 ? 's' : ''}
              </p>
              <div>
                {workers.map((w, i) => (
                  <Link
                    key={w._id}
                    to={`/worker/${w._id}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0',
                      borderTop: i === 0 ? '1px solid var(--border)' : 'none',
                      borderBottom: '1px solid var(--border)', textDecoration: 'none',
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-light)',
                      color: 'var(--primary-dark)', fontWeight: 800, fontSize: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {w.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>{w.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                        {w.worker?.experience || 0} yrs experience
                        {w.worker?.rating?.average > 0 && ` · ${w.worker.rating.average.toFixed(1)}★ (${w.worker.rating.count})`}
                      </p>
                    </div>
                    <p style={{ margin: 0, fontWeight: 800, color: 'var(--text)', fontSize: 16, flexShrink: 0 }}>
                      ₹{w.worker?.wagePerDay || '—'}<span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)' }}>/day</span>
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: '28px 0' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
                No {skillLower}s listed in {city} yet
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 18, maxWidth: 440 }}>
                Post the job anyway — we'll notify {skillLower}s in {city} as soon as they join, or be the
                first to sign up if you do this work yourself.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/register" style={{
                  fontSize: 14, fontWeight: 700, color: '#fff', background: 'var(--primary-dark)',
                  padding: '11px 20px', borderRadius: 8, textDecoration: 'none',
                }}>
                  Post a job
                </Link>
                <Link to="/register" style={{
                  fontSize: 14, fontWeight: 700, color: 'var(--text)', border: '1.5px solid var(--border)',
                  padding: '11px 20px', borderRadius: 8, textDecoration: 'none',
                }}>
                  I'm a {skillLower}
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ══ Editorial content — narrow measure, not a card ══ */}
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)', maxWidth: 620 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
            Hiring a {skillLower} in {city}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 16 }}>
            Finding a reliable {skillLower} in {city} usually means asking a neighbor, or trusting a listing
            with no real accountability behind it. Instant Worker checks the ID of every {skillLower} before
            they're allowed to take a single job — so the person who shows up is who you agreed to hire.
          </p>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            Once a job's agreed, you can track them on the way and pay however you like — Instant Worker
            never touches that money or takes a cut.
          </p>
        </section>

        {/* ══ Process — horizontal timeline, legitimately sequential ══ */}
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 28 }}>How it works</h2>
          <div style={{ display: 'flex', gap: 0 }} className="scl-steps">
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ flex: 1, position: 'relative', paddingRight: 24 }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: 13, left: '60%', right: 0, height: 1, background: 'var(--border)' }} />
                )}
                <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 800, color: 'var(--primary-dark)' }}>{s.n}</p>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>{s.title}</p>
                <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ Credentials strip — one row, not a card grid ══ */}
        <section style={{
          padding: '20px 0', borderBottom: '1px solid var(--border)',
          display: 'flex', flexWrap: 'wrap', gap: '10px 32px', fontSize: 13.5, color: 'var(--text-secondary)', fontWeight: 600,
        }}>
          <span>ID-verified workers</span>
          <span>Zero commission</span>
          <span>Direct messaging</span>
          <span>Live job tracking</span>
        </section>

        {/* ══ Worker recruitment banner — flat color, no gradient ══ */}
        <section style={{
          margin: '48px 0', background: 'var(--text)', borderRadius: 14,
          padding: '28px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 18,
        }}>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>
              Work as a {skillLower} in {city}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'rgba(255,255,255,.7)' }}>
              Free to join. Keep everything you earn.
            </p>
          </div>
          <Link to="/register" style={{
            background: '#fff', color: 'var(--text)', fontWeight: 800, fontSize: 14,
            padding: '12px 22px', borderRadius: 8, textDecoration: 'none', flexShrink: 0,
          }}>
            Sign up free
          </Link>
        </section>
      </div>

      {/* ══ Footer ══ */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 24px' }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <img src={LOGO_URL} alt="InstantWorker" style={{ height: 24, width: 'auto' }} />
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <a href={`https://wa.me/${SUPPORT.whatsapp}`} style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>WhatsApp</a>
            <a href={`mailto:${SUPPORT.email}`} style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>{SUPPORT.email}</a>
            <Link to="/terms" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms</Link>
            <Link to="/privacy" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy</Link>
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-tertiary)' }}>
            © {new Date().getFullYear()} Instant Worker
          </p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 760px) {
          .scl-hero-grid { grid-template-columns: 1fr !important; }
          .scl-steps { flex-direction: column !important; gap: 24px !important; }
          .scl-steps > div { padding-right: 0 !important; }
          .scl-steps > div > div { display: none !important; }
        }
      `}</style>
    </div>
  );
}