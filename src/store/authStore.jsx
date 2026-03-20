import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

// ── Context ──────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ─────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true); // starts true — loads session on mount

  const isAuthenticated = Boolean(user && token);

  // ── Persist token to localStorage + axios header ──────
  const persistToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
    setToken(newToken);
  }, []);

  // ── Load user session on app start ───────────────────
  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setToken(storedToken);
    } catch {
      // Token invalid/expired — clear everything
      persistToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [persistToken]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ── Signup ────────────────────────────────────────────
  const signup = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      setUser(data.user);
      persistToken(data.token);
      toast.success(`Welcome aboard, ${data.user.name.split(' ')[0]}! 🎉`);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Signup failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [persistToken]);

  // ── Login ─────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      persistToken(data.token);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 👋`);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [persistToken]);

  // ── Logout ────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    persistToken(null);
    toast.success('Logged out successfully.');
  }, [persistToken]);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside <AuthProvider>');
  }
  return ctx;
}

export default AuthContext;
