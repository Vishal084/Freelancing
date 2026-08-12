import axios from 'axios';
import { API_URL } from '../config';
import { isTokenExpired } from '../utils/helpers';

let store; // will be injected later

export const injectStore = (_store) => {
  store = _store;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (token && store) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    store.dispatch({ type: 'auth/logout' });
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!error.response && config && config.retryCount < 2) {
      config.retryCount = config.retryCount || 0;
      config.retryCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 1000 * config.retryCount));
      return api(config);
    }

    if (error.response?.status === 401) {
      const hadToken = !!error.config?.headers?.Authorization;
      const isAuthEndpoint = error.config?.url?.startsWith('/auth/');
      if (hadToken && !isAuthEndpoint && store) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        store.dispatch({ type: 'auth/logout' });
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;