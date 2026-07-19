import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import AppShell from '../components/AppShell';
import '../styles/theme.css';

const SKILLS = ['Labour','Painter','Carpenter','Electrician','Mechanic','Farmer','Driver','Plumber','Welder','Other'];

export default function Portfolio() {
  const { workerId } = useParams();
  const { user }     = useAuth();
  const { t }        = useLang();
  const navigate     = useNavigate();

  const isMyPortfolio = !workerId || workerId === user?._id;
  const targetId      = workerId || user?._id;

  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ title: '', description: '', skill: '', images: [] });
  const [previews, setPreviews]   = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');

  const load = async () => {
    try {
      const url = isMyPortfolio ? '/api/portfolio/my' : `/api/portfolio/${targetId}`;
      const { data } = await axios.get(url);
      setItems(data.items || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [targetId]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setForm(f => ({ ...f, images: files }));
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setUploading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('skill', form.skill);
      form.images.forEach(img => fd.append('images', img));
      await axios.post('/api/portfolio', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowForm(false);
      setForm({ title: '', description: '', skill: '', images: [] });
      setPreviews([]);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this portfolio item?')) return;
    try {
      await axios.delete(`/api/portfolio/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) { alert('Failed to delete'); }
  };

  const content = (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMyPortfolio ? '22px 18px 30px' : '20px 18px 60px' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {!isMyPortfolio && (
          <button onClick={() => navigate(-1)} className="il-back-btn" style={{ color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <i className="ti ti-arrow-left" aria-hidden="true"></i>
          </button>
        )}
        <div style={{ flex: 1, minWidth: 150 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {isMyPortfolio ? t('myPortfolio') : t('portfolio')}
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>
            {t('portfolioTagline')}
          </p>
        </div>
        {isMyPortfolio && (
          <button onClick={() => setShowForm(!showForm)} className="il-btn il-btn-primary">
            <i className="ti ti-plus" style={{ fontSize: 17 }} aria-hidden="true"></i>
            {t('addWork')}
          </button>
        )}
      </div>

      {showForm && isMyPortfolio && (
        <div className="il-card il-card-pad" style={{ marginBottom: 20 }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 15.5, fontWeight: 800, color: 'var(--text)' }}>{t('addPastWork')}</h2>
          {error && <p style={{ background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: 13, padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="il-field">
              <label className="il-label">{t('title')}</label>
              <input className="il-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g. Painted 3BHK flat in Madhapur" />
            </div>
            <div className="il-grid-2">
              <div className="il-field">
                <label className="il-label">{t('skillUsed')}</label>
                <select className="il-select" value={form.skill} onChange={e => setForm({...form, skill: e.target.value})} required>
                  <option value="">{t('select')}</option>
                  {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="il-field">
                <label className="il-label">{t('photosMax')}</label>
                <input type="file" accept="image/*" multiple onChange={handleImages} className="il-input" style={{ padding: '9px 10px' }} />
              </div>
            </div>
            <div className="il-field">
              <label className="il-label">{t('description')}</label>
              <textarea className="il-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} placeholder={t('describeWork')} />
            </div>
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {previews.map((p, i) => <img key={i} src={p} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover' }} alt="" />)}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setShowForm(false)} className="il-btn il-btn-outline">{t('cancel')}</button>
              <button type="submit" disabled={uploading} className="il-btn il-btn-primary" style={{ flex: 1 }}>{uploading ? t('loading') : t('save')}</button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="il-muted" style={{ textAlign: 'center', padding: '40px 0', fontSize: 13.5 }}>{t('loading')}</p>}

      {!loading && items.length === 0 && (
        <div className="il-empty">
          <i className="ti ti-photo-off" aria-hidden="true"></i>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{t('noPortfolio')}</p>
          {isMyPortfolio && <p style={{ fontSize: 12.5, marginTop: 5 }}>{t('noPortfolioSub')}</p>}
        </div>
      )}

      <div className="portfolio-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
        {items.map(item => (
          <div key={item._id} className="il-card" style={{ overflow: 'hidden' }}>
            {item.images?.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: item.images.length === 1 ? '1fr' : '1fr 1fr', gap: 2 }}>
                {item.images.slice(0, 4).map((img, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={img.url} alt={item.title} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                    {i === 3 && item.images.length > 4 && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>+{item.images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--text)', fontSize: 14.5 }}>{item.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <span className="il-badge" style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)' }}>{item.skill}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>
                      {new Date(item.completedAt || item.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                {isMyPortfolio && (
                  <button onClick={() => handleDelete(item._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: 13, cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>{t('delete')}</button>
                )}
              </div>
              {item.description && <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item.description}</p>}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .portfolio-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );

  if (isMyPortfolio) {
    return <AppShell>{content}</AppShell>;
  }
  return <div className="il-page">{content}</div>;
}