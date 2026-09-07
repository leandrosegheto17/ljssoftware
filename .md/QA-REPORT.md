# QA-REPORT.md — Site institucional LJSSoftware

**Autor:** Validador (chapéu QA)
**Base:** `TASK.md` Seção 3 (Lote 1), `UX-SPEC.md` Seções 3.1/6/7, `GUARDRAILS.md` (G-01, G-05, G-07, G-11, G-14)
**Data:** 2026-09-07

---

## Lote 1 — Fundação de Design System

**Escopo validado:** T1.1 a T1.5, todas com Status `Concluída` no `TASK.md` no
momento desta validação.

**Metodologia:** cada artefato foi inspecionado diretamente no disco contra o
critério de aceite do `TASK.md`/`UX-SPEC.md`/`GUARDRAILS.md`, sem usar a nota
de implementação do Executor como base de aprovação (usada só como ponto de
partida de onde olhar). Scripts automatizados do próprio lote foram
reexecutados nesta validação (não reaproveitado o resultado relatado pelo
Executor).

### T1.1 — Tokens de design "Geométrico/Glass"

**Veredito: Aprovado.**

- Todos os 14 tokens da tabela da Seção 1.2 do `TASK.md` estão declarados em
  `assets/css/tokens.css`, com os valores exatos da Seção 3.1 do `UX-SPEC.md`.
- `.glass-card` presente com `backdrop-filter: blur(var(--glass-blur))` +
  fallback `@supports not (backdrop-filter: blur(1px))` aplicando `--glass-bg`
  sem blur — conforme UX-SPEC.md Seção 7.
- `.decorative-shape` presente com `--shape-radius`, rotação dentro da faixa
  10°-35° (22°, ponto médio) e gradiente `--color-bg-gradient-1/2`.
- Não inclui `.wordmark` (correto, removida por ADR-005).
- `node assets/css/tokens.contrast-check.js` reexecutado por este Validador:
  **5/5 combinações PASS WCAG AA** (13.91:1, 9.96:1, 10.13:1, 15.39:1, 9.18:1
  — todas acima do mínimo exigido). Confere com o relatado pelo Executor.
- `assets/css/tokens.smoke.html` presente e coerente com o que descreve
  (card glass + blocos de contraste + demo de header).
- G-05 (WCAG AA) e G-11 (fontes self-hosted, tratado em T1.2) não violados
  nesta tarefa.

### T1.2 — Self-hosting de fontes Unbounded/Outfit

**Veredito: Aprovado.**

- 4 arquivos `.woff2` presentes em `assets/fonts/`: `unbounded-v12-latin-500`,
  `unbounded-v12-latin-700`, `outfit-v15-latin-400`, `outfit-v15-latin-600`,
  tamanhos batendo com o relatado.
- `@font-face` em `tokens.css` para os 4 pesos, todos com
  `font-display: swap` — confirmado por leitura direta do arquivo.
- `node assets/fonts/fonts.smoke.check.js` reexecutado por este Validador:
  **PASS** — sem referência a CDN externo de fontes, `font-display: swap`
  presente em todos os `@font-face`, integridade dos 4 arquivos confirmada.
- Varredura adicional deste Validador (`grep` por `fonts.googleapis`/
  `fonts.gstatic`/`cdn.` em todo o projeto) não encontrou nenhuma referência
  de CDN de fontes fora do próprio script de verificação — G-11 satisfeita.

### T1.3 — CSS reset/base + grid responsivo

**Veredito: Aprovado.**

- `assets/css/base.css` contém reset (box-sizing, remoção de margin/padding,
  normalização de `img`/lista/link/botão/heading), `overflow-x: hidden` em
  `html`/`body`, suporte a `prefers-reduced-motion: reduce`,
  `:focus-visible` com `--color-accent` (nenhum `outline: none` sem
  substituto — confere com a diretriz da Seção 1.2 do `TASK.md`).
- Breakpoints via `min-width` em 768px e 1024px, mobile-first: `.grid`
  base 1 coluna; `.grid--2col`/`.grid--3col` viram 2 colunas em 768px;
  `.grid--3col` vira 3 colunas em 1024px — exatamente conforme UX-SPEC.md
  Seção 6 (mobile 1 col / tablet 2 col / desktop 3 col para grid de apps).
- `.stack--row-tablet-up` empilha em mobile e vira linha a partir de 768px,
  coerente com "rodapé empilhado verticalmente" em mobile (Seção 6).
- `assets/css/base.smoke.html` presente. Nota de processo: esta validação
  não dispôs de automação de navegador (`playwright-skill`) para os 3
  breakpoints — inspeção foi feita por leitura estática das media queries,
  que estão corretas e suficientes para aprovar nesta fase (nenhuma página
  HTML final existe ainda para um teste end-to-end real; T4.2 fará a
  auditoria de acessibilidade/responsividade sobre as páginas montadas no
  Lote 3).

### T1.4 — Favicon derivado do ícone da logo

**Veredito: Aprovado com ressalva (achado Simples registrado).**

- `assets/img/favicon/favicon.ico`, `favicon-32x32.png` (32×32),
  `apple-touch-icon.png` (180×180), `favicon-512x512.png` (512×512) —
  todos presentes, dimensões corretas.
- Inspeção visual do `favicon-512x512.png` confirma: glifo "U/S" preservado
  por completo, sem corte nem distorção, com padding transparente
  lateral/vertical (letterbox) para tornar o canvas quadrado.
