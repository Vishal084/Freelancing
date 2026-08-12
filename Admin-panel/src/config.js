// src/config.js
const requiredVars = ['VITE_API_URL'];
requiredVars.forEach((key) => {
  if (!import.meta.env[key]) {
    throw new Error(`Missing environment variable: ${key}. Check your .env file.`);
  }
});
export const API_URL = import.meta.env.VITE_API_URL;
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';