import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Fix this import same as WorkerLocationPanel — match your SocketContext export
// ─────────────────────────────────────────────────────────────────────────────
// import { SocketContext } from '../context/SocketContext'; // ← adjust if needed
import { useSocket } from '../context/SocketContext';


export default function LiveTrackingMap({ job, worker }) {
  const { socket }    = useSocket(); // ← adjust if needed
  const { user }      = useAuth();
  const mapRef        = useRef(null);
  const googleMapRef  = useRef(null);
  const markerRef     = useRef(null);
  const destMarkerRef = useRef(null);

  const [workerPos, setWorkerPos] = useState(null);
  const [isOnline, setIsOnline]   = useState(false);
  const [eta, setEta]             = useState('');
  const [distance, setDistance]   = useState('');
  const [mapReady, setMapReady]   = useState(false);
  const [mapError, setMapError]   = useState('');

  const workerId     = worker?._id || worker;
  const jobId        = job?._id;
  const jobLat       = job?.location?.lat;
  const jobLng       = job?.location?.lng;
  const contractorId = user?._id;

  // Load Google Maps once
  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    if (!key) {
      setMapError('Add VITE_GOOGLE_MAPS_KEY=your_key to client/.env to enable live map');
      return;
    }
    if (window.google?.maps) { initMap(); return; }
    if (document.getElementById('gmaps-live')) {
      const wait = setInterval(() => {
        if (window.google?.maps) { clearInterval(wait); initMap(); }
      }, 200);
      return;
    }
    const s = document.createElement('script');
    s.id    = 'gmaps-live';
    s.src   = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry`;
    s.async = true;
    s.onload  = initMap;
    s.onerror = () => setMapError('Failed to load Google Maps. Check your API key.');
    document.head.appendChild(s);
  }, []);

  function initMap() {
    if (!mapRef.current || !window.google) return;
    const center = { lat: 17.385, lng: 78.4867 };
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center, zoom: 14,
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
      styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }],
    });
    if (jobLat && jobLng) {
      destMarkerRef.current = new window.google.maps.Marker({
        position: { lat: jobLat, lng: jobLng },
        map: googleMapRef.current,
        title: 'Worksite',
        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', scaledSize: new window.google.maps.Size(36, 36) },
      });
    }
    setMapReady(true);
    fetchLastKnown();
  }

  async function fetchLastKnown() {
    try {
      const { data } = await axios.get(`/api/location/worker/${workerId}`);
      if (data.success) {
        const { lat, lng } = data.location.coordinates;
        placeWorker(lat, lng);
        setIsOnline(true);
        if (jobLat && jobLng) calcEta(lat, lng);
      }
    } catch {}
  }

  function placeWorker(lat, lng) {
    if (!googleMapRef.current || !window.google) return;
    setWorkerPos({ lat, lng });
    if (markerRef.current) {
      animateMarker(markerRef.current, { lat, lng });
    } else {
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: googleMapRef.current,
        title: 'Worker',
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#1a56db', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
        animation: window.google.maps.Animation.DROP,
      });
    }
    if (jobLat && jobLng) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat, lng });
      bounds.extend({ lat: jobLat, lng: jobLng });
      googleMapRef.current.fitBounds(bounds, { padding: 60 });
    } else {
      googleMapRef.current.setCenter({ lat, lng });
      googleMapRef.current.setZoom(15);
    }
  }

  function animateMarker(marker, target) {
    const start  = marker.getPosition();
    if (!start) { marker.setPosition(target); return; }
    const frames = 30;
    const dLat   = (target.lat - start.lat()) / frames;
    const dLng   = (target.lng - start.lng()) / frames;
    let f = 0;
    const tick = setInterval(() => {
      f++;
      marker.setPosition({ lat: start.lat() + dLat * f, lng: start.lng() + dLng * f });
      if (f >= frames) clearInterval(tick);
    }, 16);
  }

  function calcEta(lat, lng) {
    if (!window.google || !jobLat || !jobLng) return;
    const d    = window.google.maps.geometry.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(lat, lng),
      new window.google.maps.LatLng(jobLat, jobLng)
    );
    const km   = d / 1000;
    const mins = Math.round((km / 25) * 60);
    setDistance(km.toFixed(1) + ' km');
    setEta(mins < 1 ? 'Arriving now' : `~${mins} min`);
  }

  // Socket events
  useEffect(() => {
    if (!socket || !jobId || !workerId) return;
    socket.emit('watch_worker', { contractorId, workerId, jobId });

    const onStarted = ({ lat, lng }) => { setIsOnline(true); placeWorker(lat, lng); calcEta(lat, lng); };
    const onUpdate  = ({ lat, lng }) => { placeWorker(lat, lng); calcEta(lat, lng); };
    const onStopped = ()             => { setIsOnline(false); setEta(''); setDistance(''); };

    socket.on('worker_started_sharing', onStarted);
    socket.on('worker_location_updated', onUpdate);
    socket.on('worker_stopped_sharing', onStopped);
    return () => {
      socket.off('worker_started_sharing', onStarted);
      socket.off('worker_location_updated', onUpdate);
      socket.off('worker_stopped_sharing', onStopped);
    };
  }, [socket, jobId, workerId]);

  if (mapError) {
    return (
      <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
        <i className="ti ti-map-off" style={{ fontSize: 28, color: '#ea580c', display: 'block', marginBottom: 6 }} aria-hidden="true"></i>
        <p style={{ margin: 0, fontSize: 12, color: '#9a3412' }}>{mapError}</p>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      {/* Map header */}
      <div style={{ background: '#1a56db', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: isOnline ? '#4ade80' : '#9ca3af', display: 'inline-block' }}></span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
            {isOnline ? 'Worker is on the way' : 'Waiting for worker location...'}
          </span>
        </div>
        {eta && (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#1a56db', background: '#fff', padding: '3px 9px', borderRadius: 20 }}>
            ETA {eta}
          </span>
        )}
      </div>

      {/* Map canvas */}
      <div ref={mapRef} style={{ height: 260, width: '100%', background: '#f3f4f6' }} />

      {/* Footer */}
      {isOnline && (distance || workerPos) && (
        <div style={{ background: '#f9fafb', padding: '8px 14px', display: 'flex', gap: 16, fontSize: 11, color: '#6b7280', borderTop: '1px solid #e5e7eb' }}>
          {distance && (
            <span>
              <i className="ti ti-route" aria-hidden="true" style={{ marginRight: 3 }}></i>
              {distance} away
            </span>
          )}
          <span style={{ marginLeft: 'auto' }}>Updates every 5 sec</span>
        </div>
      )}
    </div>
  );
}
