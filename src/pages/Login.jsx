import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/theme.css';

const BRAND_IMG = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80&auto=format&fit=crop';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('expired') === '1';

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
      setError(err.response?.data?.message || 'Wrong phone number or password');
    } finally { setLoading(false); }
  };

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
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #047857, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(16,185,129,.4)' }}>
              <i className="ti ti-bolt" style={{ fontSize: 22, color: '#fff' }} aria-hidden="true"></i>
            </div>
            <span style={{ fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Instant<span style={{ color: '#34D399' }}>Worker</span>
            </span>
          </button>

          {/* Value copy */}
          <div style={{ animation: 'authFadeUp .8s ease both' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.02em', maxWidth: 420 }}>
              Skilled work,<br />just a tap away.
            </h2>
            <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,.75)', lineHeight: 1.7, maxWidth: 380 }}>
              Find work or hire verified workers in minutes — with zero commission, live tracking, and support in your language.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 30 }}>
              {['100% free for workers — no commission ever', 'ID-verified profiles with real ratings', 'Live tracking, like following a cab'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(16,185,129,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="ti ti-check" style={{ fontSize: 14, color: '#34D399' }} aria-hidden="true"></i>
                  </div>
                  <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,.85)', fontWeight: 600 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,.45)' }}>
            © 2026 Instant Worker · Andhra Pradesh & Telangana
          </p>
        </div>
      </div>

      {/* ══ RIGHT — form ══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', position: 'relative' }}>

        {/* Mobile logo */}
        <button onClick={() => navigate('/')} className="auth-mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 30 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #047857, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(16,185,129,.35)' }}>
            <i className="ti ti-bolt" style={{ fontSize: 23, color: '#fff' }} aria-hidden="true"></i>
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Instant<span style={{ color: '#059669' }}>Worker</span>
          </span>
        </button>

        <div style={{ width: '100%', maxWidth: 400, animation: 'authFadeUp .6s ease both' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Welcome back
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: 'var(--text-secondary)' }}>
            Log in to continue to your account
          </p>

          {sessionExpired && !error && (
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '11px 15px', marginBottom: 18 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#92400E' }}>
                <i className="ti ti-clock-exclamation" style={{ marginRight: 6, verticalAlign: -2 }} aria-hidden="true"></i>
                Your session expired. Please log in again.
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
              <label className="il-label">Mobile number</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', fontSize: 14, fontWeight: 700, color: 'var(--text-tertiary)' }}>+91</span>
                <input className="il-input" name="phone" value={form.phone} onChange={handleChange} required
                  placeholder="10-digit number" autoComplete="tel" inputMode="numeric" maxLength={10}
                  style={{ paddingLeft: 52 }} />
              </div>
            </div>

            <div className="il-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="il-label" style={{ marginBottom: 0 }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <input className="il-input" name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} required
                  placeholder="Your password" autoComplete="current-password" style={{ paddingRight: 46 }} />
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
                ? <><span className="il-spinner"></span> Logging in...</>
                : <>Log in <i className="ti ti-arrow-right" style={{ fontSize: 18 }} aria-hidden="true"></i></>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '26px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>New here?</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
          </div>

          <Link to="/register" className="il-btn il-btn-outline il-btn-block" style={{ padding: 14, borderRadius: 14, textDecoration: 'none' }}>
            Create a free account
          </Link>

          <p style={{ textAlign: 'center', marginTop: 26, fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
            By logging in you agree to our{' '}
            <Link to="/terms" className="il-link" style={{ fontSize: 12 }}>Terms</Link> and{' '}
            <Link to="/privacy" className="il-link" style={{ fontSize: 12 }}>Privacy Policy</Link>
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