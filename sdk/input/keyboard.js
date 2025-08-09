/**
 * Keyboard manager that tracks key state and dispatches callbacks.
 */
export class KeyboardManager {
  constructor() {
    this.keys = {};
    this.listeners = {};
    this.enabled = true;
    window.addEventListener('keydown', (e) => this.handleKeyDown(e), { passive: false });
    window.addEventListener('keyup', (e) => this.handleKeyUp(e), { passive: false });
  }
  handleKeyDown(e) {
    if (!this.enabled) return;
    const key = e.code;
    if (!this.keys[key]) {
      this.keys[key] = true;
      if (this.listeners[key]) {
        this.listeners[key].forEach((fn) => fn(true));
      }
    }
  }
  handleKeyUp(e) {
    if (!this.enabled) return;
    const key = e.code;
    if (this.keys[key]) {
      delete this.keys[key];
      if (this.listeners[key]) {
        this.listeners[key].forEach((fn) => fn(false));
      }
    }
  }
  /**
   * Register a callback for when a particular key is pressed or released.
   * @param {string} key Key code (e.g. 'Space', 'ArrowUp')
   * @param {(down:boolean) => void} fn Called with true on press and false on release.
   */
  on(key, fn) {
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(fn);
  }
  /**
   * Query whether a key is currently pressed.
   * @param {string} key Key code to query.
   */
  isDown(key) {
    return !!this.keys[key];
  }
}