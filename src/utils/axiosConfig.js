import axios from 'axios';

// Global axios response interceptor — handles two security cases automatically:
//   401 → token expired/invalid → force logout, redirect to login
//   423 → account locked → message passes through to the calling page
//
// Import this ONCE in client/src/main.jsx, before the app renders:
//   import './utils/axiosConfig';

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