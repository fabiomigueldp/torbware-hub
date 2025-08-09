/**
 * Neon Flapper - Flappy Bird like game implemented using the internal SDK.
 */
import { Engine } from '../../sdk/core/engine.js';
import { KeyboardManager } from '../../sdk/input/keyboard.js';
import { PointerManager } from '../../sdk/input/pointer.js';
import { TimerManager } from '../../sdk/utils/timer.js';
import { save, load } from '../../sdk/storage/localSave.js';
import { t } from '../../sdk/i18n/index.js';

/**
 * Draw a simple poster for the game. This is shown on the home page card.
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 */
export function drawPoster(ctx, canvas) {
  const w = canvas.width;
  const h = canvas.height;
  // background gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0f0c29');
  grad.addColorStop(1, '#302b63');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  // neon bird
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.arc(w * 0.3, h * 0.5, 15, 0, Math.PI * 2);
  ctx.fill();
  // pipes representation
  ctx.fillStyle = '#ff00f2';
  ctx.fillRect(w * 0.6, 0, 20, h * 0.4);
  ctx.fillRect(w * 0.6, h * 0.7, 20, h * 0.3);
  // title
  ctx.font = 'bold 14px "Press Start 2P"';
  ctx.fillStyle = '#ffef00';
  ctx.textAlign = 'center';
  ctx.fillText('Neon Flapper', w / 2, h - 10);
}

/**
 * Main initialization function for the game. Called when user launches the game.
 * @param {Object} opts
 * @param {HTMLCanvasElement} opts.canvas Canvas to render the game.
 * @param {Object} opts.sdk SDK containing engine and helpers.
 * @param {AudioManager} opts.audioManager Audio manager instance.
 * @param {() => void} opts.exit Callback to exit back to menu.
 */
export async function init({ canvas, sdk, audioManager, exit }) {
  const ctx = canvas.getContext('2d');
  let width = canvas.width;
  let height = canvas.height;
  // Game state variables
  let running = true;
  const gravity = 600; // px/s^2
  const flapVelocity = -250; // px/s
  const pipeGap = 140;
  const pipeWidth = 50;
  let pipes = [];
  let bird = { x: width * 0.3, y: height / 2, vy: 0 };
  let score = 0;
  let highScore = load('flapper_highscore', 0);
  let state = 'start'; // start, play, gameover
  const timer = new TimerManager();
  // Input managers
  const keyboard = new KeyboardManager();
  const pointer = new PointerManager(canvas);
  // Flap action
  function flap() {
    if (state === 'start') {
      startGame();
    }
    if (state === 'play') {
      bird.vy = flapVelocity;
      audioManager.beep(880, 0.1, 'square');
    } else if (state === 'gameover') {
      restartGame();
    }
  }
  keyboard.on('Space', (down) => {
    if (down) flap();
  });
  keyboard.on('ArrowUp', (down) => {
    if (down) flap();
  });
  pointer.on('down', flap);
  // Start the game
  function startGame() {
    state = 'play';
    pipes = [];
    bird.y = height / 2;
    bird.vy = 0;
    score = 0;
    spawnPipe();
  }
  function restartGame() {
    state = 'start';
  }
  function spawnPipe() {
    const gapY = 80 + Math.random() * (height - 160);
    pipes.push({ x: width + pipeWidth, y: 0, gapY });
  }
  // Update game state
  function update(dt) {
    timer.update(dt);
    if (state === 'play') {
      // Bird physics
      bird.vy += gravity * dt;
      bird.y += bird.vy * dt;
      // Pipes movement
      for (const pipe of pipes) {
        pipe.x -= 200 * dt;
      }
      // Remove off-screen pipes and count score
      if (pipes.length && pipes[0].x + pipeWidth < bird.x && !pipes[0].passed) {
        pipes[0].passed = true;
        score++;
        audioManager.beep(660, 0.05, 'triangle');
      }
      if (pipes.length && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
      }
      // Spawn new pipes
      if (pipes.length === 0 || pipes[pipes.length - 1].x < width - 200) {
        spawnPipe();
      }
      // Collision detection
      if (bird.y > height || bird.y < 0) {
        endGame();
      }
      for (const pipe of pipes) {
        // Check pipe collision (top or bottom)
        if (bird.x + 16 > pipe.x && bird.x - 16 < pipe.x + pipeWidth) {
          if (bird.y - 16 < pipe.gapY || bird.y + 16 > pipe.gapY + pipeGap) {
            endGame();
          }
        }
      }
    }
  }
  function endGame() {
    state = 'gameover';
    audioManager.beep(220, 0.2, 'sawtooth');
    if (score > highScore) {
      highScore = score;
      save('flapper_highscore', highScore);
    }
  }
  // Draw game
  function render(ctx, dt) {
    // Clear
    ctx.fillStyle = '#05070d';
    ctx.fillRect(0, 0, width, height);
    // Draw pipes
    ctx.fillStyle = '#ff00f2';
    for (const pipe of pipes) {
      ctx.fillRect(pipe.x, pipe.y, pipeWidth, pipe.gapY);
      ctx.fillRect(pipe.x, pipe.gapY + pipeGap, pipeWidth, height - pipe.gapY - pipeGap);
    }
    // Draw bird
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, 16, 0, Math.PI * 2);
    ctx.fill();
    // Draw score
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = '#ffef00';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Best: ${highScore}`, 10, 40);
    // Instructions
    if (state === 'start') {
      ctx.font = '16px "Press Start 2P"';
      ctx.fillStyle = '#ffef00';
      ctx.textAlign = 'center';
      ctx.fillText(t('ui.play'), width / 2, height / 2);
      ctx.font = '8px "Press Start 2P"';
      ctx.fillText('Pressione para voar', width / 2, height / 2 + 20);
    } else if (state === 'gameover') {
      ctx.font = '16px "Press Start 2P"';
      ctx.fillStyle = '#ffef00';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', width / 2, height / 2);
      ctx.font = '8px "Press Start 2P"';
      ctx.fillText('Pressione para reiniciar', width / 2, height / 2 + 20);
    }
  }
  // Handle resizing
  function resize(newW, newH) {
    width = newW;
    height = newH;
    // reposition bird relative to new height
    bird.x = width * 0.3;
  }
  const engine = new Engine({ update, render, canvas });
  engine.start();
  // Return cleanup function
  return () => {
    engine.stop();
    // remove event listeners if necessary (keyboard/pointer automatically cleaned by GC)
  };
}