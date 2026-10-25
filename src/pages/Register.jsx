import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useLang } from '../context/LangContext';
import { sendOtp as msgSend, verifyOtp as msgVerify, OTP_LENGTH } from '../utils/msg91';
import '../styles/theme.css';

// OTP: the browser asks MSG91 to send/verify the code directly (utils/msg91.js); our server then confirms
// the verified token and creates the account (/api/auth/register-msg91).

export default function Register() {
  const navigate = useNavigate();
  const { t, lang, setLang, languages } = useLang();

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

  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', password: '', skill: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [otpLen] = useState(OTP_LENGTH);
  const [reqId, setReqId] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [skills, setSkills] = useState([]);
  useEffect(() => {
    axios.get('/api/skills')
      .then(({ data }) => setSkills(data.skills || []))
      .catch(() => setSkills(['Labour','Painter','Carpenter','Electrician','Mechanic','Farmer','Driver','Plumber','Welder','Other']));
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const selectRole = (r) => { setRole(r); setStep(2); };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError(t('validPhoneErr'));
      return;
    }
    setSendingOtp(true);
    try {
      setReqId(await msgSend(form.phone.trim()));
      setOtp('');
      setResendIn(30);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendIn > 0) return;
    setError('');
    try {
      setReqId(await msgSend(form.phone.trim()));
      setOtp('');
      setResendIn(30);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not resend OTP');
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== otpLen) { setError(`Enter the ${otpLen}-digit OTP`); return; }
    setError('');
    setLoading(true);
    try {
      const accessToken = await msgVerify(reqId, otp.trim());
      const { data } = await axios.post('/api/auth/register-msg91', {
        name: form.name,
        password: form.password,
        role,
        skill: role === 'worker' ? form.skill : undefined,
        accessToken,
      });
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || err.message || t('couldNotComplete'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: 'var(--font)', padding: 20, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <LangSwitcher />
      </div>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 26 }}>
          <img
            src="https://res.cloudinary.com/dxdjlyq72/image/upload/v1786430441/InstantWorker_Logo_pljqcg.png"
            alt="InstantWorker"
            style={{ height: 56, width: 'auto', display: 'block' }}
          />
        </button>

        {step === 1 && (
          <>
            <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{t('createAccountTitle')}</h1>
            <p style={{ margin: '0 0 22px', fontSize: 14, color: 'var(--text-secondary)' }}>{t('howWillYouUse')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => selectRole('worker')} className="il-card il-card-pad" style={{ cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-hammer" style={{ fontSize: 23, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
                </div>
                <div><p style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>{t('iWantToWork')}</p><p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-tertiary)' }}>{t('findJobsNearYou')}</p></div>
              </button>
              <button onClick={() => selectRole('user')} className="il-card il-card-pad" style={{ cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-user-search" style={{ fontSize: 23, color: 'var(--secondary-dark)' }} aria-hidden="true"></i>
                </div>
                <div><p style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>{t('iNeedWorkers')}</p><p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-tertiary)' }}>{t('postJobsAndHire')}</p></div>
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
              <i className="ti ti-arrow-left" aria-hidden="true"></i> {t('backBtn')}
            </button>
            <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{t('yourDetailsTitle')}</h1>
            <p style={{ margin: '0 0 22px', fontSize: 14, color: 'var(--text-secondary)' }}>{t('weWillVerifyNext')}</p>

            {error && (
              <div style={{ background: 'var(--danger-bg)', border: '1px solid #fecaca', borderRadius: 12, padding: '11px 15px', marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleDetailsSubmit}>
              <div className="il-field">
                <label className="il-label">{t('fullNameLabel')}</label>
                <input className="il-input" name="name" value={form.name} onChange={handleChange} required placeholder={t('yourNamePh')} />
              </div>
              <div className="il-field">
                <label className="il-label">{t('mobileNumberReg')}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', fontSize: 14, fontWeight: 700, color: 'var(--text-tertiary)' }}>+91</span>
                  <input className="il-input" name="phone" value={form.phone} onChange={handleChange} required
                    placeholder={t('tenDigitNumberReg')} inputMode="numeric" maxLength={10} style={{ paddingLeft: 52 }} />
                </div>
              </div>
              <div className="il-field">
                <label className="il-label">{t('passwordLabel')}</label>
                <input className="il-input" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} placeholder={t('atLeast6Chars')} />
              </div>
              {role === 'worker' && (
                <div className="il-field">
                  <label className="il-label">{t('yourMainSkill')}</label>
                  <select className="il-select" name="skill" value={form.skill} onChange={handleChange} required>
                    <option value="">{t('selectSkillPh')}</option>
                    {skills.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
              <button type="submit" disabled={sendingOtp} className="il-btn il-btn-primary il-btn-block" style={{ marginTop: 8, padding: 14 }}>
                {sendingOtp
                  ? <><span className="il-spinner"></span> Sending OTP...</>
                  : <>{t('continueToVerification')} <i className="ti ti-arrow-right" style={{ fontSize: 17 }} aria-hidden="true"></i></>}
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
              <i className="ti ti-arrow-left" aria-hidden="true"></i> {t('backBtn')}
            </button>
            <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Verify your number</h1>
            <p style={{ margin: '0 0 22px', fontSize: 14, color: 'var(--text-secondary)' }}>
              Enter the {otpLen}-digit code sent to +91 {form.phone}
            </p>

            {!!devOtp && (
              <div style={{ background: '#FEFCE8', border: '1px solid #FDE68A', borderRadius: 12, padding: '11px 15px', marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#A16207', fontWeight: 700, textAlign: 'center' }}>
                  Test mode — your OTP is: {devOtp}
                </p>
              </div>
            )}

            {error && (
              <div style={{ background: 'var(--danger-bg)', border: '1px solid #fecaca', borderRadius: 12, padding: '11px 15px', marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleVerifyAndRegister}>
              <div className="il-field">
                <input
                  className="il-input"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, otpLen))}
                  placeholder="000000"
                  inputMode="numeric"
                  maxLength={otpLen}
                  autoFocus
                  style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, letterSpacing: 8, padding: '16px 0' }}
                />
              </div>

              <button type="submit" disabled={loading} className="il-btn il-btn-primary il-btn-block" style={{ marginTop: 8, padding: 14 }}>
                {loading
                  ? <><span className="il-spinner"></span> {t('creatingAccount')}</>
                  : <>Verify & Create Account</>}
              </button>
            </form>

            <button
              onClick={handleResendOtp}
              disabled={resendIn > 0}
              style={{
                background: 'none', border: 'none', cursor: resendIn > 0 ? 'default' : 'pointer',
                color: resendIn > 0 ? 'var(--text-tertiary)' : 'var(--primary-dark)',
                fontWeight: 700, fontSize: 13, width: '100%', textAlign: 'center', marginTop: 16, padding: 8,
              }}
            >
              {resendIn > 0 ? `Resend OTP in ${resendIn}s` : 'Resend OTP'}
            </button>
          </>
        )}

        {step !== 3 && (
          <p style={{ textAlign: 'center', marginTop: 26, fontSize: 13, color: 'var(--text-tertiary)' }}>
            {t('alreadyHaveAccount')} <Link to="/login" className="il-link">{t('logInLink')}</Link>
          </p>
        )}
      </div>
    </div>
  );
}