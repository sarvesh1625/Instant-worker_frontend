import { useState } from 'react';
import { useVoiceSearch } from './useVoiceSearch';
import { useLang } from '../context/LangContext';

const PROMPTS = {
  en: [
    'Say: "Electrician Hyderabad"',
    'Say: "Painter near me"',
    'Say: "Carpenter Vijayawada"',
    'Say: "Plumber Madhapur"',
  ],
  hi: [
    'बोलो: "इलेक्ट्रीशियन हैदराबाद"',
    'बोलो: "पेंटर मेरे पास"',
    'बोलो: "बढ़ई विजयवाड़ा"',
    'बोलो: "प्लंबर हैदराबाद"',
  ],
  te: [
    'చెప్పండి: "ఎలక్ట్రీషియన్ హైదరాబాద్"',
    'చెప్పండి: "పెయింటర్ నా దగ్గర"',
    'చెప్పండి: "వడ్రంగి విజయవాడ"',
    'చెప్పండి: "ప్లంబర్ హైదరాబాద్"',
  ],
};

const LABELS = {
  en: { tap: 'Tap mic to search by voice', listening: 'Listening... speak now', notSupported: 'Voice not supported — use Chrome' },
  hi: { tap: 'आवाज़ से खोजने के लिए माइक दबाएं', listening: 'सुन रहा हूँ... बोलिए', notSupported: 'आवाज़ समर्थित नहीं — Chrome उपयोग करें' },
  te: { tap: 'వాయిస్ ద్వారా వెతకడానికి మైక్ నొక్కండి', listening: 'వింటున్నాను... మాట్లాడండి', notSupported: 'వాయిస్ మద్దతు లేదు — Chrome వాడండి' },
};

