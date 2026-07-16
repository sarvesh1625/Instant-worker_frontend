import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/theme.css';

// ── Support details ──────────────────────────────────────────────────────────
const SUPPORT = {
  email:    'support247instantworker@gmail.com',
  phone:    '+91 93906 83569',
  whatsapp: '919390683569',
  hours:    'Mon–Sat, 9 AM – 7 PM IST',
  city:     'Andhra Pradesh & Telangana',
};

// ── Photos (Unsplash CDN) ────────────────────────────────────────────────────
const IMG = {
  hero:    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80&auto=format&fit=crop',
  painter: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=700&q=80&auto=format&fit=crop',
  electric:'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&q=80&auto=format&fit=crop',
  plumber: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700&q=80&auto=format&fit=crop',
  team:    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80&auto=format&fit=crop',
};

// ── Testimonials ─────────────────────────────────────────────────────────────
// ⚠️ PLACEHOLDER CONTENT — replace with REAL quotes from pilot users before
// launch. Fake testimonials are misleading advertising (Consumer Protection
// Act 2019) and destroy trust if discovered.
const TESTIMONIALS = [
  { name: 'Ravi K.', role: 'Painter · Hyderabad', quote: 'Earlier I stood at the labour adda from 6 AM hoping for work. Now jobs come to my phone. I got 2 painting jobs in my first 3 days.', stars: 5 },
  { name: 'Srinivas T.', role: 'Job poster · Vijayawada', quote: 'I needed 2 helpers urgently. Both were confirmed within 20 minutes and I could watch them arrive on the map.', stars: 5 },
  { name: 'Lakshmi D.', role: 'Job poster · Visakhapatnam', quote: 'I checked the electrician\'s rating and photos of his past work before booking. The job was done well, no stress at all.', stars: 4 },
];

// ── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Is Instant Worker really free for workers?', a: 'Yes. Registration is free, finding jobs is free, and we take zero commission from your wages. Whatever wage you agree with the job poster is 100% yours.' },
  { q: 'How do workers get paid?', a: 'Payment is made directly between the worker and the job poster — cash or UPI, whatever both agree. We recommend confirming the wage in chat before starting work, so there is a written record.' },
  { q: 'What if a poster refuses to pay after work?', a: 'Report them immediately using the Report button on their profile. Our team reviews every report. Users with verified payment complaints are banned from the platform.' },
  { q: 'I cannot read or type well. Can I still use this?', a: 'Yes — that is exactly who we built this for. You can search for jobs by speaking in Telugu, Hindi, or English, and job details can be read aloud. Registration needs only your name, phone number, and an OTP.' },
  { q: 'Why does the app need my location?', a: 'A worker\'s live location is shared ONLY while a job is active, so the job poster can see they are on the way — like tracking a cab. It stops automatically when work is done.' },
  { q: 'Are ID documents safe if I verify?', a: 'Yes. ID verification is optional. Your document is seen only by our verification team, never shown publicly, and never shared with anyone. Only the "Verified" badge appears on your profile.' },
];

