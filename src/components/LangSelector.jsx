import { useLang } from '../context/LangContext';

export default function LangSelector({ style = {} }) {
  const { lang, changeLang, languages } = useLang();

  return (
    <div style={{ display: 'flex', gap: 6, ...style }}>
      {languages.map(l => (
        <button key={l.code} onClick={() => changeLang(l.code)} style={{
          background: lang === l.code ? '#fff' : 'rgba(255,255,255,0.18)',
          color: lang === l.code ? '#1a56db' : '#fff',
          border: 'none', borderRadius: 8,
          padding: '3px 10px', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', transition: 'all .15s',
        }}>
          {l.label}
        </button>
      ))}
    </div>
  );
}