import { t } from '../../sdk/i18n/index.js';
export function drawPoster(ctx, canvas) {
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = '#0f0c29';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#00e5ff';
  ctx.fillRect(w * 0.2, h * 0.3, 20, 20);
  ctx.fillStyle = '#ff00f2';
  ctx.fillRect(w * 0.4, h * 0.5, 20, 20);
  ctx.fillStyle = '#ffef00';
  ctx.fillRect(w * 0.6, h * 0.4, 20, 20);
  ctx.font = '14px "Press Start 2P"';
  ctx.fillStyle = '#ffef00';
  ctx.textAlign = 'center';
  ctx.fillText('MineGrid', w / 2, h - 10);
}
export function init({ canvas, sdk, audioManager, exit }) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#05070d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '12px "Press Start 2P"';
  ctx.fillStyle = '#ffef00';
  ctx.textAlign = 'center';
  ctx.fillText(t('game.minegrid.name'), canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText('Coming soon...', canvas.width / 2, canvas.height / 2 + 10);
  return () => {};
}