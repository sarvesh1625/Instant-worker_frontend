import { useState, useEffect } from 'react';
import axios from 'axios';
import { LEGAL } from '../legal/legalConfig';

// Shown once to anyone who has not accepted the CURRENT version of the Terms + Privacy Policy
// (every existing user the first time, and everyone again whenever LEGAL.version changes in legalConfig.js).
// If the check fails (no network, old server) it does NOT block the site.
export default function TermsGate() {
  const [needs, setNeeds] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    axios.get('/api/legal/mine')
      .then(({ data }) => { if (alive) setNeeds(!(data.consents || []).some(c => c.version === LEGAL.version)); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const agree = async () => {
    setSaving(true); setError('');
    try { await axios.post('/api/legal/accept', { version: LEGAL.version, source: 'web' }); setNeeds(false); }
    catch { setError('Could not save. Please try again.'); }
    finally { setSaving(false); }
  };

  if (!needs) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(17,24,39,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: 26, width: '100%', maxWidth: 460, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,.35)' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="ti ti-file-text" style={{ fontSize: 30, color: '#047857' }} aria-hidden="true"></i>
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>We updated our Terms</h2>
        <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Please read and accept our Terms &amp; Conditions and Privacy Policy to continue.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
          <a href="/terms" target="_blank" rel="noreferrer" style={{ color: '#047857', fontWeight: 700, fontSize: 13.5 }}>Terms &amp; Conditions</a>
          <span style={{ color: '#94A3B8' }}>·</span>
          <a href="/privacy" target="_blank" rel="noreferrer" style={{ color: '#047857', fontWeight: 700, fontSize: 13.5 }}>Privacy Policy</a>
        </div>
        {error && <p style={{ color: 'var(--danger)', fontSize: 13, margin: '0 0 10px' }}>{error}</p>}
        <button onClick={agree} disabled={saving} style={{
          width: '100%', padding: '14px 16px', border: 'none', borderRadius: 12, background: 'var(--primary, #10B981)', color: '#fff',
          fontWeight: 800, fontSize: 15, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1,
        }}>{saving ? 'Saving...' : 'I agree and continue'}</button>
      </div>
    </div>
  );
}