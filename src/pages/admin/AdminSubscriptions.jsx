import { useState, useEffect } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T } from './adminTheme';

const STATUS_CONFIG = {
  active:    { bg: T.successBg, color: T.success, label: 'Active' },
  pending:   { bg: 'rgba(245,158,11,.12)', color: '#F59E0B', label: 'Pending' },
  cancelled: { bg: 'rgba(148,163,184,.14)', color: T.textTertiary, label: 'Cancelling' },
  expired:   { bg: T.dangerBg, color: T.danger, label: 'Expired' },
};

function GrantModal({ onClose, onGranted }) {
  const [phoneQuery, setPhoneQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [customDays, setCustomDays] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAxios.get('/api/admin/subscriptions/plans')
      .then(({ data }) => setPlans((data.plans || []).filter(p => p.active)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!phoneQuery.trim() || phoneQuery.trim().length < 3) { setSearchResults([]); return; }
    setSearching(true);
    const t = setTimeout(() => {
      adminAxios.get(`/api/admin/users?search=${encodeURIComponent(phoneQuery.trim())}`)
        .then(({ data }) => setSearchResults((data.users || []).filter(u => u.role === 'worker')))
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 350);
    return () => clearTimeout(t);
  }, [phoneQuery]);

  const selectedPlan = plans.find(p => p._id === selectedPlanId);

  const handleGrant = async () => {
    if (!selectedUser) { setError('Search and select a worker first'); return; }
    if (!selectedPlanId) { setError('Choose a plan'); return; }

    setError(''); setSubmitting(true);
    try {
      const payload = { userId: selectedUser._id, planId: selectedPlanId };
      if (customDays.trim()) payload.durationDays = Number(customDays.trim());

      await adminAxios.post('/api/admin/subscriptions/grant', payload);
      onGranted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not grant subscription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.surface, borderRadius: T.radiusMd, padding: 24, maxWidth: 460, width: '100%',
        border: `1px solid ${T.border}`, maxHeight: '85vh', overflowY: 'auto',
      }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: T.text }}>Grant Free Subscription</h3>
        <p style={{ margin: '0 0 20px', fontSize: 12.5, color: T.textTertiary }}>
          No payment involved — clearly marked as an admin grant, never counted as real revenue.
        </p>

        {error && (
          <div style={{ background: T.dangerBg, borderRadius: 8, padding: '9px 13px', marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 12.5, color: T.danger }}>{error}</p>
          </div>
        )}

        {/* Step 1 — find the worker */}
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.textSecondary, marginBottom: 6 }}>Worker</label>
        {selectedUser ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
            background: T.accentBg, borderRadius: T.radiusSm, marginBottom: 16,
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: T.text }}>{selectedUser.name}</p>
              <p style={{ margin: 0, fontSize: 11.5, color: T.textTertiary }}>{selectedUser.phone}</p>
            </div>
            <button onClick={() => { setSelectedUser(null); setPhoneQuery(''); }} style={{
              background: 'transparent', border: 'none', color: T.textTertiary, cursor: 'pointer', fontSize: 16, padding: 4,
            }}>
              <i className="ti ti-x" aria-hidden="true"></i>
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <input
              value={phoneQuery}
              onChange={e => setPhoneQuery(e.target.value)}
              placeholder="Search by name or phone number..."
              style={{
                width: '100%', padding: '10px 14px', borderRadius: T.radiusSm,
                border: `1px solid ${T.border}`, background: T.bg, color: T.text,
                fontSize: 13, fontFamily: T.font, outline: 'none', boxSizing: 'border-box',
              }}
            />
            {searching && <p style={{ margin: '6px 0 0', fontSize: 11.5, color: T.textTertiary }}>Searching...</p>}
            {searchResults.length > 0 && (
              <div style={{ marginTop: 8, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, overflow: 'hidden' }}>
                {searchResults.map(u => (
                  <button key={u._id} onClick={() => setSelectedUser(u)} style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', background: T.bg, border: 'none', borderBottom: `1px solid ${T.border}`,
                    cursor: 'pointer', textAlign: 'left', fontFamily: T.font,
                  }}>
                    <span style={{ fontSize: 13, color: T.text }}>{u.name}</span>
                    <span style={{ fontSize: 11.5, color: T.textTertiary }}>{u.phone}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2 — pick a plan */}
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.textSecondary, marginBottom: 6 }}>Plan</label>
        <select
          value={selectedPlanId}
          onChange={e => setSelectedPlanId(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: T.radiusSm,
            border: `1px solid ${T.border}`, background: T.bg, color: T.text,
            fontSize: 13, fontFamily: T.font, outline: 'none', marginBottom: 16, boxSizing: 'border-box',
          }}
        >
          <option value="">Select a plan...</option>
          {plans.map(p => (
            <option key={p._id} value={p._id}>{p.name} — ₹{p.price}/{p.intervalMonths}mo (normally paid)</option>
          ))}
        </select>

        {/* Step 3 — optional custom duration */}
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.textSecondary, marginBottom: 6 }}>
          Duration override (optional)
        </label>
        <input
          type="number"
          value={customDays}
          onChange={e => setCustomDays(e.target.value)}
          placeholder={selectedPlan ? `Default: ${selectedPlan.intervalMonths * 30} days (matches ${selectedPlan.name})` : 'Days'}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: T.radiusSm,
            border: `1px solid ${T.border}`, background: T.bg, color: T.text,
            fontSize: 13, fontFamily: T.font, outline: 'none', marginBottom: 6, boxSizing: 'border-box',
          }}
        />
        <p style={{ margin: '0 0 20px', fontSize: 11, color: T.textTertiary }}>
          Leave blank to use the plan's normal length. Enter a number to grant a shorter/longer free period instead — e.g. 30 for exactly one month regardless of which plan you picked.
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: 11, borderRadius: T.radiusSm, border: `1px solid ${T.border}`,
            background: 'transparent', color: T.textSecondary, fontSize: 13, cursor: 'pointer', fontFamily: T.font,
          }}>
            Cancel
          </button>
          <button onClick={handleGrant} disabled={submitting} style={{
            flex: 1, padding: 11, borderRadius: T.radiusSm, border: 'none',
            background: T.accent, color: '#fff', fontSize: 13, fontWeight: 700,
            cursor: submitting ? 'wait' : 'pointer', fontFamily: T.font,
          }}>
            {submitting ? 'Granting...' : 'Grant Free Access'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SubscriptionsContent() {
  const [subs, setSubs]       = useState([]);
  const [summary, setSummary] = useState({ activeCount: 0, monthlyRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [showGrantModal, setShowGrantModal] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const { data } = await adminAxios.get(`/api/admin/subscriptions${params}`);
      setSubs(data.subscriptions || []);
      setSummary(data.summary || { activeCount: 0, monthlyRevenue: 0 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [statusFilter]);

  const filtered = subs.filter(s => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return s.user?.name?.toLowerCase().includes(q) || s.user?.phone?.includes(q);
  });

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const handleCancel = async (sub) => {
    if (!confirm(`Cancel ${sub.user?.name}'s subscription? ${sub.grantedByAdmin ? 'This free grant will end immediately.' : 'They keep access until their current billing period ends, same as if they cancelled it themselves.'}`)) return;
    try {
      const { data } = await adminAxios.post(`/api/admin/subscriptions/${sub._id}/cancel`);
      alert(data.message);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Subscriptions</h1>
          <p style={{ margin: 0, fontSize: 13.5, color: T.textTertiary }}>See who's subscribed, and grant free access when needed</p>
        </div>
        <button onClick={() => setShowGrantModal(true)} style={{
          padding: '11px 18px', borderRadius: T.radiusSm, border: 'none',
          background: T.accent, color: '#fff', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', fontFamily: T.font, display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0,
        }}>
          <i className="ti ti-gift" style={{ fontSize: 16 }} aria-hidden="true"></i>
          Grant Free Plan
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 22 }}>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: 18 }}>
          <p style={{ margin: 0, fontSize: 11.5, color: T.textTertiary, fontWeight: 700 }}>Active Subscribers</p>
          <p style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 800, color: T.text }}>{summary.activeCount}</p>
        </div>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: 18 }}>
          <p style={{ margin: 0, fontSize: 11.5, color: T.textTertiary, fontWeight: 700 }}>Est. Monthly Revenue</p>
          <p style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 800, color: T.accent }}>₹{summary.monthlyRevenue?.toLocaleString('en-IN') || 0}</p>
          <p style={{ margin: '2px 0 0', fontSize: 10.5, color: T.textTertiary }}>Multi-month plans normalized to a monthly figure</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          style={{
            flex: 1, minWidth: 220, padding: '10px 14px', borderRadius: T.radiusSm,
            border: `1px solid ${T.border}`, background: T.surface, color: T.text,
            fontSize: 13, fontFamily: T.font, outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {['active', 'pending', 'cancelled', 'expired', 'all'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '9px 15px', borderRadius: 999, fontSize: 12, fontWeight: 700, fontFamily: T.font,
              border: statusFilter === s ? `1px solid ${T.accent}` : `1px solid ${T.border}`,
              background: statusFilter === s ? T.accentBg : 'transparent',
              color: statusFilter === s ? '#A5B4FC' : T.textTertiary,
              cursor: 'pointer', textTransform: 'capitalize',
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading && <p style={{ color: T.textTertiary, fontSize: 13.5 }}>Loading...</p>}

      {!loading && filtered.length === 0 && (
        <p style={{ textAlign: 'center', padding: 40, color: T.textTertiary, fontSize: 13 }}>
          No {statusFilter !== 'all' ? statusFilter : ''} subscriptions found{search ? ' matching your search' : ''}.
        </p>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr style={{ background: T.surfaceElevated }}>
                  {['Worker', 'Phone', 'Plan', 'Status', 'Renews / Ends', 'Source', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '11px 16px', fontSize: 11, fontWeight: 800, color: T.textTertiary, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => {
                  const cfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.expired;
                  return (
                    <tr key={sub._id} style={{ borderTop: `1px solid ${T.border}` }}>
                      <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: T.text }}>
                        {sub.user?.name || '—'}
                        <span style={{ display: 'block', fontSize: 10.5, fontWeight: 500, color: T.textTertiary, textTransform: 'capitalize' }}>{sub.user?.role}</span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12.5, color: T.textSecondary }}>{sub.user?.phone || '—'}</td>
                      <td style={{ padding: '13px 16px', fontSize: 12.5, color: T.textSecondary }}>
                        {sub.plan?.name || '—'}
                        {sub.plan?.price && <span style={{ display: 'block', fontSize: 10.5, color: T.textTertiary }}>₹{sub.plan.price} / {sub.plan.intervalMonths}mo</span>}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ background: cfg.bg, color: cfg.color, fontSize: 10.5, fontWeight: 800, padding: '4px 10px', borderRadius: 999 }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12.5, color: T.textSecondary }}>
                        {formatDate(sub.currentPeriodEnd)}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 11.5, color: T.textTertiary }}>
                        {sub.grantedByAdmin ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <i className="ti ti-gift" style={{ fontSize: 13 }} aria-hidden="true"></i> Free grant
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <i className="ti ti-credit-card" style={{ fontSize: 13 }} aria-hidden="true"></i> Paid
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        {sub.status === 'active' && (
                          <button onClick={() => handleCancel(sub)} style={{
                            background: T.dangerBg, border: 'none', borderRadius: 7,
                            padding: '6px 12px', color: T.danger, fontSize: 11.5, fontWeight: 700,
                            cursor: 'pointer', fontFamily: T.font, whiteSpace: 'nowrap',
                          }}>
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showGrantModal && (
        <GrantModal onClose={() => setShowGrantModal(false)} onGranted={load} />
      )}
    </div>
  );
}

export default function AdminSubscriptions() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <SubscriptionsContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}