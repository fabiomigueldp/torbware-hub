import { t } from '../../sdk/i18n/index.js';
export function drawPoster(ctx, canvas) {
  const { width: w, height: h } = canvas;
  ctx.fillStyle = '#0f0c29';
  ctx.fillRect(0, 0, w, h);
  // player ship
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.moveTo(w / 2, h * 0.7);
  ctx.lineTo(w / 2 - 15, h * 0.8);
  ctx.lineTo(w / 2 + 15, h * 0.8);
  ctx.closePath();
  ctx.fill();
  // invaders
  ctx.fillStyle = '#ff00f2';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(w * 0.2 + i * 0.15 * w, h * 0.3, 20, 20);
  }
  ctx.font = '14px "Press Start 2P"';
  ctx.fillStyle = '#ffef00';
  ctx.textAlign = 'center';
  ctx.fillText('Star Invaders', w / 2, h - 10);
}
export function init({ canvas, sdk, audioManager, exit }) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#05070d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '12px "Press Start 2P"';
  ctx.fillStyle = '#ffef00';
  ctx.textAlign = 'center';
  ctx.fillText(t('game.star-invaders.name'), canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText('Coming soon...', canvas.width / 2, canvas.height / 2 + 10);
  return () => {};
}