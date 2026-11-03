import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout, { AdminAuthGuard, adminAxios } from './AdminLayout';
import { T, ROLE_COLOR, STATUS_COLOR } from './adminTheme';
import { Card, Chip, Btn, Empty, fmt, fmtDate, errMsg } from './adminUi';

const TABS = [
  ['overview', 'ti-id', 'Overview'],
  ['work', 'ti-briefcase', 'Jobs'],
  ['money', 'ti-wallet', 'Money'],
  ['trust', 'ti-star', 'Reviews & reports'],
  ['account', 'ti-activity', 'Account & activity'],
  ['docs', 'ti-shield-check', 'ID & documents'],
];

const KV = ({ k, v }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '8px 0', borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
    <span style={{ color: T.textTertiary, flexShrink: 0 }}>{k}</span>
    <span style={{ color: T.text, textAlign: 'right', wordBreak: 'break-word', minWidth: 0 }}>{v === undefined || v === null || v === '' ? '—' : v}</span>
  </div>
);
const Sec = ({ title, children, style }) => (
  <Card style={style}>
    <p style={{ margin: '0 0 6px', fontSize: 13.5, fontWeight: 800, color: T.text }}>{title}</p>
    {children}
  </Card>
);
const Tile = ({ label, value, color = T.text }) => (
  <Card style={{ padding: 14, textAlign: 'center' }}>
    <p style={{ margin: 0, fontSize: 21, fontWeight: 800, color }}>{value}</p>
    <p style={{ margin: '3px 0 0', fontSize: 11.5, color: T.textSecondary }}>{label}</p>
  </Card>
);
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 14 };
const stat = (s) => STATUS_COLOR[s] || { color: T.textSecondary, bg: 'rgba(148,163,184,.14)' };
const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const maskId = (s) => (s ? '•••• •••• ' + String(s).slice(-4) : '');

