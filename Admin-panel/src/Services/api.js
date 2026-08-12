import axios from 'axios';
import { API_URL } from '../config';

let store;

export const injectStore = (_store) => {
  store = _store;
};

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (token && store) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    store.dispatch({ type: 'auth/logout' });
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!error.response && config && (config.retryCount || 0) < 2) {
      config.retryCount = (config.retryCount || 0) + 1;
      await new Promise((resolve) => setTimeout(resolve, 1000 * config.retryCount));
      return api(config);
    }
    if (error.response?.status === 401) {
      const hadToken = !!error.config?.headers?.Authorization;
      const isAuthEndpoint = error.config?.url?.startsWith('/auth/');
      if (hadToken && !isAuthEndpoint && store) {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
        store.dispatch({ type: 'auth/logout' });
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;