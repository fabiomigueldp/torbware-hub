/**
 * Basic game engine that provides a main loop using requestAnimationFrame.
 * It calls update and render callbacks with delta time and maintains a
 * target update rate independent of frame rate variations.
 */
export class Engine {
  /**
   * Create an Engine.
   * @param {Object} opts
   * @param {(dt:number) => void} opts.update Function to update game state.
   * @param {(ctx:CanvasRenderingContext2D, dt:number) => void} opts.render Function to render game state.
   * @param {HTMLCanvasElement} opts.canvas The canvas to render onto.
   */
  constructor({ update, render, canvas }) {
    this.update = update;
    this.render = render;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.lastTime = 0;
    this.running = false;
    this._boundLoop = this.loop.bind(this);
  }
  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this._boundLoop);
  }
  stop() {
    this.running = false;
  }
  loop(now) {
    if (!this.running) return;
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    // Cap delta time to avoid spirals
    const cappedDt = Math.min(dt, 0.033);
    this.update(cappedDt);
    this.render(this.ctx, cappedDt);
    requestAnimationFrame(this._boundLoop);
  }
}