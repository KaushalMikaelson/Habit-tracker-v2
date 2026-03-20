import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * authStore – Global auth state using Zustand.
 * 
 * NOTE: Zustand is not yet installed. This store is a
 * forward-looking placeholder using vanilla state for
 * Stage 1. Install zustand in Stage 2:
 *   npm install zustand
 */

// Vanilla fallback for Stage 1 (until zustand is installed)
let _user = null;
let _token = localStorage.getItem('token') || null;
const _listeners = new Set();

function notify() {
  _listeners.forEach((fn) => fn());
}

export const authStore = {
  getUser: () => _user,
  getToken: () => _token,
  setAuth: (user, token) => {
    _user = user;
    _token = token;
    if (token) localStorage.setItem('token', token);
    notify();
  },
  clearAuth: () => {
    _user = null;
    _token = null;
    localStorage.removeItem('token');
    notify();
  },
  subscribe: (listener) => {
    _listeners.add(listener);
    return () => _listeners.delete(listener);
  },
};

export default authStore;
