import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import useLocationSharing from '../utils/useLocationSharing';

export default function WorkerLocationPanel({ job }) {
  const { socket }   = useSocket();
  const { user }     = useAuth();

  const contractorId = job?.postedBy?._id || job?.postedBy;

  const { isSharing, error, currentPos, startSharing, stopSharing } =
    useLocationSharing(socket, {
      workerId:     user?._id,
      jobId:        job?._id,
      contractorId: contractorId,
    });

  // ── Auto-start location sharing as soon as component mounts ──────────────
  // No manual tap needed — sharing begins automatically when the worker
  // opens My Work and the job is accepted or in progress.
  useEffect(() => {
    if (!isSharing && job?._id && user?._id) {
      // Small delay to ensure socket is connected
      const timer = setTimeout(() => {
        startSharing();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [job?._id, user?._id]);

  if (!job) return null;

  return (
    <div style={{
      background: isSharing ? '#f0fdf4' : '#f8fafc',
      border: `1.5px solid ${isSharing ? '#bbf7d0' : '#e5e7eb'}`,
      borderRadius: 12,
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isSharing ? (
          <>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#16a34a',
              display: 'inline-block',
              animation: 'pulse-dot 1.5s infinite',
              flexShrink: 0,
            }} />
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#15803d' }}>
                Location shared automatically
              </p>
              {currentPos && (
                <p style={{ margin: 0, fontSize: 10, color: '#6b7280' }}>
                  {currentPos.lat.toFixed(4)}, {currentPos.lng.toFixed(4)}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#9ca3af',
              display: 'inline-block',
              flexShrink: 0,
            }} />
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
                {error ? 'GPS unavailable' : 'Starting location...'}
              </p>
              {error && (
                <p style={{ margin: 0, fontSize: 10, color: '#dc2626' }}>{error}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Manual stop button — only shown if actively sharing */}
      {isSharing && (
        <button
          onClick={stopSharing}
          style={{
            padding: '5px 10px', background: 'none',
            border: '1px solid #fecaca', borderRadius: 8,
            fontSize: 11, fontWeight: 600, color: '#dc2626',
            cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
          <i className="ti ti-navigation-off" style={{ fontSize: 12 }} aria-hidden="true"></i>
          Stop
        </button>
      )}

      {/* Manual retry if GPS failed */}
      {!isSharing && error && (
        <button
          onClick={startSharing}
          style={{
            padding: '5px 10px', background: '#dbeafe',
            border: 'none', borderRadius: 8,
            fontSize: 11, fontWeight: 600, color: '#1d4ed8',
            cursor: 'pointer', flexShrink: 0,
          }}>
          Retry
        </button>
      )}
    </div>
  );
}