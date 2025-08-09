/**
 * Simple scene manager to switch between different game states (menu, gameplay, etc.).
 */
export class SceneManager {
  constructor() {
    this.current = null;
  }
  /**
   * Change to a new scene. Calls exit on the current scene and enter on the new one.
   * @param {Object} scene Scene object implementing enter, update, render, exit.
   */
  change(scene) {
    if (this.current && typeof this.current.exit === 'function') {
      this.current.exit();
    }
    this.current = scene;
    if (scene && typeof scene.enter === 'function') {
      scene.enter();
    }
  }
  update(dt) {
    if (this.current && typeof this.current.update === 'function') {
      this.current.update(dt);
    }
  }
  render(ctx, dt) {
    if (this.current && typeof this.current.render === 'function') {
      this.current.render(ctx, dt);
    }
  }
}