/**
 * Audio manager for playing simple sound effects using Web Audio API.
 * Supports global volume and muting. When the page is hidden, audio is
 * automatically muted to respect user preferences.
 */
export class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.volume = 1;
    this.muted = false;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.setMute(true);
      }
    });
  }
  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
  }
  setVolume(value) {
    this.volume = value;
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : this.volume;
    }
  }
  setMute(mute) {
    this.muted = mute;
    if (this.masterGain) {
      this.masterGain.gain.value = mute ? 0 : this.volume;
    }
  }
  /**
   * Play a simple beep sound.
   * @param {number} freq Frequency in Hz
   * @param {number} duration Duration in seconds
   * @param {number} [type] Oscillator type (sine, square, sawtooth, triangle)
   */
  beep(freq = 440, duration = 0.1, type = 'square') {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.2;
    osc.frequency.setValueAtTime(freq, now);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration);
  }
}