/**
 * LUMEN LUXE - LocalStorage Persistence Wrapper
 * Provides safe get/set/remove abstractions with fallback defaults.
 */

const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`lumen_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`[Storage] Failed to read ${key} from localStorage:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(`lumen_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn(`[Storage] Failed to save ${key} to localStorage:`, e);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(`lumen_${key}`);
    } catch (e) {
      console.warn(`[Storage] Failed to remove ${key}:`, e);
    }
  }
};
