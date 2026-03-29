// utils.js – Shared utility functions

/**
 * Fetches `url`, throws on non-2xx, returns parsed JSON.
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
export const fetchData = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText} – ${url}`
    );
  }
  return response.json();
};

/**
 * Basic XSS guard – escapes HTML special characters.
 * @param {string} str
 * @returns {string}
 */
export const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
