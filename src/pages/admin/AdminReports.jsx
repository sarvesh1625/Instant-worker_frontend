import { useState, useEffect } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, ROLE_COLOR, inputStyle } from './adminTheme';

const REASON_LABELS = {
  no_show: "Didn't show up", unsafe_behavior: 'Unsafe behavior', fake_profile: 'Fake profile',
  wrong_info: 'False info', spam: 'Spam', other: 'Other',
  no_payment: "Didn't pay", underpaid: 'Underpaid', unsafe_worksite: 'Unsafe worksite',
  job_misrepresented: 'Job misrepresented', left_early: 'Left early', poor_quality_work: 'Poor quality work',
  damaged_property: 'Damaged property', asked_extra_money: 'Asked extra money',
  no_payment_materials: "Didn't pay for materials", order_dispute: 'Order dispute',
};

const SEVERITY = {
  no_show: 'medium', unsafe_behavior: 'high', fake_profile: 'high', wrong_info: 'medium', spam: 'low', other: 'low',
  no_payment: 'high', underpaid: 'medium', unsafe_worksite: 'high', job_misrepresented: 'medium',
  left_early: 'medium', poor_quality_work: 'low', damaged_property: 'high', asked_extra_money: 'medium',
  no_payment_materials: 'high', order_dispute: 'low',
};

const SEVERITY_STYLE = {
  high:   { bg: T.dangerBg,  color: '#F87171', border: 'rgba(239,68,68,.3)',  icon: 'ti-alert-triangle' },
  medium: { bg: T.warningBg, color: '#FCD34D', border: 'rgba(245,158,11,.3)', icon: 'ti-alert-circle' },
  low:    { bg: 'rgba(148,163,184,.12)', color: T.textTertiary, border: T.border, icon: 'ti-info-circle' },
};

// FIX: was { worker, contractor, vendor, customer } — missing the current
// 'user' role entirely, so a poster-filed report's role chip rendered with
// undefined color/background. Now uses the shared ROLE_COLOR (worker/user).
const roleC = (r) => ROLE_COLOR[r] || { color: T.textTertiary, bg: 'rgba(148,163,184,.14)' };

const STATUS_TABS = [
  { value: 'pending',   label: 'Pending',   icon: 'ti-clock' },
  { value: 'reviewing', label: 'Reviewing', icon: 'ti-eye' },
  { value: 'resolved',  label: 'Resolved',  icon: 'ti-circle-check' },
  { value: 'dismissed', label: 'Dismissed', icon: 'ti-circle-x' },
  { value: 'all',       label: 'All',       icon: 'ti-list' },
];

function Avatar({ user, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: T.surfaceElevated,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 700, color: T.text, overflow: 'hidden', flexShrink: 0,
    }}>
      {user?.profilePhoto ? (
        <img src={user.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
      ) : (user?.name?.charAt(0).toUpperCase() || '?')}
    </div>
  );
}

