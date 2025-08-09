/**
 * Simple timer helper for scheduling and executing callbacks.
 * Maintains a list of timers that count down with delta time.
 */
export class TimerManager {
  constructor() {
    this.timers = [];
  }
  /**
   * Schedule a callback to run after a delay.
   * @param {number} delay Seconds before callback executes.
   * @param {() => void} fn Callback function.
   */
  setTimeout(delay, fn) {
    this.timers.push({ time: delay, fn });
  }
  /**
   * Update timers; call functions whose delay has expired.
   * @param {number} dt Delta time in seconds since last update.
   */
  update(dt) {
    for (let i = this.timers.length - 1; i >= 0; i--) {
      const t = this.timers[i];
      t.time -= dt;
      if (t.time <= 0) {
        t.fn();
        this.timers.splice(i, 1);
      }
    }
  }
}