import { useTTS, buildJobSpeech } from './useTTS';
import { useLang } from '../context/LangContext';

const LABELS = {
  te: { listen: 'వినండి', stop: 'ఆపు' },
  hi: { listen: 'सुनें',  stop: 'रुको'  },
  en: { listen: 'Listen', stop: 'Stop'  },
};

export default function SpeakButton({ job, id, compact = false }) {
  const { lang } = useLang();
  const { speak, stop, speaking, activeId } = useTTS();

  const isThisSpeaking = speaking && activeId === id;
  const labels         = LABELS[lang] || LABELS.en;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isThisSpeaking) {
      stop();
    } else {
      const text = buildJobSpeech(job, lang);
      speak(text, lang, id);
    }
  };

  const style = {
    bg:     isThisSpeaking ? '#fef3c7' : '#f9fafb',
    border: isThisSpeaking ? '1.5px solid #fbbf24' : '1.5px solid #e5e7eb',
    color:  isThisSpeaking ? '#92400e' : '#6b7280',
    anim:   isThisSpeaking ? 'tts-pulse 1.5s ease-in-out infinite' : 'none',
  };

  if (compact) {
    return (
      <>
        <button onClick={handleClick} title={labels.listen} style={{
          width:36, height:36, borderRadius:'50%', border:style.border,
          background:style.bg, color:style.color,
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', fontSize:15, flexShrink:0,
          transition:'all .15s', animation:style.anim,
        }}>
          <i className={`ti ti-${isThisSpeaking ? 'player-stop' : 'volume'}`} aria-hidden="true"></i>
        </button>
        <style>{`@keyframes tts-pulse{0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,.4)}50%{box-shadow:0 0 0 6px rgba(251,191,36,0)}}`}</style>
      </>
    );
  }

  return (
    <>
      <button onClick={handleClick} style={{
        display:'flex', alignItems:'center', gap:5,
        background:style.bg, border:style.border,
        borderRadius:20, padding:'5px 12px',
        cursor:'pointer', color:style.color,
        fontSize:12, fontWeight:600, flexShrink:0,
        transition:'all .15s', animation:style.anim,
      }}>
        <i className={`ti ti-${isThisSpeaking ? 'player-stop' : 'volume'}`} style={{ fontSize:14 }} aria-hidden="true"></i>
        {isThisSpeaking ? labels.stop : labels.listen}
      </button>
      <style>{`@keyframes tts-pulse{0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,.4)}50%{box-shadow:0 0 0 6px rgba(251,191,36,0)}}`}</style>
    </>
  );
}