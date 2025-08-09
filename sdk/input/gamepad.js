/**
 * Gamepad manager handles connection of gamepads and allows querying state.
 * Note: It requires calling update() each frame to refresh state.
 */
export class GamepadManager {
  constructor() {
    this.gamepads = [];
    window.addEventListener('gamepadconnected', (e) => {
      this.gamepads[e.gamepad.index] = e.gamepad;
    });
    window.addEventListener('gamepaddisconnected', (e) => {
      delete this.gamepads[e.gamepad.index];
    });
  }
  /**
   * Refresh internal state of connected gamepads.
   */
  update() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    this.gamepads = [];
    for (let i = 0; i < pads.length; i++) {
      const pad = pads[i];
      if (pad) this.gamepads[pad.index] = pad;
    }
  }
  /**
   * Returns the first connected gamepad, if any.
   */
  get pad() {
    return this.gamepads.find(Boolean);
  }
  /**
   * Query if a button is pressed on the first gamepad.
   * @param {number} index Button index (0 = A, 1 = B, etc.)
   */
  isDown(index) {
    const pad = this.pad;
    if (!pad) return false;
    return pad.buttons[index] && pad.buttons[index].pressed;
  }
  /**
   * Get axis value from the first gamepad.
   * @param {number} index Axis index (e.g. 0 for left stick X)
   */
  axis(index) {
    const pad = this.pad;
    if (!pad) return 0;
    return pad.axes[index] || 0;
  }
}