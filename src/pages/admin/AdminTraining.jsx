import { useState, useEffect, useCallback } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T } from './adminTheme';

const btn = (bg, color, border) => ({
  padding: '8px 12px', borderRadius: T.radiusSm, border: border || 'none', background: bg, color,
  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.font,
});
const field = {
  width: '100%', boxSizing: 'border-box', padding: '9px 11px', borderRadius: T.radiusSm,
  border: `1px solid ${T.border}`, fontSize: 13.5, fontFamily: T.font, background: '#fff', color: T.text,
};
const label = { display: 'block', margin: '12px 0 5px', fontSize: 12.5, fontWeight: 700, color: T.textSecondary };

const AUDIENCES = [
  { value: 'worker', title: 'Workers (people who work)' },
  { value: 'user',   title: 'Users (people who hire)' },
];

function TrainingContent() {
  const [videos, setVideos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]       = useState('');
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState({ title: '', audience: 'worker', order: 0, url: '', requireExisting: false });
  const [file, setFile] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await adminAxios.get('/api/training/admin');
      setVideos(data.videos || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const upload = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Enter a title');
    if (!file && !form.url.trim()) return alert('Choose a video file or paste a video link');
    if (file && file.size > 100 * 1024 * 1024) return alert('The file is bigger than 100 MB. Compress it or paste a link instead.');
    const fd = new FormData();
    fd.append('title', form.title.trim());
    fd.append('audience', form.audience);
    fd.append('order', String(form.order || 0));
    fd.append('requireExisting', String(form.requireExisting));
    if (file) fd.append('video', file); else fd.append('url', form.url.trim());
    setBusy('upload'); setProgress(0);
    try {
      await adminAxios.post('/api/training/admin', fd, {
        onUploadProgress: (p) => setProgress(p.total ? Math.round((p.loaded / p.total) * 100) : 0),
        timeout: 0,
      });
      setForm({ title: '', audience: form.audience, order: 0, url: '', requireExisting: false });
      setFile(null);
      document.getElementById('training-file') && (document.getElementById('training-file').value = '');
      await load();
    } catch (err) { alert(err.response?.data?.message || 'Upload failed'); }
    finally { setBusy(''); setProgress(0); }
  };

  const patch = async (v, body) => {
    setBusy(v._id);
    try { await adminAxios.patch(`/api/training/admin/${v._id}`, body); await load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setBusy(''); }
  };

  const remove = async (v) => {
    if (!confirm(`Delete "${v.title}"? People who already watched it keep access, but the video is gone.`)) return;
    setBusy(v._id);
    try { await adminAxios.delete(`/api/training/admin/${v._id}`); await load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setBusy(''); }
  };

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Training videos</h1>
      <p style={{ margin: '0 0 22px', fontSize: 13.5, color: T.textTertiary }}>
        After signing up, people must watch the videos for their type before they can use the app. Workers and users get different videos.
      </p>

      <form onSubmit={upload} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: 18, maxWidth: 640, marginBottom: 28 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: T.text }}>Add a video</p>

        <label style={label}>Title</label>
        <input style={field} value={form.title} maxLength={120} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. How to get work on Instant Worker" />

        <label style={label}>Who must watch it</label>
        <select style={field} value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}>
          {AUDIENCES.map(a => <option key={a.value} value={a.value}>{a.title}</option>)}
        </select>

        <label style={label}>Video file (up to 100 MB)</label>
        <input id="training-file" type="file" accept="video/*" onChange={e => setFile(e.target.files?.[0] || null)} style={{ fontSize: 13 }} />

        <label style={label}>…or paste a direct video link (https, ends in .mp4)</label>
        <input style={field} value={form.url} disabled={!!file} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://…/video.mp4" />

        <label style={label}>Order (lower number is shown first)</label>
        <input style={{ ...field, width: 110 }} type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} />

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, margin: '14px 0 0', fontSize: 12.5, color: T.textSecondary, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.requireExisting} onChange={e => setForm(f => ({ ...f, requireExisting: e.target.checked }))} style={{ marginTop: 2 }} />
          <span>Also make people who already have an account watch it. (Leave unticked to require it only for new sign-ups. Tick it to test with your own test accounts.)</span>
        </label>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="submit" disabled={busy === 'upload'} style={btn(T.accent, '#fff')}>{busy === 'upload' ? `Uploading… ${progress}%` : 'Add video'}</button>
          {busy === 'upload' && <span style={{ fontSize: 12, color: T.textTertiary }}>Keep this page open until it finishes.</span>}
        </div>
      </form>

      {loading && <p style={{ color: T.textTertiary, fontSize: 13.5 }}>Loading...</p>}

      {AUDIENCES.map(a => {
        const list = videos.filter(v => v.audience === a.value);
        return (
          <div key={a.value} style={{ marginBottom: 26 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 800, color: T.text }}>{a.title} ({list.length})</h2>
            {list.length === 0 && <p style={{ color: T.textTertiary, fontSize: 13.5 }}>No video yet — nobody in this group is asked to watch anything.</p>}
            <div style={{ display: 'grid', gap: 10 }}>
              {list.map(v => (
                <div key={v._id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: 14, opacity: v.active ? 1 : 0.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, color: T.text }}>#{v.order} · {v.title}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: T.textTertiary }}>
                        {v.active ? 'Required' : 'Switched off'} · watched by {v.watchedBy} · {v.requireExisting ? 'everyone' : 'new sign-ups only'} · added {new Date(v.createdAt).toLocaleDateString()}
                      </p>
                      <a href={v.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: T.accent, fontWeight: 700 }}>Preview</a>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <button disabled={busy === v._id} onClick={() => patch(v, { active: !v.active })} style={btn('transparent', T.textSecondary, `1px solid ${T.border}`)}>{v.active ? 'Switch off' : 'Switch on'}</button>
                      <button disabled={busy === v._id} onClick={() => patch(v, { requireExisting: !v.requireExisting })} style={btn('transparent', T.textSecondary, `1px solid ${T.border}`)}>{v.requireExisting ? 'New sign-ups only' : 'Require everyone'}</button>
                      <button disabled={busy === v._id} onClick={() => remove(v)} style={btn('transparent', T.danger, `1px solid ${T.danger}`)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminTraining() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <TrainingContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}