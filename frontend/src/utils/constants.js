// frontend/src/utils/constants.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  PORTFOLIO: '/portfolio',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  ORDER: '/order',
}

// 📌 New: Social links moved here
export const SOCIAL_LINKS = [
  { name: 'twitter', url: import.meta.env.VITE_TWITTER_URL, icon: '🐦' },
  { name: 'linkedin', url: import.meta.env.VITE_LINKEDIN_URL, icon: '💼' },
  { name: 'github', url: import.meta.env.VITE_GITHUB_URL, icon: '🐙' },
  { name: 'dribbble', url: import.meta.env.VITE_DRIBBBLE_URL, icon: '⚽' },
  { name: 'instagram', url: import.meta.env.VITE_INSTAGRAM_URL, icon: '📷' },
]