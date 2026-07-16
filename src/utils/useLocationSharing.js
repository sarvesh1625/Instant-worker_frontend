import { useEffect, useRef, useState, useCallback } from 'react';

const INTERVAL_MS = 5000; // send location every 5 seconds

export default function useLocationSharing(socket, { workerId, jobId, contractorId, enabled }) {
  const [isSharing, setIsSharing]     = useState(false);
  const [error, setError]             = useState('');
  const [currentPos, setCurrentPos]   = useState(null);
  const watchIdRef                    = useRef(null);
  const intervalRef                   = useRef(null);

  const stopSharing = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (socket && workerId && jobId) {
      socket.emit('stop_location_sharing', { workerId, jobId, contractorId });
    }
    setIsSharing(false);
  }, [socket, workerId, jobId, contractorId]);

  const startSharing = useCallback(() => {
    if (!navigator.geolocation) {
      setError('GPS not supported on this device');
      return;
    }
    if (!socket) {
      setError('Not connected to server');
      return;
    }

    setError('');

    // Get initial position immediately
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCurrentPos({ lat, lng });
        setIsSharing(true);

        // Tell server we started
        socket.emit('start_location_sharing', { workerId, jobId, contractorId, lat, lng });

        // Then keep watching and emit every INTERVAL_MS
        let lastLat = lat;
        let lastLng = lng;

        watchIdRef.current = navigator.geolocation.watchPosition(
          (p) => {
            lastLat = p.coords.latitude;
            lastLng = p.coords.longitude;
            setCurrentPos({ lat: lastLat, lng: lastLng });
          },
          (err) => setError('GPS error: ' + err.message),
          { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
        );

        intervalRef.current = setInterval(() => {
          if (socket.connected) {
            socket.emit('location_update', {
              workerId,
              jobId,
              contractorId,
              lat: lastLat,
              lng: lastLng,
            });
          }
        }, INTERVAL_MS);
      },
      (err) => {
        setError('Cannot get GPS: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, [socket, workerId, jobId, contractorId]);

  // Auto-stop when component unmounts
  useEffect(() => {
    return () => stopSharing();
  }, [stopSharing]);

  return { isSharing, error, currentPos, startSharing, stopSharing };
}