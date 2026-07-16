import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

/**
 * CameraCapture — opens device camera, lets user take a photo, uploads it.
 * Props:
 *   currentPhoto  — existing photo URL to show
 *   onUpload      — callback(url) called with Cloudinary URL after upload
 *   userId        — for Cloudinary folder path
 */
export default function CameraCapture({ currentPhoto, onUpload, userId }) {
  const [mode, setMode]         = useState('idle');   // idle | camera | preview | uploading | done
  const [photoData, setPhotoData] = useState(null);   // base64 captured photo
  const [error, setError]       = useState('');

  const videoRef   = useRef(null);
  const streamRef  = useRef(null);

  // Start camera
  const openCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      setMode('camera');
      // Attach stream to video after render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera in browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Could not open camera. Try again.');
      }
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  // Capture photo from video
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPhotoData(dataUrl);
    stopCamera();
    setMode('preview');
  };

  // Retake photo
  const retake = () => {
    setPhotoData(null);
    openCamera();
  };

  // Upload to backend → Cloudinary
  const uploadPhoto = async () => {
    if (!photoData) return;
    setMode('uploading');
    setError('');
    try {
      // Convert base64 to blob
      const res     = await fetch(photoData);
      const blob    = await res.blob();
      const file    = new File([blob], 'profile.jpg', { type: 'image/jpeg' });

      const fd = new FormData();
      fd.append('photo', file);

      const { data } = await axios.post('/api/users/upload-photo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMode('done');
      onUpload && onUpload(data.url);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setMode('preview');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // ── Styles ────────────────────────────────────────────────────────────────
  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
    zIndex: 1000, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-sans)',
  };

  const btnStyle = (bg, color = '#fff') => ({
    background: bg, color, border: 'none', borderRadius: 14,
    padding: '13px 28px', fontSize: 15, fontWeight: 700,
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
    transition: 'opacity .15s',
  });

  return (
    <div>
      {/* ── Profile photo display + camera button ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {/* Photo circle */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: '#dbeafe', border: '3px solid #fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            overflow: 'hidden', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            {(mode === 'done' && photoData) || currentPhoto ? (
              <img
                src={mode === 'done' ? photoData : currentPhoto}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <i className="ti ti-user" style={{ fontSize: 44, color: '#93c5fd' }} aria-hidden="true"></i>
            )}
          </div>
          {/* Camera icon badge */}
          <button
            onClick={openCamera}
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 32, height: 32, borderRadius: '50%',
              background: '#1a56db', border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }}>
            <i className="ti ti-camera" style={{ fontSize: 16, color: '#fff' }} aria-hidden="true"></i>
          </button>
        </div>

        <button onClick={openCamera} style={{
          background: 'none', border: '1.5px solid #1a56db',
          borderRadius: 10, padding: '7px 16px',
          color: '#1a56db', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <i className="ti ti-camera" style={{ fontSize: 16 }} aria-hidden="true"></i>
          {currentPhoto || mode === 'done' ? 'Change Photo' : 'Take Photo'}
        </button>

        {error && (
          <p style={{ margin: 0, fontSize: 12, color: '#dc2626', textAlign: 'center', maxWidth: 260 }}>{error}</p>
        )}
      </div>

      {/* ── Camera overlay ── */}
      {mode === 'camera' && (
        <div style={overlayStyle}>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
            <i className="ti ti-camera" style={{ marginRight: 6 }} aria-hidden="true"></i>
            Position your face in the circle
          </p>

          {/* Circle frame guide */}
          <div style={{ position: 'relative', width: 300, height: 300, borderRadius: '50%', overflow: 'hidden', border: '3px solid #fff', boxShadow: '0 0 0 2000px rgba(0,0,0,0.6)' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
            <button onClick={() => { stopCamera(); setMode('idle'); }} style={btnStyle('rgba(255,255,255,0.15)')}>
              <i className="ti ti-x" style={{ fontSize: 18 }} aria-hidden="true"></i>
              Cancel
            </button>
            <button onClick={capturePhoto} style={btnStyle('#1a56db')}>
              <i className="ti ti-camera" style={{ fontSize: 20 }} aria-hidden="true"></i>
              Capture
            </button>
          </div>
        </div>
      )}

      {/* ── Preview overlay ── */}
      {mode === 'preview' && photoData && (
        <div style={overlayStyle}>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
            Looking good? Use this photo?
          </p>

          <div style={{ width: 240, height: 240, borderRadius: '50%', overflow: 'hidden', border: '3px solid #fff', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <img src={photoData} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {error && (
            <p style={{ color: '#fca5a5', fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
            <button onClick={retake} style={btnStyle('rgba(255,255,255,0.15)')}>
              <i className="ti ti-refresh" style={{ fontSize: 18 }} aria-hidden="true"></i>
              Retake
            </button>
            <button onClick={uploadPhoto} style={btnStyle('#16a34a')}>
              <i className="ti ti-check" style={{ fontSize: 20 }} aria-hidden="true"></i>
              Use Photo
            </button>
          </div>
        </div>
      )}

      {/* ── Uploading overlay ── */}
      {mode === 'uploading' && (
        <div style={overlayStyle}>
          <div style={{ width: 240, height: 240, borderRadius: '50%', overflow: 'hidden', border: '3px solid #fff', opacity: 0.5 }}>
            <img src={photoData} alt="Uploading" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="ti ti-loader-2" style={{ fontSize: 22, animation: 'spin 1s linear infinite' }} aria-hidden="true"></i>
            Uploading photo...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
}