


import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Smarter 401 handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = !!error.config?.headers?.Authorization;
      const isAuthEndpoint = error.config?.url?.startsWith('/auth/');

      // Only hard‑redirect if the user was actually logged in (token existed)
      // AND the request was not an auth‑related one (login, signup, me).
      if (hadToken && !isAuthEndpoint) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Use the exposed store to dispatch logout (keeps UI in sync)
        if (window.__REDUX_STORE__) {
          window.__REDUX_STORE__.dispatch({ type: 'auth/logout' });
        }
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;