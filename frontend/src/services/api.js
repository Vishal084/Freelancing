import axios from 'axios';
import { API_URL } from '../config';                 // ✅ validated env variable
import { isTokenExpired } from '../utils/helpers';   // ✅ JWT expiry check

// ──────────────────────────────────────
// 1. Centralised Axios instance
// ──────────────────────────────────────
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,                 // 15‑second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ──────────────────────────────────────
// 2. Attach token to every request (with expiry check)
// ──────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // ✅ Check expiry before attaching
    if (!isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Token expired – clear storage and let the 401 handler redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Keep Redux in sync if store is accessible
      if (window.__REDUX_STORE__) {
        window.__REDUX_STORE__.dispatch({ type: 'auth/logout' });
      }
    }
  }
  return config;
});

// ──────────────────────────────────────
// 3. Retry on network errors (not 4xx/5xx)
// ──────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;

    // Only retry when there is no response (network / timeout)
    if (!error.response && config && config.retryCount < 2) {
      config.retryCount = config.retryCount || 0;
      config.retryCount += 1;

      // Exponential back‑off: 1s, then 2s
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * config.retryCount)
      );
      return api(config);
    }

    return Promise.reject(error);
  }
);

// ──────────────────────────────────────
// 4. 401 handler – race‑condition free
// ──────────────────────────────────────
let isLoggingOut = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = !!error.config?.headers?.Authorization;
      const isAuthEndpoint = error.config?.url?.startsWith('/auth/');

      // Only act when a token was present and the failing call is not auth‑related
      if (hadToken && !isAuthEndpoint) {
        // If already processing a logout, reject silently
        if (isLoggingOut) {
          return Promise.reject(error);
        }

        isLoggingOut = true;

        // Clear stored data (runs only once even for multiple 401s)
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Keep Redux state in sync
        if (window.__REDUX_STORE__) {
          window.__REDUX_STORE__.dispatch({ type: 'auth/logout' });
        }

        // Use replace to avoid broken back‑button behaviour
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;