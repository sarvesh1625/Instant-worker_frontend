import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import AppShell from '../components/AppShell';
import JobCard from '../components/JobCard';
import VoiceSearchButton from '../components/VoiceSearchButton';
import UrgentJobBanner from '../components/UrgentJobBanner';
import '../styles/theme.css';

const SKILLS = ['', 'Labour', 'Painter', 'Carpenter', 'Electrician', 'Mechanic', 'Farmer', 'Driver', 'Plumber', 'Welder', 'Other'];
const CITIES = ['', 'Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Warangal', 'Tirupati', 'Bengaluru', 'Chennai', 'Mumbai', 'Delhi', 'Pune'];

export default function BrowseJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLang();

  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [applying, setApplying] = useState({});
  const [applied, setApplied]   = useState({});
  const [filters, setFilters]   = useState({ skill: '', city: '', jobType: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showVoice, setShowVoice]     = useState(false);

  const coordsRef = useRef(null);
  const [geoInfo, setGeoInfo] = useState(null);
  const [geoDenied, setGeoDenied] = useState(false);

  const load = async (overrideFilters) => {
    setLoading(true);
    const f = overrideFilters || filters;
    try {
      const params = new URLSearchParams();
      if (f.skill)   params.append('skill', f.skill);
      if (f.city)    params.append('city', f.city);
      if (f.jobType) params.append('jobType', f.jobType);
      if (coordsRef.current) {
        params.append('lat', coordsRef.current.lat);
        params.append('lng', coordsRef.current.lng);
      }

      const { data } = await axios.get(`/api/jobs?${params.toString()}`);
      setJobs(data.jobs || []);
      setGeoInfo({ geoSearch: data.geoSearch, radiusKm: data.radiusKm });

      const mine = {};
      (data.jobs || []).forEach(job => {
        const me = job.applicants?.find(a => (a.worker?._id || a.worker) === user?._id);
        if (me) mine[job._id] = me.status;
      });
      setApplied(mine);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!navigator.geolocation) { load(); return; }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        coordsRef.current = { lat, lng };
        axios.patch('/api/workers/location', { lat, lng }).catch(() => {});
        load();
      },
      () => {
        setGeoDenied(true);
        load();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = async (jobId) => {
    setApplying(p => ({ ...p, [jobId]: true }));
    try {
      const { data } = await axios.post(`/api/jobs/${jobId}/apply`);
      setApplied(p => ({ ...p, [jobId]: data.autoAccepted ? 'accepted' : 'pending' }));
      if (data.autoAccepted) {
        alert("You're confirmed! Chat is now open with the job poster.");
      }
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not apply');
    } finally {
      setApplying(p => ({ ...p, [jobId]: false }));
    }
  };

  const handleVoiceResult = (parsed) => {
    const next = {
      ...filters,
      skill: parsed.skill || filters.skill,
      city:  parsed.city  || filters.city,
    };
    setFilters(next);
    setShowVoice(false);
    load(next);
  };

  const clearFilters = () => {
    const next = { skill: '', city: '', jobType: '' };
    setFilters(next);
    load(next);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const isFull = (job) => {
    const acceptedCount = job.applicants?.filter(a => a.status === 'accepted').length || 0;
    return acceptedCount >= (job.workersNeeded || 1);
  };

  return (
    <AppShell>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '22px 18px 30px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              {t('findWork')}
            </h1>
            <p style={{ margin: '3px 0 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>
              {t('findWorkTagline')} — {loading ? t('searching') : t('jobsAvailable2', jobs.length)}
            </p>
          </div>

          <button onClick={() => setShowVoice(!showVoice)} className="il-btn" style={{
            background: showVoice ? '#FF6B00' : '#FFF3EA', color: showVoice ? '#fff' : '#EA580C',
            border: '1.5px solid #FED7AA', flexShrink: 0,
          }}>
            <i className="ti ti-microphone" style={{ fontSize: 17 }} aria-hidden="true"></i>
            {t('voiceSearch')}
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="il-btn il-btn-outline"
            style={{ position: 'relative' }}>
            <i className="ti ti-filter" style={{ fontSize: 17 }} aria-hidden="true"></i>
            {t('filters')}
            {activeFilterCount > 0 && (
              <span style={{
                background: 'var(--primary)', color: '#fff', fontSize: 10, fontWeight: 800,
                minWidth: 18, height: 18, borderRadius: 9, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* ── Radius banner ── */}
        {!loading && geoInfo?.geoSearch && (
          <div style={{
            background: 'var(--primary-light)', border: '1px solid #A7F3D0', borderRadius: 12,
            padding: '9px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <i className="ti ti-map-pin" style={{ fontSize: 15, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--primary-dark)', fontWeight: 600 }}>
              {geoInfo.radiusKm === 6 ? t('showingWithin', geoInfo.radiusKm) : t('noJobsExpanded', geoInfo.radiusKm)}
            </p>
          </div>
        )}
        {!loading && geoDenied && (
          <div style={{
            background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12,
            padding: '9px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <i className="ti ti-map-pin-off" style={{ fontSize: 15, color: '#B45309' }} aria-hidden="true"></i>
            <p style={{ margin: 0, fontSize: 12.5, color: '#92400E', fontWeight: 600 }}>
              {t('locationDenied')}
            </p>
          </div>
        )}

        {/* ── Urgent jobs banner ── */}
        <div style={{ margin: '0 -18px 18px', borderRadius: 14, overflow: 'hidden' }}>
          <UrgentJobBanner />
        </div>

        {/* ── Voice search panel ── */}
        {showVoice && (
          <div className="il-card il-card-pad" style={{ marginBottom: 18 }}>
            <VoiceSearchButton onResult={handleVoiceResult} />
          </div>
        )}

        {/* ── Filters panel ── */}
        {showFilters && (
          <div className="il-card il-card-pad" style={{ marginBottom: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }} className="filter-grid">
              <div>
                <label className="il-label" style={{ fontSize: 12 }}>{t('skill')}</label>
                <select className="il-select" value={filters.skill} onChange={e => setFilters({ ...filters, skill: e.target.value })}>
                  {SKILLS.map(s => <option key={s} value={s}>{s || t('allSkills')}</option>)}
                </select>
              </div>
              <div>
                <label className="il-label" style={{ fontSize: 12 }}>
                  {t('city')} {geoInfo?.geoSearch && <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>({t('locationDenied').split(' — ')[0]})</span>}
                </label>
                <select className="il-select" value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })}>
                  {CITIES.map(c => <option key={c} value={c}>{c || t('allCities')}</option>)}
                </select>
              </div>
              <div>
                <label className="il-label" style={{ fontSize: 12 }}>{t('jobType')}</label>
                <select className="il-select" value={filters.jobType} onChange={e => setFilters({ ...filters, jobType: e.target.value })}>
                  <option value="">{t('allTypes')}</option>
                  <option value="urgent">{t('urgentOnly')}</option>
                  <option value="regular">{t('regular')}</option>
                  <option value="part_time">{t('partTime')}</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={() => load()} className="il-btn il-btn-primary" style={{ flex: 1 }}>
                <i className="ti ti-search" style={{ fontSize: 17 }} aria-hidden="true"></i>
                {t('searchJobsBtn')}
              </button>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="il-btn il-btn-outline">{t('clear')}</button>
              )}
            </div>
          </div>
        )}

        {/* ── Loading / empty ── */}
        {loading && (
          <p className="il-muted" style={{ textAlign: 'center', padding: '40px 0', fontSize: 13.5 }}>{t('loadingJobs')}</p>
        )}

        {!loading && jobs.length === 0 && (
          <div className="il-empty">
            <i className="ti ti-briefcase-off" aria-hidden="true"></i>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{t('noJobsFound')}</p>
            <p style={{ fontSize: 12.5, marginTop: 5 }}>
              {activeFilterCount > 0 ? t('tryRemovingFilters') : t('willNotify')}
            </p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="il-btn il-btn-primary" style={{ marginTop: 16 }}>{t('clearFilters')}</button>
            )}
          </div>
        )}

        {/* ── Job cards ── */}
        <div className="jobs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4 }}>
          {jobs.map(job => (
            <JobCard
              key={job._id}
              job={job}
              onApply={handleApply}
              applied={!!applied[job._id]}
              accepted={applied[job._id] === 'accepted'}
              full={isFull(job)}
              role={user?.role}
              distanceKm={job.distanceKm}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 720px) {
          .filter-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 1280px) {
          .jobs-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </AppShell>
  );
}