function Content() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('overview');
  const [busy, setBusy] = useState(false);

  const load = () => adminAxios.get(`/api/admin/ops/users/${id}/full`).then(r => setD(r.data)).catch(e => setErr(errMsg(e)));
  useEffect(() => { setD(null); load(); }, [id]);   // eslint-disable-line

  const act = async (label, fn, needReason) => {
    let reason = '';
    if (needReason) { reason = prompt(`${label} — write a reason:`) || ''; if (reason.trim().length < 3) return; }
    else if (!confirm(`${label}?`)) return;
    setBusy(true);
    try { await fn(reason); await load(); } catch (e) { alert(errMsg(e)); } finally { setBusy(false); }
  };

  if (err) return <p style={{ color: '#F87171' }}>{err}</p>;
  if (!d) return <p style={{ color: T.textTertiary }}>Loading...</p>;
  const u = d.user, w = u.worker || {}, p = u.poster || {}, a = d.account, isWorker = u.role === 'worker';
  const rc = ROLE_COLOR[u.role] || { color: T.textSecondary, bg: 'rgba(148,163,184,.14)' };
  const sc = stat(u.accountStatus);
  const loc = w.location && w.location.coordinates && w.location.coordinates.length === 2 ? w.location.coordinates : null;
  const idv = u.idVerification || {};
  const locked = u.lockUntil && new Date(u.lockUntil) > new Date();

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: T.textSecondary, cursor: 'pointer', marginBottom: 12, fontFamily: T.font, fontSize: 13 }}>← Back</button>

      {/* Header */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.accentBg, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: T.accent }}>
            {u.profilePhoto ? <img src={u.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (u.name || '?').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>{u.name}</h1>
            <p style={{ margin: '3px 0 8px', fontSize: 13.5, color: T.textSecondary }}>{u.phone}{u.email ? ` · ${u.email}` : ''}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Chip color={rc.color} bg={rc.bg}>{u.role}</Chip>
              <Chip color={sc.color} bg={sc.bg}>{u.accountStatus}</Chip>
              {u.isVerified && <Chip color={T.success} bg={T.successBg}>ID verified</Chip>}
              {isWorker && (w.availability ? <Chip color={T.success} bg={T.successBg}>Available</Chip> : <Chip>Offline</Chip>)}
              {locked && <Chip color="#F87171" bg={T.dangerBg}>Login locked</Chip>}
              {a.deletion && a.deletion.status === 'pending' && <Chip color={T.warning} bg={T.warningBg}>Deletion requested</Chip>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {u.accountStatus === 'active' ? (
              <>
                <Btn kind="ghost" disabled={busy} onClick={() => act('Suspend this account', (reason) => adminAxios.patch(`/api/admin/users/${id}/suspend`, { reason }), true)}>Suspend</Btn>
                <Btn kind="danger" disabled={busy} onClick={() => act('Ban this account', (reason) => adminAxios.patch(`/api/admin/users/${id}/ban`, { reason }), true)}>Ban</Btn>
              </>
            ) : <Btn disabled={busy} onClick={() => act('Reactivate this account', () => adminAxios.patch(`/api/admin/users/${id}/reactivate`))}>Reactivate</Btn>}
          </div>
        </div>
      </Card>

      {/* Tabs (scroll sideways on a phone) */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 14 }}>
        {TABS.map(([k, icon, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', padding: '9px 14px', borderRadius: 999, cursor: 'pointer', fontFamily: T.font,
            fontSize: 13, fontWeight: 700, border: `1px solid ${tab === k ? T.accent : T.border}`, background: tab === k ? T.accentBg : 'transparent', color: tab === k ? T.text : T.textSecondary,
          }}><i className={`ti ${icon}`} style={{ fontSize: 16 }} aria-hidden="true"></i>{label}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div style={{ ...grid, gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', marginBottom: 14 }}>
            {isWorker ? (
              <>
                <Tile label="Jobs done" value={w.totalJobsDone || 0} />
                <Tile label="Rating" value={w.rating && w.rating.count ? `${Number(w.rating.average).toFixed(1)} ★` : '—'} color="#EAB308" />
                <Tile label="Jobs applied" value={d.work.appliedCount} />
                <Tile label="Portfolio items" value={d.work.portfolioCount ?? 0} />
              </>
            ) : (
              <>
                <Tile label="Jobs posted" value={d.work.postedCount} />
                <Tile label="Workers hired" value={p.totalHired || 0} />
                <Tile label="Rating" value={p.rating && p.rating.count ? `${Number(p.rating.average).toFixed(1)} ★` : '—'} color="#EAB308" />
                <Tile label="Reports against" value={d.trust.reportsAgainst.length} color={d.trust.reportsAgainst.length ? '#F87171' : T.text} />
              </>
            )}
          </div>
          <div style={grid}>
            <Sec title="Personal">
              <KV k="Name" v={u.name} /><KV k="Phone" v={u.phone} /><KV k="Email" v={u.email} />
              <KV k="Gender" v={u.gender} /><KV k="Age" v={u.age} /><KV k="Languages" v={(u.languages || []).join(', ')} />
              <KV k="City" v={u.city} /><KV k="Area" v={u.area} /><KV k="State" v={u.state} />
              <KV k="Bio" v={u.bio} />
            </Sec>
            <Sec title="Account">
              <KV k="Role" v={u.role} /><KV k="Status" v={u.accountStatus} />
              <KV k="Joined" v={fmt(u.createdAt)} /><KV k="Last profile update" v={fmt(u.updatedAt)} />
              <KV k="Profile complete" v={u.isProfileComplete ? 'Yes' : 'No'} /><KV k="ID verified" v={u.isVerified ? 'Yes' : 'No'} />
              {u.accountStatus !== 'active' && <KV k="Reason" v={u.suspendedReason} />}
              {u.suspendedAt && <KV k="Suspended on" v={fmt(u.suspendedAt)} />}
              {!isWorker && <KV k="Can post with pending payments" v={u.postingOverride ? 'Yes (admin allowed)' : 'No'} />}
            </Sec>
            {isWorker && (
              <Sec title="Work profile">
                <KV k="Main skill" v={w.skill} /><KV k="All skills" v={(w.skills || []).join(', ')} />
                <KV k="Experience" v={w.experience ? `${w.experience} years` : ''} /><KV k="Daily wage" v={w.wagePerDay ? money(w.wagePerDay) : ''} />
                <KV k="Availability" v={w.availability ? 'Available' : 'Offline'} />
                <KV k="Location" v={loc ? <a href={`https://maps.google.com/?q=${loc[1]},${loc[0]}`} target="_blank" rel="noreferrer" style={{ color: T.accent }}>{loc[1].toFixed(4)}, {loc[0].toFixed(4)} · open map</a> : 'Not shared'} />
                <KV k="Location updated" v={fmt(w.locationUpdatedAt)} />
              </Sec>
            )}
          </div>
        </>
      )}

      {tab === 'work' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!isWorker && (
            <Sec title={`Jobs posted (${d.work.postedCount})`}>
              {d.work.posted.length === 0 && <Empty>No jobs posted</Empty>}
              {d.work.posted.map(j => (
                <div key={j._id} onClick={() => navigate(`/admin/jobs/${j._id}`)} style={{ cursor: 'pointer', padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ color: T.text, fontWeight: 700, fontSize: 13.5 }}>{j.title}</span>
                    <Chip color={stat(j.status).color} bg={stat(j.status).bg}>{j.status}</Chip>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: T.textSecondary }}>
                    {j.skill} · {[j.area, j.city].filter(Boolean).join(', ')} · {money(j.wage)}/day · {j.accepted}/{j.workersNeeded} hired · {j.applicants} applied{j.paymentPending ? ` · ${j.paymentPending} payment pending` : ''} · {fmtDate(j.createdAt)}
                  </p>
                </div>
              ))}
            </Sec>
          )}
          {(isWorker || d.work.appliedCount > 0) && (
            <Sec title={`Jobs applied (${d.work.appliedCount})`}>
              {d.work.applied.length === 0 && <Empty>No applications</Empty>}
              {d.work.applied.map(j => (
                <div key={j._id} onClick={() => navigate(`/admin/jobs/${j._id}`)} style={{ cursor: 'pointer', padding: '10px 0', borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ color: T.text, fontWeight: 700, fontSize: 13.5 }}>{j.title}</span>
                    <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Chip>{j.applicationStatus}</Chip>
                      <Chip>{String(j.workStatus || 'not_started').replace('_', ' ')}</Chip>
                      {j.paymentStatus === 'pending' && <Chip color={T.warning} bg={T.warningBg}>payment pending</Chip>}
                      {j.paymentStatus === 'confirmed' && <Chip color={T.success} bg={T.successBg}>paid</Chip>}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: T.textSecondary }}>
                    {j.skill} · {money(j.wage)}/day · by {j.poster ? `${j.poster.name} (${j.poster.phone})` : '—'}{j.crewSize > 1 ? ` · team of ${j.crewSize}` : ''} · applied {fmtDate(j.appliedAt)}
                  </p>
                </div>
              ))}
            </Sec>
          )}
        </div>
      )}

      {tab === 'money' && (
        <>
          <div style={{ ...grid, gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', marginBottom: 14 }}>
            <Tile label={isWorker ? 'Total earned' : 'Total received'} value={money(d.money.credit.total)} color={T.success} />
            <Tile label={isWorker ? 'Total spent' : 'Total paid'} value={money(d.money.debit.total)} color="#F87171" />
            <Tile label="Transactions" value={d.money.credit.n + d.money.debit.n} />
          </div>
          <div style={grid}>
            <Sec title="Subscription">
              {d.money.subscription ? (
                <>
                  <KV k="Plan" v={d.money.subscription.plan ? `${d.money.subscription.plan.name} (${money(d.money.subscription.plan.price)})` : ''} />
                  <KV k="Status" v={d.money.subscription.status} />
                  <KV k="Period ends" v={fmtDate(d.money.subscription.currentPeriodEnd)} />
                  <KV k="Given by admin" v={d.money.subscription.grantedByAdmin ? 'Yes' : 'No'} />
                </>
              ) : <p style={{ margin: '8px 0 0', fontSize: 12.5, color: T.textTertiary }}>Free plan — never subscribed.</p>}
            </Sec>
            <Sec title="Recent transactions">
              {d.money.transactions.length === 0 && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: T.textTertiary }}>None</p>}
              {d.money.transactions.map(t => (
                <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderBottom: `1px solid ${T.border}`, fontSize: 12.5 }}>
                  <span style={{ color: T.textSecondary, minWidth: 0 }}>
                    {t.job ? t.job.title : (t.note || 'Transaction')}{t.counterparty ? ` · ${t.counterparty.name}` : ''}
                    <br /><span style={{ color: T.textTertiary, fontSize: 11 }}>{fmt(t.createdAt)}</span>
                  </span>
                  <b style={{ color: t.type === 'credit' ? T.success : '#F87171', flexShrink: 0 }}>{t.type === 'credit' ? '+' : '−'}{money(t.amount)}</b>
                </div>
              ))}
            </Sec>
          </div>
        </>
      )}

      {tab === 'trust' && (
        <div style={grid}>
          <Sec title={`Reviews received (${d.trust.reviewsIn.length})`}>
            <KV k="Reviews given by this person" v={d.trust.reviewsGiven} />
            {d.trust.reviewsIn.length === 0 && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: T.textTertiary }}>None yet</p>}
            {d.trust.reviewsIn.map(r => (
              <div key={r._id} style={{ padding: '8px 0', borderBottom: `1px solid ${T.border}` }}>
                <p style={{ margin: 0, fontSize: 13, color: T.text }}><span style={{ color: '#EAB308' }}>{'★'.repeat(r.rating)}</span> · {r.reviewedBy ? r.reviewedBy.name : 'Someone'} · <span style={{ color: T.textTertiary, fontSize: 11 }}>{fmtDate(r.createdAt)}</span></p>
                {r.comment && <p style={{ margin: '3px 0 0', fontSize: 12.5, color: T.textSecondary }}>{r.comment}</p>}
              </div>
            ))}
          </Sec>
          <Sec title={`Reports against this person (${d.trust.reportsAgainst.length})`}>
            {d.trust.reportsAgainst.length === 0 && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: T.textTertiary }}>None</p>}
            {d.trust.reportsAgainst.map(r => (
              <div key={r._id} style={{ padding: '8px 0', borderBottom: `1px solid ${T.border}`, fontSize: 12.5, color: T.textSecondary }}>
                <b style={{ color: T.text }}>{String(r.reason).replace(/_/g, ' ')}</b> · {r.status} · by {r.reportedBy ? r.reportedBy.name : '—'} · {fmtDate(r.createdAt)}
                {r.description && <><br />{r.description}</>}
              </div>
            ))}
          </Sec>
          <Sec title={`Reports made by this person (${d.trust.reportsBy.length})`}>
            {d.trust.reportsBy.length === 0 && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: T.textTertiary }}>None</p>}
            {d.trust.reportsBy.map(r => (
              <div key={r._id} style={{ padding: '8px 0', borderBottom: `1px solid ${T.border}`, fontSize: 12.5, color: T.textSecondary }}>
                <b style={{ color: T.text }}>{String(r.reason).replace(/_/g, ' ')}</b> · {r.status} · against {r.reportedUser ? r.reportedUser.name : '—'} · {fmtDate(r.createdAt)}
              </div>
            ))}
            <KV k="Blocked by this person" v={a.blocksOut} /><KV k="Blocked this person" v={a.blocksIn} />
          </Sec>
        </div>
      )}

      {tab === 'account' && (
        <div style={grid}>
          <Sec title="Logins (since logging started)">
            <KV k="Successful logins" v={a.stats.loginCount || 0} /><KV k="Failed logins" v={a.stats.failedLoginCount || 0} />
            <KV k="Forgot-password requests" v={a.stats.forgotPasswordCount || 0} />
            <KV k="Last login" v={fmt(a.stats.lastLoginAt)} /><KV k="Last login IP" v={a.stats.lastLoginIp} />
            <KV k="Wrong-password attempts now" v={u.loginAttempts || 0} />
            <KV k="Locked until" v={locked ? fmt(u.lockUntil) : 'Not locked'} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <Btn disabled={busy} onClick={() => act('Unlock login', (reason) => adminAxios.post(`/api/admin/ops/support/${id}/unlock`, { reason }), true)}>Unlock login</Btn>
              <Btn kind="ghost" disabled={busy} onClick={() => act('Clear start/payment code locks', (reason) => adminAxios.post(`/api/admin/ops/support/${id}/clear-code-locks`, { reason }), true)}>Clear code locks</Btn>
              {!isWorker && <Btn kind="ghost" disabled={busy} onClick={() => act(u.postingOverride ? 'Remove the posting override' : 'Allow posting even with pending payments', () => adminAxios.patch(`/api/admin/users/${id}/posting-override`, { allow: !u.postingOverride }))}>{u.postingOverride ? 'Remove posting override' : 'Allow posting'}</Btn>}
            </div>
          </Sec>
          <Sec title="Recent login events">
            {a.events.length === 0 && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: T.textTertiary }}>None recorded yet</p>}
            {a.events.map(e => (
              <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '6px 0', fontSize: 12.5 }}>
                <span style={{ color: T.textSecondary }}>{e.type.replace('_', ' ')}</span>
                <span><Chip color={e.success ? T.success : '#F87171'} bg={e.success ? T.successBg : T.dangerBg}>{e.success ? 'ok' : 'failed'}</Chip> <span style={{ color: T.textTertiary }}>{fmt(e.createdAt)}</span></span>
              </div>
            ))}
          </Sec>
          <Sec title="Devices & chats">
            <KV k="Phones registered for alerts" v={a.devices.length} />
            {a.devices.map((x, i) => <KV key={i} k={`${x.platform} · app language ${x.lang}`} v={`seen ${fmt(x.updatedAt)}`} />)}
            <KV k="Chat conversations" v={a.conversations} />
          </Sec>
          <Sec title="Terms accepted">
            {a.consents.length === 0 && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: T.textTertiary }}>No acceptance recorded</p>}
            {a.consents.map(c => <KV key={c._id} k={`Version ${c.version} (${c.source})`} v={fmt(c.acceptedAt)} />)}
          </Sec>
          <Sec title="Training videos">
            {d.training.length === 0 && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: T.textTertiary }}>No active videos</p>}
            {d.training.map(t => <KV key={t.id} k={t.title} v={t.done ? `Done ${fmt(t.at)}` : 'Not done'} />)}
          </Sec>
          <Sec title="Deletion request">
            {a.deletion ? (<><KV k="Status" v={a.deletion.status} /><KV k="Requested" v={fmt(a.deletion.requestedAt)} /><KV k="Reason" v={a.deletion.reason} /><KV k="Admin note" v={a.deletion.adminNote} /></>)
              : <p style={{ margin: '8px 0 0', fontSize: 12.5, color: T.textTertiary }}>None</p>}
          </Sec>
          <Sec title="Admin actions about this person" style={{ gridColumn: '1 / -1' }}>
            {d.adminActions.length === 0 && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: T.textTertiary }}>None</p>}
            {d.adminActions.map(x => (
              <div key={x._id} style={{ padding: '6px 0', borderBottom: `1px solid ${T.border}`, fontSize: 12.5, color: T.textSecondary }}>
                {x.summary || x.action}{x.reason ? ` — ${x.reason}` : ''} <span style={{ color: T.textTertiary }}>· {x.admin ? x.admin.name : 'Admin'} · {fmt(x.createdAt)}</span>
              </div>
            ))}
          </Sec>
        </div>
      )}

      {tab === 'docs' && (
        <div style={grid}>
          <Sec title="ID verification">
            <KV k="Status" v={idv.status || 'not_submitted'} /><KV k="ID type" v={idv.idType} /><KV k="ID number" v={maskId(idv.idNumber)} />
            <KV k="Submitted" v={fmt(idv.submittedAt)} /><KV k="Reviewed" v={fmt(idv.reviewedAt)} />
            {idv.rejectionReason && <KV k="Rejection reason" v={idv.rejectionReason} />}
          </Sec>
          <Sec title="Photos">
            {!idv.documentPhoto && !idv.selfiePhoto && <p style={{ margin: '8px 0 0', fontSize: 12.5, color: T.textTertiary }}>Nothing uploaded</p>}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              {idv.documentPhoto && <a href={idv.documentPhoto} target="_blank" rel="noreferrer" style={{ color: T.textSecondary, fontSize: 12 }}><img src={idv.documentPhoto} alt="ID document" style={{ width: 150, height: 110, objectFit: 'cover', borderRadius: 10, border: `1px solid ${T.border}`, display: 'block', marginBottom: 4 }} />ID document</a>}
              {idv.selfiePhoto && <a href={idv.selfiePhoto} target="_blank" rel="noreferrer" style={{ color: T.textSecondary, fontSize: 12 }}><img src={idv.selfiePhoto} alt="Selfie" style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: 10, border: `1px solid ${T.border}`, display: 'block', marginBottom: 4 }} />Selfie</a>}
            </div>
          </Sec>
        </div>
      )}
    </div>
  );
}

export default function AdminUserDetail() {
  return <AdminAuthGuard><AdminLayout><Content /></AdminLayout></AdminAuthGuard>;
}