function ReportsContent() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [resolveModal, setResolveModal] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [expanded, setExpanded] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminAxios.get(`/api/admin/reports?status=${filter}`);
      setReports(data.reports);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const handleResolve = async (status) => {
    if (!resolveModal) return;
    try {
      await adminAxios.patch(`/api/admin/reports/${resolveModal}/resolve`, { status, adminNote });
      setReports(prev => prev.filter(r => r._id !== resolveModal));
      setResolveModal(null); setAdminNote('');
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Reports</h1>
          <p style={{ margin: 0, fontSize: 13.5, color: T.textTertiary }}>User-submitted reports about other users</p>
        </div>
        {!loading && (
          <span style={{ fontSize: 12, color: T.textSecondary, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 999, padding: '6px 14px' }}>
            {reports.length} report{reports.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 20, marginBottom: 22, flexWrap: 'wrap', borderBottom: `1px solid ${T.border}`, paddingBottom: 14 }}>
        {STATUS_TABS.map(t => (
          <button key={t.value} onClick={() => setFilter(t.value)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 15px', borderRadius: T.radiusSm, fontSize: 12.5, fontWeight: 600, fontFamily: T.font,
            border: filter === t.value ? `1px solid ${T.accent}` : '1px solid transparent',
            background: filter === t.value ? T.accentBg : 'transparent',
            color: filter === t.value ? '#A5B4FC' : T.textTertiary,
            cursor: 'pointer', transition: 'all .15s',
          }}>
            <i className={`ti ${t.icon}`} style={{ fontSize: 14 }} aria-hidden="true"></i>
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3].map(i => <div key={i} style={{ background: T.surface, borderRadius: T.radiusMd, height: 96, opacity: 0.4 }}></div>)}
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div style={{ textAlign: 'center', padding: '70px 20px', color: T.textTertiary }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="ti ti-flag-off" style={{ fontSize: 28 }} aria-hidden="true"></i>
          </div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>No {filter !== 'all' ? filter : ''} reports</p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: T.border }}>You're all caught up</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reports.map(r => {
          const sev = SEVERITY[r.reason] || 'low';
          const sevStyle = SEVERITY_STYLE[sev];
          const isOpen = expanded[r._id];
          const rc = roleC(r.reporterRole);

          return (
            <div key={r._id} style={{
              background: T.surface, borderRadius: T.radiusMd, border: `1px solid ${sevStyle.border}`,
              overflow: 'hidden', transition: 'border-color .15s',
            }}>
              <div onClick={() => setExpanded(p => ({ ...p, [r._id]: !p[r._id] }))} style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: sevStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`ti ${sevStyle.icon}`} style={{ fontSize: 19, color: sevStyle.color }} aria-hidden="true"></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{REASON_LABELS[r.reason] || r.reason}</span>
                    <span style={{ background: rc.bg, color: rc.color, fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 10, textTransform: 'capitalize' }}>
                      {r.reporterRole}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.textTertiary }}>
                    <span style={{ fontWeight: 600, color: T.textSecondary }}>{r.reportedBy?.name}</span>
                    <i className="ti ti-arrow-right" style={{ fontSize: 12 }} aria-hidden="true"></i>
                    <span style={{ fontWeight: 600, color: T.textSecondary }}>{r.reportedUser?.name}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: T.textTertiary, whiteSpace: 'nowrap' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <i className={`ti ti-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: 16, color: T.textTertiary }} aria-hidden="true"></i>
                </div>
              </div>

              {isOpen && (
                <div style={{ padding: '0 18px 18px', borderTop: `1px solid ${T.border}` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 10, margin: '16px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar user={r.reportedBy} />
                      <div>
                        <p style={{ margin: 0, fontSize: 10, color: T.textTertiary, textTransform: 'uppercase', letterSpacing: '.04em' }}>Reported by</p>
                        <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: T.text }}>{r.reportedBy?.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: T.textTertiary }}>{r.reportedBy?.phone}</p>
                      </div>
                    </div>
                    <i className="ti ti-arrow-right" style={{ fontSize: 18, color: T.border }} aria-hidden="true"></i>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar user={r.reportedUser} />
                      <div>
                        <p style={{ margin: 0, fontSize: 10, color: T.textTertiary, textTransform: 'uppercase', letterSpacing: '.04em' }}>Against</p>
                        <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: T.text }}>{r.reportedUser?.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: T.textTertiary }}>{r.reportedUser?.phone}</p>
                      </div>
                    </div>
                  </div>

                  {r.job?.title && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 12, color: T.textSecondary }}>
                      <i className="ti ti-briefcase" style={{ fontSize: 14 }} aria-hidden="true"></i>
                      Related job: <span style={{ color: T.text, fontWeight: 600 }}>{r.job.title}</span>
                    </div>
                  )}

                  {r.description && (
                    <div style={{ background: T.bg, borderRadius: T.radiusSm, padding: '12px 14px', marginBottom: 12, borderLeft: `3px solid ${sevStyle.color}` }}>
                      <p style={{ margin: 0, fontSize: 12, color: T.textSecondary, fontWeight: 600, marginBottom: 4 }}>Message</p>
                      <p style={{ margin: 0, fontSize: 13, color: T.text, lineHeight: 1.6 }}>{r.description}</p>
                    </div>
                  )}

                  {r.adminNote && (
                    <div style={{ background: T.successBg, borderRadius: T.radiusSm, padding: '10px 14px', marginBottom: 12, display: 'flex', gap: 8 }}>
                      <i className="ti ti-note" style={{ fontSize: 14, color: '#4ADE80', flexShrink: 0, marginTop: 2 }} aria-hidden="true"></i>
                      <p style={{ margin: 0, fontSize: 12, color: '#86EFAC' }}>{r.adminNote}</p>
                    </div>
                  )}

                  {(filter === 'pending' || filter === 'reviewing') && (
                    <button onClick={(e) => { e.stopPropagation(); setResolveModal(r._id); }} style={{
                      width: '100%', padding: 11, borderRadius: T.radiusSm, border: 'none',
                      background: T.accent, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: T.font,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <i className="ti ti-checks" style={{ fontSize: 15 }} aria-hidden="true"></i>
                      Review &amp; resolve
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {resolveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: T.surface, borderRadius: T.radiusMd, padding: 22, maxWidth: 380, width: '100%', border: `1px solid ${T.border}` }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 800, color: T.text }}>Resolve report</h3>
            <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} rows={3} placeholder="Add a note (optional)..."
              style={{ ...inputStyle, resize: 'none', marginBottom: 14 }} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button onClick={() => handleResolve('resolved')} style={{ flex: 1, padding: 10, borderRadius: T.radiusSm, border: 'none', background: T.success, color: '#062E14', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: T.font }}>
                Mark resolved
              </button>
              <button onClick={() => handleResolve('dismissed')} style={{ flex: 1, padding: 10, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: 'transparent', color: T.textSecondary, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.font }}>
                Dismiss
              </button>
            </div>
            <button onClick={() => { setResolveModal(null); setAdminNote(''); }} style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: T.textTertiary, fontSize: 12, cursor: 'pointer', fontFamily: T.font }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminReports() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <ReportsContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}
