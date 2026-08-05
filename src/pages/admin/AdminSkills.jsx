import { useState, useEffect } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, inputStyle } from './adminTheme';

function SkillsContent() {
  const [skills, setSkills]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding, setAdding]   = useState(false);
  const [error, setError]     = useState('');
  const [filter, setFilter]   = useState('active'); // active | inactive | all
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName]   = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminAxios.get('/api/admin/skills');
      setSkills(data.skills || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError(''); setAdding(true);
    try {
      await adminAxios.post('/api/admin/skills', { name: newName.trim() });
      setNewName('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add skill');
    } finally { setAdding(false); }
  };

  const handleRemove = async (id, name) => {
    if (!confirm(`Remove "${name}" from the active skill list? Workers who already selected it keep it on their profile — this only hides it from future dropdowns.`)) return;
    try {
      await adminAxios.delete(`/api/admin/skills/${id}`);
      load();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleRestore = async (id) => {
    try {
      await adminAxios.patch(`/api/admin/skills/${id}`, { active: true });
      load();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const startEdit = (skill) => { setEditingId(skill._id); setEditName(skill.name); };
  const cancelEdit = () => { setEditingId(null); setEditName(''); };
  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await adminAxios.patch(`/api/admin/skills/${id}`, { name: editName.trim() });
      setEditingId(null);
      load();
    } catch (err) { alert(err.response?.data?.message || 'Could not rename'); }
  };

  const filtered = skills.filter(s => {
    if (filter === 'active') return s.active;
    if (filter === 'inactive') return !s.active;
    return true;
  });

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Skills</h1>
      <p style={{ margin: '0 0 22px', fontSize: 13.5, color: T.textTertiary }}>
        Manage the skill options shown across registration, job posting, and search
      </p>

      {/* Add new skill */}
      <form onSubmit={handleAdd} style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusMd,
        padding: 18, marginBottom: 22, display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="e.g. Tile Layer, AC Technician, Gardener..."
            style={inputStyle}
          />
          {error && <p style={{ margin: '8px 0 0', fontSize: 12, color: T.danger }}>{error}</p>}
        </div>
        <button type="submit" disabled={adding || !newName.trim()} style={{
          padding: '11px 20px', borderRadius: T.radiusSm, border: 'none',
          background: newName.trim() ? T.accent : T.border, color: '#fff',
          fontSize: 13, fontWeight: 700, cursor: newName.trim() ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', gap: 7, fontFamily: T.font, flexShrink: 0,
        }}>
          <i className="ti ti-plus" style={{ fontSize: 16 }} aria-hidden="true"></i>
          {adding ? 'Adding...' : 'Add skill'}
        </button>
      </form>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['active', 'inactive', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, fontFamily: T.font,
            border: filter === f ? `1px solid ${T.accent}` : `1px solid ${T.border}`,
            background: filter === f ? T.accentBg : 'transparent',
            color: filter === f ? '#A5B4FC' : T.textTertiary,
            cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {f}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: T.textTertiary, fontSize: 13.5 }}>Loading...</p>}

      {!loading && filtered.length === 0 && (
        <p style={{ textAlign: 'center', padding: 40, color: T.textTertiary, fontSize: 13 }}>
          No {filter !== 'all' ? filter : ''} skills
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {filtered.map(skill => (
          <div key={skill._id} style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
            padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 10,
            opacity: skill.active ? 1 : 0.6,
          }}>
            {editingId === skill._id ? (
              <>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  autoFocus
                  style={{ ...inputStyle, padding: '7px 10px', fontSize: 13 }}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(skill._id); if (e.key === 'Escape') cancelEdit(); }}
                />
                <button onClick={() => saveEdit(skill._id)} style={{ background: T.success, border: 'none', borderRadius: 6, width: 28, height: 28, color: '#fff', cursor: 'pointer', flexShrink: 0 }}>
                  <i className="ti ti-check" style={{ fontSize: 14 }} aria-hidden="true"></i>
                </button>
                <button onClick={cancelEdit} style={{ background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 6, width: 28, height: 28, color: T.textTertiary, cursor: 'pointer', flexShrink: 0 }}>
                  <i className="ti ti-x" style={{ fontSize: 14 }} aria-hidden="true"></i>
                </button>
              </>
            ) : (
              <>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: skill.active ? T.success : T.textTertiary,
                }}></span>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {skill.name}
                </span>
                {skill.active ? (
                  <>
                    <button onClick={() => startEdit(skill)} title="Rename" style={{ background: 'transparent', border: 'none', color: T.textTertiary, cursor: 'pointer', padding: 4 }}>
                      <i className="ti ti-pencil" style={{ fontSize: 15 }} aria-hidden="true"></i>
                    </button>
                    <button onClick={() => handleRemove(skill._id, skill.name)} title="Remove" style={{ background: 'transparent', border: 'none', color: T.danger, cursor: 'pointer', padding: 4 }}>
                      <i className="ti ti-trash" style={{ fontSize: 15 }} aria-hidden="true"></i>
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleRestore(skill._id)} style={{
                    background: T.successBg, border: 'none', borderRadius: 6, padding: '5px 10px',
                    color: T.success, fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: T.font,
                  }}>
                    Restore
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminSkills() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <SkillsContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}