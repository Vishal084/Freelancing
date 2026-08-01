// src/config.js
const requiredVars = ['VITE_API_URL'];

requiredVars.forEach((key) => {
  if (!import.meta.env[key]) {
    throw new Error(`Missing environment variable: ${key}. Check your .env file.`);
  }
});

export const API_URL = import.meta.env.VITE_API_URL;
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || ''; // optional for now
export const SOCIAL_LINKS = {
  twitter: import.meta.env.VITE_TWITTER_URL,
  facebook: import.meta.env.VITE_FACEBOOK_URL,
  linkedin: import.meta.env.VITE_LINKEDIN_URL,
  github: import.meta.env.VITE_GITHUB_URL,
  dribbble: import.meta.env.VITE_DRIBBBLE_URL,
  instagram: import.meta.env.VITE_INSTAGRAM_URL,
};