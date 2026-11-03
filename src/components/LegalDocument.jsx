import { useNavigate, Link } from 'react-router-dom';
import { DOCS, segments } from '../legal/legalContent';
import { LEGAL } from '../legal/legalConfig';
import '../styles/theme.css';

// Renders the Terms or the Privacy Policy. Used by pages/Terms.jsx and pages/Privacy.jsx.
function Rich({ text }) {
  return <>{segments(text).map((g, i) => (g.b ? <strong key={i} style={{ color: 'var(--text)' }}>{g.s}</strong> : <span key={i}>{g.s}</span>))}</>;
}

export default function LegalDocument({ doc }) {
  const navigate = useNavigate();
  const D = DOCS[doc];
  const other = doc === 'terms' ? { to: '/privacy', label: 'Privacy Policy' } : { to: '/terms', label: 'Terms & Conditions' };
  const body = { fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75, margin: '0 0 10px' };

  return (
    <div className="il-page">
      <div className="il-topbar il-topbar-brand">
        <div className="il-topbar-inner" style={{ maxWidth: 760 }}>
          <button onClick={() => navigate(-1)} className="il-back-btn"><i className="ti ti-arrow-left" aria-hidden="true"></i></button>
          <h1 className="il-topbar-title">{D.title}</h1>
        </div>
      </div>

      <div className="il-shell" style={{ maxWidth: 760 }}>
        <div className="il-card il-card-pad">
          <p className="il-muted" style={{ margin: '0 0 4px', fontSize: 12.5 }}>{LEGAL.website}</p>
          <p className="il-muted" style={{ margin: '0 0 22px', fontSize: 12.5 }}>
            Effective: {LEGAL.effectiveDate} · Last updated: {LEGAL.lastUpdated} · <Link to={other.to} className="il-link">{other.label}</Link>
          </p>

          {D.sections.map(s => (
            <div key={s.n} style={{ marginBottom: 22 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 15.5, fontWeight: 700, color: 'var(--text)' }}>{s.n}. {s.title}</h2>
              {s.blocks.map((b, i) => {
                if (b.t === 'p') return <p key={i} style={body}><Rich text={b.x} /></p>;
                if (b.t === 'ul') {
                  return (
                    <ul key={i} style={{ ...body, paddingLeft: 20 }}>
                      {b.items.map((it, j) => <li key={j} style={{ marginBottom: 4 }}><Rich text={it} /></li>)}
                    </ul>
                  );
                }
                return <p key={i} style={body}>{b.items.map((it, j) => <span key={j} style={{ display: 'block' }}><Rich text={it} /></span>)}</p>;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}