import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import AppShell from '../components/AppShell';
import '../styles/theme.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Wallet() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLang();
  const isWorker = user?.role === 'worker';

  const [data, setData]       = useState({ totalEarned: 0, totalSpent: 0, transactions: [] });
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear]   = useState(now.getFullYear());

  useEffect(() => {
    axios.get('/api/wallet')
      .then(({ data }) => setData(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return (data.transactions || []).filter(t => {
      const d = new Date(t.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [data.transactions, month, year]);

  const monthTotal = filtered.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const monthJobs  = filtered.length;
  const avgPerJob  = monthJobs > 0 ? Math.round(monthTotal / monthJobs) : 0;

  const lifetimeTotal = isWorker ? data.totalEarned : data.totalSpent;

  const years = useMemo(() => {
    const set = new Set([now.getFullYear()]);
    (data.transactions || []).forEach(t => set.add(new Date(t.createdAt).getFullYear()));
    return [...set].sort((a, b) => b - a);
  }, [data.transactions]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const StatCard = ({ icon, label, value, sub, gradient }) => (
    <div style={{
      background: gradient, borderRadius: 18, padding: '20px 22px',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 8px 22px rgba(17,24,39,.12)',
    }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.1)' }}></div>
      <div style={{
        width: 44, height: 44, borderRadius: 13, marginBottom: 14,
        background: 'rgba(255,255,255,.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <i className={`ti ${icon}`} style={{ fontSize: 22, color: '#fff' }} aria-hidden="true"></i>
      </div>
      <p style={{ margin: 0, fontSize: 12.5, color: 'rgba(255,255,255,.85)', fontWeight: 600, position: 'relative' }}>{label}</p>
      <p style={{ margin: '4px 0 0', fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', position: 'relative' }}>{value}</p>
      {sub && <p style={{ margin: '4px 0 0', fontSize: 11.5, color: 'rgba(255,255,255,.7)', position: 'relative' }}>{sub}</p>}
    </div>
  );

  return (
    <AppShell>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '22px 18px 30px' }}>

        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 9 }}>
            <i className="ti ti-wallet" style={{ fontSize: 26, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
            {t('walletTitle')}
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>
            {isWorker ? t('walletTaglineWorker') : t('walletTaglineUser')}
          </p>
        </div>

        <div className="il-card" style={{ padding: '14px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
            <i className="ti ti-calendar" style={{ fontSize: 17, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
            {t('filterBy')}
          </span>
          <select className="il-select" value={month} onChange={e => setMonth(Number(e.target.value))} style={{ width: 'auto', minWidth: 130, padding: '9px 12px' }}>
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select className="il-select" value={year} onChange={e => setYear(Number(e.target.value))} style={{ width: 'auto', minWidth: 95, padding: '9px 12px' }}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="wallet-stats" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginBottom: 24 }}>
          <StatCard
            icon="ti-currency-rupee"
            label={isWorker ? t('monthlyEarnings2') : t('monthlyPayments')}
            value={`₹${monthTotal.toLocaleString('en-IN')}`}
            sub={`${MONTHS[month]} ${year}`}
            gradient="linear-gradient(135deg, #059669, #10B981)"
          />
          <StatCard
            icon="ti-trending-up"
            label={t('averagePerJob')}
            value={`₹${avgPerJob.toLocaleString('en-IN')}`}
            sub={isWorker ? t('avgEarning') : t('avgPayment')}
            gradient="linear-gradient(135deg, #EA580C, #F97316)"
          />
          <StatCard
            icon="ti-briefcase"
            label={t('jobsDone2')}
            value={monthJobs}
            sub={t('completedThisMonth')}
            gradient="linear-gradient(135deg, #CA8A04, #FACC15)"
          />
        </div>

        <div className="il-card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="ti ti-award" style={{ fontSize: 21, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
              {isWorker ? t('lifetimeEarnings') : t('lifetimePayments')}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
              ₹{(lifetimeTotal || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {data.transactions?.length || 0} {t('totalRecords')}
          </span>
        </div>

        <div style={{ background: 'var(--primary-light)', border: '1px solid #A7F3D0', borderRadius: 12, padding: '13px 16px', marginBottom: 24, display: 'flex', gap: 11 }}>
          <i className="ti ti-info-circle" style={{ fontSize: 18, color: 'var(--primary-dark)', flexShrink: 0, marginTop: 1 }} aria-hidden="true"></i>
          <p style={{ margin: 0, fontSize: 12.5, color: '#065F46', lineHeight: 1.65 }}>
            {isWorker ? t('walletInfoWorker') : t('walletInfoUser')}
          </p>
        </div>

        <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
          <i className="ti ti-receipt" style={{ fontSize: 18, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
          {isWorker ? t('earningsHistory') : t('paymentHistory')}
        </p>

        {loading && <p className="il-muted" style={{ textAlign: 'center', padding: '30px 0', fontSize: 13.5 }}>{t('loading')}</p>}

        {!loading && filtered.length === 0 && (
          <div className="il-empty">
            <i className="ti ti-wallet-off" aria-hidden="true"></i>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{t('noRecordsIn', [MONTHS[month], year])}</p>
            <p style={{ fontSize: 12.5, marginTop: 5 }}>
              {data.transactions?.length > 0
                ? t('tryDifferentMonth')
                : isWorker ? t('completeFirstJobWorker') : t('completeFirstJobUser')}
            </p>
            {data.transactions?.length === 0 && (
              <button onClick={() => navigate(isWorker ? '/jobs' : '/jobs/post')} className="il-btn il-btn-primary" style={{ marginTop: 16 }}>
                {isWorker ? t('findWork') : t('postJob')}
              </button>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(t2 => {
            const isCredit = t2.type === 'credit';
            return (
              <div key={t2._id} className="il-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                  background: isCredit ? 'var(--primary-light)' : 'var(--secondary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`ti ${isCredit ? 'ti-arrow-down-left' : 'ti-arrow-up-right'}`}
                     style={{ fontSize: 21, color: isCredit ? 'var(--primary-dark)' : 'var(--secondary-dark)' }} aria-hidden="true"></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t2.job?.title || t2.note || 'Job payment'}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: 11.5, color: 'var(--text-tertiary)' }}>
                    {isCredit ? t('from') : t('to2')} {t2.counterparty?.name || '—'} · {formatDate(t2.createdAt)}
                  </p>
                </div>
                <p style={{
                  margin: 0, fontSize: 16.5, fontWeight: 800, flexShrink: 0,
                  color: isCredit ? 'var(--primary-dark)' : 'var(--secondary-dark)',
                }}>
                  {isCredit ? '+' : '−'}₹{t2.amount.toLocaleString('en-IN')}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .wallet-stats { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </AppShell>
  );
}