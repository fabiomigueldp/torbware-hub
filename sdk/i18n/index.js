import { load, save } from '../storage/localSave.js';

const defaultLang = 'pt-BR';
const fallbackLang = 'en';

// Translation dictionaries. Each key corresponds to a string identifier.
const dictionaries = {
  'pt-BR': {
    'game.flapper.name': 'Neon Flapper',
    'game.flapper.desc': 'Voe pelos gaps e colete power-ups.',
    'game.maze-chomp.name': 'Maze Chomp',
    'game.maze-chomp.desc': 'Devore pellets e fuja dos inimigos.',
    'game.minegrid.name': 'MineGrid',
    'game.minegrid.desc': 'Revele células, evite minas.',
    'game.dualpaddles.name': 'DualPaddles',
    'game.dualpaddles.desc': 'Rebata a bola contra o oponente.',
    'game.vector-breaker.name': 'Vector Breaker',
    'game.vector-breaker.desc': 'Destrua blocos com power-ups.',
    'game.neosnake.name': 'NeoSnake',
    'game.neosnake.desc': 'Cresça e evite bater em si mesmo.',
    'game.timber-dash.name': 'Timber Dash',
    'game.timber-dash.desc': 'Corte a árvore, evite os galhos.',
    'game.star-invaders.name': 'Star Invaders',
    'game.star-invaders.desc': 'Defenda-se de ondas inimigas.',
    'game.tetromino-rush.name': 'Tetromino Rush',
    'game.tetromino-rush.desc': 'Empilhe peças para formar linhas.',
    'ui.play': 'Jogar',
    'ui.practice': 'Praticar',
    'ui.back': 'Voltar',
    'ui.pause': 'Pausar',
    'ui.resume': 'Retomar'
  },
  'en': {
    'game.flapper.name': 'Neon Flapper',
    'game.flapper.desc': 'Fly through gaps and collect power-ups.',
    'game.maze-chomp.name': 'Maze Chomp',
    'game.maze-chomp.desc': 'Munch pellets and evade enemies.',
    'game.minegrid.name': 'MineGrid',
    'game.minegrid.desc': 'Reveal cells, avoid mines.',
    'game.dualpaddles.name': 'DualPaddles',
    'game.dualpaddles.desc': 'Bounce the ball past your opponent.',
    'game.vector-breaker.name': 'Vector Breaker',
    'game.vector-breaker.desc': 'Destroy bricks with power-ups.',
    'game.neosnake.name': 'NeoSnake',
    'game.neosnake.desc': 'Grow and avoid hitting yourself.',
    'game.timber-dash.name': 'Timber Dash',
    'game.timber-dash.desc': 'Chop the tree, dodge branches.',
    'game.star-invaders.name': 'Star Invaders',
    'game.star-invaders.desc': 'Defend against enemy waves.',
    'game.tetromino-rush.name': 'Tetromino Rush',
    'game.tetromino-rush.desc': 'Stack pieces to clear lines.',
    'ui.play': 'Play',
    'ui.practice': 'Practice',
    'ui.back': 'Back',
    'ui.pause': 'Pause',
    'ui.resume': 'Resume'
  }
};

let currentLang = load('lang', defaultLang) || defaultLang;
const listeners = [];

export function setLanguage(lang) {
  if (dictionaries[lang]) {
    currentLang = lang;
    save('lang', lang);
    listeners.forEach((fn) => fn(lang));
  }
}
export function getLanguage() {
  return currentLang;
}
export function onLanguageChange(fn) {
  listeners.push(fn);
}
export function t(key) {
  const dict = dictionaries[currentLang] || {};
  const fallbackDict = dictionaries[fallbackLang] || {};
  return dict[key] || fallbackDict[key] || key;
}