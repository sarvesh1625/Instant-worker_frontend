import { useState, useEffect } from 'react';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T } from './adminTheme';

function SettingsContent() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [toggling, setToggling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const load = async () => {
    try {
      const { data } = await adminAxios.get('/api/admin/settings');
      setSettings(data.settings);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleToggle = async () => {
    setShowConfirm(false);
    setToggling(true);
    try {
      const { data } = await adminAxios.patch('/api/admin/settings/subscriptions', {
        enabled: !settings.subscriptionsEnabled,
      });
      setSettings(data.settings);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update setting');
    } finally { setToggling(false); }
  };

  if (loading) return <p style={{ color: T.textTertiary, fontSize: 13.5 }}>Loading...</p>;

  const isOn = settings?.subscriptionsEnabled;

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Platform Settings</h1>
      <p style={{ margin: '0 0 26px', fontSize: 13.5, color: T.textTertiary }}>Global switches that affect the entire platform</p>

      <div style={{
        background: T.surface, border: `1px solid ${isOn ? T.accent : T.border}`, borderRadius: T.radiusMd,
        padding: 24, maxWidth: 640,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13, flexShrink: 0,
            background: isOn ? T.accentBg : 'rgba(148,163,184,.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="ti ti-crown" style={{ fontSize: 23, color: isOn ? T.accent : T.textTertiary }} aria-hidden="true"></i>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: T.text }}>Subscription System</p>
              <span style={{
                fontSize: 10.5, fontWeight: 800, padding: '3px 10px', borderRadius: 999,
                background: isOn ? T.successBg : 'rgba(148,163,184,.14)',
                color: isOn ? T.success : T.textTertiary,
              }}>
                {isOn ? 'ON' : 'OFF'}
              </span>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: 13, color: T.textSecondary, lineHeight: 1.65 }}>
              {isOn ? (
                <>
                  Subscribed workers see every new job (regular and urgent) the moment it's posted.
                  Non-subscribed workers see the same jobs <strong style={{ color: T.text }}>{settings.earlyAccessMinutes} minutes later</strong>.
                  For urgent jobs — which auto-confirm the first worker to accept — this delay has real
                  practical effect, since the job is often already filled by the time a non-subscribed
                  worker sees it.
                </>
              ) : (
                <>
                  Currently off. Every worker sees every job — regular and urgent — at exactly the same
                  time, with no delay of any kind. This is the platform's behavior as it has always worked.
                  Nothing about subscriptions is visible or active anywhere on the platform right now.
                </>
              )}
            </p>

            {isOn && settings.enabledAt && (
              <p style={{ margin: '0 0 16px', fontSize: 11.5, color: T.textTertiary }}>
                Enabled on {new Date(settings.enabledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}

            <button
              onClick={() => setShowConfirm(true)}
              disabled={toggling}
              style={{
                padding: '11px 22px', borderRadius: T.radiusSm, border: 'none',
                background: isOn ? T.dangerBg : T.accent,
                color: isOn ? '#FCA5A5' : '#fff',
                fontSize: 13, fontWeight: 700, cursor: toggling ? 'wait' : 'pointer',
                fontFamily: T.font, display: 'flex', alignItems: 'center', gap: 7,
              }}
            >
              <i className={`ti ${isOn ? 'ti-power' : 'ti-crown'}`} style={{ fontSize: 16 }} aria-hidden="true"></i>
              {toggling ? 'Updating...' : isOn ? 'Turn OFF subscriptions' : 'Turn ON subscriptions'}
            </button>
          </div>
        </div>
      </div>

      {!isOn && (
        <div style={{
          marginTop: 16, maxWidth: 640, background: 'rgba(245,158,11,.08)',
          border: '1px solid rgba(245,158,11,.25)', borderRadius: T.radiusSm,
          padding: '13px 16px', display: 'flex', gap: 10,
        }}>
          <i className="ti ti-info-circle" style={{ fontSize: 17, color: T.warning, flexShrink: 0, marginTop: 1 }} aria-hidden="true"></i>
          <p style={{ margin: 0, fontSize: 12, color: '#FCD34D', lineHeight: 1.6 }}>
            Before turning this on for real, make sure your Terms &amp; Conditions and FAQ are updated to
            explain the early-access delay — workers who notice it will look for an explanation, and it
            should already be there when they do.
          </p>
        </div>
      )}

      {showConfirm && (
        <div onClick={() => setShowConfirm(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.surface, borderRadius: T.radiusMd, padding: 24, maxWidth: 420, width: '100%',
            border: `1px solid ${T.border}`,
          }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800, color: T.text }}>
              {isOn ? 'Turn subscriptions OFF?' : 'Turn subscriptions ON?'}
            </h3>
            <p style={{ margin: '0 0 18px', fontSize: 13, color: T.textSecondary, lineHeight: 1.65 }}>
              {isOn
                ? 'This immediately restores identical job visibility for every worker, regardless of subscription status. Takes effect right away.'
                : `This immediately starts delaying job visibility by ${settings?.earlyAccessMinutes || 15} minutes for every non-subscribed worker, on both regular and urgent jobs. Takes effect right away — make sure this is intentional.`}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowConfirm(false)} style={{
                flex: 1, padding: 11, borderRadius: T.radiusSm, border: `1px solid ${T.border}`,
                background: 'transparent', color: T.textSecondary, fontSize: 13, cursor: 'pointer', fontFamily: T.font,
              }}>
                Cancel
              </button>
              <button onClick={handleToggle} style={{
                flex: 1, padding: 11, borderRadius: T.radiusSm, border: 'none',
                background: isOn ? T.danger : T.accent, color: '#fff',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: T.font,
              }}>
                Yes, {isOn ? 'turn off' : 'turn on'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSettings() {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <SettingsContent />
      </AdminLayout>
    </AdminAuthGuard>
  );
}