- **Avaliação do desvio documentado pelo Executor** (padding em vez de
  recorte quadrado literal): **aceito, não é achado.** Um recorte quadrado
  central literal cortaria as pontas do "U"/"S" (o Executor documentou isso
  corretamente). O padding transparente não introduz nenhuma arte nova —
  apenas estende a tela com transparência ao redor do glifo real — o que é
  mais fiel ao ativo original do que um crop que mutilaria o ícone. Isso
  está dentro do espírito de G-14 (não recriar/substituir por arte nova) e
  do critério de aceite ("derivados do arquivo real de ícone... visualmente
  consistente com o ícone da logo"). Decisão de detalhe tomada corretamente
  em silêncio pelo Executor, análoga ao tipo de decisão já permitido em
  L-03 do `TASK.md`.
- **Achado Simples (novo, identificado por este Validador):**
  `favicon.ico` foi documentado pelo Executor como "multi-tamanho 16/32/48px"
  — verificação binária do header ICO (contagem de imagens no cabeçalho)
  mostra que o arquivo contém **apenas 1 imagem embutida, 16×16**, não os 3
  tamanhos declarados. Isso não compromete o critério de aceite central
  (favicon carrega, é derivado do ícone real, é visualmente consistente) e
  não bloqueia nenhuma outra tarefa do lote — mas é uma divergência factual
  entre a nota de implementação e o artefato real, e reduz a qualidade do
  fallback legado (navegadores/contextos mais antigos que dependem de
  variantes 32/48px embutidas no próprio `.ico`, como atalho de área de
  trabalho, usarão a única imagem de 16px escalada, com possível perda de
  nitidez). **Classificação: Simples** — ajuste pontual e de baixo esforço
  (regenerar `favicon.ico` com os 3 tamanhos realmente embutidos). Tarefa
  criada em `Refatoração Lote-1` (ver Fechamento Estrutural abaixo); T1.4
  **permanece `Concluída`**.

### T1.5 — Preparar ativos de logo

**Veredito: Aprovado.**

- 3 arquivos presentes em `assets/img/logo/`: `logo-ljssoftware.png`,
  `logo-ljssoftware-transparente.png`, `logo-ljssoftware-icone.png`.
- Comparação pixel a pixel (Python PIL, `ImageChops.difference`) contra os
  originais em `.md/assets/`: **`diff bbox: None`** nos 3 arquivos —
  idênticos visualmente (mesma dimensão, mesmo conteúdo de pixel após
  conversão para RGBA), confirmando "nenhuma arte nova criada" (G-14).
  Diferença de tamanho em bytes é só reencoding/otimização de PNG
  (`optimize=True`, `compress_level=9`), não perda visual — consistente com
  a diretriz de compressão sem perda visível (Seção 1.2 do `TASK.md`).

### Testes de integração cross-platform

**N/A para este lote.** Nenhuma página HTML final foi montada ainda (Lote 2/3)
— não há contrato de API nem integração entre chapéis de implementação a
testar neste momento. Não é uma pendência, é escopo fora deste lote.

### Requisitos não funcionais

- Contraste WCAG AA: validado via script automatizado (ver T1.1) — PASS.
- Performance/otimização de asset (G-07): PNGs de logo comprimidos sem perda
  visual confirmada (T1.5); favicons em tamanhos adequados ao uso (não
  gigantes desnecessários); fontes em `.woff2` (formato comprimido moderno).
- `font-display: swap` (evita bloqueio de renderização de texto): confirmado
  em T1.2.

---

## Achados deste lote (resumo)

| # | Tarefa | Achado | Classificação | Ação |
|---|---|---|---|---|
| 1 | T1.4 | `favicon.ico` contém só 1 imagem embutida (16×16), não as 3 (16/32/48) documentadas pelo Executor | **Simples** | Tarefa criada em `Refatoração Lote-1`; T1.4 permanece `Concluída` |

Nenhum achado **Crítico** neste lote.

## Fechamento Estrutural do Lote 1

- Todas as 5 tarefas (T1.1-T1.5) estão `Concluída` no `TASK.md`.
- Dependências da Seção 4 do `TASK.md` relativas ao Lote 1 (T1.1→T1.3,
  T1.1→T1.4, T1.5→T1.4) estão coerentes com os artefatos reais: `base.css`
  de fato reutiliza tokens de `tokens.css` sem redefini-los; o favicon de
  fato deriva de `logo-ljssoftware-icone.png` (T1.5).
- Nenhuma tarefa `Bloqueada` sem resolução.
- Achado Simples de T1.4 (favicon.ico não realmente multi-tamanho) vira
  tarefa no lote `Refatoração Lote-1`:

  **Refatoração Lote-1**
  | ID | Tarefa | Origem | Prazo sugerido |
  |---|---|---|---|
  | RL1.1 | Regenerar `assets/img/favicon/favicon.ico` com as 3 resoluções (16/32/48px) realmente embutidas no arquivo `.ico` (hoje contém só 16×16) | QA-REPORT.md, T1.4 | Antes do deploy de produção (Lote 5); não bloqueia avanço do Lote 2/3 |

  Esta tarefa não exige redesenho de dependência/decomposição — não escala
  ao `coordenador`.

**Veredito geral do Lote 1: Aprovado com ressalvas** (1 achado Simples,
registrado em `Refatoração Lote-1`, sem impacto no critério de aceite
central de nenhuma tarefa). O lote está liberado para a auditoria de
segurança do chapéu DevSecOps.

---

## Lote 2 — Componentes Compartilhados

**Escopo validado:** T2.1, T2.2, T2.3, T2.4, todas com Status `Concluída` no
`TASK.md` no momento em que esta validação começou.

**Metodologia:** cada artefato foi inspecionado diretamente no disco contra o
critério de aceite do `TASK.md`/`UX-SPEC.md`/`GUARDRAILS.md`, sem usar a nota
de implementação do Executor como base de aprovação (usada só como ponto de
partida de onde olhar), incluindo o `git diff`/conteúdo real de
`assets/css/components.css`, `assets/js/nav.js`, `assets/js/analytics.js`,
`assets/css/header.smoke.html`, `assets/css/footer.smoke.html` e, como
evidência de integração cross-platform, os 4 arquivos HTML reais já criados
pelo Lote 3 em andamento (`index.html`, `apps.html`, `sobre.html`,
`404.html`). Sem automação de navegador disponível — inspeção por leitura
estática de CSS/JS e simulação lógica de ordem de tabulação (Tab)/estado de
`aria-*`, mesma metodologia já usada e aceita em T1.3 (Lote 1). Reexecutado
`node assets/css/tokens.contrast-check.js` e escrito um script ad-hoc (Node,
mesma fórmula de luminância) para os pares de contraste novos/reaproveitados
introduzidos por T2.1/T2.2 (não cobertos pelo script do Lote 1).

### T2.1 — Header/Nav

**Veredito: Aprovado.**

- Bloco de referência em `assets/css/components.css` (seção "Header / Nav
  (T2.1)") confere com o critério de aceite: `<header class="site-header">`
  com fundo `--color-header-bg` (branco), ícone `logo-ljssoftware-icone.png`
  (56px, `width="46" height="56"`, proporção 94:114 preservada) + texto "LJS
  Software" (`--font-heading`, `font-weight:700`, `font-size:25px`,
  `--color-header-text`) lado a lado; nav (Apps, Sobre) em
  `--color-header-nav-text`; botão "Contato" com fundo `--color-bg` e texto
  branco.
- Skip link (`<a class="skip-link" href="#main">`) é o primeiro elemento
  focável de `<body>` nas 4 páginas reais (`index.html`, `apps.html`,
  `sobre.html`, `404.html`) — confirmado por leitura direta de cada arquivo.
- `aria-current="page"` confirmado nas 4 páginas reais, exatamente um item
  por página: `apps.html` → "Apps"; `sobre.html` → "Sobre"; `index.html` e
  `404.html` → nenhum item (conforme especificado). Nenhuma página tem dois
  itens com `aria-current` simultaneamente.
- **Verificação byte-idêntica (G-02/RT-02) reexecutada por este Validador**
  via script Node comparando o bloco `<header>...</header>` das 4 páginas
  (normalizando apenas a presença de `aria-current="page"`, a única variação
  permitida): **idêntico** entre `index.html`, `apps.html`, `sobre.html` e
  `404.html`.
- Contraste WCAG AA reexecutado (script ad-hoc, mesma fórmula de
  `tokens.contrast-check.js`): `--color-header-text`/`--color-header-nav-text`
  sobre `--color-header-bg` = 15.39:1 / 9.18:1 (já confirmados em T1.1);
  texto branco do botão "Contato" sobre `--color-bg` = **15.39:1 PASS**
  (mesmo par de `--color-header-text`/`--color-header-bg`, invertido —
  confirmado nesta validação, não só aceito da nota do Executor).
- Landmarks semânticos presentes (`<header>`, `<nav aria-label="Navegação
  principal">`, `<main id="main">`) nas 4 páginas reais.
- Decisão de detalhe (CTA "Contato" → `index.html#contato`) aceita: consistente
  com UX-SPEC.md Seção 7 (não existe `contato.html`).

### T2.2 — Menu mobile

**Veredito: Reprovado — 1 achado Crítico.**

- **Achado Crítico #1 — armadilha de foco em elementos invisíveis fora da
  tela (off-canvas), em qualquer viewport < 768px, com o menu FECHADO
  (estado padrão ao carregar qualquer página):** o overlay
  (`.site-header__nav`, dentro de `@media (max-width: 767.98px)`) é
  posicionado com `position: fixed; inset: 0;` e afastado da tela só por
  `transform: translateX(100%)` quando **não** tem `data-open="true"`.
  Inspecionei `assets/css/components.css` (seção "Menu mobile (T2.2)") e
  `assets/js/nav.js` de ponta a ponta: **não existe nenhum `visibility:
  hidden`, `inert`, nem alternância de `tabindex`** aplicada ao overlay ou aos
  seus links quando fechado — só o `transform`. `transform` não remove um
  elemento da árvore de acessibilidade nem da ordem de tabulação; ele
  apenas o desloca visualmente. Simulação lógica da ordem de `Tab` num
  viewport mobile, menu fechado (estado inicial de qualquer uma das 4
  páginas reais): skip link → marca → hamburguer → **"Apps" (fora da tela,
  invisível, recortado por `overflow-x: hidden` de `base.css`, mas ainda
  focável)** → **"Sobre" (idem)** → **"Contato" (idem)** → só então o
  conteúdo de `<main>`. Um usuário de teclado em largura mobile precisa
  tabular por 3 elementos interativos invisíveis e inalcançáveis por scroll
  antes de chegar ao conteúdo da página — sem nenhuma indicação visual de
  onde o foco está. Isso viola diretamente o critério de aceite central de
  T2.2 ("acessível via teclado", "foco gerenciado corretamente") e G-05
  (`GUARDRAILS.md`: "WCAG AA é critério não negociável... nenhuma página pode
  ser considerada pronta com pendência crítica de acessibilidade... bloqueia
  fechamento da tarefa/lote correspondente até corrigir"). Afeta as 4
  páginas reais igualmente, pois todas reusam o mesmo `components.css`/
  `nav.js` — não é um problema isolado de uma página, é do componente
  compartilhado. **Classificação: Crítica** (compromete o critério de aceite
  central da tarefa; exige correção de código, ainda que pontual —
  provavelmente alternar `visibility`/`inert` ou `tabindex="-1"` nos links
  do overlay em sincronia com `aria-expanded`, dentro de `nav.js` +
  `components.css`). **T2.2 volta de `Concluída` para `Em andamento` no
  `TASK.md`, retornando ao `executor`.**
- **Achado Simples #2 — header não fixado (`position: relative`, não
  `sticky`/`fixed`) contradiz a premissa documentada no próprio comentário
  do CSS** ("o `<header>` permanece visível por cima do overlay"): como o
  `<header>` não é `position: sticky`/`fixed`, ele rola com o documento
  normalmente. Se o usuário já tiver rolado a página para baixo (plausível
  em `index.html`, que terá 6 seções após T3.2/T3.3) antes de tocar no
  hamburguer, o próprio `<header>` — e, portanto, o botão de fechar — já
  estará fora da área visível quando o overlay (`position: fixed; inset:0`)
  abrir sobre a viewport atual; o overlay cobriria a tela inteira sem
  nenhum controle visível de fechamento por toque/clique (o teclado ainda
  funciona via `Escape`, e tocar num link de navegação também fecha ao
  navegar). Não compromete o critério de aceite central (o menu ainda abre/
  fecha via clique **quando o header está visível**, e sempre via teclado) e
  não bloqueia nenhuma outra tarefa do lote. **Classificação: Simples.**
  Como T2.2 já está retornando ao `executor` pelo achado Crítico #1, **este
  achado é anexado ao mesmo retorno** (mesmo arquivo/componente, mesma
  tarefa reaberta) em vez de virar uma entrada separada em
  `Refatoração Lote-2` — decisão de eficiência de sequenciamento do
  Validador, não uma mudança de escopo.
- Aspectos que **passaram** na validação (preservados, não exigem retrabalho):
  toggle é `<button type="button">` real (`Enter`/`Space` nativos, sem
  handler dedicado — confirmado por leitura de `nav.js`, nenhum
  `preventDefault`/handler de teclado customizado para essas teclas);
  `aria-expanded`/`aria-label` alternam corretamente via `nav.js`; `Escape`
  fecha e devolve foco ao toggle (confirmado no código); foco move para o
  primeiro link ao abrir (confirmado); reset via `matchMedia('(min-width:
  768px)')` evita estado "preso" ao redimensionar (confirmado); breakpoint de
  colapso (767.98px) consistente com o resto do projeto; `data-open="true"`
  correto para o estado aberto; `prefers-reduced-motion: reduce` suprime a
  transição do slide e do ícone (confirmado, além da regra global já
  existente em `base.css`); nenhum par de contraste novo introduzido (todos
  reaproveitam tokens já validados — reconfirmado nesta validação por script
  ad-hoc: ícone hamburguer 15.39:1, links do overlay 13.91:1, CTA do overlay
  10.13:1, indicador de foco do overlay 10.13:1, todos PASS); `node --check
  assets/js/nav.js` sem erro de sintaxe. **Nenhum destes pontos exige
  retrabalho** — só o achado Crítico #1 (e o Simples #2, anexado) precisam
  de correção.

### T2.2 — Revalidação pós-correção

**Veredito: Aprovado.**

**Escopo desta revalidação:** apenas T2.2, conforme registrado no fechamento
estrutural parcial acima ("nenhuma outra tarefa do Lote 2 depende de T2.2").
Reli `assets/js/nav.js` e a seção "Menu mobile (T2.2)" de
`assets/css/components.css` por completo (não a nota de implementação do
Executor como base de aprovação), e confirmei o `git status`/ausência de
alteração em `assets/js/analytics.js` e nas seções T2.1/T2.3 de
`components.css` — nenhum arquivo fora do escopo de T2.2 foi tocado na
correção.

- **Achado Crítico #1 (armadilha de foco no overlay fechado): corrigido.**
  `nav.js` agora define `syncInertState()`, que aplica o atributo HTML
  `inert` em `.site-header__nav` sempre que `mobileMql.matches` (viewport
  < 768px, mesmo breakpoint de 767.98px já usado no CSS) **e** o menu está
  fechado (`!isOpen()`), e remove o atributo em qualquer outro caso.
  Verificação linha a linha dos 4 pontos de sincronização:
  - **Carregamento inicial:** `syncInertState()` é chamado na configuração
    de cada toggle, antes de qualquer listener — com `aria-expanded="false"`
    (estado inicial do HTML) e viewport mobile, `inert` é aplicado
    imediatamente, sem janela de foco tabulável indevido entre o carregamento
    da página e a primeira interação.
  - **Abrir (`openMenu`):** `nav.setAttribute('data-open', 'true')` e
    `toggle.setAttribute('aria-expanded', 'true')` ocorrem **antes** de
    `syncInertState()` ser chamado dentro da própria função — na hora em que
    `syncInertState()` roda, `isOpen()` já lê `true`, então cai no `else` e
    remove `inert`. Overlay volta a ser navegável via `Tab` corretamente
    quando `aria-expanded="true"`. Confirmado também que `firstFocusable.focus()`
    roda depois da remoção de `inert` (ordem das linhas em `openMenu`), então o
    foco programático não tenta pousar num elemento ainda inerte.
  - **Fechar (`closeMenu`):** mesma ordem invertida — `aria-expanded`/
    `data-open` já refletem "fechado" antes de `syncInertState()` rodar,
    então `inert` é reaplicado corretamente.
  - **Travessia de breakpoint (`desktopMql`/`handleBreakpointChange`):**
    simulação lógica das 2 direções — (a) mobile→desktop com menu aberto:
    `mql.matches && isOpen()` → `closeMenu(false)`, que por sua vez já
    resincroniza `inert` (remove, pois `mobileMql` não bate mais em
    desktop); (b) mobile→desktop com menu fechado, ou desktop→mobile em
    qualquer estado: cai no `else` → `syncInertState()` direto. As duas
    direções do `matchMedia('(min-width: 768px)')` disparam o evento
    `change` (tanto ao entrar quanto ao sair da condição), então nenhuma
    transição de breakpoint fica sem resincronizar. Simulação mental de Tab
    pós-correção, viewport mobile, menu fechado, qualquer uma das 4 páginas
    reais: skip link → marca → hamburguer → **conteúdo de `<main>`**
    (overlay inteiro fora da árvore de acessibilidade/tabulação via
    `inert`) — achado eliminado.
  - Decisão do Executor de não usar fallback `tabindex="-1"` para
    navegadores sem suporte a `inert` (documentada em comentário no topo de
    `nav.js`): **aceita**. Suporte a `inert` é amplo (Chrome/Edge 102+,
    Firefox 112+, Safari 15.5+, todos ≥2022), o projeto não tem build
    step/polyfill (G-01), e um fallback duplicaria a lógica de sincronização
    por link só para navegadores já residuais — não é um achado novo, é uma
    decisão de detalhe razoável dentro do critério de aceite.
- **Achado Simples #2 (header não sticky): corrigido.** `.site-header` agora
  é `position: sticky; top: 0;` (confirmado por leitura direta de
  `components.css`, linha da regra), com `z-index: 101` preservado —
  idêntico ao valor original, sem necessidade de reajuste relativo ao
  overlay (`z-index: 100`, também inalterado). Header permanece visível no
  topo da viewport em qualquer posição de scroll quando o overlay abre, nas
  4 páginas reais.
- **Nenhuma regressão de layout pela mudança para `sticky`:** varredura de
  todo `position: sticky`/`fixed` em `assets/css/` (`components.css`,
  `base.css`, `tokens.css`) não encontrou nenhum outro elemento fixo/sticky
  que colida com o header em produção — os únicos outros são o overlay
  mobile (`fixed`, `z-index: 100`, sempre abaixo do header) e o skip-link
  (`position: absolute`, `z-index: 1000`, deslocado para fora da tela exceto
  quando focado — intencionalmente acima de tudo nesse momento pontual, sem
  conflito). Nenhum outro `z-index` do arquivo (`hero__inner: 1`,
  `tokens.css` decorative shape: `0`) chega perto do header/overlay — sem
  sobreposição indevida em nenhuma das 4 páginas.
- **Nenhuma outra regressão em T2.2:** reconfirmado por leitura direta que
  toggle continua `<button type="button">` nativo (sem alteração);
  `aria-expanded`/`aria-label` continuam alternando corretamente em
  `openMenu`/`closeMenu` (mesma lógica já aprovada, só reordenada em relação
  a `syncInertState()` como descrito acima); `Escape` continua fechando e
  devolvendo foco ao toggle (bloco de `keydown` inalterado); gerenciamento de
  foco ao abrir preservado (`firstFocusable.focus()` inalterado); reset via
  `matchMedia('(min-width: 768px)')` no breakpoint preservado e agora também
  resincroniza `inert` (extensão aditiva, não regressão); `@media
  (prefers-reduced-motion: reduce)` ainda suprime a transição do overlay e do
  ícone (bloco de CSS inalterado); pares de contraste do ícone hamburguer
  sobre o header branco inalterados (nenhum token/cor tocado pela correção,
  15.39:1, já validado). `node --check assets/js/nav.js`: sem erro de
  sintaxe (reexecutado nesta revalidação).
- **Confirmação das 4 páginas reais:** `index.html`, `apps.html`,
  `sobre.html` e `404.html` carregam, cada uma, `assets/css/components.css`
  e `assets/js/nav.js defer` — confirmado por leitura direta de cada
  arquivo. Como a correção está inteiramente em `nav.js`/`components.css`
  (nenhum HTML de página tocado), ela se propaga automaticamente às 4
  páginas sem exigir nenhuma edição adicional nelas.

**T2.2 volta de `Em andamento` para `Concluída`, aprovada sem ressalvas.**
Nenhum achado remanescente, nem Crítico nem Simples, nesta revalidação.

### T2.3 — Footer/Contato

**Veredito: Aprovado — atenção especial dada à seção reconstruída.**

- **Conferência da seção `RECONSTRUÇÃO` de `components.css` contra a
  intenção original de T2.3, conforme recomendado explicitamente pelo
  `TASK.md`:** comparei, ponto a ponto, o CSS reconstruído com (a) a nota de
  Status de T2.3 no `TASK.md` (que descreve o comportamento
  original pretendido: `.site-footer`/`.site-footer__brand`/
  `.footer-contact`/`.footer-link` com variantes `__icon`/`__label`/
  `__external-text`, reaproveitando `--color-bg`,
  `--color-text-inverse[-secondary]`, `--color-accent`; hover muda cor para
  `--color-accent` + sublinhado; indicação de "nova aba" como texto visível,
  não `sr-only`; responsivo via `.stack`/`.stack--row-tablet-up`) e (b)
  `assets/css/footer.smoke.html` (não afetado pelo incidente, preservou o
  HTML de referência original). **Resultado: a reconstrução bate com a
  intenção original em todos os pontos verificados** — nenhuma classe
  ausente, nenhum token redefinido/novo, nenhum comportamento
  hover/foco/responsivo divergente do descrito. Único detalhe a mais
  (não uma divergência, um reforço): `.footer-link:focus-visible` na
  reconstrução aplica explicitamente `color: var(--color-accent)` +
  sublinhado (a nota original dizia que nenhuma sobrescrita de foco seria
  necessária, referindo-se ao *outline* global já herdado de `base.css`) —
  isso só telefonesa/pareia a cor do texto ao estado de hover no foco
  também, sem contradizer nem quebrar nada descrito; **não é um achado**,
  é uma decisão de detalhe adicional dentro do espírito da tarefa.
- Nenhum link é só ícone: `mailto:` tem ícone decorativo (`aria-hidden`) +
  texto do e-mail visível; LinkedIn tem ícone decorativo + texto "LinkedIn" +
  ícone "nova aba" decorativo + texto visível "(abre em nova aba)" (não
  `sr-only`, reforça UX-SPEC.md Seção 5).
- `target="_blank" rel="noopener"` presente no link de LinkedIn — confirmado
  em `footer.smoke.html` e nas 3 páginas reais que já integram o rodapé
  (`apps.html`, `sobre.html`, `404.html`).
- Foco visível com `--color-accent`: confirmado (regra global de
  `base.css` + reforço explícito em `.footer-link:focus-visible`).
- **Verificação byte-idêntica (G-02/RT-02) reexecutada por este Validador**
  via script Node comparando o bloco `<footer>...</footer>` de `apps.html`,
  `sobre.html` e `404.html`: **idêntico** nas 3. `index.html` ainda não
  integra o rodapé (T3.3 pendente, fora do escopo desta tarefa/deste lote —
  não é uma pendência de T2.3).
- Contraste WCAG AA: nenhum par novo (reaproveita
  `--color-text-inverse-secondary`/`--color-accent` sobre `--color-bg`, já
  PASS em T1.1).

### T2.4 — Evento de analytics

**Veredito: Aprovado.**

- `grep` por `preventDefault`/`stopPropagation` em todo `assets/js/`:
  nenhuma ocorrência fora de comentários — confirmado que o clique nunca
  bloqueia a navegação nativa do link.
- Convenção `data-analytics-event="contato-email"`/`"contato-linkedin"`
  presente nos 2 links de contato reais em `apps.html`, `sobre.html` e
  `404.html` (rodapé integrado); mapeamento em `analytics.js`
  (`EVENT_NAMES`) dispara `contato_email_click`/`contato_linkedin_click`
  respectivamente — nomes identificáveis conforme critério de aceite.
- Handler é *fire-and-forget*: `trackEvent` embrulhado em `try/catch`,
  checagem de existência de `window.__cfBeacon`/`window.zaraz` antes de
  chamar — não lança erro nem mesmo com o beacon real ainda ausente
  (T5.4 pendente), consistente com o smoke-test manual descrito em
  `footer.smoke.html`.
- `node --check assets/js/analytics.js`: sem erro de sintaxe.
- Sem cookies/`localStorage`/`sessionStorage` de tracking (G-03) —
  confirmado por leitura direta do arquivo.
- Os 2 botões da seção de contato da Home (T3.3) ainda não existem
  (dependem de T3.3, que ainda não rodou) — não é uma pendência de T2.4, a
  convenção (`data-analytics-event`) já está pronta para ser aplicada a eles
  sem alterar `analytics.js`, conforme documentado no próprio arquivo.

### Testes de integração cross-platform

Diferente do Lote 1 (onde isso era N/A), o Lote 3 (em andamento em paralelo)
já produziu `index.html`, `apps.html`, `sobre.html`, `404.html` — usados aqui
como evidência real de integração dos componentes de T2.1-T2.4:

- Header/Nav (T2.1) e Footer/Contato (T2.3) confirmados byte-idênticos nas
  páginas que já os integram (ver acima) — RT-02 respeitado ponta a ponta.
- Menu mobile (T2.2) integrado nas 4 páginas via o mesmo
  `<button class="site-header__toggle">`/`id="site-header-nav"`/
  `<script src="assets/js/nav.js" defer>` — mas **é justamente essa
  integração real que expôs o achado Crítico #1** (a armadilha de foco
  existe igualmente nas 4 páginas, não é um artefato do smoke-test isolado).
