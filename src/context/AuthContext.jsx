import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// FIX: was hardcoded to 'http://localhost:5000/api', which meant every call
// in this file ignored axiosConfig.js's baseURL entirely — axios only falls
// back to defaults.baseURL for RELATIVE paths, and every call here already
// builds a full absolute URL, so it always hit localhost even in production.
// Falls back to the local backend only when VITE_API_URL isn't set (dev).
const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Auto-load user on page refresh if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const { data } = await axios.get(`${API}/auth/me`);
          setUser(data.user);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const register = async (formData) => {
    const { data } = await axios.post(`${API}/auth/register`, formData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const login = async (phone, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { phone, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);