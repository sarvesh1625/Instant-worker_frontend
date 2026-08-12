import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import '../styles/theme.css';

const BRAND_IMG = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80&auto=format&fit=crop';

export default function Login() {
  const { login } = useAuth();
  const { t, lang, setLang, languages } = useLang();
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('expired') === '1';

  const LangSwitcher = () => (
    <div style={{
      display: 'flex', gap: 3, padding: 3,
      background: 'var(--surface)', borderRadius: 999, border: '1px solid var(--border)',
    }}>
      {languages.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.full}
          style={{
            padding: '6px 10px', border: 'none', borderRadius: 999, cursor: 'pointer',
            fontFamily: 'var(--font)', fontSize: 12.5, fontWeight: 800,
            background: lang === l.code ? 'var(--primary)' : 'transparent',
            color: lang === l.code ? '#fff' : 'var(--text-secondary)',
            transition: 'all .15s',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );

  const [form, setForm]         = useState({ phone: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.phone, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t('wrongCredentials'));
    } finally { setLoading(false); }
  };

  const bullets = [t('loginBullet1'), t('loginBullet2'), t('loginBullet3')];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font)', background: '#fff' }}>

      {/* ══ LEFT — brand panel (desktop only) ══ */}
      <div className="auth-brand" style={{
        display: 'none', flex: 1, position: 'relative', overflow: 'hidden',
        background: '#0B1220',
      }}>
        <img src={BRAND_IMG} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: .35,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(11,18,32,.75), rgba(4,120,87,.55))' }}></div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '46px 48px' }}>
          {/* Logo */}
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: 'fit-content' }}>
          <img
   src="https://res.cloudinary.com/dxdjlyq72/image/upload/v1786430441/InstantWorker_Logo_pljqcg.png"
  alt="InstantWorker"
  style={{ height: 40, width: 'auto', display: 'block' }}
/>
            {/* <span style={{ fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Instant<span style={{ color: '#34D399' }}>Worker</span>
            </span> */}
          </button>

          {/* Value copy */}
          <div style={{ animation: 'authFadeUp .8s ease both' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.02em', maxWidth: 420 }}>
              {t('loginTagline1')}<br />{t('loginTagline2')}
            </h2>
            <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,.75)', lineHeight: 1.7, maxWidth: 380 }}>
              {t('loginValueCopy')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 30 }}>
              {bullets.map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(16,185,129,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="ti ti-check" style={{ fontSize: 14, color: '#34D399' }} aria-hidden="true"></i>
                  </div>
                  <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,.85)', fontWeight: 600 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,.45)' }}>
            {t('footerCopyright')}
          </p>
        </div>
      </div>

      {/* ══ RIGHT — form ══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'center', padding: '32px 20px', position: 'relative' }}>

        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <LangSwitcher />
        </div>

        {/* Mobile logo */}
        <button onClick={() => navigate('/')} className="auth-mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 30 }}>
         <img
  src="https://res.cloudinary.com/dxdjlyq72/image/upload/v1786430441/InstantWorker_Logo_pljqcg.png"
  alt="InstantWorker"
  style={{ height: 56, width: 'auto', display: 'block' }}
/>
          {/* <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Instant<span style={{ color: '#059669' }}>Worker</span>
          </span> */}
        </button>

        <div style={{ width: '100%', maxWidth: 400, animation: 'authFadeUp .6s ease both' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {t('welcomeBackTitle')}
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: 'var(--text-secondary)' }}>
            {t('loginSubtitle')}
          </p>

          {sessionExpired && !error && (
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '11px 15px', marginBottom: 18 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#92400E' }}>
                <i className="ti ti-clock-exclamation" style={{ marginRight: 6, verticalAlign: -2 }} aria-hidden="true"></i>
                {t('sessionExpiredMsg')}
              </p>
            </div>
          )}

          {error && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid #FECACA', borderRadius: 12, padding: '11px 15px', marginBottom: 18, animation: 'authShake .4s ease' }}>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>
                <i className="ti ti-alert-circle" style={{ marginRight: 6, verticalAlign: -2 }} aria-hidden="true"></i>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="il-field">
              <label className="il-label">{t('mobileNumberField')}</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', fontSize: 14, fontWeight: 700, color: 'var(--text-tertiary)' }}>+91</span>
                <input className="il-input" name="phone" value={form.phone} onChange={handleChange} required
                  placeholder={t('tenDigitNumber')} autoComplete="tel" inputMode="numeric" maxLength={10}
                  style={{ paddingLeft: 52 }} />
              </div>
            </div>

            <div className="il-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="il-label" style={{ marginBottom: 0 }}>{t('passwordField')}</label>
              </div>
              <div style={{ position: 'relative' }}>
                <input className="il-input" name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} required
                  placeholder={t('yourPasswordPh')} autoComplete="current-password" style={{ paddingRight: 46 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} aria-label={showPass ? 'Hide password' : 'Show password'} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 6,
                }}>
                  <i className={`ti ${showPass ? 'ti-eye-off' : 'ti-eye'}`} style={{ fontSize: 19 }} aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="il-btn il-btn-primary il-btn-block" style={{ marginTop: 8, padding: 15, fontSize: 15.5, borderRadius: 14 }}>
              {loading
                ? <><span className="il-spinner"></span> {t('loggingInBtn')}</>
                : <>{t('logInBtn')} <i className="ti ti-arrow-right" style={{ fontSize: 18 }} aria-hidden="true"></i></>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '26px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>{t('newHere')}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
          </div>

          <Link to="/register" className="il-btn il-btn-outline il-btn-block" style={{ padding: 14, borderRadius: 14, textDecoration: 'none' }}>
            {t('createFreeAccount')}
          </Link>

          <p style={{ textAlign: 'center', marginTop: 26, fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
            {t('byLoggingIn')}{' '}
            <Link to="/terms" className="il-link" style={{ fontSize: 12 }}>{t('termsLink')}</Link>{' '}
            {t('andWord')}{' '}
            <Link to="/privacy" className="il-link" style={{ fontSize: 12 }}>{t('privacyLink')}</Link>
            {t('agreeSuffix') ? ` ${t('agreeSuffix')}` : ''}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes authFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes authShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @media (min-width: 900px) {
          .auth-brand { display: block !important; }
          .auth-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}