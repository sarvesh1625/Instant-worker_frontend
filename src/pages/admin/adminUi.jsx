import { T } from './adminTheme';

export const fmt = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export function Title({ title, sub }) {
  return (
    <>
      <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>{title}</h1>
      {sub && <p style={{ margin: '0 0 20px', fontSize: 13.5, color: T.textTertiary }}>{sub}</p>}
    </>
  );
}

export function Card({ children, style }) {
  return <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: 16, ...style }}>{children}</div>;
}

export function Chip({ children, color = T.textSecondary, bg = 'rgba(148,163,184,.14)' }) {
  return <span style={{ background: bg, color, fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>{children}</span>;
}

export function Btn({ children, onClick, kind = 'primary', disabled, style }) {
  const c = kind === 'danger' ? { background: T.dangerBg, color: '#F87171' }
    : kind === 'ghost' ? { background: 'transparent', color: T.textSecondary, border: `1px solid ${T.border}` }
    : { background: T.accent, color: '#fff' };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      border: 'none', borderRadius: T.radiusSm, padding: '8px 14px', fontSize: 12.5, fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, fontFamily: T.font, ...c, ...style,
    }}>{children}</button>
  );
}

export function Empty({ children }) {
  return <p style={{ textAlign: 'center', padding: 36, color: T.textTertiary, fontSize: 13 }}>{children}</p>;
}

export function Pager({ page, pages, setPage }) {
  if (!pages || pages <= 1) return null;
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
      <Btn kind="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Btn>
      <span style={{ color: T.textSecondary, fontSize: 12.5 }}>{page} / {pages}</span>
      <Btn kind="ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</Btn>
    </div>
  );
}

export const errMsg = (e) => e?.response?.data?.message || e?.message || 'Failed';