- Analytics (T2.4) integrado consistentemente nas 3 páginas com rodapé —
  mesmo atributo `data-analytics-event`, mesmo script incluído com `defer`
  depois de `nav.js`.
- `index.html` ainda não integra o rodapé nem o script de analytics —
  consistente com T3.3 ainda pendente, não é uma divergência de integração,
  é escopo do Lote 3 ainda não executado.

### Requisitos não funcionais

- Contraste WCAG AA: todos os pares novos/reaproveitados por T2.1/T2.2/T2.3
  reexecutados via script ad-hoc — 5/5 PASS (ver detalhe em cada tarefa
  acima).
- Acessibilidade (RNF ligado a G-05): achado Crítico #1 de T2.2 é
  precisamente uma falha de requisito não funcional de acessibilidade —
  documentado acima, não repetido aqui.
- `prefers-reduced-motion: reduce` respeitado tanto pela regra global de
  `base.css` quanto pelas regras específicas de T2.2 (slide do overlay e
  transformação do ícone).
- Nenhum uso de cookies/tracking além do padrão já aprovado (G-03),
  confirmado em T2.4.

---

## Achados deste lote (resumo)

| # | Tarefa | Achado | Classificação | Ação | Status pós-revalidação |
|---|---|---|---|---|---|
| 1 | T2.2 | Overlay do menu mobile permanece focável (Tab) mesmo fechado/fora da tela — sem `visibility`/`inert`/`tabindex` alternado, só `transform`; usuário de teclado tabula por 3 elementos invisíveis antes do conteúdo, em qualquer página, em viewport < 768px | **Crítica** | T2.2 voltou para `Em andamento` no `TASK.md`; retornou ao `executor` | **Corrigido e revalidado** — ver "T2.2 — Revalidação pós-correção" acima. `nav.js` aplica `inert` no overlay quando fechado/mobile, sincronizado em `openMenu`/`closeMenu`/carga inicial/breakpoint |
| 2 | T2.2 | Header não é `sticky`/`fixed`; se a página já estiver rolada ao abrir o menu, o header (e o botão de fechar) fica fora da viewport, contradizendo o comentário do próprio CSS | **Simples** | Anexado ao mesmo retorno de T2.2 ao `executor` (achado #1) — não virou item separado em `Refatoração Lote-2` | **Corrigido e revalidado** — `.site-header` agora `position: sticky; top: 0;`, `z-index: 101` preservado |

Nenhum achado em T2.1, T2.3 ou T2.4. Nenhum achado remanescente em T2.2 após
a revalidação.

## Fechamento Estrutural do Lote 2

- T2.1, T2.2, T2.3, T2.4: todas `Concluída` no `TASK.md`, todas aprovadas
  pelo chapéu QA (T2.2 aprovada nesta revalidação pós-correção, sem
  ressalvas remanescentes).
- Dependências da Seção 4 do `TASK.md` relativas ao Lote 2 (T2.1→T2.2,
  T2.3→T2.4): estruturalmente coerentes — T2.2 de fato depende do markup de
  T2.1 (confirmado, T2.1 não foi tocado pela correção); T2.4 de fato depende
  do markup/atributos de T2.3 (confirmado, T2.3 não foi tocado). Nenhuma
  dependência órfã.
- Nenhuma tarefa `Bloqueada` sem resolução.
- Nenhum achado simples/débito pendente deste lote exige nova entrada em
  `Refatoração Lote-2` — os 2 achados originais de T2.2 foram corrigidos
  diretamente na própria tarefa (não geraram débito residual).
- Nada nesta checagem exige redesenho de dependência/decomposição — não
  escala ao `coordenador`.

**Veredito geral do Lote 2: Aprovado.** T2.1, T2.2 (após correção e
revalidação), T2.3 e T2.4 todas aprovadas sem ressalvas remanescentes.
Lote estruturalmente fechado — liberado para a auditoria de segurança do
chapéu DevSecOps (que ainda não rodou sobre este lote) e, em paralelo, para
o chapéu DevOps considerar este build no fluxo de dupla aprovação rumo ao
deploy, condicionado à aprovação subsequente do `SECURITY-REVIEW.md`.

---

## Lote 3 — Páginas

**Escopo validado:** T3.1 a T3.6, todas com Status `Concluída` no `TASK.md`
no momento desta validação.

**Metodologia:** cada um dos 4 arquivos HTML reais (`index.html`,
`apps.html`, `sobre.html`, `404.html`) e o CSS/JS que consomem
(`assets/css/tokens.css`, `assets/css/base.css`,
`assets/css/components.css`, `assets/js/nav.js`, `assets/js/analytics.js`)
foi lido integralmente e inspecionado contra o critério de aceite de cada
tarefa no `TASK.md`, contra `UX-SPEC.md` (Seções 3.1, 5, 6, 7) e contra
`GUARDRAILS.md` (G-01, G-02, G-03, G-05, G-11, G-12, G-14) — a nota de
implementação do Executor foi usada só como ponto de partida de onde olhar,
nunca como base de aprovação. As verificações cross-page (RT-02,
`aria-current`, âncora `#contato`, scripts, links, title/description,
consistência T3.2/T3.4, fallback `.glass-card`) foram feitas via scripts
Python ad-hoc executados nesta sessão (comparação literal de blocos,
varredura de atributos fora de comentários HTML, resolução de todo
`href`/`src` relativo contra o sistema de arquivos), não só por inspeção
visual.

### T3.1 — `index.html` — Header + Hero

**Veredito: Aprovado.**

- Header (T2.1/T2.2) integrado no topo, variante correta (nenhum item de
  nav com `aria-current`, confirmado via varredura fora de comentários).
- `.hero` com mesh gradient próprio (3 `radial-gradient` com
  `color-mix(...--color-bg-gradient-1/2...)`) sobre `--color-bg` — RF-01
  satisfeito.
- 2 `.decorative-shape` com `aria-hidden="true"` presentes (`hero__shape--1`
  sempre visível, `hero__shape--2` oculta abaixo de 768px por espaço,
  conforme comentário do próprio CSS) — ambas de fato marcadas
  `aria-hidden`, confirmado por leitura do HTML.
- 2 CTAs (`hero__cta--primary`/`--secondary`), ambos `<a>` nativos
  (navegáveis por `Tab`/`Enter` sem necessidade de handler JS) — "Ver apps"
  → `apps.html` (arquivo existe), "Fale conosco" → `#contato` (âncora
  existe na mesma página, ver verificação cross-page abaixo).
- `<title>`/`meta description` próprios e distintos das outras 3 páginas
  (confirmado por comparação textual) — placeholder documentado para
  refinamento em T4.1, conforme o próprio critério de aceite permite.
- Contraste do pior caso do mesh gradient (documentado em comentário no
  CSS, ≥5.98:1) é plausível pela composição (`color-mix` a 45-55% opacidade
  sobre `--color-bg`, nunca a cor sólida do token) — cálculo não
  re-executado por script nesta validação (seria necessário reimplementar a
  fórmula de composição de opacidade), fica para a reverificação formal já
  prevista em T4.2; não é um bloqueio para T3.1, cujo critério de aceite
  não exige o cálculo formal, só a existência do mesh e da forma decorativa.

### T3.2 — `index.html` — Seção "Nossos apps" + Seção "Sobre"

**Veredito: Aprovado.**

- 2 `<section>` (`.home-apps`, `.home-about`) adicionadas logo após o hero
  e antes da seção de contato (T3.3) — ordem confirmada por leitura direta
  do HTML.
- `.grid.grid--3col` reaproveitado (sem grid novo) — 1/2/3 colunas nos
  breakpoints 360/768/1024, mesma régua de `base.css` (T1.3), confirmado.
- Os 3 cards `.app-card.glass-card` da seção "Nossos apps" usam as mesmas
  classes/conteúdo (nome, descrição, badge "Em breve") dos 3 cards de
  `apps.html` (T3.4) — comparação literal confirma os mesmos 3 apps
  ("Gestor Fácil"/"Agenda Smart"/"Financeiro Simples"), sem duplicação de
  CSS (`.app-card`/`.badge` declarados uma única vez, na seção "Vitrine de
  Apps / App Card (T3.4)" de `components.css`; a seção "Home — Seções
  Apps/Sobre (T3.2)" só acrescenta heading/link específicos).
- Fallback `@supports not (backdrop-filter: blur(1px))` de `.glass-card`
  (T1.1, `tokens.css`) se aplica automaticamente aos 4 usos novos em
  `.home-apps`/`.home-about` (mesma classe, nenhum CSS por página
  necessário) — confirmado pela seletividade global da regra `@supports`.
- Link "Saiba mais" (`.home-about__link`) → `sobre.html`, arquivo existe,
  navegável por teclado (`:focus-visible` herdado da regra global).

### T3.3 — `index.html` — Seção de contato + integração do rodapé

**Veredito: Aprovado.**

- Home completa com as 6 seções esperadas (header, hero, apps, sobre,
  contato, footer), confirmado por leitura sequencial do arquivo completo.
- `<section id="contato" class="home-contact">` presente — âncora de fato
  existe na mesma página (destino real do CTA do header e do CTA
  secundário do hero, ver verificação cross-page #3 abaixo).
- 2 botões (`.hero__cta--primary`/`--secondary`, reaproveitados do Hero) são
  `<a>` nativos, navegáveis por teclado, ambos com
  `data-analytics-event="contato-email"`/`"contato-linkedin"` — confirmado
  que esses atributos batem exatamente com as chaves de `EVENT_NAMES` em
  `assets/js/analytics.js` (`contato-email` → `contato_email_click`,
  `contato-linkedin` → `contato_linkedin_click`), e que `analytics.js` é
  carregado nesta página (ver verificação cross-page #4).
- Footer confirmado byte-idêntico ao das outras 3 páginas (RT-02) — ver
  verificação cross-page #1 abaixo, com resultado detalhado.
- RF-01/02/03/04 refletidos: hero (RF-01), apps (RF-02), sobre (RF-03),
  contato sem envio ao servidor (RF-04, G-04 não violado — ambos os botões
  são `mailto:`/link externo, nenhum `<form>` presente na página).

### T3.4 — `apps.html` — Vitrine

**Veredito: Aprovado.**

- `.grid.grid--3col` com 3 `<article class="app-card glass-card">`, mesma
  régua responsiva de breakpoints do restante do site.
- Cada card segue o modelo de conteúdo do `SDD.md` Seção 5 (nome +
  descrição curta + status "em-breve" representado pelo badge) —
  confirmado por comparação direta com o trecho do `SDD.md`.
- Nenhum link quebrado: `href`/`src` de toda a página resolvidos contra o
  sistema de arquivos via script — únicas ocorrências de "URL_REAL" estão
  dentro de comentários HTML (exemplo de como trocar o badge por link em
  T6.2), não em atributos reais.
- Visual "glass" consistente com T3.2 — mesmas classes `.app-card`/
  `.glass-card`/`.badge`, confirmado (ver T3.2 acima).

### T3.5 — `sobre.html` — Sobre

**Veredito: Aprovado.**

- Página renderiza com header (variante `aria-current="page"` em "Sobre",
  confirmado — 1 ocorrência real, na posição correta) e footer integrados
  (byte-idêntico, ver verificação cross-page #1).
- Heading único: exatamente 1 `<h1>` na página (confirmado por varredura
  fora de comentários) — "Sobre a LJS Software", dentro de `.glass-card`.
- Texto de piso mínimo aceito (Lacuna L-03, já documentada e aceita no
  próprio `TASK.md`/`UX-SPEC.md`) — não é um achado, é lacuna já
  formalmente registrada e fora do escopo desta tarefa resolver.

### T3.6 — `404.html` — página de erro

**Veredito: Aprovado.**

- Arquivo `404.html` presente na raiz do repositório — convenção nativa da
  Cloudflare Pages para rota inexistente, nenhuma configuração adicional
  necessária (conforme a própria nota de implementação, verificada por
  inspeção do restante do projeto: não há `_redirects`/config divergente
  que a contradiga neste lote — `_headers`/`_redirects` ficam para o Lote
  4/5, fora de escopo).
- Header (variante sem `aria-current`, mesmo caso de `index.html`,
  confirmado) e footer (byte-idêntico, ver verificação cross-page #1)
  integrados.
- Link de retorno (`.error-page__link`, `href="index.html"`) funcional —
  arquivo existe, foco visível herdado de `:focus-visible` global (nenhuma
  sobrescrita de `outline: none` na página).
- 1 único `<h1>` ("Página não encontrada"); o texto "404" grande é
  `<p aria-hidden="true">`, não um heading — decisão correta para não criar
  um heading duplicado nem semanticamente vazio.

### Verificações cross-page

1. **RT-02 (byte-identidade de header/footer) — PASS.** Script Python
   comparando os blocos `<header class="site-header">...</header>` e
   `<footer class="site-footer">...</footer>` das 4 páginas, normalizando
   apenas a presença/ausência de `aria-current="page"` no header: os 4
   blocos de `<footer>` são **byte-idênticos** entre `index.html`,
   `apps.html`, `sobre.html`, `404.html`; os 4 blocos de `<header>` são
   **idênticos após normalizar somente o atributo `aria-current`**
   (nenhuma outra diferença de texto/atributo/whitespace encontrada) — G-02
   satisfeito nas 4 páginas.
2. **`aria-current="page"` por página — PASS.** Varredura excluindo
   comentários HTML (a primeira leitura ingênua tinha dado falso-positivo
   por menções a `aria-current`/`<h1>` dentro de comentários explicativos;
   refeita a varredura só sobre código real): `index.html` → 0 ocorrências;
   `apps.html` → 1, em "Apps"; `sobre.html` → 1, em "Sobre"; `404.html` → 0
   ocorrências. Exatamente conforme especificado.
3. **Âncora `#contato` — PASS.** `<section id="contato" class="home-contact">`
   existe em `index.html` (T3.3); o CTA "Contato" do header
   (`index.html#contato`, presente nas 4 páginas) e o CTA secundário do
   hero (`#contato`, T3.1) resolvem para essa seção real na mesma página.
4. **Scripts incluídos corretamente — PASS.** `assets/js/nav.js` presente
   com `defer` nas 4 páginas. `assets/js/analytics.js` presente com
   `defer` nas 4 páginas — inclusive em `index.html`, que antes de T3.3 não
   o carregava; confirmado que hoje carrega, depois de `nav.js`, ao final
   do `<body>`.
5. **Nenhum link quebrado — PASS.** Script Python resolveu todo `href`/`src`
   relativo (excluindo `http(s)`, `mailto:`, âncoras `#...`) das 4 páginas
   contra o sistema de arquivos: todos existem. As únicas ocorrências de um
   destino inexistente (`URL_REAL`) estão dentro de comentários HTML (T3.4,
   exemplo de troca futura do badge), não em atributos reais — confirmado
   por inspeção direta do trecho.
6. **`<title>`/`meta description` únicos — PASS.** Os 4 pares (title,
   description) foram comparados textualmente entre si: nenhuma duplicação,
   cada página com conteúdo próprio e descritivo (placeholder aceito,
   refinamento final é T4.1).
7. **Consistência T3.2 (prévia da Home) × T3.4 (vitrine) — PASS.** Mesmos 3
   apps, mesmo texto de descrição, mesmas classes CSS (`.app-card`,
   `.glass-card`, `.badge`) reaproveitadas sem redeclaração — `.app-card`/
   `.badge` só existem uma vez em `components.css` (seção "Vitrine de Apps
   / App Card (T3.4)"); a seção de T3.2 não redeclara nada, só adiciona
   heading/link específicos da prévia.
8. **`.glass-card` com fallback `@supports` — PASS.** O seletor
   `@supports not (backdrop-filter: blur(1px)) { .glass-card { ... } }` em
   `tokens.css` (T1.1) é global por classe, não por página — os usos novos
   em T3.2 (`.home-about__card`), T3.4 (3 `.app-card`) e T3.5 (card de
   texto) herdam o fallback automaticamente, sem necessidade de CSS
   adicional por página, confirmado pela ausência de qualquer `@supports`
   redundante nas seções de `components.css` adicionadas no Lote 3.

### Requisitos não funcionais

- `prefers-reduced-motion: reduce` respeitado: regra global de `base.css`
  (neutraliza toda `transition`/`animation`/`scroll-behavior`) cobre o
  hero (sem transição própria, estático) e o menu mobile herdado de T2.2
  (`@media (prefers-reduced-motion: reduce)` explícito em
  `components.css`, neutraliza a transição do overlay e do ícone
  hamburguer/X) — nenhuma transição nova introduzida no Lote 3 escapa
  dessa cobertura.
- Contraste WCAG AA: todo o conteúdo novo sobre `--color-bg` sólido
  (`.home-apps`, `.home-about`, `.home-contact`, texto de `sobre.html`,
  `404.html`) reaproveita exclusivamente pares já verificados e aprovados
  em T1.1/T2.1 (`--color-text-inverse`/`--color-text-inverse-secondary`/
  `--color-accent` sobre `--color-bg`) — nenhuma combinação de cor nova
  introduzida, confirmado por leitura dos comentários de verificação em
  `components.css` e por não haver nenhuma declaração de cor solta fora de
  variável nas novas seções (as únicas exceções são `#FFFFFF` no botão
  "Contato" do header e `--color-bg`/`--color-accent` no CTA do overlay
  mobile, ambas já herdadas/verificadas em T2.1/T2.2, não introduzidas
  neste lote). O pior caso específico do mesh gradient do Hero (T3.1) tem
  cálculo documentado em comentário (≥5.98:1) mas não foi re-executado por
  script nesta validação — sinalizado acima em T3.1, não bloqueia por não
  ser exigência do critério de aceite desta tarefa; fica para a
  reverificação formal já prevista em T4.2.
- Nenhum `outline: none` sem substituto: varredura em `assets/css/*.css`
  não encontra nenhuma ocorrência de `outline: none`/`outline:none` fora de
  comentário — todas as regras de foco (`:focus-visible` global,
  sobrescritas de T2.1 para o header branco, de T2.2 para o overlay) usam
  cores de contraste equivalente, nunca removem o indicador.
- `alt`/`aria-hidden` corretos: os 2 `.decorative-shape` do Hero têm
  `aria-hidden="true"`; o ícone do header/marca tem `alt="LJS Software"`
  (função de identidade, correto não ser vazio); o ícone do rodapé tem
  `alt=""` (decorativo, correto ser vazio); o "404" grande em `404.html` é
  `aria-hidden="true"`. Nenhum ícone puramente decorativo ficou sem
  `aria-hidden`, nenhum ícone funcional ficou sem `alt` significativo.
- Estrutura de heading única por página: confirmado por varredura fora de
  comentários — exatamente 1 `<h1>` em cada uma das 4 páginas
  (`index.html`: "Transformamos ideias em software que funciona", no hero;
  `apps.html`: "Nossos apps"; `sobre.html`: "Sobre a LJS Software";
  `404.html`: "Página não encontrada"). As seções subsequentes de
  `index.html` (apps/sobre/contato) usam `<h2>` corretamente, sem competir
  com o `<h1>` do hero.

### Achados deste lote

Nenhum achado crítico nem simples identificado em T3.1-T3.6 nesta
validação. Todas as 8 verificações cross-page e os 5 requisitos não
funcionais listados acima passaram sem ressalva.

## Fechamento Estrutural do Lote 3

- T3.1 a T3.6: todas `Concluída` no `TASK.md`, todas aprovadas pelo chapéu
  QA nesta validação, sem achado pendente.
- Dependências da Seção 4 do `TASK.md` relativas ao Lote 3 (T2.1/T2.2→T3.1,
  T3.1→T3.2→T3.3, T2.3→T3.3, T2.4→T3.3, T2.1/T2.2/T2.3→T3.4/T3.5/T3.6):
  estruturalmente coerentes — confirmado que T3.2 de fato depende do
  markup de T3.1 (seções sequenciais no mesmo arquivo), que T3.3 de fato
  depende de T3.2 (mesmo arquivo) e do footer/analytics de T2.3/T2.4
  (integrados corretamente), e que T3.4/T3.5/T3.6 de fato reaproveitam o
  header/footer de T2.1/T2.3 sem divergência. Nenhuma dependência órfã.
- Nenhuma tarefa `Bloqueada` sem resolução.
- Nenhum achado simples/débito deste lote — não há nova entrada a criar em
  `Refatoração Lote-3` (lote não precisa existir neste momento, nenhum
  achado para justificá-lo).
- Nada nesta checagem exige redesenho de dependência/decomposição — não
  escala ao `coordenador`.

**Veredito geral do Lote 3: Aprovado.** T3.1, T3.2, T3.3, T3.4, T3.5 e T3.6
todas aprovadas sem ressalvas. Lote estruturalmente fechado — liberado para
a auditoria de segurança do chapéu DevSecOps (que ainda não rodou sobre
este lote) e, em paralelo, para o chapéu DevOps considerar este build no
fluxo de dupla aprovação rumo ao deploy, condicionado à aprovação
subsequente do `SECURITY-REVIEW.md`.
