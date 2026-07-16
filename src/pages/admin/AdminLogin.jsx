import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAxios } from './AdminLayout';
import { T, inputStyle, labelStyle } from './adminTheme';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await adminAxios.post('/api/admin/login', form);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: T.bg, position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.font, padding: 20,
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: T.accentBg, filter: 'blur(120px)', pointerEvents: 'none' }}></div>

      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>

        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 17,
            background: `linear-gradient(135deg, ${T.accentDark}, ${T.accent})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: `0 10px 30px ${T.accentBg}`,
          }}>
            <i className="ti ti-shield-lock" style={{ fontSize: 30, color: '#fff' }} aria-hidden="true"></i>
          </div>
          <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Instant Worker Admin</h1>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: T.textTertiary }}>Restricted access — admins only</p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: T.surface, borderRadius: T.radiusLg, padding: 26,
          border: `1px solid ${T.border}`, boxShadow: T.shadowMd,
        }}>

          {error && (
            <div style={{ background: T.dangerBg, border: '1px solid rgba(239,68,68,.3)', borderRadius: T.radiusSm, padding: '11px 14px', marginBottom: 18, display: 'flex', gap: 8 }}>
              <i className="ti ti-alert-circle" style={{ fontSize: 16, color: '#FCA5A5', flexShrink: 0, marginTop: 1 }} aria-hidden="true"></i>
              <p style={{ margin: 0, fontSize: 13, color: '#FCA5A5' }}>{error}</p>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Phone number</label>
            <input
              type="text" value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              required placeholder="Admin phone number"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required placeholder="Admin password"
                style={{ ...inputStyle, paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: T.textTertiary, padding: 6,
              }}>
                <i className={`ti ${showPass ? 'ti-eye-off' : 'ti-eye'}`} style={{ fontSize: 17 }} aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 14, borderRadius: T.radiusSm, border: 'none',
            background: loading ? T.accentDark : `linear-gradient(135deg, ${T.accentDark}, ${T.accent})`,
            color: '#fff', fontSize: 14.5, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: T.font,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: loading ? 'none' : `0 8px 22px ${T.accentBg}`,
          }}>
            {loading ? (
              <>
                <span style={{ width: 15, height: 15, borderRadius: '50%', border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', animation: 'admin-spin .7s linear infinite' }}></span>
                Signing in...
              </>
            ) : (
              <><i className="ti ti-login" style={{ fontSize: 18 }} aria-hidden="true"></i> Sign in to admin panel</>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 11.5, color: T.textTertiary, marginTop: 22 }}>
          <i className="ti ti-lock" style={{ marginRight: 5, verticalAlign: -2, fontSize: 13 }} aria-hidden="true"></i>
          This is a restricted area. Unauthorized access attempts are logged.
        </p>
      </div>

      <style>{`@keyframes admin-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