export default function VoiceSearchButton({ onResult, compact = false }) {
  const { lang }   = useLang();
  const { listening, transcript, parsed, error, supported, startListening, stopListening } = useVoiceSearch(lang);
  const [prompted, setPrompted] = useState(false);

  const labels  = LABELS[lang] || LABELS.en;
  const prompts = PROMPTS[lang] || PROMPTS.en;
  const prompt  = prompts[Math.floor(Date.now() / 5000) % prompts.length];

  const handleClick = () => {
    if (!supported) return;
    if (listening) {
      stopListening();
    } else {
      setPrompted(true);
      startListening();
    }
  };

  // When we get a good result, call parent
  const handleSearch = () => {
    if (parsed.skill || parsed.city || parsed.raw) {
      onResult && onResult(parsed);
    }
  };

  if (compact) {
    // Compact version — just the mic button for embedding in search bars
    return (
      <button
        onClick={handleClick}
        title={labels.tap}
        style={{
          width: 42, height: 42, borderRadius: '50%', border: 'none',
          background: listening ? '#ef4444' : '#FF6B00',
          color: '#fff', cursor: supported ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
          boxShadow: listening ? '0 0 0 6px rgba(239,68,68,0.2)' : '0 4px 14px rgba(255,107,0,0.4)',
          transition: 'all .2s',
          animation: listening ? 'voicePulse 1s ease-in-out infinite' : 'none',
        }}>
        <i className={`ti ti-${listening ? 'player-stop' : 'microphone'}`} aria-hidden="true"></i>
        <style>{`@keyframes voicePulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)}50%{box-shadow:0 0 0 10px rgba(239,68,68,0)}}`}</style>
      </button>
    );
  }

  // Full version — large mic button with result display
  return (
    <div style={{ fontFamily: 'var(--font-sans, sans-serif)' }}>

      {/* Big mic button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative' }}>
          {/* Pulse rings when listening */}
          {listening && (
            <>
              <div style={{ position:'absolute', inset:'-12px', borderRadius:'50%', background:'rgba(239,68,68,0.15)', animation:'vRing 1.5s ease-out infinite' }}></div>
              <div style={{ position:'absolute', inset:'-24px', borderRadius:'50%', background:'rgba(239,68,68,0.08)', animation:'vRing 1.5s ease-out infinite .4s' }}></div>
            </>
          )}
          <button
            onClick={handleClick}
            disabled={!supported}
            style={{
              width: 88, height: 88, borderRadius: '50%', border: 'none',
              background: listening
                ? 'linear-gradient(135deg,#ef4444,#dc2626)'
                : 'linear-gradient(135deg,#FF6B00,#FF9500)',
              color: '#fff', cursor: supported ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, position: 'relative', zIndex: 1,
              boxShadow: listening
                ? '0 8px 32px rgba(239,68,68,0.5)'
                : '0 8px 32px rgba(255,107,0,0.45)',
              transition: 'all .2s',
            }}>
            <i className={`ti ti-${listening ? 'player-stop' : 'microphone'}`} aria-hidden="true"></i>
          </button>
        </div>

        {/* Status text */}
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: listening ? '#ef4444' : 'var(--color-text-secondary)', textAlign: 'center' }}>
          {!supported
            ? labels.notSupported
            : listening
              ? labels.listening
              : labels.tap}
        </p>

        {/* Example prompt */}
        {!listening && !transcript && supported && (
          <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)', textAlign: 'center', fontStyle: 'italic' }}>
            {prompt}
          </p>
        )}
      </div>

      {/* Transcript display */}
      {(transcript || listening) && (
        <div style={{
          margin: '20px 0 0',
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '14px 16px',
          border: '0.5px solid var(--color-border-secondary)',
          minHeight: 52,
        }}>
          {listening && !transcript && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[0, 180, 360].map(d => (
                <div key={d} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#ef4444',
                  animation: `vBounce 1.2s ease-in-out infinite`,
                  animationDelay: `${d}ms`,
                }}></div>
              ))}
            </div>
          )}
          {transcript && (
            <p style={{ margin: 0, fontSize: 15, color: 'var(--color-text-primary)', fontWeight: 500 }}>
              "{transcript}"
            </p>
          )}
        </div>
      )}

      {/* Parsed result chips */}
      {(parsed.skill || parsed.city) && (
        <div style={{ margin: '12px 0 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {parsed.skill && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--color-background-info)',
              color: 'var(--color-text-info)',
              border: '0.5px solid var(--color-border-info)',
              borderRadius: 20, padding: '5px 12px', fontSize: 13, fontWeight: 600,
            }}>
              <i className="ti ti-hammer" style={{ fontSize: 14 }} aria-hidden="true"></i>
              {parsed.skill}
            </div>
          )}
          {parsed.city && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--color-background-success)',
              color: 'var(--color-text-success)',
              border: '0.5px solid var(--color-border-success)',
              borderRadius: 20, padding: '5px 12px', fontSize: 13, fontWeight: 600,
            }}>
              <i className="ti ti-map-pin" style={{ fontSize: 14 }} aria-hidden="true"></i>
              {parsed.city}
            </div>
          )}
          {!parsed.skill && !parsed.city && parsed.raw && (
            <div style={{
              background: 'var(--color-background-warning)',
              color: 'var(--color-text-warning)',
              border: '0.5px solid var(--color-border-warning)',
              borderRadius: 20, padding: '5px 12px', fontSize: 12,
            }}>
              Could not detect skill or city — try again
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 'var(--border-radius-md)',
          background: 'var(--color-background-danger)',
          color: 'var(--color-text-danger)',
          border: '0.5px solid var(--color-border-danger)',
          fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <i className="ti ti-alert-circle" style={{ fontSize: 16, flexShrink: 0 }} aria-hidden="true"></i>
          {error}
        </div>
      )}

      {/* Search button — appears when we have a result */}
      {(parsed.skill || parsed.city) && (
        <button onClick={handleSearch} style={{
          marginTop: 16, width: '100%', padding: '13px',
          background: 'linear-gradient(135deg,#FF6B00,#FF9500)',
          color: '#fff', border: 'none', borderRadius: 50,
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
          boxShadow: '0 4px 20px rgba(255,107,0,0.4)',
          transition: 'transform .15s',
        }}>
          <i className="ti ti-search" style={{ fontSize: 18 }} aria-hidden="true"></i>
          Search Jobs
        </button>
      )}

      <style>{`
        @keyframes vRing    { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.5)} }
        @keyframes vBounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>
    </div>
  );
}