# Retro Arcade Hub

Retro Arcade Hub é uma coleção de minijogos de arcade retrô que rodam diretamente no navegador sem a necessidade de servidores ou instalações. Foi concebido como um hub extensível com foco em performance, acessibilidade e jogabilidade polida. Cada jogo é construído sobre uma SDK interna reutilizável que facilita a criação de novos títulos.

## Como executar

1. Faça download do pacote `.zip` e extraia o conteúdo em uma pasta local.
2. Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Safari, Edge, etc.).
3. A página inicial listará todos os jogos disponíveis. Selecione um card para começar a jogar.

Não há dependências de servidor – o site funciona totalmente offline.

## Estrutura do Projeto

```
/
├─ index.html           // Página inicial
├─ main.js              // Lógica principal de UI e carregamento de jogos
├─ styles/              // Estilos CSS
│  └─ main.css
├─ sdk/                 // SDK interna (engine, input, áudio, utils, i18n)
│  ├─ core/
│  │  ├─ engine.js
│  │  └─ sceneManager.js
│  ├─ input/
│  │  ├─ keyboard.js
│  │  ├─ pointer.js
│  │  └─ gamepad.js
│  ├─ audio/
│  │  └─ sfx.js
│  ├─ utils/
│  │  ├─ prng.js
│  │  └─ timer.js
│  ├─ storage/
│  │  └─ localSave.js
│  ├─ i18n/
│  │  └─ index.js
│  └─ ui/
│     └─ components.js
├─ games/               // Cada jogo em sua própria pasta
│  ├─ flapper/
│  │  └─ game.js
│  ├─ maze-chomp/
│  │  └─ game.js
│  └─ ...               // demais jogos
├─ docs/
│  ├─ README.md         // Este documento
│  ├─ sdk.md            // Documentação da SDK
│  └─ games.md          // Regras e controles dos jogos
├─ tests/
│  └─ check.html        // (opcional) smoke tests
└─ assets/              // Assets gerados (pode ficar vazio)
```

## Temas e Acessibilidade

* **Temas claro/escuro:** ícone no cabeçalho alterna entre os modos. A preferência é salva localmente.
* **Efeito CRT:** botão TV aplica linhas de varredura e leve distorção, rememorando monitores antigos.
* **Idiomas:** atualmente suporta Português (PT-BR) e Inglês (EN). O botão de idioma alterna instantaneamente a interface.
* **Volume:** controle deslizante ajusta o volume global dos efeitos sonoros.
* **A11y:** cores e textos respeitam contraste mínimo, elementos interativos possuem `aria-labels`, e é possível navegar com teclado.

## Adicionando um novo jogo

Para adicionar um novo jogo utilizando a SDK:

1. Crie uma nova pasta dentro de `games/` com o identificador do jogo (ex: `games/novo-jogo/`).
2. Crie um módulo `game.js` que exporte pelo menos duas funções:
   * `drawPoster(ctx, canvas)`: desenha uma miniatura representativa usada na home.
   * `init({ canvas, sdk, audioManager, exit })`: inicializa o jogo. Você deve usar `sdk.Engine` para o loop principal e pode acessar `sdk.KeyboardManager`, `sdk.PointerManager`, etc.
     * Retorne uma função de limpeza que será chamada quando o jogador sair do jogo.
3. Adicione uma entrada correspondente no array `games` em `main.js` apontando para o novo módulo.
4. Defina as traduções para nome e descrição em `sdk/i18n/index.js`.

Siga a estrutura dos outros jogos como referência. Jogos mais complexos podem organizar código em módulos adicionais dentro de sua pasta.

## Créditos e Licenças

* **Fontes:** A fonte de título **Press Start 2P** e a fonte de corpo **Inter** são carregadas via Google Fonts e licenciadas sob SIL Open Font License.
* **Ícones:** Ícones fornecidos por [Boxicons](https://boxicons.com/) sob licença MIT.
* **Bibliotecas:** Este projeto não utiliza frameworks externos. Todo o código da SDK e dos jogos foi desenvolvido para fins de demonstração.
