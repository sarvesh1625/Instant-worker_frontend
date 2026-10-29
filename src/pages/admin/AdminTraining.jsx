import { useState, useEffect, useCallback } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T } from './adminTheme';

const btn = (bg, color, border) => ({
  padding: '8px 12px', borderRadius: T.radiusSm, border: border || 'none', background: bg, color,
  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.font,
});
const field = {
  width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: T.radiusSm,
  border: `1px solid ${T.borderStrong}`, fontSize: 14, fontFamily: T.font, background: T.bg, color: T.text,
  outline: 'none', colorScheme: 'dark',
};
const label = { display: 'block', margin: '0 0 7px', fontSize: 11.5, fontWeight: 700, color: T.textSecondary, textTransform: 'uppercase', letterSpacing: '.06em' };
const hint  = { margin: '6px 0 0', fontSize: 12, color: T.textTertiary, lineHeight: 1.5 };
const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 16 };

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

      <form onSubmit={upload} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: 24, maxWidth: 820, marginBottom: 32 }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: T.text }}>Add a video</p>

        <div style={grid2}>
          <div>
            <label style={label}>Title</label>
            <input style={field} value={form.title} maxLength={120} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. How to get work on Instant Worker" />
          </div>
          <div>
            <label style={label}>Who must watch it</label>
            <select style={field} value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}>
              {AUDIENCES.map(a => <option key={a.value} value={a.value} style={{ background: T.surface, color: T.text }}>{a.title}</option>)}
            </select>
          </div>
        </div>

        <div style={grid2}>
          <div>
            <label style={label}>Upload a video file</label>
            <label htmlFor="training-file" style={{
              ...field, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', borderStyle: 'dashed',
            }}>
              <span style={{ background: T.accentBg, color: T.accent, fontWeight: 700, fontSize: 12.5, padding: '5px 11px', borderRadius: 8, flexShrink: 0 }}>Choose file</span>
              <span style={{ color: file ? T.text : T.textTertiary, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file ? file.name : 'No file chosen (max 100 MB)'}
              </span>
            </label>
            <input id="training-file" type="file" accept="video/*" onChange={e => setFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
          </div>
          <div>
            <label style={label}>…or paste a video link</label>
            <input style={{ ...field, opacity: file ? 0.5 : 1 }} value={form.url} disabled={!!file} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://…/video.mp4" />
            <p style={hint}>Direct link, starts with https.</p>
          </div>
        </div>

        <div style={grid2}>
          <div>
            <label style={label}>Order</label>
            <input style={field} type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} placeholder="0" />
            <p style={hint}>Lower number is shown first.</p>
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: T.radiusSm, border: `1px solid ${form.requireExisting ? T.accent : T.border}`, background: form.requireExisting ? T.accentBg : 'transparent', cursor: 'pointer', alignSelf: 'end' }}>
            <input type="checkbox" checked={form.requireExisting} onChange={e => setForm(f => ({ ...f, requireExisting: e.target.checked }))} style={{ marginTop: 3, accentColor: T.accent, width: 16, height: 16 }} />
            <span style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.5 }}>
              <b style={{ color: T.text }}>Also require existing users</b><br />
              Leave off to ask only new sign-ups. Turn on to test with your own accounts.
            </span>
          </label>
        </div>

        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button type="submit" disabled={busy === 'upload'} style={{ ...btn(T.accent, '#fff'), padding: '11px 22px', fontSize: 13.5, borderRadius: T.radiusSm }}>
            {busy === 'upload' ? `Uploading… ${progress}%` : 'Add video'}
          </button>
          {busy === 'upload' && <span style={{ fontSize: 12.5, color: T.textTertiary }}>Keep this page open until it finishes.</span>}
        </div>
      </form>

      {loading && <p style={{ color: T.textTertiary, fontSize: 13.5 }}>Loading...</p>}

      {AUDIENCES.map(a => {
        const list = videos.filter(v => v.audience === a.value);
        return (
          <div key={a.value} style={{ marginBottom: 26 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 800, color: T.text }}>{a.title} ({list.length})</h2>
            {list.length === 0 && <div style={{ border: `1px dashed ${T.borderStrong}`, borderRadius: T.radiusMd, padding: 18, color: T.textTertiary, fontSize: 13.5 }}>No video yet — nobody in this group is asked to watch anything.</div>}
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