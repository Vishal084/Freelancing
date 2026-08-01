// frontend/src/utils/helpers.js

// ── Original helpers ──────────────────────────

export const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const truncateText = (text, maxLen = 100) => {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '...';
};

// ── New production‑essential utilities ────────

/**
 * Debounce a function call.
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - Delay in milliseconds (default 300).
 * @returns {Function} Debounced function.
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Safely parse JSON, returning a fallback value on failure.
 * @param {string} str - The JSON string to parse.
 * @param {*} fallback - Value returned if parsing fails.
 * @returns {*} Parsed object or fallback.
 */
export const safeJSONParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

/**
 * Generate a unique ID (useful for accessibility attributes).
 * @param {string} prefix - Optional prefix (default "id").
 * @returns {string} Unique ID string.
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Combine class names conditionally.
 * @param  {...any} classes - Class names or falsy values.
 * @returns {string} Joined class string.
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Check if a JWT token is expired (client side).
 * @param {string} token - JWT token string.
 * @returns {boolean} True if token is expired or invalid.
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/**
 * localStorage wrapper with expiry support.
 */
export const storage = {
  /**
   * Store a value with an optional TTL (default 1 hour).
   * @param {string} key
   * @param {*} value
   * @param {number} ttl - Time to live in milliseconds.
   */
  set(key, value, ttl = 3600000) {
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  /**
   * Retrieve a value. Returns null if expired or not found.
   * @param {string} key
   * @returns {*|null}
   */
  get(key) {
    const item = safeJSONParse(localStorage.getItem(key));
    if (!item) return null;
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  },

  /**
   * Remove a key from localStorage.
   * @param {string} key
   */
  remove(key) {
    localStorage.removeItem(key);
  },
};