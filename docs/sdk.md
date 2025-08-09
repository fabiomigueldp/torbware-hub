# SDK da Retro Arcade Hub

Esta SDK foi projetada para ser uma base simples, extensível e de fácil entendimento para jogos 2D em HTML5 Canvas. Ela fornece utilitários para o loop principal, gerenciamento de cenas, entrada, áudio, armazenamento local, internacionalização e geração de números aleatórios. A seguir, descrevemos as principais classes e funções disponíveis.

## Engine

`class Engine` cria um loop de jogo baseado em `requestAnimationFrame`.

```
new Engine({ update, render, canvas })
```

* **update(dt)**: função chamada a cada frame com o delta de tempo em segundos. Atualize o estado do jogo aqui.
* **render(ctx, dt)**: função chamada após `update` com o contexto 2D do canvas e o delta de tempo. Desenhe a cena aqui.
* **canvas**: referência ao elemento `<canvas>` onde o jogo será renderizado.

Métodos principais:

* **start()**: inicia o loop.
* **stop()**: interrompe o loop.

## SceneManager

`class SceneManager` permite trocar entre diferentes cenas (menu, jogo, game over, etc.). Uma cena é um objeto com métodos opcionais: `enter()`, `update(dt)`, `render(ctx, dt)`, `exit()`.

```
const manager = new SceneManager();
manager.change(scene1);
manager.update(dt);
manager.render(ctx, dt);
```

Quando `change()` é chamado, o método `exit()` da cena atual é invocado (se existir) e depois o método `enter()` da nova cena.

## Entrada

### KeyboardManager

Registra o estado do teclado e permite callbacks quando teclas são pressionadas ou liberadas.

```
const keyboard = new KeyboardManager();
keyboard.on('Space', (down) => { /* ... */ });
if (keyboard.isDown('ArrowUp')) { /* ... */ }
```

* **on(key, callback)**: registra uma função chamada com `true` quando a tecla `key` é pressionada e `false` quando liberada.
* **isDown(key)**: retorna `true` se a tecla estiver pressionada.

### PointerManager

Normaliza eventos de mouse e toque, fornecendo coordenadas no canvas.

```
const pointer = new PointerManager(canvas);
pointer.on('down', (x, y) => { /* início do toque/clique */ });
pointer.on('move', (x, y) => { /* arrasto */ });
pointer.on('up', (x, y) => { /* fim */ });
```

### GamepadManager

Gerencia gamepads conectados. É necessário chamar `update()` a cada frame para atualizar o estado.

```
const gamepads = new GamepadManager();
gamepads.update();
if (gamepads.isDown(0)) { /* botão A apertado */ }
const x = gamepads.axis(0); // eixo X do analógico esquerdo
```

## Áudio

### AudioManager

Proporciona efeitos sonoros simples gerados por síntese via Web Audio API.

```
const audio = new AudioManager();
audio.setVolume(0.5);
audio.beep(440, 0.1, 'square');
audio.setMute(true);
```

* **setVolume(value)**: define volume global (0 a 1).
* **setMute(flag)**: mudo global.
* **beep(freq, dur, type)**: toca um beep com frequência (Hz), duração (seg) e tipo de oscilador (`sine`, `square`, `sawtooth`, `triangle`).

## Utilidades

### PRNG

`createPRNG(seed)` retorna uma função geradora de números pseudo‑aleatórios baseada no algoritmo Mulberry32.

```
const rng = createPRNG(Date.now());
const value = rng(); // 0 ≤ value < 1
```

### TimerManager

Permite agendar callbacks futuros em relação ao tempo do jogo.

```
const timers = new TimerManager();
timers.setTimeout(2, () => console.log('dois segundos depois'));
function update(dt) { timers.update(dt); }
```

## Armazenamento Local

As funções `save(key, value)` e `load(key, defaultValue)` em `sdk/storage/localSave.js` oferecem interface simples para persistir dados no `localStorage` (com prefixo interno `rah_`).

```
import { save, load } from '../storage/localSave.js';
save('highscore', 42);
const score = load('highscore', 0);
```

## Internacionalização (i18n)

O módulo `sdk/i18n/index.js` centraliza strings traduzidas. Use `t(key)` para obter a tradução conforme o idioma atual.

```
import { t, setLanguage, getLanguage } from '../i18n/index.js';
console.log(t('ui.play'));
setLanguage('en');
```

* **setLanguage(lang)**: define o idioma (`'pt-BR'` ou `'en'`).
* **getLanguage()**: retorna o idioma corrente.
* **onLanguageChange(fn)**: registra callback para mudanças de idioma.

## UI Kit

O módulo `sdk/ui/components.js` contém helpers para criar elementos de interface consistentes. Por simplicidade, este projeto utiliza componentes nativos (`<button>`, `<input>`) com estilos globais. Jogos complexos podem importar e utilizar `createButton()`, `createToggle()` e `createModal()` para construir menus e diálogos reutilizáveis.
