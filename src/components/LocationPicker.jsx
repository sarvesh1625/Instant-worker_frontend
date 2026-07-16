import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// LocationPicker — "Use my current location" button (device GPS) plus an
// optional draggable Google Maps pin for fine adjustment. Degrades gracefully
// to GPS-only if VITE_GOOGLE_MAPS_KEY isn't set, following the same pattern
// as LiveTrackingMap.jsx.
//
// Props:
//   value    — { lat, lng } | null
//   onChange — called with { lat, lng } whenever the location is set/moved
//   city     — optional, used to reverse-fallback the map center if no GPS yet
// ─────────────────────────────────────────────────────────────────────────────
export default function LocationPicker({ value, onChange, city }) {
  const [locating, setLocating] = useState(false);
  const [error, setError]       = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState('');

  const mapRef       = useRef(null);
  const googleMapRef = useRef(null);
  const markerRef    = useRef(null);

  const hasKey = !!import.meta.env.VITE_GOOGLE_MAPS_KEY;

  // ── Load Google Maps script once, if a key is configured ──
  useEffect(() => {
    if (!hasKey) return;
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;

    if (window.google?.maps) { initMap(); return; }
    if (document.getElementById('gmaps-picker')) {
      const wait = setInterval(() => {
        if (window.google?.maps) { clearInterval(wait); initMap(); }
      }, 200);
      return;
    }
    const s = document.createElement('script');
    s.id    = 'gmaps-picker';
    s.src   = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    s.async = true;
    s.onload  = initMap;
    s.onerror = () => setMapError('Could not load the map — GPS will still work.');
    document.head.appendChild(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initMap() {
    if (!mapRef.current || !window.google) return;
    const start = value?.lat && value?.lng ? value : { lat: 17.385, lng: 78.4867 }; // Hyderabad fallback center
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center: start, zoom: value ? 15 : 11,
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    });

    markerRef.current = new window.google.maps.Marker({
      position: start,
      map: googleMapRef.current,
      draggable: true,
      icon: { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' },
    });

    markerRef.current.addListener('dragend', () => {
      const pos = markerRef.current.getPosition();
      onChange({ lat: pos.lat(), lng: pos.lng() });
    });

    // Also let tapping anywhere on the map move the pin
    googleMapRef.current.addListener('click', (e) => {
      const lat = e.latLng.lat(), lng = e.latLng.lng();
      markerRef.current.setPosition({ lat, lng });
      onChange({ lat, lng });
    });

    setMapReady(true);
  }

  // Keep the marker + map centered in sync whenever `value` changes externally
  // (e.g. right after "Use my current location" resolves)
  useEffect(() => {
    if (!mapReady || !value?.lat || !value?.lng || !markerRef.current) return;
    markerRef.current.setPosition(value);
    googleMapRef.current.setCenter(value);
    googleMapRef.current.setZoom(15);
  }, [value?.lat, value?.lng, mapReady]);

  const useMyLocation = () => {
    setError('');
    if (!navigator.geolocation) {
      setError('GPS not supported on this device — drag the pin instead.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        onChange({ lat, lng });
        setLocating(false);
      },
      (err) => {
        setError(
          err.code === 1
            ? 'Location access denied. You can still drag the pin on the map below.'
            : 'Could not get your location. Try again or drag the pin below.'
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={useMyLocation}
        disabled={locating}
        style={{
          width: '100%', padding: '12px', borderRadius: 12,
          border: '1.5px solid var(--primary)', background: value ? 'var(--primary-light)' : '#fff',
          color: 'var(--primary-dark)', fontSize: 14, fontWeight: 700, cursor: locating ? 'wait' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: 'var(--font)', marginBottom: 10,
        }}>
        {locating ? (
          <><span className="il-spinner" style={{ borderTopColor: 'var(--primary-dark)', borderColor: 'rgba(5,150,105,.3)' }}></span> Getting your location...</>
        ) : value ? (
          <><i className="ti ti-map-pin-check" style={{ fontSize: 17 }} aria-hidden="true"></i> Location set — tap to update</>
        ) : (
          <><i className="ti ti-current-location" style={{ fontSize: 17 }} aria-hidden="true"></i> Use my current location</>
        )}
      </button>

      {error && (
        <p style={{ margin: '0 0 10px', fontSize: 12, color: '#B45309', background: '#FFFBEB', padding: '8px 12px', borderRadius: 8 }}>
          <i className="ti ti-alert-triangle" style={{ marginRight: 5, verticalAlign: -2, fontSize: 13 }} aria-hidden="true"></i>
          {error}
        </p>
      )}

      {hasKey && !mapError && (
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1.5px solid var(--border)' }}>
          <div ref={mapRef} style={{ height: 220, width: '100%', background: 'var(--surface)' }} />
          <div style={{ padding: '8px 12px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-tertiary)' }}>
              <i className="ti ti-hand-move" style={{ marginRight: 4, verticalAlign: -1 }} aria-hidden="true"></i>
              Drag the pin or tap the map to fine-tune the exact worksite
            </p>
          </div>
        </div>
      )}

      {hasKey && mapError && (
        <p style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{mapError}</p>
      )}

      {!hasKey && (
        <p style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>
          <i className="ti ti-info-circle" style={{ marginRight: 4, verticalAlign: -1 }} aria-hidden="true"></i>
          Add VITE_GOOGLE_MAPS_KEY to enable pin adjustment — GPS location above still works.
        </p>
      )}

      {value && (
        <p style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center' }}>
          {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}