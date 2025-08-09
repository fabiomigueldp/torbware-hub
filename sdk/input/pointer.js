/**
 * Pointer manager handles both mouse and touch input, normalizing events.
 */
export class PointerManager {
  /**
   * @param {HTMLElement} target Element to attach listeners to (e.g. canvas).
   */
  constructor(target) {
    this.target = target;
    this.x = 0;
    this.y = 0;
    this.down = false;
    this.listeners = { down: [], move: [], up: [] };
    // Mouse events
    target.addEventListener('mousedown', (e) => this.handleDown(e));
    target.addEventListener('mousemove', (e) => this.handleMove(e));
    window.addEventListener('mouseup', (e) => this.handleUp(e));
    // Touch events
    target.addEventListener('touchstart', (e) => this.handleDown(e));
    target.addEventListener('touchmove', (e) => this.handleMove(e));
    window.addEventListener('touchend', (e) => this.handleUp(e));
  }
  getPos(e) {
    const rect = this.target.getBoundingClientRect();
    if (e.touches) {
      const t = e.touches[0] || e.changedTouches[0];
      return {
        x: (t.clientX - rect.left) * (this.target.width / rect.width),
        y: (t.clientY - rect.top) * (this.target.height / rect.height)
      };
    } else {
      return {
        x: (e.clientX - rect.left) * (this.target.width / rect.width),
        y: (e.clientY - rect.top) * (this.target.height / rect.height)
      };
    }
  }
  handleDown(e) {
    e.preventDefault();
    const pos = this.getPos(e);
    this.x = pos.x;
    this.y = pos.y;
    this.down = true;
    this.listeners.down.forEach((fn) => fn(this.x, this.y));
  }
  handleMove(e) {
    if (!this.down) return;
    const pos = this.getPos(e);
    this.x = pos.x;
    this.y = pos.y;
    this.listeners.move.forEach((fn) => fn(this.x, this.y));
  }
  handleUp(e) {
    if (!this.down) return;
    const pos = this.getPos(e);
    this.x = pos.x;
    this.y = pos.y;
    this.down = false;
    this.listeners.up.forEach((fn) => fn(this.x, this.y));
  }
  on(event, fn) {
    if (this.listeners[event]) {
      this.listeners[event].push(fn);
    }
  }
}