const STORAGE_KEY = 'qlsv_token';

export const tokenStorage = {
  save(token) {
    if (!token) return;
    localStorage.setItem(STORAGE_KEY, token);
  },
  get() {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
  },
  clear() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
