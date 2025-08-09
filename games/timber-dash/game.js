import { t } from '../../sdk/i18n/index.js';
export function drawPoster(ctx, canvas) {
  const { width: w, height: h } = canvas;
  ctx.fillStyle = '#0f0c29';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffef00';
  ctx.fillRect(w * 0.5 - 10, h * 0.3, 20, 60);
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.moveTo(w * 0.5 - 20, h * 0.3);
  ctx.lineTo(w * 0.5 + 20, h * 0.3);
  ctx.lineTo(w * 0.5, h * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.font = '14px "Press Start 2P"';
  ctx.fillStyle = '#ffef00';
  ctx.textAlign = 'center';
  ctx.fillText('Timber Dash', w / 2, h - 10);
}
export function init({ canvas, sdk, audioManager, exit }) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#05070d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '12px "Press Start 2P"';
  ctx.fillStyle = '#ffef00';
  ctx.textAlign = 'center';
  ctx.fillText(t('game.timber-dash.name'), canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText('Coming soon...', canvas.width / 2, canvas.height / 2 + 10);
  return () => {};
}