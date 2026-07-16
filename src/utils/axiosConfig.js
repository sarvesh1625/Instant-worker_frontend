import axios from 'axios';

// ── Production base URL ─────────────────────────────────────────────────────
// In local dev, Vite's proxy (vite.config.js) forwards relative '/api/...'
// calls to localhost:5000 automatically. In production, the frontend
// (Vercel) and backend (Render) are on different domains entirely, so every
// existing axios.get('/api/...') call in the app needs a real base URL —
// setting it once here means no other file needs to change.
if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

// Global axios response interceptor — handles two security cases automatically:
//   401 → token expired/invalid → force logout, redirect to login
//   423 → account locked → message passes through to the calling page
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];

        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=1';
        }
      }
    }

    if (status === 423) {
      console.warn('Account locked:', error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default axios;