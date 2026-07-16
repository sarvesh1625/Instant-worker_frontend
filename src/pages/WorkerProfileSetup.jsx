import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import AppShell from '../components/AppShell';
import CameraCapture from '../components/CameraCapture';
import '../styles/theme.css';

const SKILLS = ['Labour','Painter','Carpenter','Electrician','Mechanic','Farmer','Driver','Plumber','Welder','Other'];
const CITIES = ['Hyderabad','Visakhapatnam','Vijayawada','Warangal','Tirupati','Bengaluru','Chennai','Mumbai','Delhi','Pune'];

export default function WorkerProfileSetup() {
  const { user } = useAuth();
  const { t }    = useLang();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    skill: '', experience: '', city: '', area: '',
    wage: '', description: '', availability: true, languages: '',
  });
  const [profilePhoto, setProfilePhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Loads from GET /api/workers/profile/me — shape defined by workerController
    axios.get('/api/workers/profile/me')
      .then(({ data }) => {
        const p = data.profile || {};
        setForm({
          skill:        p.skill || '',
          experience:   p.experience || '',
          city:         p.location?.city || '',
          area:         p.location?.area || '',
          wage:         p.wage?.amount || '',
          description:  p.description || '',
          availability: p.availability ?? true,
          languages:    (p.languages || []).join(', '),
        });
        if (p.profilePhoto) setProfilePhoto(p.profilePhoto);
      })
      .catch(err => console.error('Profile load:', err))
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      // POST /api/workers/profile — field names must match workerController
      await axios.post('/api/workers/profile', {
        skill:        form.skill,
        experience:   Number(form.experience) || 0,
        city:         form.city,
        area:         form.area,
        wage:         Number(form.wage) || 0,
        description:  form.description,
        availability: form.availability,
        languages:    form.languages,
      });
      setSuccess('Profile saved successfully!');
      setTimeout(() => navigate('/dashboard'), 1400);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally { setLoading(false); }
  };

  if (fetching) return (
    <AppShell>
      <p className="il-muted" style={{ textAlign: 'center', padding: '60px 0', fontSize: 14 }}>Loading profile...</p>
    </AppShell>
  );

  return (
    <AppShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '22px 18px 30px' }}>

        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {t('myProfile')}
        </h1>
        <p style={{ margin: '0 0 22px', fontSize: 13.5, color: 'var(--text-secondary)' }}>
          Aapki profile — a complete profile gets you more work
        </p>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid #fecaca', borderRadius: 12, padding: '11px 15px', marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>{error}</p>
          </div>
        )}
        {success && (
          <div style={{ background: 'var(--primary-light)', border: '1px solid #A7F3D0', borderRadius: 12, padding: '11px 15px', marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#065F46', fontWeight: 600 }}>
              <i className="ti ti-circle-check" style={{ marginRight: 6, verticalAlign: -2 }} aria-hidden="true"></i>{success}
            </p>
          </div>
        )}

        {/* ── Photo ── */}
        <div className="il-card il-card-pad" style={{ marginBottom: 16, textAlign: 'center' }}>
          <p style={{ margin: '0 0 16px', fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>
            <i className="ti ti-camera" style={{ marginRight: 7, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
            Apni photo lo — Your photo
          </p>
          <CameraCapture currentPhoto={profilePhoto} onUpload={(url) => setProfilePhoto(url)} userId={user?._id} />
          <p style={{ margin: '12px 0 0', fontSize: 11.5, color: 'var(--text-tertiary)' }}>
            Workers with a photo get hired more often
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Work details ── */}
          <div className="il-card il-card-pad" style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Work details</p>

            <div className="il-field">
              <label className="il-label">{t('yourSkill')} <span className="il-required">*</span></label>
              <select className="il-select" name="skill" value={form.skill} onChange={handleChange} required>
                <option value="">{t('select')}</option>
                {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="il-grid-2">
              <div className="il-field">
                <label className="il-label">{t('experience')}</label>
                <input className="il-input" name="experience" type="number" min="0" max="60"
                  value={form.experience} onChange={handleChange} placeholder="e.g. 3" />
              </div>
              <div className="il-field">
                <label className="il-label">{t('dailyWage')} <span className="il-required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, fontWeight: 700, color: 'var(--text-tertiary)' }}>₹</span>
                  <input className="il-input" name="wage" type="number" min="0" value={form.wage} onChange={handleChange}
                    required placeholder="800" style={{ paddingLeft: 32 }} />
                </div>
              </div>
            </div>

            {/* Availability toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: form.availability ? 'var(--primary-light)' : 'var(--surface)',
              border: `1.5px solid ${form.availability ? '#A7F3D0' : 'var(--border)'}`,
              borderRadius: 14, padding: '14px 16px', marginTop: 4,
              transition: 'all .15s',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                background: form.availability ? 'var(--primary)' : 'var(--border-strong)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={`ti ${form.availability ? 'ti-briefcase' : 'ti-briefcase-off'}`} style={{ fontSize: 20, color: '#fff' }} aria-hidden="true"></i>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{t('available')}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--text-secondary)' }}>
                  {form.availability ? 'You will receive job alerts' : 'You will not get new job alerts'}
                </p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 27, flexShrink: 0, cursor: 'pointer' }}>
                <input type="checkbox" name="availability" checked={form.availability} onChange={handleChange}
                  style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: 27,
                  background: form.availability ? 'var(--primary)' : 'var(--border-strong)',
                  transition: 'background .2s',
                }}>
                  <span style={{
                    position: 'absolute', top: 3, left: form.availability ? 24 : 3,
                    width: 21, height: 21, borderRadius: '50%', background: '#fff',
                    transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                  }}></span>
                </span>
              </label>
            </div>
          </div>

          {/* ── Location ── */}
          <div className="il-card il-card-pad" style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Where do you work?</p>
            <div className="il-grid-2">
              <div className="il-field">
                <label className="il-label">{t('city')} <span className="il-required">*</span></label>
                <select className="il-select" name="city" value={form.city} onChange={handleChange} required>
                  <option value="">{t('select')}</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="il-field" style={{ marginBottom: 0 }}>
                <label className="il-label">{t('area')}</label>
                <input className="il-input" name="area" value={form.area} onChange={handleChange} placeholder="e.g. Kukatpally" />
              </div>
            </div>
          </div>

          {/* ── About ── */}
          <div className="il-card il-card-pad" style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>About you</p>

            <div className="il-field">
              <label className="il-label">{t('aboutYou')}</label>
              <textarea className="il-textarea" name="description" value={form.description} onChange={handleChange}
                rows={3} maxLength={300} placeholder="Describe your work experience, what you are good at..." />
              <p style={{ margin: '5px 0 0', fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'right' }}>
                {form.description.length}/300
              </p>
            </div>

            <div className="il-field" style={{ marginBottom: 0 }}>
              <label className="il-label">{t('languages')}</label>
              <input className="il-input" name="languages" value={form.languages} onChange={handleChange}
                placeholder="e.g. Telugu, Hindi, English" />
              <p style={{ margin: '5px 0 0', fontSize: 11, color: 'var(--text-tertiary)' }}>
                Separate with commas
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => navigate('/dashboard')} className="il-btn il-btn-outline" style={{ flex: 1 }}>
              {t('cancel')}
            </button>
            <button type="submit" disabled={loading} className="il-btn il-btn-primary" style={{ flex: 2, padding: 14, fontSize: 15 }}>
              {loading
                ? <><span className="il-spinner"></span> Saving...</>
                : <><i className="ti ti-check" style={{ fontSize: 18 }} aria-hidden="true"></i> {t('saveProfile')}</>}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}