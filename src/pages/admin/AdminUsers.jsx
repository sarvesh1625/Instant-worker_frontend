import { useState, useEffect } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, ROLE_COLOR, STATUS_COLOR, inputStyle, labelStyle } from './Admintheme ';

function UsersContent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [actionReason, setActionReason] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', phone: '', password: '', role: 'worker', skill: '', city: '' });
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(false);
  const [activeConvo, setActiveConvo] = useState(null);
  const [convoMessages, setConvoMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      const { data } = await adminAxios.get(`/api/admin/users?${params}`);
      setUsers(data.users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [role, status]);

  const handleSearch = (e) => { e.preventDefault(); load(); };

  const openUserDetail = async (userId) => {
    try {
      const { data } = await adminAxios.get(`/api/admin/users/${userId}`);
      setSelectedUser(data);
      setEditMode(false);
      setConversations([]);
      setActiveConvo(null);
      setEditForm({
        name: data.user.name || '', phone: data.user.phone || '',
        city: data.user.city || '', area: data.user.area || '',
        bio: data.user.bio || '', role: data.user.role || 'worker',
        skill: data.user.worker?.skill || '', wagePerDay: data.user.worker?.wagePerDay || '',
        newPassword: '',
      });
    } catch (err) { console.error(err); }
  };

  const handleSuspend = async () => {
    try {
      await adminAxios.patch(`/api/admin/users/${actionModal.userId}/${actionModal.type}`, { reason: actionReason });
      setActionModal(null); setActionReason(''); setSelectedUser(null);
      load();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleReactivate = async (userId) => {
    try {
      await adminAxios.patch(`/api/admin/users/${userId}/reactivate`);
      setSelectedUser(null); load();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddError(''); setAdding(true);
    try {
      await adminAxios.post('/api/admin/users', addForm);
      setShowAddModal(false);
      setAddForm({ name: '', phone: '', password: '', role: 'worker', skill: '', city: '' });
      load();
    } catch (err) {
      setAddError(err.response?.data?.message || 'Could not create user');
    } finally { setAdding(false); }
  };

  const handleSaveEdit = async () => {
    setEditError(''); setSaving(true);
    try {
      const payload = {
        name: editForm.name, phone: editForm.phone,
        city: editForm.city, area: editForm.area, bio: editForm.bio,
        role: editForm.role,
      };
      if (editForm.role === 'worker') {
        payload.worker = { skill: editForm.skill, wagePerDay: Number(editForm.wagePerDay) || 0 };
      }
      if (editForm.newPassword && editForm.newPassword.trim()) {
        if (editForm.newPassword.trim().length < 6) {
          setEditError('New password must be at least 6 characters');
          setSaving(false);
          return;
        }
        payload.newPassword = editForm.newPassword.trim();
      }
      const { data } = await adminAxios.put(`/api/admin/users/${selectedUser.user._id}`, payload);
      setSelectedUser(prev => ({ ...prev, user: data.user }));
      setEditMode(false);
      load();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Could not save changes');
    } finally { setSaving(false); }
  };

  const handleDeleteUser = async () => {
    if (deleteConfirm.trim().toUpperCase() !== 'DELETE') return;
    setDeleting(true);
    try {
      await adminAxios.delete(`/api/admin/users/${selectedUser.user._id}`);
      setShowDeleteModal(false); setDeleteConfirm(''); setSelectedUser(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete user');
    } finally { setDeleting(false); }
  };

  const loadConversations = async () => {
    setLoadingConvos(true);
    try {
      const { data } = await adminAxios.get(`/api/admin/users/${selectedUser.user._id}/conversations`);
      setConversations(data.conversations || []);
    } catch (err) { console.error(err); }
    finally { setLoadingConvos(false); }
  };

  const openConversation = async (conversationId) => {
    setActiveConvo(conversationId);
    setLoadingMessages(true);
    try {
      const { data } = await adminAxios.get(`/api/admin/chat/${conversationId}`);
      setConvoMessages(data.messages || []);
    } catch (err) { console.error(err); }
    finally { setLoadingMessages(false); }
  };

  const roleC = (r) => ROLE_COLOR[r] || { color: T.textTertiary, bg: 'rgba(148,163,184,.14)' };
  const statusC = (s) => STATUS_COLOR[s] || { color: T.textTertiary, bg: 'rgba(148,163,184,.14)' };

  const selectStyle = { ...inputStyle, cursor: 'pointer' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Users</h1>
          <p style={{ margin: 0, fontSize: 13.5, color: T.textTertiary }}>Manage worker and user accounts</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{
          padding: '10px 18px', borderRadius: T.radiusSm, border: 'none',
          background: T.success, color: '#062E14', fontSize: 13, fontWeight: 800, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7, fontFamily: T.font,
        }}>
          <i className="ti ti-user-plus" style={{ fontSize: 16 }} aria-hidden="true"></i>
          Add user
        </button>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginTop: 20, marginBottom: 18, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or phone..."
          style={{ ...inputStyle, flex: 1, minWidth: 200 }} />
        <select value={role} onChange={e => setRole(e.target.value)} style={{ ...selectStyle, width: 'auto', minWidth: 130 }}>
          <option value="">All roles</option>
          <option value="worker">Worker</option>
          <option value="user">User</option>
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...selectStyle, width: 'auto', minWidth: 130 }}>
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
        <button type="submit" style={{
          padding: '11px 20px', borderRadius: T.radiusSm, border: 'none',
          background: T.accent, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: T.font,
        }}>
          Search
        </button>
      </form>

      {loading && <p style={{ color: T.textTertiary, fontSize: 13.5 }}>Loading...</p>}

      <div style={{ background: T.surface, borderRadius: T.radiusMd, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
        {users.map((u, idx) => {
          const rc = roleC(u.role), sc = statusC(u.accountStatus);
          return (
            <div key={u._id} onClick={() => openUserDetail(u._id)} style={{
              display: 'flex', alignItems: 'center', gap: 13, padding: '14px 18px',
              borderBottom: idx < users.length - 1 ? `1px solid ${T.border}` : 'none',
              cursor: 'pointer', transition: 'background .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.surfaceHover}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: T.surfaceElevated, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: T.text, overflow: 'hidden', flexShrink: 0 }}>
                {u.profilePhoto ? <img src={u.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt=""/> : u.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: T.text }}>{u.name}</p>
                  {u.isVerified && <i className="ti ti-shield-check" style={{ fontSize: 14, color: T.success }} aria-hidden="true"></i>}
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: T.textTertiary }}>{u.phone}{u.city ? ` · ${u.city}` : ''}</p>
              </div>
              <span style={{ background: rc.bg, color: rc.color, fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 999, textTransform: 'capitalize' }}>{u.role}</span>
              <span style={{ background: sc.bg, color: sc.color, fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 999, textTransform: 'capitalize' }}>{u.accountStatus}</span>
              <i className="ti ti-chevron-right" style={{ fontSize: 16, color: T.textTertiary }} aria-hidden="true"></i>
            </div>
          );
        })}
        {!loading && users.length === 0 && (
          <p style={{ textAlign: 'center', padding: 40, color: T.textTertiary, fontSize: 13 }}>No users found</p>
        )}
      </div>

      {/* ══ User detail drawer ══ */}
      {selectedUser && (
        <div onClick={() => setSelectedUser(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1500, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, background: T.surface, height: '100%', overflowY: 'auto', padding: 22, borderLeft: `1px solid ${T.border}` }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: T.text }}>
                {activeConvo ? 'Conversation' : 'User details'}
              </h2>
              <button onClick={() => activeConvo ? setActiveConvo(null) : setSelectedUser(null)} style={{ background: T.surfaceElevated, border: `1px solid ${T.border}`, borderRadius: 8, width: 32, height: 32, color: T.textSecondary, fontSize: 17, cursor: 'pointer' }}>
                <i className={`ti ti-${activeConvo ? 'arrow-left' : 'x'}`} aria-hidden="true"></i>
              </button>
            </div>

            {activeConvo && (
              <div>
                {loadingMessages && <p style={{ color: T.textTertiary, fontSize: 13 }}>Loading messages...</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {convoMessages.map(m => {
                    const isFirstUser = m.sender?._id === selectedUser.user._id;
                    return (
                      <div key={m._id} style={{ display: 'flex', flexDirection: 'column', alignItems: isFirstUser ? 'flex-start' : 'flex-end' }}>
                        <div style={{ maxWidth: '80%', background: isFirstUser ? T.surfaceElevated : T.accentBg, borderRadius: 12, padding: '9px 13px' }}>
                          {m.type === 'voice'
                            ? <p style={{ margin: 0, fontSize: 12.5, color: T.text }}>🎤 Voice message</p>
                            : <p style={{ margin: 0, fontSize: 13, color: T.text }}>{m.text}</p>}
                        </div>
                        <p style={{ margin: '3px 4px 0', fontSize: 10, color: T.textTertiary }}>
                          {m.sender?.name} · {new Date(m.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    );
                  })}
                  {!loadingMessages && convoMessages.length === 0 && (
                    <p style={{ textAlign: 'center', color: T.textTertiary, fontSize: 13, padding: 30 }}>No messages in this conversation</p>
                  )}
                </div>
              </div>
            )}

            {!activeConvo && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 18 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.surfaceElevated, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 700, color: T.text, overflow: 'hidden' }}>
                    {selectedUser.user.profilePhoto ? <img src={selectedUser.user.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt=""/> : selectedUser.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: T.text }}>{selectedUser.user.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: T.textTertiary }}>{selectedUser.user.phone}</p>
                  </div>
                  {!editMode && (
                    <button onClick={() => setEditMode(true)} style={{ background: T.accentBg, border: `1px solid ${T.accent}`, color: '#A5B4FC', borderRadius: T.radiusSm, padding: '7px 13px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.font }}>
                      <i className="ti ti-pencil" style={{ fontSize: 13, marginRight: 4 }} aria-hidden="true"></i>Edit
                    </button>
                  )}
                </div>

                {!editMode && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
                    {(() => { const rc = roleC(selectedUser.user.role); return (
                      <span style={{ background: rc.bg, color: rc.color, fontSize: 11, fontWeight: 700, padding: '4px 11px', borderRadius: 999, textTransform: 'capitalize' }}>{selectedUser.user.role}</span>
                    ); })()}
                    {(() => { const sc = statusC(selectedUser.user.accountStatus); return (
                      <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, padding: '4px 11px', borderRadius: 999, textTransform: 'capitalize' }}>{selectedUser.user.accountStatus}</span>
                    ); })()}
                    {selectedUser.user.isVerified && (
                      <span style={{ background: T.successBg, color: T.success, fontSize: 11, fontWeight: 700, padding: '4px 11px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="ti ti-shield-check" style={{ fontSize: 13 }} aria-hidden="true"></i> Verified
                      </span>
                    )}
                  </div>
                )}

                {editMode && (
                  <div style={{ marginBottom: 22 }}>
                    {editError && (
                      <div style={{ background: T.dangerBg, border: '1px solid rgba(239,68,68,.3)', borderRadius: T.radiusSm, padding: '9px 13px', marginBottom: 14 }}>
                        <p style={{ margin: 0, fontSize: 12, color: '#FCA5A5' }}>{editError}</p>
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={labelStyle}>Name</label>
                        <input style={inputStyle} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                      </div>
                      <div>
                        <label style={labelStyle}>Phone</label>
                        <input style={inputStyle} value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={labelStyle}>City</label>
                        <input style={inputStyle} value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} />
                      </div>
                      <div>
                        <label style={labelStyle}>Area</label>
                        <input style={inputStyle} value={editForm.area} onChange={e => setEditForm({ ...editForm, area: e.target.value })} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={labelStyle}>Role</label>
                      <select style={{ ...inputStyle, cursor: 'pointer' }} value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
                        <option value="worker">Worker</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                    {editForm.role === 'worker' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                          <label style={labelStyle}>Skill</label>
                          <input style={inputStyle} value={editForm.skill} onChange={e => setEditForm({ ...editForm, skill: e.target.value })} />
                        </div>
                        <div>
                          <label style={labelStyle}>Daily wage (₹)</label>
                          <input style={inputStyle} type="number" value={editForm.wagePerDay} onChange={e => setEditForm({ ...editForm, wagePerDay: e.target.value })} />
                        </div>
                      </div>
                    )}
                    <div style={{ marginBottom: 12 }}>
                      <label style={labelStyle}>Bio</label>
                      <textarea style={{ ...inputStyle, resize: 'none' }} rows={2} value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>
                        Reset password <span style={{ color: T.textTertiary, textTransform: 'none', fontWeight: 400 }}>(leave blank to keep current)</span>
                      </label>
                      <input style={inputStyle} type="text" placeholder="New password (min 6 characters)"
                        value={editForm.newPassword || ''} onChange={e => setEditForm({ ...editForm, newPassword: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setEditMode(false)} style={{ flex: 1, padding: 11, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: 'transparent', color: T.textSecondary, fontSize: 13, cursor: 'pointer', fontFamily: T.font }}>
                        Cancel
                      </button>
                      <button onClick={handleSaveEdit} disabled={saving} style={{ flex: 1, padding: 11, borderRadius: T.radiusSm, border: 'none', background: T.accent, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: T.font }}>
                        {saving ? 'Saving...' : 'Save changes'}
                      </button>
                    </div>
                  </div>
                )}

                {!editMode && (
                  <>
                    {selectedUser.user.suspendedReason && (
                      <div style={{ background: T.warningBg, border: '1px solid rgba(245,158,11,.3)', borderRadius: T.radiusSm, padding: 12, marginBottom: 18 }}>
                        <p style={{ margin: 0, fontSize: 12, color: '#FCD34D', fontWeight: 700 }}>Suspension reason:</p>
                        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#FDE68A' }}>{selectedUser.user.suspendedReason}</p>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 22 }}>
                      {[
                        { label: 'Jobs posted', value: selectedUser.activity.jobsPosted },
                        { label: 'Jobs worked', value: selectedUser.activity.jobsWorked },
                        { label: 'Reports against', value: selectedUser.activity.reportsAgainstCount, danger: selectedUser.activity.reportsAgainstCount > 0 },
                        { label: 'Reviews received', value: selectedUser.reviews.length },
                      ].map(s => (
                        <div key={s.label} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: 12, textAlign: 'center' }}>
                          <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: s.danger ? '#F87171' : T.text }}>{s.value}</p>
                          <p style={{ margin: 0, fontSize: 10, color: T.textTertiary }}>{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: 22 }}>
                      <button onClick={loadConversations} style={{
                        width: '100%', padding: 12, borderRadius: T.radiusSm, border: `1px solid ${T.border}`,
                        background: T.bg, color: T.textSecondary, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: T.font,
                      }}>
                        <i className="ti ti-message-2" style={{ fontSize: 16 }} aria-hidden="true"></i>
                        {conversations.length > 0 ? `${conversations.length} conversation(s)` : 'View chat history'}
                      </button>

                      {loadingConvos && <p style={{ fontSize: 12, color: T.textTertiary, marginTop: 8 }}>Loading...</p>}

                      {conversations.length > 0 && (
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {conversations.map(c => (
                            <button key={c.conversationId} onClick={() => openConversation(c.conversationId)} style={{
                              display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                              background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
                              padding: '10px 12px', cursor: 'pointer', fontFamily: T.font,
                            }}>
                              <div style={{ width: 30, height: 30, borderRadius: '50%', background: T.surfaceElevated, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: T.text, flexShrink: 0 }}>
                                {c.otherUser?.name?.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: T.text }}>{c.otherUser?.name}</p>
                                <p style={{ margin: 0, fontSize: 11, color: T.textTertiary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.lastMessage}</p>
                              </div>
                              <i className="ti ti-chevron-right" style={{ fontSize: 15, color: T.textTertiary, flexShrink: 0 }} aria-hidden="true"></i>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedUser.reportsAgainst.length > 0 && (
                      <div style={{ marginBottom: 22 }}>
                        <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, color: T.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em' }}>Reports against this user</p>
                        {selectedUser.reportsAgainst.slice(0, 5).map(r => (
                          <div key={r._id} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: 10, marginBottom: 6 }}>
                            <p style={{ margin: 0, fontSize: 12, color: '#F87171', fontWeight: 700, textTransform: 'capitalize' }}>{r.reason.replace(/_/g, ' ')}</p>
                            <p style={{ margin: '2px 0 0', fontSize: 11, color: T.textTertiary }}>by {r.reportedBy?.name} · {new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      {selectedUser.user.accountStatus === 'active' ? (
                        <>
                          <button onClick={() => setActionModal({ type: 'suspend', userId: selectedUser.user._id })} style={{ flex: 1, padding: 11, borderRadius: T.radiusSm, border: `1px solid ${T.warning}`, background: 'transparent', color: '#FCD34D', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.font }}>
                            Suspend
                          </button>
                          <button onClick={() => setActionModal({ type: 'ban', userId: selectedUser.user._id })} style={{ flex: 1, padding: 11, borderRadius: T.radiusSm, border: `1px solid ${T.danger}`, background: 'transparent', color: '#F87171', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.font }}>
                            Ban
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleReactivate(selectedUser.user._id)} style={{ flex: 1, padding: 11, borderRadius: T.radiusSm, border: 'none', background: T.success, color: '#062E14', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: T.font }}>
                          Reactivate account
                        </button>
                      )}
                    </div>

                    <button onClick={() => setShowDeleteModal(true)} style={{
                      width: '100%', padding: 11, borderRadius: T.radiusSm, border: '1px solid rgba(239,68,68,0.35)',
                      background: 'rgba(239,68,68,0.06)', color: '#FCA5A5', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.font,
                    }}>
                      <i className="ti ti-trash" style={{ fontSize: 13, marginRight: 5 }} aria-hidden="true"></i>
                      Delete account permanently
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ══ Suspend/Ban modal ══ */}
      {actionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: T.surface, borderRadius: T.radiusMd, padding: 22, maxWidth: 380, width: '100%', border: `1px solid ${T.border}` }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: T.text, textTransform: 'capitalize' }}>{actionModal.type} this user?</h3>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: T.textTertiary }}>Provide a reason — this will be visible to the user.</p>
            <textarea value={actionReason} onChange={e => setActionReason(e.target.value)} rows={3} placeholder="Reason..."
              style={{ ...inputStyle, resize: 'none', marginBottom: 14 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setActionModal(null); setActionReason(''); }} style={{ flex: 1, padding: 11, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: 'transparent', color: T.textSecondary, fontSize: 13, cursor: 'pointer', fontFamily: T.font }}>
                Cancel
              </button>
              <button onClick={handleSuspend} style={{
                flex: 1, padding: 11, borderRadius: T.radiusSm, border: 'none',
                background: actionModal.type === 'ban' ? T.danger : T.warning, color: '#fff',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize', fontFamily: T.font,
              }}>
                Confirm {actionModal.type}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Add user modal ══ */}
      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: T.surface, borderRadius: T.radiusMd, padding: 24, maxWidth: 420, width: '100%', border: `1px solid ${T.border}` }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: T.text }}>Add a new user</h3>
            <p style={{ margin: '0 0 18px', fontSize: 12, color: T.textTertiary }}>Creates an account directly — skips OTP verification.</p>

            {addError && (
              <div style={{ background: T.dangerBg, border: '1px solid rgba(239,68,68,.3)', borderRadius: T.radiusSm, padding: '10px 14px', marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 12, color: '#FCA5A5' }}>{addError}</p>
              </div>
            )}

            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Full name</label>
                <input required style={inputStyle} value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input required style={inputStyle} value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input required type="password" style={inputStyle} value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Role</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })}>
                    <option value="worker">Worker</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input style={inputStyle} value={addForm.city} onChange={e => setAddForm({ ...addForm, city: e.target.value })} />
                </div>
              </div>
              {addForm.role === 'worker' && (
                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>Skill</label>
                  <input style={inputStyle} value={addForm.skill} onChange={e => setAddForm({ ...addForm, skill: e.target.value })} />
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: 12, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: 'transparent', color: T.textSecondary, fontSize: 13, cursor: 'pointer', fontFamily: T.font }}>
                  Cancel
                </button>
                <button type="submit" disabled={adding} style={{ flex: 1, padding: 12, borderRadius: T.radiusSm, border: 'none', background: T.success, color: '#062E14', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: T.font }}>
                  {adding ? 'Creating...' : 'Create user'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ Delete confirmation modal ══ */}
      {showDeleteModal && (
        <div onClick={() => setShowDeleteModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: T.surface, borderRadius: T.radiusMd, padding: 24, maxWidth: 380, width: '100%', border: `1px solid ${T.danger}` }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: T.dangerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <i className="ti ti-alert-triangle" style={{ fontSize: 24, color: '#F87171' }} aria-hidden="true"></i>
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 800, color: T.text, textAlign: 'center' }}>
              Permanently delete this account?
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: 12.5, color: T.textSecondary, textAlign: 'center', lineHeight: 1.6 }}>
              This removes {selectedUser?.user?.name}'s profile, job history, messages, and reviews.
              <strong style={{ color: '#F87171' }}> This cannot be undone.</strong>
            </p>
            <label style={{ ...labelStyle, textAlign: 'center', display: 'block' }}>
              Type <strong style={{ color: '#F87171' }}>DELETE</strong> to confirm
            </label>
            <input style={{ ...inputStyle, textAlign: 'center', marginBottom: 16 }} value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }} style={{ flex: 1, padding: 12, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, background: 'transparent', color: T.textSecondary, fontSize: 13, cursor: 'pointer', fontFamily: T.font }}>
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting || deleteConfirm.trim().toUpperCase() !== 'DELETE'}
                style={{
                  flex: 1, padding: 12, borderRadius: T.radiusSm, border: 'none',
                  background: deleteConfirm.trim().toUpperCase() === 'DELETE' ? T.danger : T.border,
                  color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: T.font,
                  cursor: deleteConfirm.trim().toUpperCase() === 'DELETE' ? 'pointer' : 'not-allowed',
                }}>
                {deleting ? 'Deleting...' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsers() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <UsersContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}