import { useState, useEffect } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, ROLE_COLOR, inputStyle } from './Admintheme ';

// FIX: same class of bug as AdminReports — the old roleColor map had no
// 'user' key, only the retired 4-role set. Now shares ROLE_COLOR.
const roleC = (r) => ROLE_COLOR[r] || { color: T.textTertiary, bg: 'rgba(148,163,184,.14)' };

function VerificationsContent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [actioning, setActioning] = useState({});
  const [zoomImage, setZoomImage] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminAxios.get(`/api/admin/verifications?status=${filter}`);
      setUsers(data.users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const handleApprove = async (userId) => {
    setActioning(p => ({ ...p, [userId]: true }));
    try {
      await adminAxios.patch(`/api/admin/verifications/${userId}/approve`);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setActioning(p => ({ ...p, [userId]: false })); }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActioning(p => ({ ...p, [rejectModal]: true }));
    try {
      await adminAxios.patch(`/api/admin/verifications/${rejectModal}/reject`, { reason: rejectReason });
      setUsers(prev => prev.filter(u => u._id !== rejectModal));
      setRejectModal(null); setRejectReason('');
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setActioning(p => ({ ...p, [rejectModal]: false })); }
  };

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>ID Verifications</h1>
      <p style={{ margin: '0 0 20px', fontSize: 13.5, color: T.textTertiary }}>Review uploaded ID documents</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        {['pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 17px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, fontFamily: T.font,
            border: filter === f ? `1px solid ${T.accent}` : `1px solid ${T.border}`,
            background: filter === f ? T.accent : 'transparent',
            color: filter === f ? '#fff' : T.textTertiary,
            cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {f}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: T.textTertiary, fontSize: 13.5 }}>Loading...</p>}
      {!loading && users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: T.textTertiary }}>
          <i className="ti ti-shield-check" style={{ fontSize: 44, display: 'block', marginBottom: 12, opacity: .5 }} aria-hidden="true"></i>
          <p style={{ margin: 0, fontSize: 14 }}>No {filter} verifications</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        {users.map(u => {
          const rc = roleC(u.role);
          return (
            <div key={u._id} style={{ background: T.surface, borderRadius: T.radiusMd, border: `1px solid ${T.border}`, overflow: 'hidden' }}>

              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${T.border}` }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.surfaceElevated, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: T.text, overflow: 'hidden', flexShrink: 0 }}>
                  {u.profilePhoto ? <img src={u.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt=""/> : u.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{u.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: T.textTertiary }}>{u.phone}</p>
                </div>
                <span style={{ background: rc.bg, color: rc.color, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, textTransform: 'capitalize' }}>{u.role}</span>
              </div>

              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: T.textSecondary }}>ID Type:</span>
                  <span style={{ fontSize: 11, color: T.text, fontWeight: 700, textTransform: 'capitalize' }}>{u.idVerification?.idType}</span>
                  {u.idVerification?.idNumber && (
                    <span style={{ fontSize: 11, color: T.textTertiary }}>···{u.idVerification.idNumber}</span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: u.idVerification?.selfiePhoto ? '1fr 1fr' : '1fr', gap: 8, marginBottom: 14 }}>
                  <div onClick={() => setZoomImage(u.idVerification.documentPhoto)} style={{ cursor: 'pointer', borderRadius: T.radiusSm, overflow: 'hidden', border: `1px solid ${T.border}`, position: 'relative' }}>
                    <img src={u.idVerification.documentPhoto} alt="ID document" style={{ width: '100%', height: 120, objectFit: 'cover' }}/>
                    <div style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '2px 7px', fontSize: 9, color: '#fff' }}>ID document</div>
                  </div>
                  {u.idVerification?.selfiePhoto && (
                    <div onClick={() => setZoomImage(u.idVerification.selfiePhoto)} style={{ cursor: 'pointer', borderRadius: T.radiusSm, overflow: 'hidden', border: `1px solid ${T.border}`, position: 'relative' }}>
                      <img src={u.idVerification.selfiePhoto} alt="Selfie" style={{ width: '100%', height: 120, objectFit: 'cover' }}/>
                      <div style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '2px 7px', fontSize: 9, color: '#fff' }}>Selfie</div>
                    </div>
                  )}
                </div>

                <p style={{ margin: '0 0 12px', fontSize: 10, color: T.textTertiary }}>
                  Submitted {new Date(u.idVerification.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>

                {filter === 'pending' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleApprove(u._id)} disabled={actioning[u._id]} style={{
                      flex: 1, padding: 10, borderRadius: T.radiusSm, border: 'none',
                      background: T.success, color: '#062E14', fontSize: 12, fontWeight: 800, fontFamily: T.font,
                      cursor: actioning[u._id] ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    }}>
                      <i className="ti ti-check" style={{ fontSize: 14 }} aria-hidden="true"></i> Approve
                    </button>
                    <button onClick={() => setRejectModal(u._id)} disabled={actioning[u._id]} style={{
                      flex: 1, padding: 10, borderRadius: T.radiusSm, border: `1px solid ${T.danger}`,
                      background: 'transparent', color: '#F87171', fontSize: 12, fontWeight: 700, fontFamily: T.font,
                      cursor: actioning[u._id] ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    }}>
                      <i className="ti ti-x" style={{ fontSize: 14 }} aria-hidden="true"></i> Reject
                    </button>
                  </div>
                )}

                {filter === 'rejected' && u.idVerification?.rejectionReason && (
                  <p style={{ margin: 0, fontSize: 11, color: '#F87171', background: T.dangerBg, borderRadius: T.radiusSm, padding: '8px 11px' }}>
                    {u.idVerification.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {zoomImage && (
        <div onClick={() => setZoomImage(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, cursor: 'zoom-out',
        }}>
          <img src={zoomImage} alt="Zoomed" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 8 }}/>
        </div>
      )}

      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: T.surface, borderRadius: T.radiusMd, padding: 22, maxWidth: 380, width: '100%', border: `1px solid ${T.border}` }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 800, color: T.text }}>Reason for rejection</h3>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
              placeholder="e.g. Document is blurry, ID number not visible..."
              style={{ ...inputStyle, resize: 'none', marginBottom: 14 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} style={{ flex: 1, padding: 10, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: 'transparent', color: T.textSecondary, fontSize: 13, cursor: 'pointer', fontFamily: T.font }}>
                Cancel
              </button>
              <button onClick={handleReject} style={{ flex: 1, padding: 10, borderRadius: T.radiusSm, border: 'none', background: T.danger, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: T.font }}>
                Confirm reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminVerifications() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <VerificationsContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}