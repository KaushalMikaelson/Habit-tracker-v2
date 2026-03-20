import { useState, useEffect, useCallback } from 'react';

/**
 * useAuth – Authentication state hook.
 * Stage 1: Returns a stub structure. Will be wired to
 * the backend and authStore in Stage 2.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: call POST /api/auth/login in Stage 2
      console.log('Login stub – credentials:', credentials);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: call POST /api/auth/register in Stage 2
      console.log('Signup stub – data:', data);
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  const isAuthenticated = Boolean(user);

  return { user, loading, error, isAuthenticated, login, signup, logout };
}
