// ─────────────────────────────────────────────────────────────────────────────
// Shared design tokens for the admin panel — polished dark theme, deliberately
// distinct from the emerald consumer app so admins always know which surface
// they're on. Import wherever needed: `import { T } from './adminTheme';`
// ─────────────────────────────────────────────────────────────────────────────

export const T = {
  bg:              '#0A0E1A',
  surface:         '#131A2C',
  surfaceElevated: '#1A2238',
  surfaceHover:    '#1E2740',

  border:       'rgba(148,163,184,0.12)',
  borderStrong: 'rgba(148,163,184,0.22)',

  text:           '#F1F5F9',
  textSecondary:  '#94A3B8',
  textTertiary:   '#5B6B85',

  accent:      '#6366F1',
  accentDark:  '#4F46E5',
  accentBg:    'rgba(99,102,241,0.14)',

  success:   '#22C55E',
  successBg: 'rgba(34,197,94,0.14)',
  warning:   '#F59E0B',
  warningBg: 'rgba(245,158,11,0.14)',
  danger:    '#EF4444',
  dangerBg:  'rgba(239,68,68,0.14)',
  purple:    '#A855F7',
  purpleBg:  'rgba(168,85,247,0.14)',
  cyan:      '#22D3EE',
  cyanBg:    'rgba(34,211,238,0.14)',

  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

  radiusSm: 10,
  radiusMd: 14,
  radiusLg: 18,

  shadowSm: '0 1px 2px rgba(0,0,0,.2)',
  shadowMd: '0 8px 24px rgba(0,0,0,.35)',
};

// Two-role system: worker (blue-cyan) vs user/poster (purple).
// FIX: the previous role-color maps across Reports/Verifications still had
// old 4-role keys (worker/contractor/vendor/customer) — 'user' had no entry,
// so a poster's role chip silently rendered with undefined color/background.
export const ROLE_COLOR = {
  worker: { color: T.cyan,   bg: T.cyanBg },
  user:   { color: T.purple, bg: T.purpleBg },
  admin:  { color: T.accent, bg: T.accentBg },
};

export const STATUS_COLOR = {
  active:    { color: T.success, bg: T.successBg },
  suspended: { color: T.warning, bg: T.warningBg },
  banned:    { color: T.danger,  bg: T.dangerBg },
  open:      { color: T.success, bg: T.successBg },
  closed:    { color: T.textTertiary, bg: 'rgba(91,107,133,0.14)' },
  completed: { color: T.accent, bg: T.accentBg },
};

export const inputStyle = {
  width: '100%', fontSize: 13.5, padding: '11px 14px', borderRadius: T.radiusSm,
  border: `1px solid ${T.border}`, background: T.bg, color: T.text,
  outline: 'none', boxSizing: 'border-box', fontFamily: T.font,
  transition: 'border-color .15s',
};

export const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 700, color: T.textSecondary,
  marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.06em',
};