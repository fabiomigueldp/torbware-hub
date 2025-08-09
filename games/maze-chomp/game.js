/**
 * Maze Chomp placeholder module. A Pac-Man inspired game.
 */
import { t } from '../../sdk/i18n/index.js';

export function drawPoster(ctx, canvas) {
  const { width: w, height: h } = canvas;
  ctx.fillStyle = '#0f0c29';
  ctx.fillRect(0, 0, w, h);
  // Ghosts
  ctx.fillStyle = '#ff00f2';
  ctx.beginPath();
  ctx.arc(w * 0.3, h * 0.5, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.5, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffef00';
  ctx.beginPath();
  ctx.arc(w * 0.7, h * 0.5, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '14px "Press Start 2P"';
  ctx.fillStyle = '#ffef00';
  ctx.textAlign = 'center';
  ctx.fillText('Maze Chomp', w / 2, h - 10);
}

export function init({ canvas, sdk, audioManager, exit }) {
  const ctx = canvas.getContext('2d');
  // Render simple message
  ctx.fillStyle = '#05070d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '12px "Press Start 2P"';
  ctx.fillStyle = '#ffef00';
  ctx.textAlign = 'center';
  ctx.fillText(t('game.maze-chomp.name'), canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText('Coming soon...', canvas.width / 2, canvas.height / 2 + 10);
  return () => {};
}