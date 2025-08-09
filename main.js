import { Engine } from './sdk/core/engine.js';
import { SceneManager } from './sdk/core/sceneManager.js';
import { KeyboardManager } from './sdk/input/keyboard.js';
import { PointerManager } from './sdk/input/pointer.js';
import { GamepadManager } from './sdk/input/gamepad.js';
import { AudioManager } from './sdk/audio/sfx.js';
import { TimerManager } from './sdk/utils/timer.js';
import { createPRNG } from './sdk/utils/prng.js';
import * as storage from './sdk/storage/localSave.js';
import { t, setLanguage, getLanguage, onLanguageChange } from './sdk/i18n/index.js';

// Import all game modules statically (avoids dynamic import restrictions on file://)
import * as flapperModule from './games/flapper/game.js';
import * as mazeChompModule from './games/maze-chomp/game.js';
import * as minegridModule from './games/minegrid/game.js';
import * as dualpaddlesModule from './games/dualpaddles/game.js';
import * as vectorBreakerModule from './games/vector-breaker/game.js';
import * as neosnakeModule from './games/neosnake/game.js';
import * as timberDashModule from './games/timber-dash/game.js';
import * as starInvadersModule from './games/star-invaders/game.js';
import * as tetrominoRushModule from './games/tetromino-rush/game.js';

// Global SDK to share with games
const audioManager = new AudioManager();
const sdk = {
  Engine,
  SceneManager,
  KeyboardManager,
  PointerManager,
  GamepadManager,
  AudioManager,
  TimerManager,
  createPRNG,
  storage,
  t,
  audioManager
};

// Game metadata list
const games = [
  { id: 'flapper' },
  { id: 'maze-chomp' },
  { id: 'minegrid' },
  { id: 'dualpaddles' },
  { id: 'vector-breaker' },
  { id: 'neosnake' },
  { id: 'timber-dash' },
  { id: 'star-invaders' },
  { id: 'tetromino-rush' }
];

// Map IDs to modules
const modulesMap = {
  'flapper': flapperModule,
  'maze-chomp': mazeChompModule,
  'minegrid': minegridModule,
  'dualpaddles': dualpaddlesModule,
  'vector-breaker': vectorBreakerModule,
  'neosnake': neosnakeModule,
  'timber-dash': timberDashModule,
  'star-invaders': starInvadersModule,
  'tetromino-rush': tetrominoRushModule
};

let currentGameCleanup = null;

function init() {
  // Populate current year
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  // Load theme from storage
  const theme = storage.load('theme', 'dark');
  if (theme === 'light') document.body.classList.add('light');
  // Load CRT effect state
  const crt = storage.load('crt', false);
  if (crt) document.body.classList.add('crt');
  // Setup theme toggle button
  const themeBtn = document.getElementById('themeToggle');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const newTheme = document.body.classList.contains('light') ? 'light' : 'dark';
    storage.save('theme', newTheme);
    updateThemeIcon();
  });
  function updateThemeIcon() {
    const icon = themeBtn.querySelector('i');
    if (document.body.classList.contains('light')) {
      icon.className = 'bx bx-moon';
    } else {
      icon.className = 'bx bx-sun';
    }
  }
  updateThemeIcon();
  // CRT toggle
  const crtBtn = document.getElementById('crtToggle');
  crtBtn.addEventListener('click', () => {
    document.body.classList.toggle('crt');
    const isCrt = document.body.classList.contains('crt');
    storage.save('crt', isCrt);
  });
  // Language toggle
  const langBtn = document.getElementById('langToggle');
  function updateLangButton() {
    langBtn.querySelector('span').textContent = getLanguage() === 'pt-BR' ? 'PT' : 'EN';
  }
  langBtn.addEventListener('click', () => {
    const newLang = getLanguage() === 'pt-BR' ? 'en' : 'pt-BR';
    setLanguage(newLang);
  });
  onLanguageChange(() => {
    updateLangButton();
    renderGameList();
  });
  updateLangButton();
  // Volume slider
  const volumeSlider = document.getElementById('volumeSlider');
  volumeSlider.value = storage.load('volume', 1);
  audioManager.setVolume(parseFloat(volumeSlider.value));
  volumeSlider.addEventListener('input', () => {
    const val = parseFloat(volumeSlider.value);
    audioManager.setVolume(val);
    storage.save('volume', val);
  });
  renderGameList();
}

function renderGameList() {
  const list = document.getElementById('game-list');
  list.innerHTML = '';
  games.forEach((game) => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', t(`game.${game.id}.name`));
    // Canvas poster
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 160;
    card.appendChild(canvas);
    // Info
    const info = document.createElement('div');
    info.className = 'info';
    const title = document.createElement('h3');
    title.textContent = t(`game.${game.id}.name`);
    info.appendChild(title);
    const desc = document.createElement('p');
    desc.textContent = t(`game.${game.id}.desc`);
    info.appendChild(desc);
    card.appendChild(info);
    // Draw poster via module, fallback to default pattern
    const mod = modulesMap[game.id];
    if (mod && typeof mod.drawPoster === 'function') {
      mod.drawPoster(canvas.getContext('2d'), canvas);
    } else {
      const ctx2 = canvas.getContext('2d');
      const grad = ctx2.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#1c1e33');
      grad.addColorStop(1, '#343a6e');
      ctx2.fillStyle = grad;
      ctx2.fillRect(0, 0, canvas.width, canvas.height);
    }
    // Click/Enter event
    const handler = () => launchGame(game);
    card.addEventListener('click', handler);
    card.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        handler();
      }
    });
    list.appendChild(card);
  });
}

async function launchGame(gameMeta) {
  const listSection = document.getElementById('game-list');
  const gameContainer = document.getElementById('game-container');
  // Clear previous game if any
  if (currentGameCleanup) {
    currentGameCleanup();
    currentGameCleanup = null;
  }
  listSection.style.display = 'none';
  gameContainer.innerHTML = '';
  gameContainer.style.display = 'flex';
  const canvas = document.createElement('canvas');
  canvas.width = gameContainer.clientWidth;
  canvas.height = gameContainer.clientHeight;
  canvas.className = 'game-canvas';
  gameContainer.appendChild(canvas);
  // Provide exit/back button
  const backBtn = document.createElement('button');
  backBtn.className = 'btn-icon back-btn';
  backBtn.innerHTML = `<i class='bx bx-arrow-back'></i>`;
  backBtn.setAttribute('aria-label', t('ui.back'));
  backBtn.addEventListener('click', () => {
    if (currentGameCleanup) currentGameCleanup();
    gameContainer.style.display = 'none';
    listSection.style.display = 'grid';
    currentGameCleanup = null;
  });
  gameContainer.appendChild(backBtn);
  // Resize canvas on window resize
  const resizeCanvas = () => {
    canvas.width = gameContainer.clientWidth;
    canvas.height = gameContainer.clientHeight;
    if (typeof currentGameCleanup?.resize === 'function') {
      currentGameCleanup.resize(canvas.width, canvas.height);
    }
  };
  window.addEventListener('resize', resizeCanvas);
  // Dynamically import game module
  try {
    const mod = modulesMap[gameMeta.id];
    if (!mod || typeof mod.init !== 'function') throw new Error('Game module missing init');
    currentGameCleanup = await mod.init({ canvas, sdk, audioManager, exit: () => backBtn.click() });
  } catch (e) {
    console.error('Failed to load game', gameMeta.id, e);
    const p = document.createElement('p');
    p.textContent = `Erro ao carregar o jogo ${gameMeta.id}.`;
    gameContainer.appendChild(p);
  }
}

document.addEventListener('DOMContentLoaded', init);