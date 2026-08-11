import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import '../styles/theme.css';

const SUPPORT = {
  email:    'support247instantworker@gmail.com',
  phone:    '+91 93906 83569',
  whatsapp: '919390683569',
  hours:    'Mon–Sat, 9 AM – 7 PM IST',
  city:     'Andhra Pradesh & Telangana',
};

const IMG = {
  hero:    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80&auto=format&fit=crop',
  painter: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=700&q=80&auto=format&fit=crop',
  electric:'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&q=80&auto=format&fit=crop',
  plumber: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700&q=80&auto=format&fit=crop',
  team:    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80&auto=format&fit=crop',
};

// ⚠️ PLACEHOLDER CONTENT — replace with REAL quotes from pilot users before
// launch. Fake testimonials are misleading advertising (Consumer Protection
// Act 2019) and destroy trust if discovered.
// Names/roles/quotes are translated via t() below (testi1Name, testi1Quote, etc.)

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, lang, setLang, languages } = useLang();
  const [openFaq, setOpenFaq]     = useState(null);
  const [menuOpen, setMenuOpen]   = useState(false);

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

  const LangSwitcher = () => (
    <div style={{
      display: 'flex', gap: 3, padding: 3,
      background: 'var(--surface)', borderRadius: 999, border: '1px solid var(--border)', flexShrink: 0,
    }}>
      {languages.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.full}
          style={{
            padding: '6px 10px', border: 'none', borderRadius: 999, cursor: 'pointer',
            fontFamily: 'var(--font)', fontSize: 12.5, fontWeight: 800,
            background: lang === l.code ? '#059669' : 'transparent',
            color: lang === l.code ? '#fff' : 'var(--text-secondary)',
            transition: 'all .15s',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );

  const NAV_LINKS = [
    { label: t('navServices'), href: '#services' },
    { label: t('navHow'),      href: '#how' },
    { label: t('navAbout'),    href: '#about' },
    { label: t('navFaq'),      href: '#faq' },
    { label: t('navContact'),  href: '#contact' },
  ];

  const TESTIMONIALS = [
    { name: t('testi1Name'), role: t('testi1Role'), quote: t('testi1Quote'), stars: 5 },
    { name: t('testi2Name'), role: t('testi2Role'), quote: t('testi2Quote'), stars: 5 },
    { name: t('testi3Name'), role: t('testi3Role'), quote: t('testi3Quote'), stars: 4 },
  ];

  const FAQS = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
    { q: t('faq5Q'), a: t('faq5A') },
    { q: t('faq6Q'), a: t('faq6A') },
  ];

  const MARQUEE_SKILLS = [
    t('marqueePainters'), t('marqueeCarpenters'), t('marqueeElectricians'), t('marqueePlumbers'),
    t('marqueeDrivers'), t('marqueeWelders'), t('marqueeMechanics'), t('marqueeFarmLabour'),
    t('marqueeHelpers'), t('marqueeMasons'),
  ];

  return (
    <div className="il-page" style={{ background: '#fff', overflowX: 'hidden' }}>

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
           <img
  src="https://res.cloudinary.com/dxdjlyq72/image/upload/v1786430441/InstantWorker_Logo_pljqcg.png"
  alt="InstantWorker"
  style={{ height: 56, width: 'auto', display: 'block' }}
/>
            {/* <span style={{ fontSize: 18.5, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Instant<span style={{ color: '#059669' }}>Worker</span>
            </span> */}
          </div>

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

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 9, alignItems: 'center' }}>
            <span className="lp-lang-desktop" style={{ display: 'none' }}>
              <LangSwitcher />
            </span>
            <button onClick={() => navigate('/login')} className="lp-login-btn il-btn il-btn-outline il-btn-sm" style={{ borderRadius: 999, padding: '9px 20px' }}>
              {t('loginNav')}
            </button>
            <button onClick={() => navigate('/register')} className="il-btn il-btn-primary il-btn-sm" style={{ borderRadius: 999, padding: '9px 20px' }}>
              {t('getStarted')}
            </button>
            <button className="lp-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
              display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 10, width: 38, height: 38, cursor: 'pointer',
              alignItems: 'center', justifyContent: 'center', color: 'var(--text)', fontSize: 19,
            }}>
              <i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'}`} aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lp-mobile-menu" style={{ borderTop: '1px solid var(--border)', background: '#fff', padding: '10px 20px 16px' }}>
            <div style={{ padding: '10px 4px 14px' }}>
              <LangSwitcher />
            </div>
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
        <div style={{ position: 'absolute', top: -120, right: -140, width: 440, height: 440, borderRadius: '50%', background: 'rgba(16,185,129,.09)', filter: 'blur(70px)' }}></div>
        <div style={{ position: 'absolute', bottom: -100, left: -120, width: 380, height: 380, borderRadius: '50%', background: 'rgba(249,115,22,.08)', filter: 'blur(70px)' }}></div>

        <div className="lp-hero" style={{
          position: 'relative', maxWidth: 1180, margin: '0 auto',
          padding: '56px 20px 72px',
          display: 'grid', gridTemplateColumns: '1fr', gap: 44, alignItems: 'center',
        }}>
          <div className="fade-up">
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#ECFDF5', border: '1px solid #A7F3D0',
              color: '#047857', fontSize: 12.5, fontWeight: 700,
              padding: '7px 16px', borderRadius: 999, marginBottom: 22,
            }}>
              <i className="ti ti-sparkles" style={{ fontSize: 15 }} aria-hidden="true"></i>
              {t('heroTaglineCity', SUPPORT.city)}
            </span>

            <h1 style={{
              margin: 0, fontSize: 'clamp(34px, 5.5vw, 56px)', fontWeight: 800,
              color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-0.03em',
            }}>
              {t('heroH1a')}<br />
              <span style={{ color: '#059669' }}>{t('heroH1b')}</span><br />
              {t('heroH1c')}
            </h1>

            <p style={{ margin: '20px 0 0', maxWidth: 460, fontSize: 'clamp(15px, 2vw, 17.5px)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {t('heroSubP1')} <strong style={{ color: 'var(--text)' }}>{t('heroSubP2')}</strong>
            </p>

            <div style={{ display: 'flex', gap: 13, marginTop: 32, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')} className="il-btn il-btn-primary" style={{ borderRadius: 999, padding: '15px 30px', fontSize: 15.5 }}>
                <i className="ti ti-hammer" style={{ fontSize: 19 }} aria-hidden="true"></i>
                {t('heroBtnWork')}
              </button>
              <button onClick={() => navigate('/register')} className="il-btn il-btn-secondary" style={{ borderRadius: 999, padding: '15px 30px', fontSize: 15.5 }}>
                <i className="ti ti-user-search" style={{ fontSize: 19 }} aria-hidden="true"></i>
                {t('heroBtnHire')}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 26, marginTop: 36, flexWrap: 'wrap' }}>
              {[
                { num: '0%',   label: t('heroStatCommission') },
                { num: '2 min', label: t('heroStatRegister') },
                { num: '3',    label: t('heroStatLanguages') },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'var(--text)' }}>{s.num}</p>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-tertiary)', fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up delay-2" style={{ position: 'relative' }}>
            <div style={{ borderRadius: 26, overflow: 'hidden', boxShadow: '0 24px 60px rgba(17,24,39,.16)' }}>
              <img src={IMG.hero} alt="Skilled worker on the job"
                style={{ width: '100%', height: 'clamp(300px, 44vw, 460px)', objectFit: 'cover', display: 'block' }}
                onError={e => e.currentTarget.parentElement.style.display = 'none'} />
            </div>

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
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>{t('floatWorkerConfirmed')}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-tertiary)' }}>{t('floatArriving')}</p>
              </div>
            </div>

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
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>{t('floatRating')}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-tertiary)' }}>{t('floatVerifiedElectrician')}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)', overflow: 'hidden', padding: '14px 0' }}>
          <div className="marquee" style={{ display: 'flex', gap: 14, width: 'max-content' }}>
            {[...Array(2)].flatMap((_, r) =>
              MARQUEE_SKILLS.map(s => (
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

      {/* ══ SERVICES ════════════════════════════════════════════════════════ */}
      <section id="services" style={{ maxWidth: 1180, margin: '0 auto', padding: '76px 20px 30px' }}>
        <p className="reveal" style={{ textAlign: 'center', margin: 0, fontSize: 12.5, fontWeight: 800, color: '#059669', letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('servicesTag')}</p>
        <h2 className="reveal" style={{ textAlign: 'center', margin: '10px auto 14px', maxWidth: 620, fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {t('servicesH2')}
        </h2>
        <p className="reveal" style={{ textAlign: 'center', margin: '0 auto 48px', maxWidth: 540, fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {t('servicesSub')}
        </p>

        <div className="lp-services" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 22 }}>
          <div className="reveal il-card" style={{ overflow: 'hidden', background: '#fff' }}>
            <img src={IMG.painter} alt="Painter at work" style={{ width: '100%', height: 210, objectFit: 'cover', display: 'block' }}
              onError={e => e.currentTarget.style.display = 'none'} />
            <div style={{ padding: '26px 26px 28px' }}>
              <span className="il-badge" style={{ background: '#ECFDF5', color: '#047857', marginBottom: 12 }}>
                <i className="ti ti-hammer" style={{ fontSize: 13 }} aria-hidden="true"></i> {t('forWorkersBadge')}
              </span>
              <h3 style={{ margin: '10px 0 14px', fontSize: 21, fontWeight: 800, color: 'var(--text)' }}>{t('forWorkersTitle')}</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {[t('workerBullet1'), t('workerBullet2'), t('workerBullet3'), t('workerBullet4')].map(li => (
                  <li key={li} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <i className="ti ti-circle-check-filled" style={{ fontSize: 18, color: '#10B981', flexShrink: 0, marginTop: 1 }} aria-hidden="true"></i>
                    {li}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} className="il-btn il-btn-primary" style={{ marginTop: 22, borderRadius: 999 }}>
                {t('startFindingWork')}
                <i className="ti ti-arrow-right" style={{ fontSize: 17 }} aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <div className="reveal il-card" style={{ overflow: 'hidden', background: '#fff' }}>
            <img src={IMG.electric} alt="Electrician working" style={{ width: '100%', height: 210, objectFit: 'cover', display: 'block' }}
              onError={e => e.currentTarget.style.display = 'none'} />
            <div style={{ padding: '26px 26px 28px' }}>
              <span className="il-badge" style={{ background: '#FFF7ED', color: '#C2410C', marginBottom: 12 }}>
                <i className="ti ti-user-search" style={{ fontSize: 13 }} aria-hidden="true"></i> {t('forPostersBadge')}
              </span>
              <h3 style={{ margin: '10px 0 14px', fontSize: 21, fontWeight: 800, color: 'var(--text)' }}>{t('forPostersTitle')}</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {[t('posterBullet1'), t('posterBullet2'), t('posterBullet3'), t('posterBullet4')].map(li => (
                  <li key={li} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <i className="ti ti-circle-check-filled" style={{ fontSize: 18, color: '#F97316', flexShrink: 0, marginTop: 1 }} aria-hidden="true"></i>
                    {li}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} className="il-btn il-btn-secondary" style={{ marginTop: 22, borderRadius: 999 }}>
                {t('postFirstJob')}
                <i className="ti ti-arrow-right" style={{ fontSize: 17 }} aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════════════ */}
      <section id="how" style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 20px' }}>
        <p className="reveal" style={{ textAlign: 'center', margin: 0, fontSize: 12.5, fontWeight: 800, color: '#059669', letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('howTag')}</p>
        <h2 className="reveal" style={{ textAlign: 'center', margin: '10px 0 48px', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {t('howH2')}
        </h2>

        <div className="lp-steps" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
          {[
            { n: '01', icon: 'ti-user-plus',      title: t('step1Title'), desc: t('step1Desc') },
            { n: '02', icon: 'ti-search',         title: t('step2Title'), desc: t('step2Desc') },
            { n: '03', icon: 'ti-currency-rupee', title: t('step3Title'), desc: t('step3Desc') },
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
              { icon: 'ti-bolt',           title: t('featUrgentTitle'), desc: t('featUrgentDesc') },
              { icon: 'ti-map-pin',        title: t('featTrackTitle'),  desc: t('featTrackDesc') },
              { icon: 'ti-shield-check',   title: t('featIdTitle'),     desc: t('featIdDesc') },
              { icon: 'ti-message-circle', title: t('featChatTitle'),   desc: t('featChatDesc') },
              { icon: 'ti-percentage',     title: t('featZeroTitle'),   desc: t('featZeroDesc') },
              { icon: 'ti-language',       title: t('featLangTitle'),   desc: t('featLangDesc') },
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
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>{t('builtForFairness')}</p>
            </div>
          </div>

          <div className="reveal delay-1">
            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: '#059669', letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('aboutTag')}</p>
            <h2 style={{ margin: '10px 0 18px', fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {t('aboutH2')}
            </h2>
            <p style={{ margin: '0 0 14px', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {t('aboutP1')}
            </p>
            <p style={{ margin: '0 0 22px', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {t('aboutP2', SUPPORT.city)}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[t('chipNoMiddlemen'), t('chipZeroCommission'), t('chipLocalFirst')].map(chip => (
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
          <p className="reveal" style={{ textAlign: 'center', margin: 0, fontSize: 12.5, fontWeight: 800, color: '#059669', letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('testimonialsTag')}</p>
          <h2 className="reveal" style={{ textAlign: 'center', margin: '10px 0 44px', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {t('testimonialsH2')}
          </h2>

          <div className="lp-testimonials" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            {TESTIMONIALS.map((tst, i) => (
              <div key={tst.name} className="reveal il-card" style={{ padding: '26px 24px', background: '#fff', transitionDelay: `${i * 90}ms` }}>
                <i className="ti ti-quote" style={{ fontSize: 30, color: 'var(--border-strong)', display: 'block', marginBottom: 10 }} aria-hidden="true"></i>
                <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--text)', lineHeight: 1.75 }}>
                  {tst.quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div className="il-avatar" style={{ width: 42, height: 42, fontSize: 16 }}>{tst.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{tst.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-tertiary)' }}>{tst.role}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(s => (
                      <i key={s} className="ti ti-star-filled" style={{ fontSize: 13, color: s <= tst.stars ? '#FACC15' : 'var(--border)' }} aria-hidden="true"></i>
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
        <p className="reveal" style={{ textAlign: 'center', margin: 0, fontSize: 12.5, fontWeight: 800, color: '#059669', letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('lpFaqTag')}</p>
        <h2 className="reveal" style={{ textAlign: 'center', margin: '10px 0 36px', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {t('lpFaqH2')}
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
              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: '#059669', letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('contactTag')}</p>
              <h2 style={{ margin: '10px 0 12px', fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                {t('contactH2')}
              </h2>
              <p style={{ margin: 0, fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 380 }}>
                {t('contactSub')}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href={`https://wa.me/${SUPPORT.whatsapp}?text=Hi%2C%20I%20have%20a%20question%20about%20Instant%20Worker`}
                 target="_blank" rel="noopener noreferrer"
                 style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '15px 18px', borderRadius: 14, border: '1.5px solid #A7F3D0', background: '#ECFDF5', textDecoration: 'none' }}>
                <i className="ti ti-brand-whatsapp" style={{ fontSize: 24, color: '#059669' }} aria-hidden="true"></i>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{t('whatsappLabel')}</p>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>{SUPPORT.phone} · {t('whatsappSub')}</p>
                </div>
                <i className="ti ti-arrow-up-right" style={{ fontSize: 18, color: '#059669' }} aria-hidden="true"></i>
              </a>

              <a href={`tel:${SUPPORT.phone.replace(/\s/g, '')}`}
                 style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '15px 18px', borderRadius: 14, border: '1.5px solid var(--border)', background: 'var(--surface)', textDecoration: 'none' }}>
                <i className="ti ti-phone" style={{ fontSize: 24, color: '#F97316' }} aria-hidden="true"></i>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{t('callUsLabel')}</p>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>{SUPPORT.hours}</p>
                </div>
              </a>

              <a href={`mailto:${SUPPORT.email}`}
                 style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '15px 18px', borderRadius: 14, border: '1.5px solid var(--border)', background: 'var(--surface)', textDecoration: 'none' }}>
                <i className="ti ti-mail" style={{ fontSize: 24, color: 'var(--text-secondary)' }} aria-hidden="true"></i>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{t('emailLabel')}</p>
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
            {t('ctaH2')}
          </h2>
          <p style={{ margin: '0 0 30px', fontSize: 15.5, color: 'rgba(255,255,255,.7)' }}>
            {t('ctaSub', SUPPORT.city)}
          </p>
          <button onClick={() => navigate('/register')} className="il-btn il-btn-primary" style={{
            borderRadius: 999, padding: '17px 44px', fontSize: 16.5,
            boxShadow: '0 12px 34px rgba(16,185,129,.4)',
          }}>
            {t('joinInstantWorker')}
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
                <img
  src="https://res.cloudinary.com/dxdjlyq72/image/upload/v1786430441/InstantWorker_Logo_pljqcg.png"
  alt="InstantWorker"
  style={{ height: 56, width: 'auto', display: 'block' }}
/>
                {/* <span style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>Instant<span style={{ color: '#10B981' }}>Worker</span></span> */}
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.7, maxWidth: 300 }}>
                {t('footerTagline')}
              </p>
            </div>

            <div>
              <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{t('footerExplore')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {NAV_LINKS.map(l => (
                  <button key={l.href} onClick={() => scrollTo(l.href)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', fontFamily: 'var(--font)', color: 'rgba(255,255,255,.7)', fontSize: 13.5 }}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{t('footerLegalAccount')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/register" style={{ color: 'rgba(255,255,255,.7)', fontSize: 13.5, textDecoration: 'none' }}>{t('footerRegisterFree')}</Link>
                <Link to="/login" style={{ color: 'rgba(255,255,255,.7)', fontSize: 13.5, textDecoration: 'none' }}>{t('footerLogin')}</Link>
                <Link to="/terms" style={{ color: 'rgba(255,255,255,.7)', fontSize: 13.5, textDecoration: 'none' }}>{t('footerTerms')}</Link>
                <Link to="/privacy" style={{ color: 'rgba(255,255,255,.7)', fontSize: 13.5, textDecoration: 'none' }}>{t('footerPrivacy')}</Link>
              </div>
            </div>

            <div>
              <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{t('footerContact')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                <a href={`https://wa.me/${SUPPORT.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.7)', fontSize: 13.5, textDecoration: 'none' }}>
                  {t('footerWhatsappPrefix')} {SUPPORT.phone}
                </a>
                <a href={`mailto:${SUPPORT.email}`} style={{ color: 'rgba(255,255,255,.7)', fontSize: 13.5, textDecoration: 'none', wordBreak: 'break-all' }}>
                  {SUPPORT.email}
                </a>
                <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 13 }}>{SUPPORT.city}, India</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,.35)' }}>{t('footerRights')}</p>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,.35)' }}>{t('footerMadeWith')} <span style={{ color: '#F97316' }}>♥</span> {t('footerMadeIn')}</p>
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

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: none; }
        }
        .fade-up { animation: fadeUp .8s cubic-bezier(.2,.7,.3,1) both; }
        .delay-1 { animation-delay: .15s; }
        .delay-2 { animation-delay: .3s; }

        .reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s cubic-bezier(.2,.7,.3,1), transform .7s cubic-bezier(.2,.7,.3,1); }
        .reveal.in { opacity: 1; transform: none; }

        @keyframes floatA { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        @keyframes floatB { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        .float-a { animation: floatA 4.5s ease-in-out infinite; }
        .float-b { animation: floatB 5s ease-in-out infinite; }

        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee { animation: marquee 28s linear infinite; }
        .marquee:hover { animation-play-state: paused; }

        @media (min-width: 900px) {
          .lp-nav-links    { display: flex !important; }
          .lp-hamburger    { display: none !important; }
          .lp-mobile-menu  { display: none !important; }
          .lp-lang-desktop { display: inline-flex !important; }
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