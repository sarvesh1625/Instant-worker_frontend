import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLang } from '../context/LangContext';
import '../styles/theme.css';

const ID_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'voter',   label: 'Voter ID' },
  { value: 'pan',     label: 'PAN Card' },
  { value: 'driving', label: 'Driving Licence' },
];

export default function Verification() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [idType, setIdType]       = useState('');
  const [idNumber, setIdNumber]   = useState('');
  const [docFile, setDocFile]     = useState(null);
  const [docPreview, setDocPreview] = useState('');
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  const STATUS_CONFIG = {
    not_submitted: { bg: '#F5F6FA', color: '#5B6472', icon: 'ti-id-badge',      title: t('notVerifiedYet') },
    pending:       { bg: '#FFF6E8', color: '#B45309', icon: 'ti-clock',        title: t('underReview') },
    approved:      { bg: '#E9FBF1', color: '#12B76A', icon: 'ti-shield-check', title: t('verifiedStatus') },
    rejected:      { bg: '#FEEDEC', color: '#F04438', icon: 'ti-shield-x',     title: t('verificationRejected') },
  };

  const load = async () => {
    try {
      const { data } = await axios.get('/api/verification/status');
      setStatus(data.verification);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleDocChange = (e) => {
    const file = e.target.files[0];
    if (file) { setDocFile(file); setDocPreview(URL.createObjectURL(file)); }
  };
  const handleSelfieChange = (e) => {
    const file = e.target.files[0];
    if (file) { setSelfieFile(file); setSelfiePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docFile) { setError('Please upload a photo of your ID document'); return; }
    if (!idType)  { setError('Please select your ID type'); return; }
    setError(''); setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('idType', idType);
      fd.append('idNumber', idNumber);
      fd.append('documentPhoto', docFile);
      if (selfieFile) fd.append('selfiePhoto', selfieFile);
      await axios.post('/api/verification/submit', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="il-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p className="il-muted" style={{ fontSize: 14 }}>{t('loading')}</p>
    </div>
  );

  const cfg = STATUS_CONFIG[status?.status] || STATUS_CONFIG.not_submitted;
  const uploadBox = (preview, onChange, accept, icon, label, sub) => (
    <label style={{
      display: 'block', border: `2px dashed ${preview ? 'var(--primary)' : 'var(--border-strong)'}`,
      borderRadius: 12, padding: preview ? 0 : 26, textAlign: 'center', cursor: 'pointer',
      marginBottom: 18, overflow: 'hidden', transition: 'border-color .15s',
    }}>
      <input type="file" accept="image/*" {...accept} onChange={onChange} style={{ display: 'none' }} />
      {preview ? (
        <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'contain', background: 'var(--bg)' }} />
      ) : (
        <>
          <i className={`ti ${icon}`} style={{ fontSize: 34, color: 'var(--text-tertiary)', display: 'block', marginBottom: 10 }} aria-hidden="true"></i>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text)', fontWeight: 600 }}>{label}</p>
          {sub && <p style={{ margin: '4px 0 0', fontSize: 11.5, color: 'var(--text-tertiary)' }}>{sub}</p>}
        </>
      )}
    </label>
  );

  return (
    <div className="il-page">
      <div className="il-topbar il-topbar-brand">
        <div className="il-topbar-inner" style={{ maxWidth: 600 }}>
          <button onClick={() => navigate(-1)} className="il-back-btn"><i className="ti ti-arrow-left" aria-hidden="true"></i></button>
          <h1 className="il-topbar-title">{t('idVerificationTitle')}</h1>
        </div>
      </div>

      <div className="il-shell" style={{ maxWidth: 560 }}>

        <div className="il-card il-card-pad" style={{ marginBottom: 16, textAlign: 'center' }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className={`ti ${cfg.icon}`} style={{ fontSize: 32, color: cfg.color }} aria-hidden="true"></i>
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 17.5, fontWeight: 700, color: 'var(--text)' }}>{cfg.title}</h2>

          {status?.status === 'not_submitted' && (
            <p className="il-muted" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>
              {t('getVerifiedBadge')}
            </p>
          )}
          {status?.status === 'pending' && (
            <p style={{ margin: 0, fontSize: 13.5, color: '#B45309', lineHeight: 1.6 }}>
              {new Date(status.submittedAt).toLocaleDateString('en-IN')}. {t('reviewWithin')}
            </p>
          )}
          {status?.status === 'approved' && (
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--success)', lineHeight: 1.6 }}>
              {t('identityVerified')}
            </p>
          )}
          {status?.status === 'rejected' && (
            <>
              <p style={{ margin: '0 0 8px', fontSize: 13.5, color: 'var(--danger)', lineHeight: 1.6 }}>{status.rejectionReason || 'Document could not be verified.'}</p>
              <p className="il-muted" style={{ margin: 0, fontSize: 12.5 }}>{t('canResubmit')}</p>
            </>
          )}
        </div>

        {(status?.status === 'not_submitted' || status?.status === 'rejected') && !showForm && (
          <button onClick={() => setShowForm(true)} className="il-btn il-btn-primary il-btn-block" style={{ padding: 15, fontSize: 15 }}>
            <i className="ti ti-upload" style={{ fontSize: 18 }} aria-hidden="true"></i>
            {status?.status === 'rejected' ? t('resubmitId') : t('verifyMyIdentity')}
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="il-card il-card-pad">
            {error && <div style={{ background: 'var(--danger-bg)', border: '1px solid #fecdca', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}><p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>{error}</p></div>}

            <div className="il-field">
              <label className="il-label">{t('idType')} <span className="il-required">*</span></label>
              <select className="il-select" value={idType} onChange={e => setIdType(e.target.value)}>
                <option value="">{t('selectIdType')}</option>
                {ID_TYPES.map(t2 => <option key={t2.value} value={t2.value}>{t2.label}</option>)}
              </select>
            </div>

            <div className="il-field">
              <label className="il-label">{t('idNumberOptional')}</label>
              <input className="il-input" type="text" value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="e.g. last 4 digits visible publicly" />
            </div>

            <label className="il-label">{t('photoOfId')} <span className="il-required">*</span></label>
            {uploadBox(docPreview, handleDocChange, { capture: 'environment' }, 'ti-camera', t('tapToUpload'), t('makeSureVisible'))}

            <label className="il-label">{t('selfieOptional')}</label>
            {uploadBox(selfiePreview, handleSelfieChange, { capture: 'user' }, 'ti-user-circle', t('tapAddSelfie'))}

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setShowForm(false)} className="il-btn il-btn-outline" style={{ flex: 1 }}>{t('cancel')}</button>
              <button type="submit" disabled={submitting} className="il-btn il-btn-primary" style={{ flex: 2 }}>
                {submitting ? t('submitting') : t('submitForReview')}
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: 16, background: 'var(--primary-light)', borderRadius: 12, padding: '13px 15px', display: 'flex', gap: 10 }}>
          <i className="ti ti-lock" style={{ fontSize: 18, color: 'var(--primary)', flexShrink: 0, marginTop: 1 }} aria-hidden="true"></i>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--primary-dark)', lineHeight: 1.6 }}>
            {t('privacyNoteVerify')}
          </p>
        </div>
      </div>
    </div>
  );
}