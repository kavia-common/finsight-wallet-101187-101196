const KEY_PREFIX = 'finsight__';

function k(key) { return `${KEY_PREFIX}${key}`; }

// PUBLIC_INTERFACE
export const storage = {
  set(key, value) {
    localStorage.setItem(k(key), JSON.stringify(value));
  },
  get(key, fallback = null) {
    const raw = localStorage.getItem(k(key));
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch { return fallback; }
  },
  remove(key) {
    localStorage.removeItem(k(key));
  }
};