const NAV_LINKS = [
  { label: 'Services',     href: '#services' },
  { label: 'How it works', href: '#how' },
  { label: 'About',        href: '#about' },
  { label: 'FAQ',          href: '#faq' },
  { label: 'Contact',      href: '#contact' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq]     = useState(null);
  const [menuOpen, setMenuOpen]   = useState(false);

  // ── Scroll-reveal animation ──
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="il-page" style={{ background: '#fff', overflowX: 'hidden' }}>

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'linear-gradient(135deg, #059669, #10B981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 12px rgba(16,185,129,.35)',
            }}>
              <i className="ti ti-bolt" style={{ fontSize: 21, color: '#fff' }} aria-hidden="true"></i>
            </div>
            <span style={{ fontSize: 18.5, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Instant<span style={{ color: '#059669' }}>Worker</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="lp-nav-links" style={{ display: 'none', gap: 4, marginLeft: 22 }}>
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600,
                color: 'var(--text-secondary)', padding: '8px 14px', borderRadius: 9,
                transition: 'color .15s, background .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#059669'; e.currentTarget.style.background = '#ECFDF5'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'none'; }}>
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 9, alignItems: 'center' }}>
            <button onClick={() => navigate('/login')} className="lp-login-btn il-btn il-btn-outline il-btn-sm" style={{ borderRadius: 999, padding: '9px 20px' }}>
              Login
            </button>
            <button onClick={() => navigate('/register')} className="il-btn il-btn-primary il-btn-sm" style={{ borderRadius: 999, padding: '9px 20px' }}>
              Get Started
            </button>
            {/* Mobile hamburger */}
            <button className="lp-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
              display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
              alignItems: 'center', justifyContent: 'center', color: 'var(--text)', fontSize: 19,
            }}>
              <i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'}`} aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="lp-mobile-menu" style={{ borderTop: '1px solid var(--border)', background: '#fff', padding: '10px 20px 16px' }}>
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font)', fontSize: 15, fontWeight: 600,
                color: 'var(--text)', padding: '12px 4px',
                borderBottom: '1px solid var(--border)',
              }}>
                {l.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Soft background blobs — subtle, mostly white page */}
        <div style={{ position: 'absolute', top: -120, right: -140, width: 440, height: 440, borderRadius: '50%', background: 'rgba(16,185,129,.09)', filter: 'blur(70px)' }}></div>
        <div style={{ position: 'absolute', bottom: -100, left: -120, width: 380, height: 380, borderRadius: '50%', background: 'rgba(249,115,22,.08)', filter: 'blur(70px)' }}></div>

        <div className="lp-hero" style={{
          position: 'relative', maxWidth: 1180, margin: '0 auto',
          padding: '56px 20px 72px',
          display: 'grid', gridTemplateColumns: '1fr', gap: 44, alignItems: 'center',
        }}>
          {/* Left — copy */}
          <div className="fade-up">
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#ECFDF5', border: '1px solid #A7F3D0',
              color: '#047857', fontSize: 12.5, fontWeight: 700,
              padding: '7px 16px', borderRadius: 999, marginBottom: 22,
            }}>
              <i className="ti ti-sparkles" style={{ fontSize: 15 }} aria-hidden="true"></i>
              India's instant work platform · {SUPPORT.city}
            </span>

            <h1 style={{
              margin: 0, fontSize: 'clamp(34px, 5.5vw, 56px)', fontWeight: 800,
              color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-0.03em',
            }}>
              Skilled workers.<br />
              <span style={{ color: '#059669' }}>On demand.</span><br />
              In minutes.
            </h1>

            <p style={{ margin: '20px 0 0', maxWidth: 460, fontSize: 'clamp(15px, 2vw, 17.5px)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Painters, carpenters, electricians, plumbers, drivers and daily-wage labour —
              hire verified workers or find work near you. <strong style={{ color: 'var(--text)' }}>No middlemen. Zero commission.</strong>
            </p>

            <div style={{ display: 'flex', gap: 13, marginTop: 32, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')} className="il-btn il-btn-primary" style={{ borderRadius: 999, padding: '15px 30px', fontSize: 15.5 }}>
                <i className="ti ti-hammer" style={{ fontSize: 19 }} aria-hidden="true"></i>
                I want work
              </button>
              <button onClick={() => navigate('/register')} className="il-btn il-btn-secondary" style={{ borderRadius: 999, padding: '15px 30px', fontSize: 15.5 }}>
                <i className="ti ti-user-search" style={{ fontSize: 19 }} aria-hidden="true"></i>
                I need workers
              </button>
            </div>

            <div style={{ display: 'flex', gap: 26, marginTop: 36, flexWrap: 'wrap' }}>
              {[
                { num: '0%',   label: 'Commission' },
                { num: '2 min', label: 'To register' },
                { num: '3',    label: 'Languages' },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'var(--text)' }}>{s.num}</p>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-tertiary)', fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — photo with floating cards */}
          <div className="fade-up delay-2" style={{ position: 'relative' }}>
            <div style={{ borderRadius: 26, overflow: 'hidden', boxShadow: '0 24px 60px rgba(17,24,39,.16)' }}>
              <img src={IMG.hero} alt="Skilled worker on the job"
                style={{ width: '100%', height: 'clamp(300px, 44vw, 460px)', objectFit: 'cover', display: 'block' }}
                onError={e => e.currentTarget.parentElement.style.display = 'none'} />
            </div>

            {/* Floating card — worker confirmed */}
            <div className="float-a" style={{
              position: 'absolute', top: 22, left: -14,
              background: '#fff', borderRadius: 15, padding: '13px 17px',
              boxShadow: '0 12px 32px rgba(17,24,39,.14)',
              display: 'flex', alignItems: 'center', gap: 11,
              border: '1px solid var(--border)',
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-circle-check" style={{ fontSize: 20, color: '#059669' }} aria-hidden="true"></i>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>Worker confirmed</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-tertiary)' }}>Arriving in 18 minutes</p>
              </div>
            </div>

            {/* Floating card — rating */}
            <div className="float-b" style={{
              position: 'absolute', bottom: 26, right: -10,
              background: '#fff', borderRadius: 15, padding: '13px 17px',
              boxShadow: '0 12px 32px rgba(17,24,39,.14)',
              display: 'flex', alignItems: 'center', gap: 11,
              border: '1px solid var(--border)',
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: '#FEFCE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-star-filled" style={{ fontSize: 19, color: '#FACC15' }} aria-hidden="true"></i>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>4.8 rating</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-tertiary)' }}>ID-verified electrician</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills marquee */}
        <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)', overflow: 'hidden', padding: '14px 0' }}>
          <div className="marquee" style={{ display: 'flex', gap: 14, width: 'max-content' }}>
            {[...Array(2)].flatMap((_, r) =>
              ['Painters','Carpenters','Electricians','Plumbers','Drivers','Welders','Mechanics','Farm Labour','Helpers','Masons'].map(s => (
                <span key={`${r}-${s}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: '#fff', border: '1px solid var(--border)',
                  borderRadius: 999, padding: '8px 20px',
                  fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981' }}></span>
                  {s}
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ══ SERVICES — what we provide ══════════════════════════════════════ */}
      <section id="services" style={{ maxWidth: 1180, margin: '0 auto', padding: '76px 20px 30px' }}>
        <p className="reveal" style={{ textAlign: 'center', margin: 0, fontSize: 12.5, fontWeight: 800, color: '#059669', letterSpacing: '.1em', textTransform: 'uppercase' }}>What we provide</p>
        <h2 className="reveal" style={{ textAlign: 'center', margin: '10px auto 14px', maxWidth: 620, fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          One platform. Two sides. Everything you need.
        </h2>
        <p className="reveal" style={{ textAlign: 'center', margin: '0 auto 48px', maxWidth: 540, fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Whether you're looking for daily work or need trusted hands for a job — Instant Worker connects both sides directly.
        </p>

        <div className="lp-services" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 22 }}>
          {/* For Workers */}
          <div className="reveal il-card" style={{ overflow: 'hidden', background: '#fff' }}>
            <img src={IMG.painter} alt="Painter at work" style={{ width: '100%', height: 210, objectFit: 'cover', display: 'block' }}
              onError={e => e.currentTarget.style.display = 'none'} />
            <div style={{ padding: '26px 26px 28px' }}>
              <span className="il-badge" style={{ background: '#ECFDF5', color: '#047857', marginBottom: 12 }}>
                <i className="ti ti-hammer" style={{ fontSize: 13 }} aria-hidden="true"></i> FOR WORKERS
              </span>
              <h3 style={{ margin: '10px 0 14px', fontSize: 21, fontWeight: 800, color: 'var(--text)' }}>Find work near you — free forever</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {[
                  'Jobs matched to your skill and city, delivered to your phone',
                  'Set your own daily wage — keep 100% of it',
                  'Go Online / Offline anytime, you control when you work',
                  'Build a photo portfolio and earn ratings that get you hired more',
                ].map(li => (
                  <li key={li} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <i className="ti ti-circle-check-filled" style={{ fontSize: 18, color: '#10B981', flexShrink: 0, marginTop: 1 }} aria-hidden="true"></i>
                    {li}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} className="il-btn il-btn-primary" style={{ marginTop: 22, borderRadius: 999 }}>
                Start finding work
                <i className="ti ti-arrow-right" style={{ fontSize: 17 }} aria-hidden="true"></i>
              </button>
            </div>
          </div>

          {/* For Job Posters */}
          <div className="reveal il-card" style={{ overflow: 'hidden', background: '#fff' }}>
            <img src={IMG.electric} alt="Electrician working" style={{ width: '100%', height: 210, objectFit: 'cover', display: 'block' }}
              onError={e => e.currentTarget.style.display = 'none'} />
            <div style={{ padding: '26px 26px 28px' }}>
              <span className="il-badge" style={{ background: '#FFF7ED', color: '#C2410C', marginBottom: 12 }}>
                <i className="ti ti-user-search" style={{ fontSize: 13 }} aria-hidden="true"></i> FOR JOB POSTERS
              </span>
              <h3 style={{ margin: '10px 0 14px', fontSize: 21, fontWeight: 800, color: 'var(--text)' }}>Hire verified workers in minutes</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {[
                  'Post a job and receive applications from nearby skilled workers',
                  'Urgent hiring — first available worker auto-confirms in minutes',
                  'Track your worker arriving live on the map, like a cab',
                  'Check ID-verified badges, ratings, and past work photos before hiring',
                ].map(li => (
                  <li key={li} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <i className="ti ti-circle-check-filled" style={{ fontSize: 18, color: '#F97316', flexShrink: 0, marginTop: 1 }} aria-hidden="true"></i>
                    {li}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} className="il-btn il-btn-secondary" style={{ marginTop: 22, borderRadius: 999 }}>
                Post your first job
                <i className="ti ti-arrow-right" style={{ fontSize: 17 }} aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════════════ */}
      <section id="how" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 20px' }}>
        <p className="reveal" style={{ textAlign: 'center', margin: 0, fontSize: 12.5, fontWeight: 800, color: '#059669', letterSpacing: '.1em', textTransform: 'uppercase' }}>How it works</p>
        <h2 className="reveal" style={{ textAlign: 'center', margin: '10px 0 48px', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Three steps. That's it.
        </h2>

        <div className="lp-steps" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
          {[
            { n: '01', icon: 'ti-user-plus',      title: 'Register free',     desc: 'Name, phone number, OTP. Choose Worker or Job Poster. Under 2 minutes, no documents required.' },
            { n: '02', icon: 'ti-search',         title: 'Match instantly',   desc: 'Workers browse jobs near them. Posters get applications — or use Urgent mode for instant auto-confirmation.' },
            { n: '03', icon: 'ti-currency-rupee', title: 'Work & get paid',   desc: 'Track arrival live, complete the work, pay directly in cash or UPI. We never touch your money.' },
          ].map((s, i) => (
            <div key={s.n} className={`reveal il-card`} style={{ padding: '30px 26px', position: 'relative', overflow: 'hidden', transitionDelay: `${i * 90}ms` }}>
              <span style={{ position: 'absolute', top: -16, right: 6, fontSize: 96, fontWeight: 800, color: 'var(--surface)', lineHeight: 1, userSelect: 'none', WebkitTextStroke: '1px var(--border)' }}>{s.n}</span>
              <div style={{ width: 54, height: 54, borderRadius: 15, background: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative' }}>
                <i className={`ti ${s.icon}`} style={{ fontSize: 26, color: '#fff' }} aria-hidden="true"></i>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: 'var(--text)', position: 'relative' }}>{s.title}</h3>
              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7, position: 'relative' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES STRIP ══════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '60px 20px' }}>
          <div className="lp-features" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { icon: 'ti-bolt',           title: 'Urgent hiring',    desc: 'First to accept gets the job — confirmed in minutes.' },
              { icon: 'ti-map-pin',        title: 'Live tracking',    desc: 'Watch your worker arrive on the map in real time.' },
              { icon: 'ti-shield-check',   title: 'ID verification',  desc: 'Government-ID checked badges you can trust.' },
              { icon: 'ti-message-circle', title: 'Secure chat',      desc: 'Chat and voice notes unlock after confirmation.' },
              { icon: 'ti-percentage',     title: 'Zero commission',  desc: 'Direct payment. Workers keep every rupee.' },
              { icon: 'ti-language',       title: '3 languages',      desc: 'Telugu, Hindi and English — with voice search.' },
            ].map((f, i) => (
              <div key={f.title} className="reveal" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', transitionDelay: `${i * 60}ms` }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                  <i className={`ti ${f.icon}`} style={{ fontSize: 21, color: '#059669' }} aria-hidden="true"></i>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{f.title}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ABOUT ═══════════════════════════════════════════════════════════ */}
      <section id="about" style={{ maxWidth: 1180, margin: '0 auto', padding: '76px 20px' }}>
        <div className="lp-about" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, alignItems: 'center' }}>
          <div className="reveal" style={{ position: 'relative' }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 50px rgba(17,24,39,.14)' }}>
              <img src={IMG.team} alt="Team working together" style={{ width: '100%', height: 'clamp(260px, 36vw, 400px)', objectFit: 'cover', display: 'block' }}
                onError={e => e.currentTarget.parentElement.style.display = 'none'} />
            </div>
            <div className="float-a" style={{
              position: 'absolute', bottom: -16, left: 20,
              background: '#fff', borderRadius: 14, padding: '13px 18px',
              boxShadow: '0 12px 30px rgba(17,24,39,.15)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <i className="ti ti-heart-handshake" style={{ fontSize: 22, color: '#F97316' }} aria-hidden="true"></i>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>Built for fairness</p>
            </div>
          </div>

          <div className="reveal delay-1">
            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: '#059669', letterSpacing: '.1em', textTransform: 'uppercase' }}>About us</p>
            <h2 style={{ margin: '10px 0 18px', fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              The days of standing at the labour adda are over.
            </h2>
            <p style={{ margin: '0 0 14px', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Every morning, millions of skilled workers across India wait at street corners hoping
              someone will offer a day's work. Meanwhile, people who need those exact skills can't
              find anyone reliable.
            </p>
            <p style={{ margin: '0 0 22px', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Instant Worker connects both sides directly — no agents, no cuts from anyone's wage.
              Starting in {SUPPORT.city}, built in Telugu, Hindi and English so everyone can use it,
              including those who can't read or type well.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['No middlemen', 'Zero commission', 'Local first'].map(chip => (
                <span key={chip} className="il-badge" style={{ background: '#ECFDF5', color: '#047857', padding: '8px 16px', fontSize: 12.5 }}>
                  <i className="ti ti-check" style={{ fontSize: 14 }} aria-hidden="true"></i>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 20px' }}>
          <p className="reveal" style={{ textAlign: 'center', margin: 0, fontSize: 12.5, fontWeight: 800, color: '#059669', letterSpacing: '.1em', textTransform: 'uppercase' }}>Testimonials</p>
          <h2 className="reveal" style={{ textAlign: 'center', margin: '10px 0 44px', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            What people are saying
          </h2>

          <div className="lp-testimonials" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="reveal il-card" style={{ padding: '26px 24px', background: '#fff', transitionDelay: `${i * 90}ms` }}>
                <i className="ti ti-quote" style={{ fontSize: 30, color: 'var(--border-strong)', display: 'block', marginBottom: 10 }} aria-hidden="true"></i>
                <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--text)', lineHeight: 1.75 }}>
                  {t.quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div className="il-avatar" style={{ width: 42, height: 42, fontSize: 16 }}>{t.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{t.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-tertiary)' }}>{t.role}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(s => (
                      <i key={s} className="ti ti-star-filled" style={{ fontSize: 13, color: s <= t.stars ? '#FACC15' : 'var(--border)' }} aria-hidden="true"></i>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ═════════════════════════════════════════════════════════════ */}
      <section id="faq" style={{ maxWidth: 780, margin: '0 auto', padding: '70px 20px' }}>
        <p className="reveal" style={{ textAlign: 'center', margin: 0, fontSize: 12.5, fontWeight: 800, color: '#059669', letterSpacing: '.1em', textTransform: 'uppercase' }}>FAQ</p>
        <h2 className="reveal" style={{ textAlign: 'center', margin: '10px 0 36px', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Frequently asked questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="reveal il-card" style={{ overflow: 'hidden', borderColor: isOpen ? '#10B981' : 'var(--border)', background: '#fff', transitionDelay: `${i * 40}ms` }}>
                <button onClick={() => setOpenFaq(isOpen ? null : i)} style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '17px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 12, textAlign: 'left', fontFamily: 'var(--font)',
                }}>
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: isOpen ? '#047857' : 'var(--text)' }}>{f.q}</span>
                  <span style={{
                    width: 27, height: 27, borderRadius: '50%', flexShrink: 0,
                    background: isOpen ? '#10B981' : 'var(--surface)',
                    border: isOpen ? 'none' : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .15s',
                  }}>
                    <i className={`ti ${isOpen ? 'ti-minus' : 'ti-plus'}`} style={{ fontSize: 14, color: isOpen ? '#fff' : 'var(--text-secondary)' }} aria-hidden="true"></i>
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 20px 17px' }}>
                    <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{f.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ CONTACT ═════════════════════════════════════════════════════════ */}
      <section id="contact" style={{ maxWidth: 1180, margin: '0 auto', padding: '10px 20px 76px' }}>
        <div className="reveal il-card" style={{ padding: 'clamp(28px, 4vw, 44px)', background: '#fff' }}>
          <div className="lp-contact" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
            <div>
              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: '#059669', letterSpacing: '.1em', textTransform: 'uppercase' }}>Contact us</p>
              <h2 style={{ margin: '10px 0 12px', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                Questions? We're here to help.
              </h2>
              <p style={{ margin: 0, fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 380 }}>
                Reach out on WhatsApp for the fastest response, or call during support hours.
                We reply to every message.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href={`https://wa.me/${SUPPORT.whatsapp}?text=Hi%2C%20I%20have%20a%20question%20about%20Instant%20Worker`}
                 target="_blank" rel="noopener noreferrer"
                 style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '15px 18px', borderRadius: 14, border: '1.5px solid #A7F3D0', background: '#ECFDF5', textDecoration: 'none' }}>
                <i className="ti ti-brand-whatsapp" style={{ fontSize: 24, color: '#059669' }} aria-hidden="true"></i>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>WhatsApp</p>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>{SUPPORT.phone} · Fastest response</p>
                </div>
                <i className="ti ti-arrow-up-right" style={{ fontSize: 18, color: '#059669' }} aria-hidden="true"></i>
              </a>

              <a href={`tel:${SUPPORT.phone.replace(/\s/g, '')}`}
                 style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '15px 18px', borderRadius: 14, border: '1.5px solid var(--border)', background: 'var(--surface)', textDecoration: 'none' }}>
                <i className="ti ti-phone" style={{ fontSize: 24, color: '#F97316' }} aria-hidden="true"></i>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Call us</p>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>{SUPPORT.hours}</p>
                </div>
              </a>

              <a href={`mailto:${SUPPORT.email}`}
                 style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '15px 18px', borderRadius: 14, border: '1.5px solid var(--border)', background: 'var(--surface)', textDecoration: 'none' }}>
                <i className="ti ti-mail" style={{ fontSize: 24, color: 'var(--text-secondary)' }} aria-hidden="true"></i>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Email</p>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{SUPPORT.email}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════════════ */}
      <section style={{ background: '#0B1220', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -120, left: '35%', width: 420, height: 420, borderRadius: '50%', background: 'rgba(16,185,129,.14)', filter: 'blur(90px)' }}></div>
        <div className="reveal" style={{ position: 'relative', maxWidth: 700, margin: '0 auto', padding: '68px 20px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Start today. It's free.
          </h2>
          <p style={{ margin: '0 0 30px', fontSize: 15.5, color: 'rgba(255,255,255,.7)' }}>
            Free registration · Zero commission · {SUPPORT.city}
          </p>
          <button onClick={() => navigate('/register')} className="il-btn il-btn-primary" style={{
            borderRadius: 999, padding: '17px 44px', fontSize: 16.5,
            boxShadow: '0 12px 34px rgba(16,185,129,.4)',
          }}>
            Join Instant Worker
            <i className="ti ti-arrow-right" style={{ fontSize: 19 }} aria-hidden="true"></i>
          </button>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer style={{ background: '#0B1220', borderTop: '1px solid rgba(255,255,255,.08)', padding: '46px 20px 30px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="lp-footer" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32, marginBottom: 36 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #059669, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-bolt" style={{ fontSize: 19, color: '#fff' }} aria-hidden="true"></i>
                </div>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>Instant<span style={{ color: '#10B981' }}>Worker</span></span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, maxWidth: 300 }}>
                Connecting daily-wage workers with the people who need them — instantly, fairly, with zero commission.
              </p>
            </div>

            <div>
              <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Explore</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {NAV_LINKS.map(l => (
                  <button key={l.href} onClick={() => scrollTo(l.href)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', fontFamily: 'var(--font)', color: 'rgba(255,255,255,.7)', fontSize: 13.5 }}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Legal & Account</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/register" style={{ color: 'rgba(255,255,255,.7)', fontSize: 13.5, textDecoration: 'none' }}>Register free</Link>
                <Link to="/login" style={{ color: 'rgba(255,255,255,.7)', fontSize: 13.5, textDecoration: 'none' }}>Login</Link>
                <Link to="/terms" style={{ color: 'rgba(255,255,255,.7)', fontSize: 13.5, textDecoration: 'none' }}>Terms & Conditions</Link>
                <Link to="/privacy" style={{ color: 'rgba(255,255,255,.7)', fontSize: 13.5, textDecoration: 'none' }}>Privacy Policy</Link>
              </div>
            </div>

            <div>
              <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>Contact</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                <a href={`https://wa.me/${SUPPORT.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.7)', fontSize: 13.5, textDecoration: 'none' }}>
                  WhatsApp: {SUPPORT.phone}
                </a>
                <a href={`mailto:${SUPPORT.email}`} style={{ color: 'rgba(255,255,255,.7)', fontSize: 13.5, textDecoration: 'none', wordBreak: 'break-all' }}>
                  {SUPPORT.email}
                </a>
                <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 13 }}>{SUPPORT.city}, India</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,.35)' }}>© 2026 Instant Worker. All rights reserved.</p>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Made with <span style={{ color: '#F97316' }}>♥</span> in Andhra Pradesh</p>
          </div>
        </div>
      </footer>

      {/* ══ FLOATING WHATSAPP ═══════════════════════════════════════════════ */}
      <a
        href={`https://wa.me/${SUPPORT.whatsapp}?text=Hi%2C%20I%20have%20a%20question%20about%20Instant%20Worker`}
        target="_blank" rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: 'fixed', bottom: 22, right: 22, zIndex: 60,
          width: 56, height: 56, borderRadius: '50%',
          background: '#10B981',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(16,185,129,.45)',
          transition: 'transform .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
        <i className="ti ti-brand-whatsapp" style={{ fontSize: 29, color: '#fff' }} aria-hidden="true"></i>
      </a>

      {/* ══ ANIMATIONS & RESPONSIVE ═════════════════════════════════════════ */}
      <style>{`
        html { scroll-behavior: smooth; }

        /* Entry animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: none; }
        }
        .fade-up { animation: fadeUp .8s cubic-bezier(.2,.7,.3,1) both; }
        .delay-1 { animation-delay: .15s; }
        .delay-2 { animation-delay: .3s; }

        /* Scroll-reveal */
        .reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s cubic-bezier(.2,.7,.3,1), transform .7s cubic-bezier(.2,.7,.3,1); }
        .reveal.in { opacity: 1; transform: none; }

        /* Floating cards */
        @keyframes floatA { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        @keyframes floatB { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        .float-a { animation: floatA 4.5s ease-in-out infinite; }
        .float-b { animation: floatB 5s ease-in-out infinite; }

        /* Skills marquee */
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee { animation: marquee 28s linear infinite; }
        .marquee:hover { animation-play-state: paused; }

        /* Responsive layout */
        @media (min-width: 900px) {
          .lp-nav-links    { display: flex !important; }
          .lp-hamburger    { display: none !important; }
          .lp-mobile-menu  { display: none !important; }
          .lp-hero         { grid-template-columns: 1.05fr 1fr !important; }
          .lp-services     { grid-template-columns: 1fr 1fr !important; }
          .lp-steps        { grid-template-columns: repeat(3, 1fr) !important; }
          .lp-features     { grid-template-columns: repeat(3, 1fr) !important; }
          .lp-testimonials { grid-template-columns: repeat(3, 1fr) !important; }
          .lp-about        { grid-template-columns: 1fr 1.05fr !important; }
          .lp-contact      { grid-template-columns: 1fr 1fr !important; }
          .lp-footer       { grid-template-columns: 1.4fr 1fr 1fr 1.3fr !important; }
        }
        @media (max-width: 899px) {
          .lp-login-btn { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fade-up, .reveal, .float-a, .float-b, .marquee { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}