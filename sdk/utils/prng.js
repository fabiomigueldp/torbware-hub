/**
 * Seedable pseudo-random number generator using Mulberry32 algorithm.
 * Example usage:
 *   const rng = createPRNG(Date.now());
 *   console.log(rng()); // outputs a number between 0 and 1
 *
 * @param {number} seed Seed value for the generator
 * @returns {() => number} Function that returns a pseudo-random number [0,1)
 */
export function createPRNG(seed) {
  let state = seed >>> 0;
  return function() {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}