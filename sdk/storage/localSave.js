/**
 * Simple wrapper around localStorage providing JSON serialization.
 */
const PREFIX = 'rah_';

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('Unable to save', key, e);
  }
}

export function load(key, defaultValue) {
  try {
    const str = localStorage.getItem(PREFIX + key);
    return str ? JSON.parse(str) : defaultValue;
  } catch (e) {
    console.warn('Unable to load', key, e);
    return defaultValue;
  }
}