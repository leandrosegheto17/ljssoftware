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

---

## Lote 4 — SEO, Acessibilidade e Segurança Transversal

**Escopo validado:** T4.1, T4.2, T4.3, T4.4, todas com Status `Concluída` no
`TASK.md` no momento desta validação.

**Metodologia:** os 4 arquivos HTML reais (`index.html`, `apps.html`,
`sobre.html`, `404.html`), `assets/css/components.css`, `robots.txt`,
`sitemap.xml` e `_headers` foram lidos integralmente e inspecionados contra
o critério de aceite de cada tarefa no `TASK.md`, contra `UX-SPEC.md`
(Seções 3.1, 5, 6, 7) e `GUARDRAILS.md` (G-01 a G-05, G-09, G-11, G-12,
G-14) — a nota de implementação do Executor foi usada só como ponto de
partida de onde olhar, nunca como base de aprovação. `node
assets/css/a11y-contrast-check.js` e `node
assets/css/tokens.contrast-check.js` foram **reexecutados** nesta sessão
(não reaproveitado o resultado relatado pelo Executor), e os valores
hardcoded do script de contraste (cores dos tokens, alpha dos 3 blobs do
mesh gradient, alpha de `--glass-bg`) foram conferidos linha a linha contra
`assets/css/tokens.css`/`assets/css/components.css` para confirmar que o
script mede a implementação real, não valores desatualizados. Verificações
adicionais ad-hoc: varredura de `tabindex` positivo e `outline: none` em
todo o projeto; resolução de todo `href`/`src` referenciado pelas 4 páginas
e pelos novos arquivos de infraestrutura contra o sistema de arquivos;
contagem de headings fora de comentário HTML.

### T4.1 — Meta tags SEO finais + favicon + Open Graph

**Veredito: Aprovado.**

- `<title>`/`meta description` únicos e distintos nas 4 páginas —
  confirmado por leitura direta e comparação textual: Home (proposta de
  valor + CTA), Apps (portfólio/vitrine), Sobre (proposta e valores), 404
  (erro), nenhuma duplicação entre si.
- `<link rel="icon">` presente nas 4 páginas com os 3 formatos já gerados em
  T1.4 (`favicon.ico` `sizes="any"`, `favicon-32x32.png`,
  `favicon-512x512.png`) + `<link rel="apple-touch-icon">` — os 4 arquivos
  referenciados existem de fato em `assets/img/favicon/` (confirmado por
  listagem de diretório).
- `og:image` aponta para `https://ljssoftware.com.br/assets/img/logo/logo-ljssoftware-transparente.png`
  nas 4 páginas — arquivo real existe em `assets/img/logo/` (T1.5, G-14,
  nenhuma arte nova); URL absoluta com o domínio definitivo do projeto,
  coerente com `og:url` (`/`, `/apps.html`, `/sobre.html`, `/404.html`,
  cada um resolvendo para a própria página).
- `og:type`/`og:title`/`og:description` presentes e espelham o
  title/description finais de cada página.
- Nenhum bloco de header/nav/footer foi tocado por esta tarefa — confirmado
  por comparação com a versão já validada no Lote 3 (RT-02/G-02
  preservados).

### T4.2 — Auditoria e ajuste de acessibilidade WCAG AA

**Veredito: Aprovado.**

- **Reexecução independente de `node assets/css/a11y-contrast-check.js`:**
  22/22 combinações reportadas PASS, incluindo as 5 sólidas da tabela de
  tokens (revalidadas), as combinações dos Lotes 2/3 e — o ponto central
  desta tarefa — o pior caso do mesh gradient e o pior caso composto
  `.glass-card` sobre o blob mais intenso.
- **Verificação de que o script mede a implementação real, não valores
  desatualizados:** os hex dos tokens (`--color-bg-gradient-1: #146B8C`,
  `--color-bg-gradient-2: #1FB6A6`, `--glass-bg: rgba(255,255,255,0.08)`,
  `--glass-border: rgba(255,255,255,0.18)`) e as 3 opacidades de blob usadas
  pelo script (55%, 28%, 40%) foram conferidas linha a linha contra
  `assets/css/tokens.css` e a seção "Hero (T3.1)" de
  `assets/css/components.css` — **idênticas**. A correção de opacidade
  citada na nota do Executor (blob `--color-bg-gradient-2` de 45% para 28%)
  está de fato aplicada no CSS real (`color-mix(in srgb,
  var(--color-bg-gradient-2) 28%, transparent)`, linha da regra
  `background-image` do `.hero`) — não é só uma alegação na nota de
  implementação.
- **Resultado da correção, confirmado por este Validador (não apenas
  aceito da nota do Executor):** `--color-text-inverse-secondary` sobre o
  blob 2 isolado passou de reprovado (não recalculado por este Validador
  no valor antigo, mas a lógica de composição confere) para **5.99:1
  PASS**; o pior caso composto (`.glass-card` sobre o blob mais intenso)
  para `--color-text-inverse-secondary` mede **4.82:1 PASS** — acima do
  mínimo AA (4.5:1), mas com margem pequena (0.32). Não é um achado (passa
  no critério objetivo), mas fica registrado como ponto de atenção para
  qualquer ajuste futuro de opacidade do mesh gradient ou do `.glass-card`
  não reduzir essa margem sem revalidar o script.
- **Achado do Executor sobre `--glass-border` (~1.6:1, abaixo do 3:1 de
  WCAG 1.4.11) avaliado por este Validador: aceito como não-crítico.** O
  raciocínio do Executor está correto — `.glass-card` é um container de
  conteúdo estático, não um controle interativo, e o critério de aceite
  desta tarefa ("nenhuma pendência crítica de `accessibility-review`") não
  torna esse item obrigatório; corrigir exigiria mais que dobrar a
  opacidade da borda, o que seria uma mudança visual perceptível em todo o
  site (redesenho, vedado por G-12 nesta tarefa). **Concordo com a
  classificação de não-crítico e com a decisão de documentar em vez de
  corrigir.**
- **Correção de heading `apps.html` (h3→h2): verificada e correta.**
  Contagem de headings fora de comentário confirma: `apps.html` tem
  `<h1>` "Nossos apps" seguido diretamente de 3 `<h2 class="app-card__name">`
  (sem pulo de nível); `index.html` mantém `<h3 class="app-card__name">`
  nos mesmos cards, corretamente, pois ali existe um `<h2
  class="home-apps__title">` de agrupamento antes deles — nenhuma página
  ficou com pulo de nível de heading. `sobre.html` e `404.html` não têm
  grid de cards, não são afetadas por este achado — confirmado que nenhuma
  delas tem heading algum além do `<h1>` único.
- **Landmarks semânticos:** `<header>`/`<footer>` implícitos
  (banner/contentinfo), exatamente 1 `<main id="main">` por página, 2
  `<nav>` por página com `aria-label` distintos ("Navegação principal" e
  "Contato") — confirmado nas 4 páginas reais.
- **Ordem de foco:** nenhum `tabindex` positivo em nenhum arquivo do
  projeto (varredura própria deste Validador, `grep` por
  `tabindex="[1-9]`: zero ocorrências); overlay do menu mobile usa `inert`
  quando fechado abaixo de 768px (T2.2, já validado no Lote 2, não regrediu
  nesta tarefa — `nav.js` não foi tocado por T4.2).
- **`prefers-reduced-motion: reduce`:** regra global em `base.css` mais a
  regra específica do menu mobile em `components.css`, nenhuma das duas
  tocada por T4.2 — sem regressão.
- **`alt`/`aria-hidden`:** confirmado por leitura das 4 páginas — 2
  `.decorative-shape` do Hero com `aria-hidden="true"`; ícone do
  header/marca com `alt="LJS Software"` (funcional); ícone do rodapé com
  `alt=""` (decorativo, com texto ao lado); `404` numeral grande de
  `404.html` com `aria-hidden="true"`. Nenhum ícone decorativo sem
  `aria-hidden`, nenhum ícone funcional sem `alt` significativo.
- **`outline: none`:** varredura própria deste Validador em
  `assets/css/*.css` (`grep` por `outline:\s*none`): a única ocorrência é
  dentro de um comentário explicativo em `base.css` ("nunca `outline:
  none` sem substituto"), não uma regra real — confirmado que nenhuma
  regra de foco remove o indicador sem substituto.
- **Nenhum arquivo fora do escopo declarado foi tocado:** confirmado que
  `tokens.css`, `base.css`, `nav.js`, `analytics.js`, `index.html`,
  `sobre.html`, `404.html` não foram alterados por esta tarefa (só
  `a11y-contrast-check.js` novo, opacidade do blob 2 e comentários em
  `components.css`, e os 3 headings de `apps.html`).

### T4.3 — `robots.txt` + `sitemap.xml`

**Veredito: Aprovado.**

- `robots.txt` presente na raiz: `User-agent: *` / `Allow: /`, `Disallow:
  /assets/css/*.smoke.html` (confirmado que o padrão de fato cobre os 4
  arquivos de smoke-test reais existentes — `base.smoke.html`,
  `footer.smoke.html`, `header.smoke.html`, `tokens.smoke.html`, todos em
  `assets/css/`), `Sitemap: https://ljssoftware.com.br/sitemap.xml`.
- `sitemap.xml` presente na raiz: XML bem formado (`<?xml
  version="1.0"...?>`, um único `<urlset>` com namespace correto do
  protocolo sitemaps.org), 3 `<url>/<loc>` absolutas para as páginas
  públicas reais (`/`, `/apps.html`, `/sobre.html`) — confirmado que as 3
  URLs resolvem para arquivos reais na raiz do projeto.
- **`404.html` corretamente excluído do sitemap** — confirmado por leitura
  direta (só 3 entradas, nenhuma referência a `404.html`), conforme o
  critério de aceite e a boa prática de não indexar página de erro.
- Nenhum build step usado (G-01): 2 arquivos estáticos simples, sem
  geração automática — confirmado, texto plano/XML sem qualquer marcador
  de template.

### T4.4 — Arquivo `_headers` (headers de segurança)

**Veredito: Aprovado, com pendência de confirmação em ambiente real
(não-bloqueante) — natural para este tipo de verificação.**

- `_headers` presente na raiz, sintaxe nativa do Cloudflare Pages, com um
  único bloco `/*` cobrindo todas as rotas (G-09 satisfeita na parte
  estaticamente verificável).
- **CSP revisada diretiva a diretiva contra os recursos reais das 4
  páginas** (verificação própria deste Validador, não só aceite da nota do
  Executor):
  - `script-src 'self' https://static.cloudflarewebanalytics.io` —
    confirmado por `grep` que as 4 páginas reais só carregam `<script
    src="assets/js/nav.js" defer>` e `<script src="assets/js/analytics.js"
    defer>` (mesma origem), nenhum `<script>` inline em nenhuma das 4;
    coerente com a política.
  - `style-src 'self' 'unsafe-inline'` — confirmado que `apps.html` e
    `sobre.html` têm atributos `style=` inline (`grep` por `style=`
    localizou exatamente essas 2, como a nota do Executor descreve).
    **Achado de detalhe, não coberto pela nota do Executor:** `404.html`
    também depende de `'unsafe-inline'` em `style-src`, mas por um `<style>`
    (bloco `<style>...</style>` no `<head>`, não um atributo `style=`
    inline) — a diretiva `'unsafe-inline'` de `style-src` já cobre ambos os
    casos (atributo inline e elemento `<style>`) segundo a especificação
    CSP, então a política **funciona corretamente para as 4 páginas**; a
    nota de implementação só documentou 2 dos 3 casos reais de uso de
    `'unsafe-inline'`. **Classificação: Simples** (divergência factual
    entre a nota de implementação e o artefato real, sem impacto no
    critério de aceite — a CSP já é suficiente e correta como está).
  - `img-src 'self'` — confirmado que o único `<img>` usado nas 4 páginas é
    `assets/img/logo/logo-ljssoftware-icone.png` (self-hosted).
  - `font-src 'self'` — confirmado que `@font-face` em `tokens.css` só
    referencia `../fonts/*.woff2` local, nenhum CDN.
  - `connect-src 'self' https://static.cloudflarewebanalytics.io` —
    coerente com o domínio de beacon documentado em `analytics.js` (T2.4),
    ainda não fisicamente incluído (T5.4 pendente, fora de escopo).
  - `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`,
    `frame-ancestors 'none'` — endurecimento padrão, nenhum uso de
    `<object>`/formulário no site (G-04 não violado: nenhum `<form>`
    encontrado nas 4 páginas).
- Demais headers presentes e com valores corretos: `X-Content-Type-Options:
  nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy:
  strict-origin-when-cross-origin`, `Permissions-Policy` negando
  câmera/microfone/geolocalização/pagamento/USB + opt-out de
  `interest-cohort`.
- **Parte não verificável localmente, documentada como pendência não-
  bloqueante (conforme a própria tarefa antecipa):** a aplicação real dos
  headers em `/*` no preview deploy do Cloudflare Pages e a ausência de
  erro de bloqueio no console do navegador só podem ser confirmadas após
  deploy real — recomenda-se que o chapéu DevOps confirme isso na primeira
  chamada de `/deploy` (preparação de infraestrutura), antes do deploy de
  produção. Isso **não é tratado como bloqueio** desta validação — é
  natural para este tipo de verificação e o próprio critério de aceite da
  tarefa já antecipa essa dependência de ambiente real.
- Nota de interpretação do domínio do beacon (`static.cloudflarewebanalytics.io`)
  documentada pelo Executor como sujeita a confirmação em T5.4: aceita —
  não é um achado desta validação, é uma dependência explícita e correta de
  tarefa futura já fora do escopo do Lote 4.

### Testes de integração cross-platform

- As 4 páginas continuam carregando os mesmos 3 arquivos CSS e os mesmos 2
  scripts JS já validados nos Lotes 2/3 — nenhuma regressão de integração
  introduzida por T4.1-T4.4 (nenhum desses arquivos foi tocado, exceto
  `components.css`, cuja mudança foi isolada à opacidade de um blob do
  Hero e a comentários, sem alterar seletores/classes consumidos pelo
  HTML).
- `_headers`/`robots.txt`/`sitemap.xml` são arquivos de infraestrutura sem
  dependência de runtime nas páginas — não há integração cross-page a
  testar além da resolução de URL já verificada acima.

### Requisitos não funcionais

- Contraste WCAG AA: cobertura completa do design system, incluindo o pior
  caso composto (`.glass-card` sobre o blob mais intenso do mesh gradient)
  — reexecutado e PASS (ver T4.2).
- SEO básico (RF-07): title/description únicos, Open Graph, favicon,
  sitemap/robots — todos verificados (T4.1/T4.3).
- Segurança operacional de borda (G-09): `_headers` presente e
  estaticamente coerente com os recursos reais do site (T4.4); parte
  dependente de ambiente real sinalizada, não bloqueante.
- Nenhuma regressão nos requisitos não funcionais já validados nos Lotes
  1-3 (`prefers-reduced-motion`, `outline` de foco, `alt`/`aria-hidden`,
  ausência de cookies/tracking além do Cloudflare Web Analytics).

### Achados deste lote (resumo)

| # | Tarefa | Achado | Classificação | Ação |
|---|---|---|---|---|
| 1 | T4.4 | Nota de implementação do `_headers` documenta `'unsafe-inline'` de `style-src` como necessário só por atributos `style=` inline em `apps.html`/`sobre.html`, mas `404.html` também depende dessa diretiva por ter um bloco `<style>` no `<head>` — a política já cobre corretamente os 3 casos, é só uma lacuna na documentação da nota, sem impacto funcional | **Simples** | Tarefa criada em `Refatoração Lote-4` (ver Fechamento Estrutural abaixo); T4.4 permanece `Concluída` |

Nenhum achado **Crítico** neste lote. Nenhum achado em T4.1, T4.2 ou T4.3.

## Fechamento Estrutural do Lote 4

- T4.1, T4.2, T4.3, T4.4: todas `Concluída` no `TASK.md`, todas aprovadas
  pelo chapéu QA nesta validação (T4.4 com 1 achado Simples, sem impacto no
  critério de aceite central).
- Dependências da Seção 4 do `TASK.md` relativas ao Lote 4 (T3.1-T3.6 →
  T4.1/T4.2/T4.3; T4.4 sem dependência de página, paralelizável desde o
  início): estruturalmente coerentes — confirmado que T4.1/T4.2/T4.3 de
  fato operam sobre as 4 páginas já concluídas no Lote 3, sem exigir
  nenhuma dependência não declarada; T4.4 de fato não depende de nenhuma
  página (arquivo `_headers` isolado na raiz), consistente com o grafo de
  dependências.
- Nenhuma tarefa `Bloqueada` sem resolução.
- Achado Simples de T4.4 (lacuna na documentação da nota de implementação,
  sem impacto funcional na CSP real) vira tarefa no lote
  `Refatoração Lote-4`:

  **Refatoração Lote-4**
  | ID | Tarefa | Origem | Prazo sugerido |
  |---|---|---|---|
  | RL4.1 | Atualizar o comentário/nota de `_headers` (ou de `404.html`) para documentar que o `<style>` inline de `404.html` também depende de `style-src 'unsafe-inline'`, junto com os atributos `style=` de `apps.html`/`sobre.html` já documentados | QA-REPORT.md, achado #1 (T4.4) | Antes do deploy de produção (Lote 5); não bloqueia avanço/deploy — a CSP real já está correta |

  Esta tarefa não exige redesenho de dependência/decomposição — não escala
  ao `coordenador`.

**Veredito geral do Lote 4: Aprovado com ressalvas** (1 achado Simples em
T4.4, de documentação, sem impacto na CSP real; registrado em
`Refatoração Lote-4`). O lote está liberado para a auditoria de segurança
do chapéu DevSecOps (que ainda não rodou sobre este lote) e, em paralelo,
para o chapéu DevOps considerar este build no fluxo de dupla aprovação
rumo ao deploy — incluindo a confirmação em ambiente real da aplicação de
`_headers`/CSP (T4.4), sinalizada acima como pendência não-bloqueante desta
validação funcional.

---

## Refatoração Lote-1

**Escopo validado:** RL1.1 e RL1.2, ambas com Status `Concluída` no
`TASK.md` no momento desta validação. Origem: achados Simples do Lote 1
(QA-REPORT.md, achado #1 de T1.4) e do chapéu DevSecOps (SECURITY-REVIEW.md,
achado #1) sobre o mesmo lote.

**Metodologia:** os dois artefatos reais foram inspecionados diretamente no
disco contra o critério de aceite exato do `TASK.md`, sem usar a nota de
implementação do Executor como base de aprovação (usada só como ponto de
partida de onde olhar).

- Para RL1.1: script Python ad-hoc lendo o cabeçalho binário do formato ICO
  (`ICONDIR`/`ICONDIRENTRY`, 6 + 16×N bytes) para contar entradas e extrair
  largura/altura/tamanho de cada uma; e Pillow (`Image.open(...).info['sizes']`
  + comparação pixel a pixel via `get_flattened_data()`) para confirmar que o
  frame de 32×32 embutido no `.ico` é idêntico ao `favicon-32x32.png` já
  existente e aprovado no Lote 1.
- Para RL1.2: leitura direta e comparação textual da tag `<meta
  name="robots">` nos 4 arquivos de smoke-test reais do Lote 1
  (`tokens.smoke.html`, `base.smoke.html`, `header.smoke.html`,
  `footer.smoke.html`) — nota: o `TASK.md` referencia "`tokens.smoke.html`/
  `fonts.smoke.html`" como os 2 arquivos de comparação, mas não existe
  `fonts.smoke.html` no projeto (T1.2 não tem smoke-test HTML próprio, só o
  script `fonts.smoke.check.js`, já validado no Lote 1); os smoke-tests HTML
  reais do lote são os 4 listados acima. Não é um achado desta validação —
  é uma imprecisão de nomenclatura no `TASK.md`/prompt, sem impacto no
  critério de aceite de RL1.2, que pede identidade com "os outros 2 arquivos
  de smoke-test do Lote 1"; usei os 4 disponíveis como universo de
  comparação, o que é estritamente mais rigoroso que os 2 pedidos.

### RL1.1 — Regenerar `favicon.ico` com 3 resoluções reais

**Veredito: Aprovado.**

- Leitura binária do cabeçalho ICO (`assets/img/favicon/favicon.ico`, 6.957
  bytes) confirma **3 entradas** (`ICONDIR.count = 3`), exatamente como
  descrito na nota de implementação:
  - Entrada 0: 16×16, 32 bpp, 844 bytes, offset 54.
  - Entrada 1: 32×32, 32 bpp, 2.249 bytes, offset 898.
  - Entrada 2: 48×48, 32 bpp, 3.810 bytes, offset 3.147.
- `Pillow` (`Image.open(...).info['sizes']`) confirma o mesmo conjunto:
  `{(16, 16), (32, 32), (48, 48)}` — bate com o relatado pelo Executor e com
  a leitura binária independente feita por este Validador.
- **Glifo não alterado (verificação própria, não só aceite da nota do
  Executor):** extraí o frame de 32×32 do `.ico` (`Image.open(...)`, `size =
  (32, 32)`, `.load()`) e comparei pixel a pixel (`get_flattened_data()`,
  após converter ambos para RGBA) contra `assets/img/favicon/favicon-32x32.png`
  (já existente e aprovado no Lote 1): **idêntico, PASS** — mesma dimensão,
  mesmo conteúdo de pixel em todos os canais RGBA.
- Critério de aceite de RL1.1 ("cabeçalho ICO contém as 3 imagens embutidas
  — 16/32/48px —, sem alterar o glifo/arte do ícone") **satisfeito
  integralmente**, com evidência binária e visual própria, não apenas a nota
  do Executor.

### RL1.2 — Adicionar `<meta name="robots">` em `base.smoke.html`

**Veredito: Aprovado.**

- `assets/css/base.smoke.html`, linha 7: `<meta name="robots"
  content="noindex, nofollow">`, imediatamente após `<title>` — confirmado
  por leitura direta do arquivo.
- Comparação textual byte a byte da tag contra os outros 3 arquivos de
  smoke-test HTML reais do Lote 1:
  - `tokens.smoke.html` (linha 6): `<meta name="robots" content="noindex,
    nofollow">` — idêntico.
  - `header.smoke.html` (linha 6): `<meta name="robots" content="noindex,
    nofollow">` — idêntico.
  - `footer.smoke.html` (linha 7): `<meta name="robots" content="noindex,
    nofollow">` — idêntico.
- **Idêntico nos 4 arquivos**, sem nenhuma variação de atributo, espaçamento
  ou capitalização. Critério de aceite de RL1.2 satisfeito (a exigência
  original — identidade com pelo menos os outros 2 arquivos citados —
  é subsumida por esta comparação mais ampla, com resultado PASS).
- Nenhuma outra linha de `base.smoke.html` foi alterada — confirmado por
  leitura integral do arquivo (135 linhas), conteúdo do restante idêntico ao
  já validado no Lote 1 (T1.3).

### Testes de integração cross-platform

**N/A para este lote.** RL1.1 e RL1.2 são ajustes pontuais e independentes
sobre artefatos isolados (um `.ico` binário e um arquivo de smoke-test que
não faz parte do fluxo de páginas reais do site) — nenhuma dependência
cruzada entre eles nem com outro lote.

### Requisitos não funcionais

- Nenhum requisito não funcional novo introduzido por este lote de
  refatoração — RL1.1 é uma correção de fidelidade de artefato binário
  (não uma mudança de UX/performance/acessibilidade observável além do já
  coberto no Lote 1); RL1.2 é uma correção de metadado de indexação em um
  arquivo que já era `noindex` de fato (não é servido/linkado pelo site
  público), reduzindo apenas o risco residual documentado pelo DevSecOps.

### Achados deste lote

Nenhum achado Crítico nem Simples identificado em RL1.1 ou RL1.2 nesta
validação. Ambas as tarefas satisfazem integralmente o critério de aceite
original, confirmado por inspeção direta e independente dos artefatos reais
(binário do `.ico` e texto dos 4 arquivos de smoke-test).

## Fechamento Estrutural do lote Refatoração Lote-1

- RL1.1 e RL1.2: ambas `Concluída` no `TASK.md`, ambas aprovadas pelo
  chapéu QA nesta validação, sem achado pendente.
- Dependências da Seção 4 do `TASK.md` relativas a este lote ("nenhuma
  dependência de outro lote para começar"; "RL1.1 e RL1.2 são independentes
  entre si"): confirmadas coerentes com os artefatos reais — RL1.1 tocou
  apenas `favicon.ico`, RL1.2 tocou apenas `base.smoke.html`, nenhum dos
  dois arquivos referencia ou depende do outro.
- Nenhuma tarefa `Bloqueada` sem resolução.
- Nenhum achado simples/débito novo deste lote — não há nova entrada a
  criar em `Refatoração Lote-1` (o próprio lote já está com as 2 tarefas de
  origem concluídas e aprovadas) nem em qualquer outro lote de refatoração.
- Nada nesta checagem exige redesenho de dependência/decomposição — não
  escala ao `coordenador`. A única observação registrada (nomenclatura
  imprecisa "`fonts.smoke.html`" no `TASK.md`, que não existe como arquivo)
  é cosmética, não afeta nenhum critério de aceite nem grafo de
  dependências, e não justifica uma nova tarefa de correção.

**Veredito geral do lote Refatoração Lote-1: Aprovado.** RL1.1 e RL1.2
aprovadas sem ressalvas, com evidência binária/textual própria deste
Validador (não apoiada apenas na nota de implementação do Executor). Lote
estruturalmente fechado — liberado para a auditoria de segurança do chapéu
DevSecOps sobre este lote específico e, em paralelo, para o chapéu DevOps
considerar este build no fluxo de dupla aprovação rumo ao deploy.

---

## Refatoração Lote-4

**Escopo validado:** RL4.1 (única tarefa do lote), com Status `Concluída` no
`TASK.md` no momento desta validação. Origem: achado Simples #1 do Lote 4
(QA-REPORT.md, achado #1 de T4.4 — lacuna de documentação sobre `_headers`).

**Metodologia:** o arquivo real `_headers` foi lido integralmente na raiz do
projeto, sem usar a nota de implementação do Executor como base de
aprovação (usada só como ponto de partida de onde olhar); `404.html`,
`apps.html` e `sobre.html` foram lidos/grepados diretamente para confirmar
as afirmações factuais do novo comentário.

### RL4.1 — Atualizar o comentário/nota de `_headers` sobre `style-src 'unsafe-inline'`

**Veredito: Aprovado, com 1 achado Simples anexado (ver abaixo) — tarefa
permanece `Concluída`.**

- **Citação dos 3 arquivos (critério de aceite central):** `_headers`,
  linhas 1-9, confirma o comentário citando explicitamente os 3 arquivos
  exigidos — `apps.html` e `sobre.html` (padrão "atributo de estilo
  inline") e `404.html` (padrão "elemento de estilo inline", bloco
  `<style>...</style>` completo) — como dependentes de `'unsafe-inline'`
  em `style-src`, com a justificativa correta (ambos os padrões exigem a
  diretiva segundo a especificação CSP). **Critério de aceite satisfeito
  integralmente.**
- **`404.html` tem de fato um bloco `<style>`, não um atributo `style=`:**
  confirmado por leitura direta de `404.html`, linhas 20-70 — um único
  bloco `<style>...</style>` no `<head>` (regras `.error-page*`), nenhum
  atributo `style=` inline nesse arquivo. A afirmação factual do novo
  comentário está correta.
- **Nenhuma mudança na CSP real:** a diretiva `style-src 'self'
  'unsafe-inline'` no `_headers` atual é textualmente idêntica à mesma
  diretiva já documentada e aprovada como correta na auditoria de
  segurança do Lote 4 (`.md/SECURITY-REVIEW.md`, linha 701) — nenhuma
  palavra alterada em `style-src` especificamente. Nota: a linha completa
  de `Content-Security-Policy` no `_headers` atual difere da registrada em
  `SECURITY-REVIEW.md` no domínio de `script-src`/`connect-src`
  (`static.cloudflarewebanalytics.io` → `static.cloudflareinsights.com`/
  `cloudflareinsights.com`) — mudança de uma correção separada e já
  documentada no próprio arquivo (linhas 11-22, "CORRECAO (Validador,
  chapeu DevOps, preparação de T5.4)"), fora do escopo de RL4.1 e sem
  relação com `style-src`; não é um achado desta tarefa.
- **Achado Simples (novo, desta validação) — referência de linha incorreta
  para `apps.html`:** o comentário afirma que os atributos `style=` de
  `apps.html` estão nas "linhas ~67-68" (`_headers`, linha 2-3). Grep
  direto em `apps.html` mostra os 2 atributos `style=` reais nas linhas
  **78-79**, não 67-68 — divergência de 11 linhas. Para comparação, a
  mesma afirmação sobre `sobre.html` ("linhas ~51-69") bate com os 5
  atributos `style=` reais encontrados nas linhas 51, 52, 53, 63 e 69
  (grep confirma). **Classificação: Simples** — é um detalhe de precisão
  numa referência de linha dentro de um comentário de documentação, sem
  impacto no critério de aceite central de RL4.1 (que exige apenas citar
  os 3 arquivos como dependentes de `'unsafe-inline'`, o que está correto)
  e sem qualquer impacto na CSP real ou em qualquer outra tarefa do lote.
  RL4.1 **permanece `Concluída`**; o achado vira tarefa em
  `Refatoração Lote-4` (ver Fechamento Estrutural abaixo), não retorno ao
  `executor`.

### Testes de integração cross-platform

**N/A para este lote.** RL4.1 é um ajuste pontual de comentário em um único
arquivo de configuração de headers (`_headers`), sem dependência cruzada
com outro artefato/lote.

### Requisitos não funcionais

**N/A para este lote.** Mudança é puramente documental (comentário `#`),
sem efeito observável de performance/usabilidade/acessibilidade — a CSP
real já era e continua a mesma para efeitos de `style-src`.

### Achados deste lote

| # | Tarefa | Achado | Classificação | Ação |
|---|---|---|---|---|
| 1 | RL4.1 | Comentário novo em `_headers` cita "linhas ~67-68" para os atributos `style=` de `apps.html`, mas os 2 atributos reais estão nas linhas 78-79 (grep confirma) — a referência de `sobre.html` ("~51-69") está correta | **Simples** | Tarefa criada em `Refatoração Lote-4` (ver Fechamento Estrutural abaixo); RL4.1 permanece `Concluída` |

Nenhum achado **Crítico** neste lote.

## Fechamento Estrutural do lote Refatoração Lote-4

- RL4.1: única tarefa do lote, `Concluída` no `TASK.md`, aprovada pelo
  chapéu QA nesta validação (com 1 achado Simples, sem impacto no critério
  de aceite central).
- Dependências da Seção 4 do `TASK.md` relativas a este lote ("nenhuma
  dependência de outro lote para começar"): confirmadas coerentes — RL4.1
  tocou apenas `_headers`, arquivo isolado, sem referenciar nem depender de
  nenhuma tarefa de outro lote.
- Nenhuma tarefa `Bloqueada` sem resolução.
- Achado Simples de RL4.1 (referência de linha incorreta para `apps.html`
  no comentário de `_headers`) vira nova tarefa no mesmo lote:

  **Refatoração Lote-4** (atualizado)
  | ID | Tarefa | Origem | Prazo sugerido |
  |---|---|---|---|
  | RL4.1 | *(já `Concluída` — ver acima)* | — | — |
  | RL4.2 | Corrigir a referência de linha de `apps.html` no comentário de `_headers` (de "linhas ~67-68" para as linhas reais dos 2 atributos `style=`, hoje 78-79 — reconferir no momento da correção, pois pode mudar se o arquivo for editado) | QA-REPORT.md, achado #1 (RL4.1) | Antes do deploy de produção (Lote 5); não bloqueia avanço/deploy — é só uma imprecisão de comentário, sem efeito na CSP real |

  Esta tarefa não exige redesenho de dependência/decomposição — não escala
  ao `coordenador`.

**Veredito geral do lote Refatoração Lote-4: Aprovado com ressalvas** (1
achado Simples em RL4.1, uma referência de linha imprecisa dentro do
comentário, sem impacto na citação dos 3 arquivos exigida pelo critério de
aceite nem na CSP real; registrado como RL4.2 em `Refatoração Lote-4`). O
lote está estruturalmente fechado (única tarefa, sem dependência externa,
nenhuma tarefa `Bloqueada`) e liberado para a auditoria de segurança do
chapéu DevSecOps sobre este lote específico e, em paralelo, para o chapéu
DevOps considerar este build no fluxo de dupla aprovação rumo ao deploy.

---

## Lote 5 — Deploy e Infraestrutura

**Escopo validado:** T5.1, T5.2, T5.3, T5.4, todas com Status `Concluída`
no `TASK.md` no momento desta validação.

**Metodologia:** diferente dos Lotes 1-4, este lote envolveu ações reais de
infraestrutura fora do repositório (conta Cloudflare, DNS/registro.br),
executadas manualmente pelo stakeholder — não há como reexecutar essas
ações, apenas auditar o resultado publicado. Este Validador **não tem
acesso a uma conta Cloudflare real** (não navega no painel), mas tem
acesso de leitura à internet real e ao repositório. Por isso, cada critério
de aceite de T5.1-T5.4 foi verificado por **requisição HTTP real** contra
`https://ljssoftware.pages.dev` e `https://ljssoftware.com.br`/
`https://www.ljssoftware.com.br` (via `curl`, inspecionando status code,
`Location`, e os headers de resposta), não por leitura de nota de
implementação nem por confiança no relato do Executor. Também foram lidos
diretamente `public/_headers`, `public/_redirects` e as 4 páginas HTML
publicadas (`public/index.html`, `public/apps.html`, `public/sobre.html`,
`public/404.html`), e reexecutados nesta sessão os 3 scripts Node de
verificação movidos para `dev/` na reestruturação desta fase (`node
dev/css/tokens.contrast-check.js`, `node dev/css/a11y-contrast-check.js`,
`node dev/fonts/fonts.smoke.check.js`), para confirmar que a reestruturação
`public/`+`dev/` não quebrou nenhuma checagem de acessibilidade/fontes já
aprovada nos Lotes 1 e 4.

### T5.1 — Setup do repositório + conexão ao Cloudflare Pages

**Veredito: Aprovado.**

- `https://ljssoftware.pages.dev` responde `200` e serve o conteúdo real do
  site (confirmado via `curl`), mesmo depois do domínio customizado (T5.2)
  estar ativo — preview continua acessível de forma independente, conforme
  exigido pelo critério de aceite.
- `dev/` **não** é publicado: `https://ljssoftware.pages.dev/dev/css/tokens.smoke.html`
  responde `404`, assim como `https://ljssoftware.com.br/dev/css/tokens.smoke.html`
  — confirma que o *Build output directory* `public` de fato exclui `dev/`
  da publicação, resolvendo o risco de vazamento de smoke-test já sinalizado
  em `SECURITY-REVIEW.md` (Lotes 1-4).
- Critério de aceite ("Deploy de preview acessível via URL `*.pages.dev`,
  atualizando a cada push") satisfeito pelo que é observável hoje (URL
  acessível com conteúdo real); a atualização automática a cada push não é
  diretamente testável por este Validador sem disparar um push de teste,
  mas é comportamento nativo do Cloudflare Pages quando conectado via Git,
  consistente com a Production branch `main` confirmada em uso.

### T5.2 — Domínio customizado + migração de NS

**Veredito: Aprovado.**

- `https://ljssoftware.com.br` responde `200` com o conteúdo real do site
  (HTML da Home, não um placeholder/erro do Cloudflare) — confirmado via
  `curl`.
- Certificado TLS válido: a conexão HTTPS completa sem erro de certificado
  (handshake TLS 1.x bem-sucedido via `curl`, sem `SSL certificate problem`
  nem aviso de nome incompatível).

### T5.3 — Always Use HTTPS + redirect www→apex

**Veredito: Aprovado, com 1 achado Simples anexado (ver abaixo) — tarefas
permanecem `Concluída`.**

- `http://ljssoftware.com.br` → `301` → `https://ljssoftware.com.br/` —
  confirmado via `curl` (header `Location`).
- `https://www.ljssoftware.com.br/` → `301` → `https://ljssoftware.com.br/`
  — confirmado.
- `https://www.ljssoftware.com.br/apps.html?x=1` → `301` →
  `https://ljssoftware.com.br/apps.html?x=1` (path e query string
  preservados) — confirmado, batendo com o que `DEPLOY.md` já registrava
  como verificado.
- Certificado TLS válido nos dois domínios (apex e `www`), sem erro de
  certificado em nenhuma das requisições acima.
- **Achado Simples (novo, desta validação) — redirect adicional não
  documentado, "clean URL" do Cloudflare Pages:** ao testar cada página
  isoladamente, toda URL com extensão `.html` (`/apps.html`, `/sobre.html`,
  `/index.html`) responde com **`308 Permanent Redirect`** para a mesma
  URL sem extensão (`/apps`, `/sobre`, `/`) — comportamento padrão do
  Cloudflare Pages para sites com arquivos `.html` no *Build output
  directory*, não configurado explicitamente por nenhuma tarefa do
  `TASK.md`/`DEPLOY.md` e não mencionado em nenhuma verificação registrada
  até aqui. Consequência prática, testada:
  - `https://www.ljssoftware.com.br/apps.html?x=1` → **2 hops**, não 1: o
    redirect `www`→apex documentado em `DEPLOY.md`/T5.3 (`301` para
    `https://ljssoftware.com.br/apps.html?x=1`) é seguido por um **segundo**
    redirect (`308`, Cloudflare Pages) para `https://ljssoftware.com.br/apps?x=1`,
    que aí sim responde `200` — query string ainda preservada nos dois
    hops, nenhuma quebra funcional, mas a cadeia real tem 1 hop a mais do
    que o único hop testado e registrado em `DEPLOY.md`.
  - Os links internos de navegação das 4 páginas (`href="apps.html"`,
    `href="sobre.html"`, `href="index.html"`) continuam apontando para os
    caminhos com extensão, então **todo clique de navegação interna do
    site dispara um redirect 308** antes de chegar à URL final — sem
    quebra visível para o usuário (o navegador segue o redirect de forma
    transparente), mas é um hop de rede evitável em toda navegação.
  - `sitemap.xml` (T4.3) e `og:url` (T4.1) das páginas `apps.html`/`sobre.html`
    referenciam explicitamente as URLs **com** `.html`
    (`https://ljssoftware.com.br/apps.html`), que hoje são a origem, não o
    destino final, do redirect — motores de busca/crawlers de rede social
    ainda resolvem por seguirem redirect, mas a prática recomendada é que
    `sitemap.xml`/`og:url`/link interno apontem direto para a URL
    canônica final servida (sem redirect no meio).
  - **Classificação: Simples.** Não compromete o critério de aceite
    central de T5.3 (http→https `301` ✓, www→apex `301` ✓, TLS válido ✓ —
    todos confirmados) nem de nenhuma outra tarefa deste lote; o site
    continua 100% navegável e todas as URLs resolvem para `200` no fim da
    cadeia. Não é uma falha de segurança (nenhum dos redirects escapa de
    HTTPS/do domínio correto) nem de compliance. É um ajuste de
    consistência/performance (menos hops, canonical real) e de precisão de
    documentação (o próximo `/deploy` ou auditoria não deve assumir que
    T5.3 tem só 1 hop de redirect por combinação). T5.1-T5.4 **permanecem
    `Concluída`**; o achado vira tarefa em `Refatoração Lote-5` (ver
    Fechamento Estrutural abaixo), não retorno ao `executor`.

### T5.4 — Cloudflare Web Analytics + beacon nas 4 páginas

**Veredito: Aprovado.**

- Snippet do beacon (`<script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "bc3ce694258f45c393941b292ba37ac9"}'>`)
  presente nas 4 páginas publicadas — confirmado por leitura direta de
  `public/index.html` (linha 260), `public/apps.html` (linha 171),
  `public/sobre.html` (linha 139) e `public/404.html` (linha 160), sempre
  imediatamente antes de `assets/js/analytics.js`, mesmo token nas 4.
- `https://static.cloudflareinsights.com/beacon.min.js` responde `200`
  (confirmado via `curl` direto ao domínio real da Cloudflare) — o script
  carrega sem erro de rede.
- CSP publicada em produção (`curl -I https://ljssoftware.com.br`) já
  reflete a correção registrada em `DEPLOY.md`/`_headers`: `script-src`
  inclui `https://static.cloudflareinsights.com` e `connect-src` inclui
  `https://cloudflareinsights.com` — os domínios reais do beacon (não mais
  o domínio inexistente `static.cloudflarewebanalytics.io` usado até o
  Lote 4), confirmando que a CSP publicada não bloqueia o beacon.
- `assets/js/analytics.js` (verificado no repositório) continua chamando
  `window.__cfBeacon.track(...)`/fallback `window.zaraz.track(...)` apenas
  se as funções existirem, sem alterar a lógica de T2.4 — consistente com
  o snippet real inserido.
- Confirmação de eventos custom (`contato_email_click`/
  `contato_linkedin_click`) e de visitas reais aparecendo no dashboard do
  Cloudflare Web Analytics **não é verificável por este Validador** (exige
  acesso ao painel Cloudflare, indisponível neste ambiente) — mesma
  pendência leve, não bloqueante, já sinalizada em `TASK.md`/T5.4 e em
  `DEPLOY.md`; não impede a aprovação do critério de aceite central
  (beacon ativo e sem erro nas 4 páginas), que é o que está sob controle
  observável deste Validador.

### Testes de integração cross-platform

- Cadeia completa `http://` → `https://` → (`www` → apex, quando
  aplicável) → conteúdo real `200`, testada ponta a ponta para a Home e
  para uma página interna com query string (`apps.html?x=1`) — todos os
  hops preservam protocolo/path/query corretamente, sem perda de dados na
  URL em nenhum ponto da cadeia (ver achado Simples de T5.3 acima sobre o
  número de hops, não sobre correção do resultado final).
- CSP publicada em produção testada contra o domínio real do beacon
  (`static.cloudflareinsights.com`/`cloudflareinsights.com`) — sem
  divergência entre o que `_headers` declara no repositório e o que o
  Cloudflare Pages de fato aplica em produção (`curl -I` no domínio real
  bate byte a byte com `public/_headers`).
- Reestruturação `public/`+`dev/` (T5.1) testada contra os 3 scripts de
  verificação movidos para `dev/`: os 3 continuam rodando e passando sem
  erro depois da mudança de caminhos relativos, confirmando que a
  reorganização de diretórios não quebrou nenhuma checagem automatizada já
  aprovada nos Lotes 1 e 4 (ver "Requisitos não funcionais" abaixo para o
  resultado de cada um).

### Requisitos não funcionais

- **Acessibilidade (WCAG AA), pós-reestruturação:** `node
  dev/css/tokens.contrast-check.js` (5/5 combinações PASS, idêntico ao
  resultado original de T1.1) e `node dev/css/a11y-contrast-check.js`
  (todas as combinações — tokens sólidos, componentes dos Lotes 2/3, pior
  caso do mesh gradient, pior caso composto `.glass-card` sobre o mesh
  gradient — PASS, idêntico ao resultado original de T4.2) **reexecutados
  nesta sessão a partir do novo caminho `dev/css/`**, sem nenhuma
  regressão.
- **Fontes self-hosted (G-11), pós-reestruturação:** `node
  dev/fonts/fonts.smoke.check.js` confirma, a partir do novo caminho
  `dev/fonts/`, ausência de qualquer referência a CDN externo de fontes em
  todo HTML/CSS do projeto publicado, `font-display: swap` presente em
  todos os `@font-face`, e os 4 arquivos `.woff2` íntegros — sem
  regressão.
- **Headers de segurança em produção real:** `X-Content-Type-Options:
  nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy:
  strict-origin-when-cross-origin`, `Permissions-Policy` restritiva —
  todos presentes na resposta HTTP real de `https://ljssoftware.com.br`,
  idênticos ao `public/_headers` do repositório (auditoria de segurança
  completa fica a cargo do chapéu DevSecOps, aqui confirmado apenas que a
  publicação real corresponde ao arquivo versionado).
- **Página 404 real:** `https://ljssoftware.com.br/<rota-inexistente>`
  responde `404` servindo o conteúdo de `404.html` (`<title>Página Não
  Encontrada (404) — LJS Software</title>` confirmado no corpo da
  resposta real), não uma página de erro genérica do Cloudflare.

### Achados deste lote

| # | Tarefa | Achado | Classificação | Ação |
|---|---|---|---|---|
| 1 | T5.3 (e, por extensão, T4.1/T4.3) | Cloudflare Pages aplica redirect `308` automático de toda URL `.html` para a URL sem extensão ("clean URL"), não documentado/testado antes desta validação; gera 1 hop extra em toda navegação interna e nos redirects `www`→apex de páginas internas, e deixa `sitemap.xml`/`og:url` apontando para a URL de origem do redirect em vez da URL final canônica | **Simples** | Tarefa criada em `Refatoração Lote-5` (ver Fechamento Estrutural abaixo); T5.1-T5.4 permanecem `Concluída` |

Nenhum achado **Crítico** neste lote — todos os critérios de aceite centrais
de T5.1-T5.4, verificados por requisição HTTP real contra a infraestrutura
publicada, estão satisfeitos.

## Fechamento Estrutural do Lote 5

- T5.1, T5.2, T5.3, T5.4: todas `Concluída` no `TASK.md`, todas aprovadas
  pelo chapéu QA nesta validação (T5.3 com 1 achado Simples anexado, sem
  impacto no critério de aceite central).
- Dependências da Seção 4 do `TASK.md` relativas a este lote: confirmadas
  coerentes — T5.2 depende de T5.1 (satisfeita, T5.1 `Concluída` antes),
  T5.3 depende de T5.2 (satisfeita), T5.4 depende de T5.1 e do Lote 3
  completo (T3.1-T3.6, todas `Concluída`) e de T2.4 (`Concluída`); nenhuma
  dependência órfã/inconsistente encontrada.
- Nenhuma tarefa `Bloqueada` sem resolução.
- Achado Simples de T5.3 (redirect `308` "clean URL" não documentado) vira
  nova tarefa em um novo lote de refatoração:

  **Refatoração Lote-5** (novo)
  | ID | Tarefa | Origem | Prazo sugerido |
  |---|---|---|---|
  | RL5.1 | Resolver a duplicidade de URL introduzida pelo redirect `308` automático do Cloudflare Pages (`.html` → sem extensão): (a) atualizar os links internos de navegação das 4 páginas e o CTA/`href` relevantes para apontar direto para a URL sem extensão (`apps`/`sobre`, sem `.html`), eliminando o hop 308 na navegação normal do site; (b) atualizar `sitemap.xml` (T4.3) e `og:url` (T4.1) das 4 páginas para referenciar a mesma URL final sem extensão, consistente entre si | QA-REPORT.md, achado #1 (T5.3) | Antes do deploy de produção final (após o Lote 6, conteúdo definitivo) — não bloqueia o avanço/deploy: o site já resolve corretamente para `200` em todos os casos, é um ajuste de consistência/performance, não uma correção de algo quebrado |

  Esta tarefa não exige redesenho de dependência/decomposição — não escala
  ao `coordenador`; é um ajuste de consistência de URL dentro do
  repositório, mesma natureza dos ajustes já registrados em `Refatoração
  Lote-1`/`Refatoração Lote-4`.

**Veredito geral do Lote 5: Aprovado com ressalvas** (1 achado Simples em
T5.3 — redirect `308` "clean URL" do Cloudflare Pages não documentado
antes desta validação, sem impacto nos critérios de aceite centrais de
T5.1-T5.4, todos confirmados por requisição HTTP real contra a
infraestrutura publicada; registrado como RL5.1 em `Refatoração Lote-5`).
O lote está estruturalmente fechado (4 tarefas `Concluída`, dependências da
Seção 4 coerentes, nenhuma tarefa `Bloqueada`) e liberado para a auditoria
de segurança do chapéu DevSecOps sobre este lote específico e, em
paralelo, para o chapéu DevOps considerar este build (já em produção) no
fluxo de dupla aprovação — a dupla aprovação (QA + DevSecOps) sobre este
lote é o que falta para o deploy já realizado ser considerado formalmente
liberado pelo processo de governança.

---

## Lote 6 — Confirmação de Conteúdo Pendente

**Escopo validado:** T6.1, T6.2, T6.3, todas com Status `Concluída`/`Provisória`
no `TASK.md` no momento desta validação — as 3 são tratadas como `Concluída`
para fins de elegibilidade de validação do lote (T6.1 tem só o e-mail
`Concluída` no sentido estrito e o LinkedIn marcado `Provisória`, mas essa
provisoriedade é uma ressalva de negócio já registrada pelo stakeholder, não
um trabalho pendente de implementação — ver avaliação específica abaixo).

**Metodologia:** diferente dos Lotes 1-5 (onde a leitura do repositório local
já bastava, complementada por HTTP real nos Lotes 5), este lote foi validado
**primariamente por requisição HTTP real** contra a produção
(`https://ljssoftware.com.br`), conforme instruído — as 4 páginas
(`index.html`, `apps.html`, `sobre.html`, `404.html`, as duas últimas via
redirect `308` já registrado/aceito em `RL5.1`) foram buscadas via `curl`
diretamente da internet, não do disco. O conteúdo local em `public/` (lido
antes, como ponto de partida de onde olhar, nunca como base de aprovação) foi
usado só para montar a expectativa a conferir contra a resposta HTTP real.
Reexecutado `node dev/css/a11y-contrast-check.js` (não reaproveitado nenhum
resultado relatado pelo Executor) para confirmar ausência de regressão de
contraste. O e-mail ofuscado servido pela Cloudflare (ver T6.1) foi decodificado
manualmente (mesmo algoritmo do Scrape Shield: XOR de cada byte pelo primeiro
byte da string hex) para confirmar que o valor real por trás da ofuscação
continua sendo `contato@ljssoftware.com.br`, não um valor divergente.

### T6.1 — E-mail definitivo e URL de LinkedIn (rodapé + contato da Home)

**Veredito: Aprovado.**

- **E-mail (`contato@ljssoftware.com.br`) — presente e correto nas 4
  páginas + seção de contato da Home**, confirmado por requisição HTTP real.
  **Achado de produção não previsto no código-fonte, investigado e
  descartado como não-bloqueante**: a Cloudflare aplica automaticamente
  "Email Address Obfuscation" (Scrape Shield) a toda a zona, reescrevendo o
  `href="mailto:contato@ljssoftware.com.br"` do HTML servido para
  `href="/cdn-cgi/l/email-protection#<hex>"` e o texto visível do e-mail
  para um `<span class="__cf_email__" data-cfemail="<hex>">`, decodificados
  no client por um script injetado (`/cdn-cgi/scripts/.../email-decode.min.js`,
  mesma origem, não bloqueado pela CSP `script-src 'self' ...`). Decodifiquei
  manualmente o hex de 3 ocorrências (Home hero-CTA "Enviar e-mail", Home
  rodapé, `apps.html` rodapé) com o algoritmo público do Scrape Shield
  (XOR de cada byte pelo primeiro byte da string): as 3 decodificam
  exatamente para `contato@ljssoftware.com.br` — o dado real por trás da
  ofuscação está correto, não é uma regressão de conteúdo. **Isso não é um
  achado novo desta validação**: já foi identificado, avaliado e decidido
  pelo usuário como recurso a manter ligado (ver `.md/DEPLOY.md`, "Decisão do
  usuário — Email Address Obfuscation", e `.md/CTO-REVIEW.md`, "Decisão de
  produto já registrada, sem gerar débito") — não gera nova entrada em
  `Refatoração Lote-6`, só confirmado aqui como comportamento estável e
  correto na validação funcional de T6.1.
- `data-analytics-event="contato-email"` **preservado** no atributo do
  `<a>` mesmo após a reescrita do `href` pelo Scrape Shield — confirmado por
  leitura direta da resposta HTTP real nas 4 páginas + Home. O script de
  decodificação da Cloudflare só toca `href` e o conteúdo do `<span
  class="__cf_email__">`, nunca remove/sobrescreve outros atributos do
  elemento pai — evento de analytics não foi perdido pela substituição de
  conteúdo (T2.4 continua funcional).
- **LinkedIn (`https://www.linkedin.com/in/leandro-segheto-moraes-90879b138`)
  — presente nas 4 páginas (rodapé) e na seção de contato da Home**,
  confirmado por requisição HTTP real, com `target="_blank"` e
  `rel="noopener"` em todas as 5 ocorrências (4 rodapés + 1 CTA de contato da
  Home), e `data-analytics-event="contato-linkedin"` presente em todas —
  nenhuma perda de instrumentação de analytics.
- **Avaliação explícita da ressalva já registrada (LinkedIn provisório =
  perfil pessoal, não da empresa):** confirmado no `TASK.md` (T6.1) que essa
  é uma decisão de negócio já tomada pelo stakeholder (empresa ainda sem
  página própria no LinkedIn), com pendência de troca futura já sinalizada e
  escopo dos 5 arquivos afetados já mapeado. **Não é um achado de QA** — o
  critério de aceite de T6.1 ("URL real do perfil de LinkedIn") está
  satisfeito pelo valor que o próprio stakeholder confirmou como correto
  para este momento; não reprovo por isso, e não duplico o registro já
  existente no `TASK.md`.
- Ícones do rodapé (`.footer-link__icon`, decorativos) continuam com
  `aria-hidden="true"` nas 4 páginas reais — nenhuma regressão de
  acessibilidade introduzida pela troca de texto/URL (os `<svg>` não foram
  tocados por T6.1, só o conteúdo textual/`href` dos links).

### T6.2 — Lista definitiva de apps (Curta Mais, Bíblia Fácil, My Money)

**Veredito: Aprovado.**

- Confirmado por requisição HTTP real: os 3 apps (**Curta Mais**, **Bíblia
  Fácil**, **My Money**), com as descrições exatas do `TASK.md`, aparecem
  tanto em `apps.html` (vitrine, `<h2 class="app-card__name">`) quanto na
  prévia de `index.html` (`<h3 class="app-card__name">`) — mesmo conteúdo,
  mesma ordem, nas duas páginas.
- **Estrutura de card/badge idêntica à das demais tarefas do Lote 3,
  preservada:** os 3 cards continuam `<article class="app-card
  glass-card">` com `<span class="badge">Em breve</span>`, mesma classe
  `.grid.grid--3col`, sem nenhum CSS novo introduzido pela substituição de
  conteúdo (confirmado por não haver `style=` inline nem classe nova nos
  cards nas 2 páginas reais).
- **Diferença de nível de heading entre as duas páginas (`h2` em
  `apps.html`, `h3` em `index.html`) é intencional e correta, não uma
  divergência** — já validada e corrigida em T4.2 (Lote 4): em `apps.html`
  os cards são filhos diretos do `<h1>` "Nossos apps" (sem `<h2>` de
  agrupamento), então usam `<h2>`; em `index.html` existe um `<h2
  class="home-apps__title">` de agrupamento antes deles, então os cards
  usam `<h3>` corretamente. A troca de conteúdo em T6.2 não alterou essa
  estrutura em nenhuma das duas páginas — confirmado por leitura direta da
  resposta HTTP real.
- **Nenhuma quebra de layout/grid**: `grid--3col` (1/2/3 colunas nos
  breakpoints 360/768/1024, já validado nos Lotes 1/3) não foi tocado; os
  novos textos (descrições reais, de tamanho comparável aos placeholders
  substituídos) não introduzem `overflow`/quebra visível — confirmado por
  leitura do CSS real (`.app-card__description` sem `white-space:
  nowrap`/altura fixa que pudesse cortar texto mais longo).

### T6.3 — CTA secundário do hero ("Fale conosco" → `#contato`)

**Veredito: Aprovado.**

- Confirmado por requisição HTTP real à Home em produção:
  `<a class="hero__cta hero__cta--secondary" href="#contato">Fale conosco</a>`
  presente no hero, e `<section id="contato" class="home-contact">` existe
  na mesma página (seção de contato, T3.3) — a âncora resolve corretamente
  para o destino real, sem link quebrado.
- Nenhuma mudança de código nesta tarefa (o próprio `TASK.md` já registra
  isso) — confirmado que o CTA é byte-idêntico ao já validado em T3.1/T3.3
  (Lote 3), sem regressão.

### T6.4 — 3 novos apps na vitrine e na prévia da Home (SportsLM, FutebolApp, Evolução Segura)

**Veredito: Aprovado.**

**Metodologia específica desta tarefa:** diferente de T6.1/T6.2/T6.3
(validadas por requisição HTTP real contra a produção, porque já estavam
publicadas), T6.4 ainda **não foi publicada** no momento desta validação
(`git status` confirma `public/apps.html`/`public/index.html` modificados
na working tree, sem commit) — validada por leitura direta dos 2 arquivos
reais em `public/` e por `git diff` isolado dessas duas mudanças, não pela
nota de implementação do Executor no `TASK.md`.

- **Os 3 novos cards existem nas 2 páginas, com nome/descrição exatos do
  critério de aceite**: confirmado por leitura direta de `public/apps.html`
  (linhas 109-134) e `public/index.html` (linhas 123-139) — **SportsLM**
  ("Suas notícias em um único lugar"), **FutebolApp** ("Gestão completa do
  seu grupo de futebol"), **Evolução Segura** ("Prontuário digital simples,
  com seus dados sempre com você"), nos dois arquivos, mesma ordem, mesmo
  texto byte a byte entre `apps.html` e `index.html`.
- **Markup/classes consistentes com os 3 apps já existentes em cada
  página e entre as duas páginas**: os 3 novos `<article>` usam
  `class="app-card glass-card"`, mesmo `<span class="badge">Em breve</span>`
  isolado com o mesmo comentário de troca futura por
  `<a class="badge badge--link">` (em `apps.html`), sem nenhum atributo novo
  (`id`, `style=`, classe extra) que os 3 antigos não tivessem. Confirmado
  por `git diff` isolado (`git diff -- public/apps.html public/index.html`):
  a única mudança em `apps.html` é a inserção dos 3 blocos `<article>` após
  "My Money", sem tocar em nenhum card existente; em `index.html`, mesma
  inserção mais a atualização do comentário de proveniência (linhas 89-95,
  texto desatualizado que citava os 3 placeholders antigos "Gestor Fácil"/
  "Agenda Smart"/"Financeiro Simples" corrigido para refletir a paridade
  real com `apps.html`) — nenhuma outra linha alterada.
- **Nível de heading correto e consistente com a regra já fixada em T4.2**:
  os 3 novos cards usam `<h2 class="app-card__name">` em `apps.html` (filhos
  diretos do `<h1>` "Nossos apps", sem `<h2>` de agrupamento — mesma razão
  já documentada em T4.2/T6.2) e `<h3 class="app-card__name">` em
  `index.html` (existe `<h2 class="home-apps__title">` de agrupamento antes
  deles) — confirmado por leitura direta, nenhum pulo de nível introduzido
  (WCAG 2.4.6). Agora `apps.html` tem 6 `<h2>` filhos diretos do `<h1>` e
  `index.html` tem 6 `<h3>` filhos do mesmo `<h2>` de agrupamento — estrutura
  se mantém coerente ao escalar de 3 para 6 cards.
- **Grid responsivo sem alteração de CSS, sem overflow esperado**: `.grid`/
  `.grid--3col` (`public/assets/css/base.css`, linhas ~190-208) usa
  `grid-template-columns: repeat(N, 1fr)` (1 coluna mobile, 2 em >=768px, 3
  em >=1024px) — `repeat()` não tem limite de itens, 6 cards se distribuem
  em 2 ou 3 linhas conforme o breakpoint sem qualquer ajuste necessário;
  nenhuma regra de altura fixa/`overflow: hidden` em `.app-card`/`.glass-card`
  que pudesse cortar conteúdo. Nenhum CSS novo foi de fato adicionado
  (confirmado pelo `git diff` não tocar em nenhum arquivo `.css`).
- **Nenhum link quebrado**: os 3 novos cards não têm `<a href>` (mesmo
  padrão dos 3 existentes — badge isolado, não clicável na fase 1, RF-02);
  nada a testar de navegação nesta tarefa.
- **Nenhuma regressão de acessibilidade introduzida**: nenhum `alt`/
  `aria-hidden` novo necessário (os 3 cards são só texto, sem ícone/imagem);
  contraste dos novos cards usa exatamente os mesmos tokens/classes já
  verificados PASS em T4.2 (`.app-card__name`/`.app-card__description`
  sobre `.glass-card`/mesh gradient) — nenhuma cor nova introduzida, então
  não há necessidade de re-executar `a11y-contrast-check.js` para este
  achado especificamente (nenhum token de cor tocado, confirmado por
  `git diff` não tocar `.css`).
- **Consistência entre as duas páginas (RT-02 aplicado por analogia ao
  conteúdo, mesmo critério já usado para avaliar T6.2)**: os 6 apps (3
  antigos + 3 novos) aparecem na mesma ordem e com o mesmo texto em
  `apps.html` e na prévia de `index.html` — nenhuma divergência.
- **Nenhum outro arquivo tocado**: confirmado por `git status`/`git diff`
  que só `public/apps.html` e `public/index.html` foram modificados nesta
  tarefa — `tokens.css`, `base.css`, `nav.js`, `analytics.js`, `sobre.html`,
  `404.html` inalterados, exatamente como a nota de implementação do
  Executor afirma (confirmado de forma independente, não tomado como base).

**Confirmação de que T6.1/T6.2/T6.3 permanecem inalteradas**: `git diff`
isolado de `public/apps.html`/`public/index.html` mostra apenas as inserções
dos 3 novos cards (mais o ajuste de comentário em `index.html`) — nenhuma
linha dos cards de Curta Mais/Bíblia Fácil/My Money, do rodapé, do CTA do
hero ou de qualquer outro trecho já validado nos vereditos anteriores foi
tocada. Vereditos já registrados de T6.1/T6.2/T6.3 acima (rodapé HTTP real
em produção) seguem válidos sem necessidade de revalidação.

### T6.5 — Renomeação de nome/descrição de 5 dos 6 apps já publicados (Destino Ideal, Minha Jornada, Meu Objetivo, Radar Esportivo, Gestão da Pelada; Evolução Segura inalterado)

**Veredito: Aprovado.**

**Metodologia específica desta tarefa:** mesma metodologia de T6.4 — T6.5
ainda **não foi publicada** no momento desta validação (`git status`
confirma `public/apps.html`/`public/index.html` modificados na working
tree, sem commit) — validada por leitura direta dos 2 arquivos reais em
`public/` e por `git diff` isolado dessas duas mudanças, não pela nota de
implementação do Executor no `TASK.md`.

- **Os 6 pares nome/descrição batem exatamente com o texto aprovado pelo
  usuário, mesma ordem, nas duas páginas**: confirmado por leitura direta de
  `public/apps.html` (linhas 82-134) e `public/index.html` (linhas 105-139).
  Ordem e conteúdo, byte a byte, em ambos os arquivos:
  1. **Destino Ideal** — "Decida para onde ir e organize tudo em um só
     lugar."
  2. **Minha Jornada** — "Leitura bíblica guiada e preparo de estudos, tudo
     em um app."
  3. **Meu Objetivo** — "Defina uma meta, um prazo, e saiba exatamente
     quanto guardar."
  4. **Radar Esportivo** — "Suas notícias esportivas, sempre em dia."
  5. **Gestão da Pelada** — "Tudo sobre o seu grupo de futebol, em um único
     app."
  6. **Evolução Segura** — "Prontuário digital simples, com seus dados
     sempre com você." (mantido sem alteração, confirmado por `git diff`
     — nenhuma linha desse card aparece no diff, nas duas páginas).
  Pontuação/maiúsculas conferidas caractere a caractere contra o texto
  aprovado nesta requisição de validação — nenhuma divergência.
- **`git diff` isolado confirma edição cirúrgica, só texto**: `git diff --
  public/apps.html public/index.html` mostra exatamente 20 linhas alteradas
  em cada arquivo (10 pares `<h2>`/`<h3>` + `<p>`, 2 linhas por par × 5 apps
  renomeados × 2 arquivos) — nenhuma linha de classe/atributo/comentário/
  badge tocada. O comentário de troca futura do badge por link (`apps.html`)
  e o badge `<span class="badge">Em breve</span>` (ambas as páginas)
  permanecem idênticos em todos os 6 cards, incluindo os 5 renomeados.
- **Nenhum nome antigo remanescente**: confirmado por busca em `public/`
  (`Grep`) que "Curta Mais", "Bíblia Fácil", "My Money", "SportsLM" e
  "FutebolApp" não aparecem em nenhum arquivo publicado — só os 3 nomes
  antigos citados em nota de implementação/histórico do `TASK.md` e deste
  `QA-REPORT.md`, fora de `public/`.
- **Nível de heading inalterado**: os 6 cards continuam `<h2
  class="app-card__name">` em `apps.html` (filhos diretos do `<h1>` "Nossos
  apps") e `<h3 class="app-card__name">` em `index.html` (filhos do `<h2
  class="home-apps__title">`) — mesma estrutura já fixada em T4.2/T6.2/T6.4,
  sem nenhum pulo de nível introduzido pela troca de texto (WCAG 2.4.6).
- **Nenhuma quebra de grid/layout esperada**: as novas descrições têm entre
  41 e 63 caracteres, todas mais curtas que a descrição mais longa já
  validada sem overflow em T6.4/T4.2 ("Controle financeiro em família e
  metas claras para conquistar seus objetivos.", 79 caracteres, hoje
  substituída mas que já comprovou a folga do card para texto desse
  tamanho); nenhum nome novo é mais longo que "Evolução Segura"/"Radar
  Esportivo", já dentro do padrão dos nomes existentes. `.grid--3col`
  (`public/assets/css/base.css`) não foi tocado (confirmado por `git diff`
  não tocar em nenhum `.css`) — sem alteração de CSS não há risco de
  regressão de layout por este achado.
- **Nenhuma regressão de contraste/acessibilidade**: `node
  dev/css/a11y-contrast-check.js` reexecutado nesta validação — todas as
  combinações (incluindo o pior caso do mesh gradient e o pior caso composto
  `.glass-card` sobre o mesh gradient) continuam PASS. Coerente com o
  esperado: T6.5 só trocou texto, nenhum token de cor em `tokens.css` foi
  tocado (confirmado por `git status`/`git diff` — `tokens.css` não consta
  entre os arquivos modificados).
- **Nenhum outro arquivo tocado**: confirmado por `git status` que só
  `public/apps.html`, `public/index.html` e `.md/TASK.md` (nota de
  implementação da própria tarefa) foram modificados nesta tarefa —
  `tokens.css`, `base.css`, `components.css`, `nav.js`, `analytics.js`,
  `sobre.html`, `404.html` inalterados.

**Confirmação de que T6.1-T6.4 permanecem inalteradas**: `git diff` isolado
de `public/apps.html`/`public/index.html` mostra apenas a substituição de
texto dos 5 pares nome/descrição — nenhuma linha do rodapé (T6.1), do CTA do
hero (T6.3), do card "Evolução Segura" nem da estrutura/markup introduzida
em T6.4 foi tocada. Vereditos já registrados de T6.1/T6.2/T6.3/T6.4 acima
seguem válidos sem necessidade de revalidação.

### Requisitos não funcionais

- **Contraste WCAG AA — sem regressão:** `node dev/css/a11y-contrast-check.js`
  reexecutado nesta validação — todas as combinações (incluindo o pior caso
  do mesh gradient e o pior caso composto `.glass-card` sobre o mesh
  gradient, já testados nos Lotes 3/4) continuam PASS. Coerente com o
  esperado: T6.1/T6.2 só trocaram texto/URL, nenhum token de cor foi tocado.
- **`alt`/`aria-hidden` dos ícones — sem regressão:** os SVGs decorativos do
  rodapé (`.footer-link__icon`, incluindo o ícone de "nova aba" do link de
  LinkedIn) continuam `aria-hidden="true"` nas 4 páginas reais; nenhum ícone
  passou a ser o único conteúdo de um link (o texto "(abre em nova aba)"
  visível, já validado em T2.3, continua presente ao lado do link de
  LinkedIn nas 4 páginas + Home).
- **Estrutura de heading — sem regressão:** exatamente 1 `<h1>` real por
  página (confirmado excluindo ocorrências de `<h1` dentro de comentários
  HTML) nas páginas afetadas por este lote (`index.html`, `apps.html`);
  hierarquia `h1`→`h2`/`h3` dos cards de app preservada conforme já
  corrigido em T4.2 (ver T6.2 acima).
- **Contrato de analytics (T2.4) — sem regressão:** `data-analytics-event`
  presente e correto em todos os pontos de contato (e-mail e LinkedIn) nas 4
  páginas + Home, mesmo com a reescrita de `href` do e-mail pela Cloudflare
  (ver T6.1) — nenhum clique deixou de ser instrumentável pela substituição
  de conteúdo.

### Achados deste lote

Nenhum achado **Crítico** nem **Simples** identificado em T6.1, T6.2, T6.3,
T6.4 ou T6.5 nesta validação (T6.5 avaliada nesta atualização do relatório).
O
comportamento de ofuscação de e-mail da Cloudflare, investigado em
profundidade em T6.1 por ser uma diferença observável entre o HTML servido
em produção e o HTML versionado no repositório, **não é um achado novo** —
já está registrado e decidido em `.md/DEPLOY.md`/`.md/CTO-REVIEW.md` como
decisão de produto do usuário, sem débito pendente; citado aqui apenas para
registrar que a validação funcional real o confirmou como correto e
não-regressivo.

## Fechamento Estrutural do Lote 6

- T6.1 (e-mail `Concluída`, LinkedIn `Provisória` por decisão de negócio já
  registrada — tratada como fechada para fins de fluxo, não uma pendência
  de implementação), T6.2, T6.3, T6.4, **T6.5 (adicionada nesta
  atualização)**: todas aprovadas pelo chapéu QA, sem achado.
- Dependências da Seção 4 do `TASK.md` relativas ao Lote 6 (T3.1-T3.6 →
  T6.1; T3.2/T3.4 → T6.2; T3.1 → T6.3; T3.4 → T6.4; T6.2/T6.4 → T6.5):
  estruturalmente coerentes — confirmado que as 5 tarefas de fato operam
  sobre artefatos do Lote 3 (e, no caso de T6.5, também do próprio Lote 6)
  já `Concluída`/aprovados, sem exigir nenhuma dependência não declarada.
  Nenhuma dependência órfã. **Achado de documentação corrigido nesta
  checagem** (não é um achado de QA sobre código, é uma inconsistência de
  registro, mesma natureza do já corrigido para T6.4 na validação
  anterior): a "Tabela de paralelismo por lote" (Seção 4 do `TASK.md`, linha
  do Lote 6) ainda listava "T6.1, T6.2, T6.3, T6.4" como o conjunto
  paralelizável, sem citar a dependência de T6.5 em relação a T6.2/T6.4 (a
  própria Seção 3 já documentava essa dependência corretamente, e T6.5 de
  fato não roda em paralelo com T6.2/T6.4 — mesmos arquivos/cards) —
  corrigida diretamente pelo Validador, coluna de dependência direta da
  linha do Lote 6 passa a citar "T6.5 depende de T6.2 e T6.4 (mesmos 6
  cards)". Correção de rotina, não exige redesenho — não escala ao
  `coordenador`.
- Nenhuma tarefa `Bloqueada` sem resolução.
- Nenhum achado simples/débito novo deste lote (incluindo T6.5) — não há
  nova entrada a criar em nenhuma `Refatoração Lote-X`. A ressalva de
  negócio de T6.1 (LinkedIn provisório) já está documentada no próprio
  `TASK.md`, não duplicada aqui, e não é um débito técnico.
- Nada nesta checagem exige redesenho de dependência/decomposição — não
  escala ao `coordenador`.

**Veredito geral do Lote 6: Aprovado, sem ressalvas técnicas** (a única
ressalva do lote é de negócio — LinkedIn provisório, já registrada e aceita
pelo próprio stakeholder no `TASK.md`, não é um achado de QA). T6.1/T6.2/
T6.3 confirmadas por requisição HTTP real contra a produção
(`https://ljssoftware.com.br`), incluindo verificação cruzada de
`target="_blank"`/`rel="noopener"`, atributos de analytics, estrutura de
card/badge, e ausência de regressão de contraste/acessibilidade; T6.4 e
T6.5 confirmadas por leitura direta dos arquivos reais em `public/` e `git
diff` isolado (ambas ainda não publicadas no momento desta validação). O
lote está estruturalmente fechado e liberado para a auditoria de segurança
do chapéu DevSecOps sobre T6.4/T6.5 especificamente (T6.1-T6.3 já
auditadas) e, em paralelo, para o chapéu DevOps considerar este build no
fluxo de dupla aprovação rumo à confirmação final do deploy.

---

## Lote 7 — Botão "Saiba mais" + Modal nos Cards de App

**Escopo validado:** T7.1, único item do lote, `Concluída` no `TASK.md` no
momento desta validação. Ainda não commitada — confirmado via `git status`
(`public/apps.html`, `public/assets/css/components.css`,
`public/index.html` modificados; `public/assets/js/app-modal.js` novo,
untracked).

**Metodologia:** leitura direta de `public/apps.html`, `public/index.html`,
`public/assets/css/components.css` e `public/assets/js/app-modal.js`
(arquivo completo), mais `git diff`/`git status` isolado — a nota de
implementação do Executor no `TASK.md` foi usada só como ponto de partida
de onde olhar, nunca como base de aprovação. Reexecutado `node --check
public/assets/js/app-modal.js` e `node dev/css/a11y-contrast-check.js`.

### T7.1 — Botão "Saiba mais" + Modal

**Veredito: Aprovado.**

- **6 botões `.app-card__more` nas 2 páginas — PASS.** `apps.html` e
  `index.html` têm, cada uma, 6 botões com `data-app-name`/
  `data-app-summary`; comparação byte a byte dos 6 pares de atributos entre
  as duas páginas (via `git diff`) confirma texto **idêntico** (Destino
  Ideal, Minha Jornada, Meu Objetivo, Radar Esportivo, Gestão da Pelada,
  Evolução Segura) — mesmo padrão RT-02 já aplicado ao conteúdo comercial em
  T6.2/T6.4/T6.5. `data-app-name` bate com o `<h2>`/`<h3
  class="app-card__name">` do próprio card em todos os 6 casos; `data-app-
  summary` é uma expansão comercial coerente da `<p class="app-card__
  description">` correspondente (mesmo produto, mesmo tom), sem
  contradição de conteúdo.
- **Modal único por página — PASS.** `#app-modal` aparece exatamente 1 vez
  em cada uma de `apps.html`/`index.html` (confirmado por contagem),
  `hidden` no HTML estático (estado inicial fechado). Estrutura conforme:
  `role="dialog"`, `aria-modal="true"`, `aria-labelledby="app-modal-title"`
  no `.app-modal__dialog`; `<h2 id="app-modal-title">` casa exatamente com
  o `aria-labelledby`; botão de fechar com `aria-label="Fechar"` e
  `data-app-modal-close`; overlay também com `data-app-modal-close`.
- **`node --check public/assets/js/app-modal.js` — PASS**, sem erro de
  sintaxe (reexecutado nesta validação).
- **Lógica de acessibilidade do JS — PASS, lida linha a linha:**
  `openModal(trigger)` guarda `lastFocused = trigger`, aplica `inert` em
  todo `child` de `document.body` exceto o próprio `modal` (via
  `document.body.children`, condição `child !== modal &&
  !child.hasAttribute('inert')`), depois `modal.hidden = false` e foco
  programático em `.app-modal__close`. `closeModal()` reverte `modal.hidden
  = true`, remove `inert` de todos os `inertSiblings` guardados, devolve
  foco a `lastFocused` (o botão que abriu) e limpa `lastFocused = null` —
  sem vazamento de referência entre aberturas. Fecha via clique no overlay,
  no botão de fechar (ambos com `data-app-modal-close`, mesmo handler) e via
  `Escape` (checado com `isOpen()` antes de agir, sem interferir quando o
  modal já está fechado). Como o `modal` em si nunca recebe `inert`, e
  título/texto não são focáveis, o único elemento tabulável dentro do modal
  é o botão de fechar — não é necessário um "focus trap" manual, coerente
  com a decisão documentada no cabeçalho do arquivo e com a mesma técnica já
  aprovada em `nav.js` (T2.2, achado Crítico #1 daquele lote, hoje
  corrigido). Nenhum "vazamento" de foco identificado nesta leitura.
- **`.app-card__footer` e grid — PASS.** `display:flex; align-items:center;
  gap:.75rem; flex-wrap:wrap` agrupa badge + botão sem alterar `.grid.grid--
  3col` (não tocado, confirmado por `git diff` isolado da seção "App Card —
  botão 'Saiba mais' + Modal (T7.1)", que é inteiramente aditiva a partir da
  linha 817 de `components.css`, depois do fechamento do bloco anterior).
  Nenhum token novo declarado: leitura completa da seção nova confirma uso
  exclusivo de `--color-accent`, `--color-bg`, `--glass-bg`, `--glass-
  border`, `--glass-blur`, `--glass-radius`, `--color-text-inverse`,
  `--color-text-inverse-secondary`, `--font-body`, `--font-heading` — todos
  já existentes em `tokens.css` desde T1.1/T1.2.
- **`node dev/css/a11y-contrast-check.js` — PASS, sem regressão.**
  Reexecutado nesta validação: as 24 combinações do script (tabela de
  tokens, componentes dos Lotes 2/3, pior caso do mesh gradient, pior caso
  composto `.glass-card` sobre o mesh gradient) continuam todas PASS —
  esperado, já que T7.1 não toca em nenhum token. **Achado de cobertura,
  não bloqueante:** o script não cobre as 2 combinações novas introduzidas
  por T7.1 (`--color-accent` sobre o fundo do botão/`.glass-card`;
  `--color-text-inverse[-secondary]` sobre o diálogo do modal). O
  comentário no CSS afirma que são "pares idênticos" aos já validados em
  `tokens.css` — **isso é uma aproximação, não é exato**: recalculei à mão
  (mesma fórmula de luminância relativa do script) `--color-accent`
  (`#7FE3D2`) sobre a cor composta real de `.glass-card` sobre `--color-bg`
  (`#1F3654`, já calculada pelo próprio script na Seção 4) e obtive
  **8.06:1** — diferente do 10.13:1 citado (que é o par sobre `--color-bg`
  sólido, não sobre o composto translúcido), mas **ainda PASS com folga
  larga** sobre o mínimo AA de texto normal (4.5:1, já que o texto do botão
  tem 0.85rem, abaixo do limiar de "texto grande"). O texto/título do modal
  reaproveita exatamente os mesmos pares já testados na Seção 4 do script
  para `.glass-card` sobre `--color-bg` sólido (11.04:1/7.90:1) — o modal
  não fica sobre o mesh gradient em nenhuma das 2 páginas (a seção
  `.home-apps` de `index.html` e a seção de vitrine de `apps.html` não têm
  mesh gradient, só o `.hero` de `index.html` tem — confirmado por leitura
  do HTML), então nem o pior caso do script se aplica aqui; a combinação
  real é ainda mais folgada que a testada. **Classificação: não é um
  achado** (nenhuma combinação falha, a imprecisão é só no texto do
  comentário do CSS, que descreve o par errado como "idêntico" em vez de
  "equivalente/mais folgado") — mas fica registrado como nota de
  documentação a corrigir, ver Fechamento Estrutural abaixo.
- **Nenhuma regressão nos 6 cards/badges existentes — PASS.** `git diff` de
  `apps.html`/`index.html` mostra que a única mudança em cada card é a
  substituição de `<span class="badge">Em breve</span>` solto por
  `<div class="app-card__footer">` envolvendo o mesmo `<span class="badge">`
  (texto/atributos do badge inalterados) + o novo botão; `<h2>`/`<h3
  class="app-card__name">` e `<p class="app-card__description">` de todos
  os 6 cards, nas 2 páginas, **não foram tocados** (confirmado linha a
  linha no diff).
- **Nenhum arquivo fora do escopo tocado — PASS.** `git status` confirma
  que só `public/apps.html`, `public/assets/css/components.css`,
  `public/index.html` (modificados) e `public/assets/js/app-modal.js`
  (novo) fazem parte desta tarefa; `tokens.css`, `base.css`, `nav.js`,
  `analytics.js`, `sobre.html`, `404.html`, `_headers` permanecem
  inalterados. (`.md/CTO-REVIEW.md` também aparece modificado no `git
  status`, mas é resíduo do registro de fechamento do Gate 4 do Lote 6, já
  commitado em contexto anterior a este lote — não faz parte do diff de
  T7.1, confirmado por leitura do próprio conteúdo alterado.)

### Testes de integração cross-platform

`apps.html` e `index.html` compartilham o mesmo `components.css`/`app-
modal.js` — comportamento validado uma vez por página (ambas com marcação
idêntica de modal e mesmos 6 conjuntos de atributos), sem necessidade de
teste adicional de contrato entre chapéis (não há API envolvida nesta
tarefa).

### Requisitos não funcionais

- Contraste WCAG AA: PASS, ver achado de cobertura de script acima (não
  bloqueante).
- `prefers-reduced-motion: reduce`: nenhuma transição própria declarada no
  componente novo (confirmado por leitura da seção CSS), coberto pela regra
  global de `base.css` por definição (nada a neutralizar).
- Nenhum `outline: none` sem substituto: confirmado por leitura completa da
  seção nova — nenhuma ocorrência.

### Achados deste lote (resumo)

| # | Tarefa | Achado | Classificação | Ação |
|---|---|---|---|---|
| 1 | T7.1 | Comentário de contraste no CSS descreve o par `--color-accent` sobre o fundo do botão como "idêntico" ao par já validado sobre `--color-bg` sólido; na prática é um par diferente (`--color-accent` sobre o composto `.glass-card`), com contraste real 8.06:1 — ainda PASS com folga, não é uma falha de contraste, só uma imprecisão de documentação | **Simples** | Tarefa criada em `Refatoração Lote-7`; T7.1 permanece `Concluída` |
| 2 | T7.1 (estrutural) | Diagrama mermaid da Seção 4 do `TASK.md` não inclui nenhum nó para o Lote 7/T7.1 (lote novo, fora do ciclo formal de reabertura) — texto de dependências abaixo da tabela já documenta a dependência corretamente, só o diagrama visual está incompleto | **Simples** | Tarefa criada em `Refatoração Lote-7`; não é dependência órfã/inconsistente, é lacuna de diagrama |

Nenhum achado **Crítico** neste lote.

## Fechamento Estrutural do Lote 7

- T7.1 (única tarefa do lote): `Concluída` no `TASK.md`, aprovada pelo
  chapéu QA nesta validação.
- Dependências da Seção 4 do `TASK.md` relativas ao Lote 7: o texto
  "Dependências do Lote 7" (T7.1 depende de T3.4/T3.2 e do conteúdo
  pós-T6.5) está correto e coerente com os artefatos reais — os 6 cards e
  seus nomes/descrições de fato vêm de T3.4 (`apps.html`)/T3.2 (`index.html`)
  já ajustados pelo Lote 6. O diagrama mermaid da Seção 4 não tem nó para o
  Lote 7 (achado #2 acima) — não é uma dependência órfã/inconsistente
  (nenhuma seta aponta para um nó inexistente), é só ausência de um nó
  novo; correção de rotina, não exige redesenho de dependência/decomposição
  — não escala ao `coordenador`.
- Nenhuma tarefa `Bloqueada` sem resolução.
- 2 achados Simples deste lote viram tarefas em `Refatoração Lote-7`:

  **Refatoração Lote-7**
  | ID | Tarefa | Origem | Prazo sugerido |
  |---|---|---|---|
  | RL7.1 | Corrigir o comentário de verificação de contraste em `assets/css/components.css` (seção "App Card — botão 'Saiba mais' + Modal (T7.1)"): o par `--color-accent` sobre o fundo do botão não é idêntico ao par `--color-accent`/`--color-bg` sólido (10.13:1) — é `--color-accent` sobre o composto `.glass-card` (8.06:1, ainda PASS AA). Atualizar o texto do comentário para refletir o par real | QA-REPORT.md, T7.1 | Baixo esforço; antes do próximo lote que tocar este CSS, não bloqueia deploy |
  | RL7.2 | Adicionar o nó do Lote 7/T7.1 ao diagrama mermaid da Seção 4 do `TASK.md`, refletindo a dependência já documentada em texto (T3.4/T3.2 → T7.1) | QA-REPORT.md, T7.1 | Baixo esforço; próxima revisão do `TASK.md` |

  Nenhuma das 2 tarefas exige redesenho de dependência/decomposição — não
  escala ao `coordenador`.

**Veredito geral do Lote 7: Aprovado com ressalvas** (2 achados Simples, de
documentação, registrados em `Refatoração Lote-7`, sem impacto no critério
de aceite central da tarefa nem em nenhuma combinação de contraste real).
O lote está liberado para a auditoria de segurança do chapéu DevSecOps.

---

## Lote 8 — Fundação de Componentes da Página de Produto (Evolução Segura, Rodada 3)

**Escopo validado:** T8.1, T8.2, T8.3, todas com Status `Concluída` no
`TASK.md` no momento desta validação. Nenhuma das 3 tarefas foi commitada
ainda — confirmado via `git status` (`public/assets/css/tokens.css` e
`public/assets/css/components.css` modificados; nenhum outro arquivo
tocado nesta rodada).

**Natureza do lote:** os 3 componentes são CSS puro (tokens + blocos de
referência), sem tela renderizada — `evolucao-segura.html` (Lote 9) ainda
não existe. O critério de aceite de cada tarefa é sobre a
existência/estrutura/responsividade/contraste do CSS em si, não sobre uma
página montada — validado exatamente nesses termos, sem antecipar
julgamento sobre o Lote 9.

**Metodologia:** leitura completa do `git diff` de `public/assets/css/
tokens.css` e `public/assets/css/components.css` (não a nota de
implementação do Executor no `TASK.md` como base de aprovação, usada só
como ponto de partida de onde olhar), comparação linha a linha contra
`UX-SPEC.md` Seção 3.1 (tokens/paleta), Seção 3.2 (tabela de componentes
novos da Rodada 3) e Seção 6 (responsivo), e reexecução de
`node dev/css/a11y-contrast-check.js` (script já existente, reaproveitado
pelas 3 tarefas conforme documentado — reexecutado de forma independente
por este Validador, não aceito do relato do Executor).

### T8.1 — Tokens de "aviso"

**Veredito: Aprovado.**

- Os 3 tokens (`--color-notice-bg`, `--color-notice-border`,
  `--color-notice-icon`) estão declarados no bloco `:root` de
  `tokens.css`, com os valores exatos da tabela de paleta do `UX-SPEC.md`
  Seção 3.1 (`rgba(255, 209, 102, 0.10)` / `rgba(255, 209, 102, 0.35)` /
  `#FFD166`) — confirmado por leitura direta.
- **Aditivo, confirmado:** `git diff` mostra só acréscimo de comentário +
  3 linhas de token no bloco `:root`; nenhum token pré-existente teve seu
  valor alterado (`--color-accent` e os demais 13 tokens de T1.1
  permanecem byte-idênticos).
- **Contraste crítico de UI reexecutado por este Validador:**
  `--color-notice-icon` (#FFD166) sobre `--color-bg` (#0B2545) →
  **10.67:1** (mínimo exigido para UI/ícone, 3:1) — PASS com folga larga,
  confere exatamente com o valor documentado no comentário de `tokens.css`
  e com o relatado pelo Executor.
- `--color-notice-bg`/`--color-notice-border` são corretamente tratados
  como decorativos (fundo/borda translúcidos do `.notice`), fora do
  crítico de contraste texto/UI — avaliação aceita, o texto do `.notice`
  de fato reaproveita `--color-text-inverse` (T8.3), já validado sobre
  `--color-bg` sólido.
- Família de cor "aviso" isolada de `--color-accent`, decisão já registrada
  no `UX-SPEC.md` (teal = "positivo/destaque", âmbar = "atenção") —
  coerente, nenhuma redefinição de significado de token existente.

### T8.2 — Componentes de prova visual

**Veredito: Aprovado com ressalva (achado Simples registrado).**

- 4 componentes confirmados em `components.css`, seção própria e
  aditiva a partir do final do arquivo: `.hero--product` (grid 1 coluna →
  2 colunas `1.05fr 0.95fr` a partir de `min-width: 900px`, alinhamento à
  esquerda sobrescrevendo o centralizado herdado de `.hero`), `.shot` (2
  estados por composição de classe — `.shot__frame` tracejado com
  `role="img"`/`aria-label` para "a capturar", `.shot__img` direto +
  `.shot__tag--ready` para "capturado" — nunca imagem quebrada/espaço em
  branco, conforme `UX-SPEC.md` Seção 4), `.problem-card`/`.pillar`
  (variantes de conteúdo de `.glass-card`, sem token novo, herdam o
  fallback `@supports not (backdrop-filter)` por composição de classe,
  confirmado por não haver nenhuma redeclaração do fallback nesta seção),
  `.feature`/`.feature--reverse` (grid 2 colunas a partir de 900px,
  decisão de detalhe documentada — mesmo breakpoint do hero, desvio
  pequeno e justificado da redação mais genérica "a partir de Tablet" da
  Seção 6, aceito pelo mesmo raciocínio já usado em outras decisões de
  detalhe deste projeto).
- Bloco de referência HTML de `.hero--product` já indica
  `<button type="button" ... disabled aria-disabled="true">` para o CTA
  "Baixar para Windows" — elemento semântico correto para o estado
  "Indisponível para download nesta fase" (`UX-SPEC.md` Seção 4),
  corretamente sinalizado como fora do escopo desta tarefa (estilo visual
  do estado disabled é T9.1/T9.6).
- Nenhum token novo declarado nesta seção (confirmado por leitura
  completa) — reaproveita só tokens já existentes de `tokens.css`/T1.1.
- **Achado Simples (novo, identificado por este Validador):** o comentário
  de verificação de contraste desta seção afirma que
  `.hero__facts`/`.hero__cta-note` (`--color-text-inverse-secondary` sobre
  o mesh gradient do `.hero`) é "o mesmo par revalidado em T4.2... **4.65
  :1** no pior caso composto". Reexecutando
  `node dev/css/a11y-contrast-check.js` nesta validação, o valor real do
  pior caso composto (`--color-text-inverse-secondary` sobre `.glass-card`
  sobre o pior blob do mesh gradient) é **4.82:1**, não 4.65:1 — o número
  4.65:1 é um valor desatualizado, já citado originalmente no comentário
  de T3.1 (`.hero`) antes da correção de opacidade aplicada em T4.2 (que
  elevou o valor real para 4.82:1, conforme já registrado neste mesmo
  `QA-REPORT.md`, seção "T4.2 — Auditoria e ajuste de acessibilidade WCAG
  AA"), e agora repetido sem atualização no novo comentário de T8.2.
  **Não é uma falha de contraste real** — 4.82:1 ainda passa com folga
  acima do mínimo AA (4.5:1), e o componente `.hero__facts`/`.hero__cta-
  note` de fato reaplica o mesmo par já validado, sem introduzir
  composição nova; o único problema é o comentário citar o número antigo,
  já sinalizado como impreciso desde o Lote 4 mas nunca corrigido no
  CSS-fonte de onde T8.2 copiou a citação. **Classificação: Simples** —
  divergência de documentação, não de comportamento real, não compromete
  o critério de aceite central da tarefa (verificação de contraste existir
  e passar) nem bloqueia outra tarefa do lote. Tarefa criada em
  `Refatoração Lote-8` (ver Fechamento Estrutural abaixo); T8.2
  **permanece `Concluída`**.
- Verificação de contraste (demais pares da seção): reconfirmados por
  script — `.shot__tag`/`.pillar__num` (10.13:1), `.shot__tag--ready`
  (13.91:1 via par simétrico), `.shot__screen`/`.problem-card__title`/
  `.pillar__title`/`.feature__title` (13.91:1), `.shot__hint`/
  `.shot__caption`/`.problem-card__text`/`.pillar__text`/`.feature__text`
  (9.96:1 sobre `--color-bg` sólido, confirmado que essas seções não têm
  mesh gradient próprio — mesmo raciocínio já aceito em T3.2 para "Home —
  Seções Apps/Sobre"), `.shot__privacy`/`.hero__eyebrow` (10.13:1) — todos
  PASS, nenhuma outra imprecisão de documentação encontrada.

### T8.3 — Componentes informativos

**Veredito: Aprovado.**

- 4 componentes confirmados em `components.css`, seção própria e aditiva
  (nenhuma regra de T8.2/anteriores tocada, confirmado por `git diff`
  isolado da seção): `.steps` (`<ol>` semântico esperado no HTML
  consumidor, numeração 100% via `counter-reset`/`counter-increment`/
  `content: counter(steps)` em `.steps__num::before`, puramente decorativa
  — a ordem real fica garantida pelo `<ol>` nativo mesmo que o `::before`
  falhe), `.notice` (reaproveita os 3 tokens de T8.1, nenhum valor
  `rgba`/hex fixo repetido — confirmado por leitura completa da seção,
  `--color-notice-bg`/`-border`/`-icon` são as únicas cores não-token
  usadas), `.specs` (`<table>`/`<caption>`/`scope="row"` esperados no
  bloco de referência; `@media (max-width: 767.98px)` empilha `th`/`td`
  como `display: block`, sem nenhuma regra de `overflow-x`/rolagem
  horizontal introduzida — critério de aceite "sem `<table>` com rolagem
  horizontal" satisfeito por não introduzir rolagem, não por escondê-la),
  `.faq` (`<details>`/`<summary>` nativos no bloco de referência,
  indicador `::after` "+"/"–" reagindo a `[open]` via CSS puro, **zero**
  `<script>`/JS novo introduzido — confirmado por `grep` de `<script`/
  `on\w+=` em toda a seção: nenhuma ocorrência, G-01 respeitado).
- Breakpoint de `.specs` é **767.98px**, não os 480px do mockup de
  conceito — confirmado que bate exatamente com o critério de aceite do
  `TASK.md` ("abaixo de 768px") e com o mesmo valor já usado em todo o
  resto do projeto (T2.2, menu mobile) — decisão de divergir do mockup
  aceita e correta.
- Verificação de contraste reexecutada: `.steps__title`/`.notice__title`/
  `.specs th`/`.faq__q` (`--color-text-inverse` sobre `--color-bg` por
  trás do `.glass-card` translúcido, 13.91:1 — mesmo par já validado em
  T1.1, aplicado sobre um fundo quase transparente, sem impacto
  perceptível, mesmo raciocínio já aceito para `.app-card` em T3.4),
  `.steps__text`/`.notice__text`/`.specs td`/`.faq__a`
  (`--color-text-inverse-secondary`, 9.96:1), `.notice__icon`
  (`--color-notice-icon`, 10.67:1, mesmo valor de T8.1), `.faq__q::after`
  (`--color-accent`, 10.13:1) — todos PASS, e nesta seção (diferente de
  T8.2) o comentário de contraste **não** repete nenhum número
  desatualizado — todos os valores citados batem com o resultado real do
  script.
- `.notice__path` (fundo `rgba(0,0,0,0.28)` mais escuro que `--color-bg`
  sólido) — raciocínio "estritamente mais escuro, logo o contraste só
  aumenta em relação ao par já verificado" confirmado matematicamente
  (adicionar uma camada preta translúcida sobre um fundo já escuro só
  reduz a luminância do fundo, nunca aumenta, o que só favorece o
  contraste de um texto claro por cima) — aceito.

### Testes de integração cross-platform

**N/A para este lote**, mesmo raciocínio já usado no Lote 1: nenhuma
página HTML final foi montada ainda (Lote 9, ainda pendente) — não há
contrato de API nem integração entre chapéis de implementação a testar
neste momento. Os blocos de referência HTML documentados em comentário
(não implementados como markup real) foram lidos e conferem com as
classes/estrutura declaradas no CSS, mas a integração real só será
testável quando `evolucao-segura.html` existir.

### Requisitos não funcionais

- Contraste WCAG AA: `node dev/css/a11y-contrast-check.js` reexecutado —
  **todas as combinações PASS** (ver detalhe por tarefa acima; 1 achado
  de documentação em T8.2, sem falha real).
- Responsividade: `.hero--product`/`.feature` colapsam para 1 coluna
  abaixo de 900px (confirmado por leitura da media query); `.specs`
  empilha abaixo de 767.98px sem rolagem horizontal (confirmado); nenhuma
  outra media query nova introduzida além dessas 2 (mesmo breakpoint
  reaproveitado pelos 2 componentes de T8.2).
- `prefers-reduced-motion: reduce`: nenhuma transição/animação declarada
  em nenhum dos 8 componentes novos (T8.1 é só token, T8.2/T8.3 não
  declaram `transition`) — nada a neutralizar, confirmado por leitura
  completa das 2 seções novas.
- G-01 (zero framework/build/toolchain): confirmado por `git status` —
  nenhum `package.json`/lockfile/dependência nova introduzida; os 2
  arquivos tocados são CSS puro.

### Achados deste lote (resumo)

| # | Tarefa | Achado | Classificação | Ação |
|---|---|---|---|---|
| 1 | T8.2 | Comentário de verificação de contraste cita `--color-text-inverse-secondary` sobre o pior caso composto do mesh gradient como "4.65:1", valor desatualizado de antes da correção de T4.2 — o valor real medido pelo script é 4.82:1 (ainda PASS, com mais folga que o citado) | **Simples** | Tarefa criada em `Refatoração Lote-8`; T8.2 permanece `Concluída` |

Nenhum achado **Crítico** neste lote.

## Fechamento Estrutural do Lote 8

- T8.1, T8.2, T8.3: todas `Concluída` no `TASK.md`, todas aprovadas pelo
  chapéu QA nesta validação (T8.2 com 1 ressalva de documentação, sem
  impacto no critério de aceite central).
- Dependências da Seção 4 do `TASK.md` relativas ao Lote 8 ("T8.1 não
  depende de nada... T8.2 e T8.3 dependem de T8.1") estruturalmente
  coerentes com os artefatos reais: T8.2/T8.3 de fato só consomem os 3
  tokens de T8.1 (`--color-notice-*`) via `.notice` (T8.3) — `.hero--
  product`/`.shot`/`.problem-card`/`.pillar`/`.feature` (T8.2) não usam
  nenhum dos 3 tokens novos, confirmado por leitura completa da seção
  (comentário do próprio T8.2 já registra essa não-dependência
  explicitamente). Diagrama mermaid da Seção 4 (subgraph "Lote 8 -
  Componentes pagina produto", nós `T81`/`T82`/`T83`) já existe e está
  coerente com o texto — nenhuma dependência órfã/inconsistente.
- Nenhuma tarefa `Bloqueada` sem resolução.
- 1 achado Simples deste lote vira tarefa em `Refatoração Lote-8`:

  **Refatoração Lote-8**
  | ID | Tarefa | Origem | Prazo sugerido |
  |---|---|---|---|
  | RL8.1 | Corrigir o comentário de verificação de contraste em `assets/css/components.css` (seção "Evolução Segura — Prova visual... (T8.2)"): `.hero__facts`/`.hero__cta-note` sobre o pior caso composto do mesh gradient mede 4.82:1 (script `a11y-contrast-check.js`), não 4.65:1 como citado — atualizar também a referência equivalente já existente na seção "Hero (T3.1)", se ainda não corrigida | QA-REPORT.md, T8.2 | Baixo esforço; antes do próximo lote que tocar este CSS, não bloqueia deploy |

  Esta tarefa não exige redesenho de dependência/decomposição — não
  escala ao `coordenador`.

**Veredito geral do Lote 8: Aprovado com ressalvas** (1 achado Simples, de
documentação, registrado em `Refatoração Lote-8`, sem impacto em critério
de aceite/contraste real de nenhuma das 3 tarefas). O lote está liberado
para a auditoria de segurança do chapéu DevSecOps.

---

## Lote 9 — Página `evolucao-segura.html` (Rodada 3)

**Contexto de execução relevante para esta validação:** as 6 tarefas
(T9.1-T9.6) foram implementadas por 6 instâncias diferentes do Executor
editando o mesmo arquivo `public/evolucao-segura.html` em paralelo (T9.1
primeiro/sozinha, criando o arquivo e os marcadores de continuação; depois
T9.2/T9.3/T9.4/T9.5/T9.6 em paralelo). Houve um incidente de concorrência
real durante essa rodada: a instância de T9.2 duplicou por engano o
comentário-marcador `<!-- T9.3 adiciona aqui -->`, o que fez a instância de
T9.3 preencher o marcador deslocado, invertendo a ordem das Seções 4 e 5. A
própria instância de T9.2 detectou isso (rodando seu teste automatizado
`dev/html/evolucao-segura.t9-2.check.js`) e corrigiu, reordenando sem
alterar o conteúdo de T9.3 — documentado na nota de Status de T9.2 no
`TASK.md`. **Este chapéu não aceitou essa correção como dada** — a
integridade estrutural do arquivo foi reauditada de forma independente
abaixo (item 1), sem se apoiar na nota de implementação do Executor nem na
verificação prévia do orquestrador.

### 1. Integridade estrutural do arquivo (reauditoria independente)

- **Ordem das 10 `<section>`:** confirmada por leitura completa e sequencial
  do arquivo (`public/evolucao-segura.html`) — 1 Hero, 2 O problema, 3
  Proposta de valor, 4 Por dentro (`id="por-dentro"`), 5 Conformidade
  (`id="cfp-titulo"`), 6 Instalação (`id="instalacao"`), 7 Licença
  (`id="licenca"`), 8 Requisitos (`id="requisitos"`), 9 Dúvidas
  (`aria-labelledby="faq-titulo"`), 10 CTA final (`id="baixar"`) — ordem
  bate exatamente com o Fluxo 3 do `UX-SPEC.md`. A inversão do incidente
  (Seção 5 antes da Seção 4) **não está presente** no arquivo publicado.
- **Balanceamento de tags** (contagem de abertura vs. fechamento por
  `grep -c`, confirmado nesta validação, não reaproveitado de nenhuma
  verificação anterior): `<section` 10 / `</section>` 10; `<main` 1 /
  `</main>` 1; `<header` 1 / `</header>` 1; `<footer` 1 / `</footer>` 1;
  `<html` 1 / `</html>` 1; `<body` 1 / `</body>` 1 — todos 1:1 ou N:N.
- **IDs duplicados:** nenhum — todo `id="..."` do documento (16 no total,
  incl. `id="main"`, `id="site-header-nav"`, os 8 `id` de heading/seção e
  os 4 `id` de âncora) aparece exatamente 1 vez (`grep`/`sort`/`uniq -c`).
- **Marcadores de continuação `<!-- T9.X adiciona aqui -->`:** nenhum
  restante no arquivo — todos os 5 (T9.2-T9.6) foram substituídos pelo
  conteúdo real, confirmado por busca direta.
- **Conclusão deste item:** a verificação independente do orquestrador
  está correta. O incidente de concorrência foi de fato detectado e
  corrigido dentro da própria rodada, sem deixar resíduo estrutural.

### 2. Reconciliação dos 5 checkers automatizados (`dev/html/evolucao-segura.t9-{1,2,3,5,6}.check.js`)

Rodados nesta validação (`node dev/html/evolucao-segura.t9-N.check.js`),
não só lidos do relato do Executor:

| Checker | Resultado | Observação |
|---|---|---|
| `t9-1.check.js` | 22 PASS, **1 FAIL** | FAIL esperado/único: "comentários de continuação para T9.2-T9.6 presentes" — o teste de T9.1 ainda procura pelos 5 marcadores `<!-- T9.X adiciona aqui -->`, que foram legitimamente substituídos pelo conteúdo real das sub-tarefas seguintes. Confirmado que é **exatamente essa e só essa** falha (staleness de teste, não bug real) — nenhuma das outras 22 asserções (documento, header/`aria-current`, hero/S1, CTAs, `.problem-card`) falhou |
| `t9-2.check.js` | 17/17 PASS | Inclui a asserção "Seção 5 vem depois da Seção 4 ('Por dentro')" — **PASSA**. Nota de T9.6 no `TASK.md` ("o teste de T9.2 espera a Seção 5 logo após a Seção 3... não corrigido") está **desatualizada**: a própria correção de ordenação de T9.2 já havia atualizado este teste para refletir a ordem correta antes de T9.6 ser escrita; não há falha real remanescente aqui — achado de documentação, não de comportamento (ver Achados abaixo) |
| `t9-3.check.js` | 32/32 PASS | Âncora `#por-dentro`, 4 `.feature` com 2+ `.feature--reverse`, 6 pares webp/PNG reais em disco, `alt` não vazio, legendas de privacidade |
| `t9-5.check.js` | 24/24 PASS | Ausência de `<input>`/`<form>`/`.steps`/menção a "chave"/"contra-chave" na seção de licença; `.specs` completo |
| `t9-6.check.js` | 18/18 PASS | FAQ com 5 perguntas, CTA final sem `href` de `.exe`/GitHub/`#`, rodapé byte-idêntico a `apps.html` |
| (T9.4 sem checker) | N/A | Esperado — T9.4 não alterou CSS nem introduziu combinação de cor nova (nota da própria tarefa: "contraste não revalidado por não haver alteração de CSS"); a Seção 6 (Instalação) foi coberta por leitura direta neste chapéu (item 4 abaixo) |

### 3. Os 2 CTAs de download — confirmação independente de "sem nenhuma ação"

Busca própria no arquivo (`public/evolucao-segura.html`), não apoiada nos
testes dos Executores:

- **Hero (T9.1), linha 107:** `<button type="button" class="hero__cta hero__cta--primary" disabled aria-disabled="true">Baixar para Windows</button>` — elemento `<button>`, não `<a>`; `disabled` presente; `aria-disabled="true"` presente; nenhum `href`. Nota textual visível na linha seguinte: `<p class="hero__cta-note">Download ainda não disponível nesta fase.</p>`.
- **CTA final (T9.6), linha 777:** `<button type="button" class="hero__cta hero__cta--primary" disabled aria-disabled="true">Baixar para Windows</button>` — mesmo elemento/estado, reaproveitado literalmente. Nota textual na linha seguinte: `<p class="final-cta__meta">Download ainda não disponível nesta fase.</p>`.
- Varredura no arquivo inteiro: nenhum `href="[^"]*\.exe"`, nenhum
  `github\.com/[^"]*releases`, nenhum `href="#"` em qualquer elemento
  (confirmado por regex própria, não reaproveitada dos checkers). O único
  link relacionado à instalação é `<a class="final-cta__link" href="#instalacao">`
  (âncora interna para a Seção 6, funcional e esperada — não é um destino
  de download disfarçado).
- **Conclusão:** os 2 CTAs atendem integralmente L-11/`UX-SPEC.md` Seção 4
  (5º estado "Indisponível para download nesta fase").

### 4. T9.4 — Seção de Instalação sem screenshot S8 (esperado, não é achado)

Confirmado por leitura direta: a Seção 6 (`id="instalacao"`) contém `.steps`
(4 passos reais) e `.notice` (aviso honesto sobre o SmartScreen, instalador
não assinado, caminho "Mais informações › Executar assim mesmo", lista do
que pode ser conferido antes, link de contato) — sem nenhuma `<figure
class="shot">` para o slot S8. No lugar do slot, comentário HTML claro:
`<!-- TODO: screenshot S8 (aviso do SmartScreen) pendente — ver TASK.md
Lacuna L-13 ... -->`, posicionado corretamente ao final da seção, antes do
fechamento de `</section>`. Isso é o esperado (decisão do usuário após
T11.2 não conseguir reproduzir a tela real com segurança, ver L-13) — não é
reportado como erro.

### 5. T9.5 — Seção de Licença sem mecanismo de ativação (esperado, não é achado)

Confirmado por leitura direta e pelo `t9-5.check.js` (24/24 PASS): a Seção
7 (`id="licenca"`) não tem nenhum `<input>`/`<form>` em toda a página
(varredura global), não usa `.steps`, e não menciona as palavras "chave"
nem "contra-chave" em nenhum formato (nem `.steps`, nem prosa) — conteúdo
restrito ao que é verificável hoje (7 dias de teste; bloqueio só de
escrita após expirar; leitura/exportação em PDF continuam disponíveis;
frase honesta sobre o passo a passo pós-teste ainda estar sendo definido).
Isso é intencional (G-04 + L-12, ajuste confirmado pelo usuário após
investigação do Guia do Usuário/Catálogo de Telas real do produto) — não é
um achado.

### 6. Acessibilidade

- `node dev/css/a11y-contrast-check.js`: **todas as combinações PASS**
  (rodado nesta validação), incluindo os pares específicos de
  `evolucao-segura.html` já cobertos pelos tokens/componentes dos Lotes
  1/8 (nenhuma combinação de cor nova introduzida pelo Lote 9 — confirmado
  pelas próprias notas de T9.1-T9.6, nenhuma alterou `tokens.css`).
- **Hierarquia de headings:** confirmada por extração de todos os
  `<h1>`-`<h6>` do arquivo — 1 único `<h1>` (hero), seguido só por `<h2>`
  (10 títulos de seção) e `<h3>` (cards/pillars/features/notice), nenhum
  `<h4>`-`<h6>`, nenhum salto de nível (H1→H2→H3 em todas as ramificações).
- **`alt` de imagens novas:** os 7 pares `<picture>`/`<img>` (S1-S7) têm
  `alt` não vazio e descritivo do conteúdo real de cada tela (confirmado
  por leitura de cada um); os 2 ícones do rodapé/header (decorativos ou de
  marca) seguem o padrão já estabelecido (`alt=""`/`alt="LJS Software"`),
  sem imagem nova sem `alt`.

### 7. Verificação visual dos 7 screenshots (nomes/dados fictícios)

Abertos e inspecionados visualmente nesta validação (S1, S2, S3, S4, S5,
S6, S7 — todos os 7): nomes de pacientes (João Pedro Nascimento, Mariana
Albuquerque Rocha, Beatriz Campos Lima, Rafael Moreira Teixeira, Luísa
Fernandes Prado, Carlos Eduardo Siqueira, Tânia Regina Vasconcelos),
telefone ((11) 90000-0201, padrão claramente fictício), nome de psiquiatra
fictício ("Dr. Paulo Andrade", explicitamente rotulado como fictício na
própria captura) e datas em 2026 (compatível com o ambiente de
demonstração) — nenhum dado real de paciente identificado. Confirma o
padrão já atestado pelos Executores (T11.1), de forma independente.

### Achados deste lote (resumo)

| # | Tarefa | Achado | Classificação | Ação |
|---|---|---|---|---|
| 1 | T9.6 (nota de documentação) | A nota de Status de T9.6 no `TASK.md` afirma que `t9-2.check.js` reporta falha esperando a Seção 5 logo após a Seção 3 — na verdade, ao rodar o teste nesta validação, ele PASSA (17/17), incluindo a checagem explícita de ordem Seção 4 → Seção 5. A nota está desatualizada em relação ao estado real do teste (provavelmente escrita antes da própria correção de T9.2 ter sido consolidada) | **Simples** | Tarefa criada em `Refatoração Lote-9` (ver Fechamento Estrutural abaixo); T9.6 permanece `Concluída` — não há falha de comportamento, só uma imprecisão de nota de implementação |

Nenhum achado **Crítico**. Nenhuma reprovação de tarefa.

### Testes de integração cross-platform

- Header/rodapé de `evolucao-segura.html` comparados byte a byte contra o
  bloco de `public/apps.html`: idênticos, exceto o `aria-current="page"`
  esperado em "Apps" (não em "Home"/"Sobre") — confirma RT-02/G-02.
- Link "Ver por dentro" do hero (T9.1) → âncora `#por-dentro` (T9.3):
  navegação funcional confirmada por correspondência de `href`/`id`.
- Link `#instalacao` do CTA final (T9.6) → Seção 6 (T9.4): âncora
  funcional confirmada.
- Nenhuma integração com `apps.html`/`index.html` (T10.1/T10.2, ainda
  `Pendente`) faz parte do escopo do Lote 9 — o link "Ver app" que
  apontará para esta página é tarefa de outro lote, não bloqueia o
  fechamento deste.

### Requisitos não funcionais

- Contraste WCAG AA: PASS (item 6 acima).
- `prefers-reduced-motion`: nenhuma transição/animação nova introduzida
  pelo Lote 9 (confirmado — nenhuma das 6 tarefas tocou regras de
  `transition`/`animation` em `components.css`).
- Sem cookies/tracking além do already-existente beacon do Cloudflare
  Web Analytics (script já presente nas demais páginas, reaproveitado
  sem alteração).
- `width`/`height` reais declarados em todos os 7 `<img>` de screenshot
  (reserva de espaço, evita CLS) — confirmado por leitura.

## Fechamento Estrutural do Lote 9

- T9.1, T9.2, T9.3, T9.4, T9.5, T9.6: todas `Concluída` no `TASK.md`,
  todas aprovadas pelo chapéu QA nesta validação (nenhuma reprovação,
  1 achado Simples de documentação em T9.6).
- Dependências da Seção 4 do `TASK.md` relativas ao Lote 9 ("T9.1 e T9.2
  dependem de T8.2... T9.3 depende de T8.2 e de T11.1... T9.4 depende de
  T8.3 e de T11.2... T9.5 depende de T8.2 e T8.3... T9.6 depende de T8.3")
  estruturalmente coerentes com os artefatos reais: todos os componentes
  citados (`.hero--product`/`.problem-card`/`.pillar`/`.feature`/`.shot`
  de T8.2; `.notice`/`.specs`/`.faq` de T8.3) são de fato consumidos pelas
  seções correspondentes, confirmado por leitura. Nenhuma dependência
  órfã/inconsistente. Diagrama mermaid da Seção 4 (subgraph "Lote 9 -
  Pagina evolucao-segura", nós `T91`-`T96`) existe e é coerente com a
  tabela de dependências.
- Nenhuma tarefa `Bloqueada` sem resolução.
- L-13 (screenshot S8 pendente) confirmada como já rastreada
  corretamente na Seção 6 do `TASK.md` — não é re-registrada como achado
  novo deste lote, apenas confirmada como consistente com o que a Seção 6
  (Instalação) do arquivo real implementa (item 4 acima).
- 1 achado Simples deste lote vira tarefa em `Refatoração Lote-9`:

  **Refatoração Lote-9**
  | ID | Tarefa | Origem | Prazo sugerido |
  |---|---|---|---|
  | RL9.1 | Atualizar a nota de Status de T9.6 no `TASK.md`: remover/corrigir a afirmação de que `dev/html/evolucao-segura.t9-2.check.js` reporta falha esperando a Seção 5 logo após a Seção 3 — o teste já passa (17/17) e checa explicitamente a ordem correta (Seção 4 antes da Seção 5) | QA-REPORT.md, Lote 9 (item 2 acima) | Baixo esforço; documentação, não bloqueia deploy |

  Esta tarefa não exige redesenho de dependência/decomposição — não
  escala ao `coordenador`.

**Veredito geral do Lote 9: Aprovado com ressalvas** (1 achado Simples, de
documentação — nota desatualizada no `TASK.md` sobre o estado de um teste
que na verdade passa —, sem impacto em nenhum critério de aceite real das
6 tarefas). Integridade estrutural do arquivo (ordem das seções, tags
balanceadas, IDs únicos, ausência de marcadores residuais) reauditada de
forma independente e confirmada correta. O lote está liberado para a
auditoria de segurança do chapéu DevSecOps.

## Lote 10 — Integração na Vitrine (Rodada 3)

**Pré-requisito confirmado:** as 2 tarefas do lote estão `Concluída` no
`TASK.md`, e o Lote 9 (dependência de T10.2) já tem veredito "Aprovado com
ressalvas" acima — build liberado para esta validação.

Validação direta contra o `git diff` de `public/apps.html` e
`public/index.html` (nota de implementação do Executor usada só como
referência de onde olhar, não como base de aprovação):

- **T10.1 (correção de texto do card):** confirmado nos 2 arquivos.
  `.app-card__description` do card "Evolução Segura" mudou de "Prontuário
  digital simples, com seus dados sempre com você." (texto que falava
  como se o produto fosse para o paciente) para "Prontuário eletrônico
  criptografado para o psicólogo clínico autônomo." — idêntico,
  byte-a-byte, em `apps.html` e `index.html`. `data-app-summary` do botão
  "Saiba mais" também reescrito nos 2 arquivos, texto idêntico entre si
  ("Feito para o psicólogo clínico autônomo registrar seus pacientes. O
  Evolução Segura mantém o prontuário criptografado no seu próprio
  computador, sem depender de nuvem ou servidor de terceiros."),
  consistente em tom e conteúdo com o hero de `evolucao-segura.html`
  (Lote 9, "psicólogo clínico autônomo"). Nome do app ("Evolução Segura")
  mantido sem alteração. Nenhuma classe/atributo além do texto tocado.
- **T10.2 (badge → link "Ver app"):** confirmado nos 2 arquivos.
  `<span class="badge">Em breve</span>` (e o comentário HTML "Badge
  isolado (RF-02)..." que o acompanhava) foi substituído por `<a
  class="badge badge--link" href="evolucao-segura.html"
  data-analytics-event="app-evolucao-segura">Ver app</a>`, idêntico em
  `apps.html` e `index.html`. Comparação lado a lado com os 2 outros
  cards que já usam `badge--link` (Destino Ideal e Radar Esportivo, T6.2)
  no mesmo arquivo: ambos têm `target="_blank"`, `rel="noopener"` e
  `<span class="sr-only"> (abre em nova aba)</span>` dentro do `<a>` —
  correto para links externos (Vercel). O link de Evolução Segura
  **não** tem nenhum dos três, corretamente: é navegação interna, mesmo
  domínio, sem abrir nova aba — exatamente a diferença exigida pelo
  critério de aceite de T10.2 (RF-09/RN-03). `evolucao-segura.html`
  existe de fato em `public/` (Lote 9, já validado e aprovado com
  ressalvas acima) — link resolve para arquivo real, não quebrado.
- **Isolamento da mudança:** `git diff -- public/apps.html
  public/index.html` mostra só os 2 hunks do card "Evolução Segura" em
  cada arquivo (descrição + `data-app-summary` + badge→link); nenhum
  outro card, nenhuma outra seção de nenhum dos 2 arquivos foi tocada.
- Nenhum achado de bug nesta validação — 0 crítico, 0 simples.

**Veredito geral do Lote 10: Aprovado, sem ressalvas.** As 2 tarefas
cumprem o critério de aceite escrito no `TASK.md` sem desvio. O lote está
liberado para a auditoria de segurança do chapéu DevSecOps.

## Fechamento Estrutural do Lote 10

- T10.1, T10.2: ambas `Concluída` no `TASK.md`, ambas aprovadas pelo
  chapéu QA acima (nenhuma reprovação).
- Dependências da Seção 4 do `TASK.md` relativas ao Lote 10 ("T10.1 não
  depende de nenhuma tarefa desta reabertura... T10.2 depende do Lote 9
  completo") estruturalmente coerentes com os artefatos reais: T10.2
  aponta para `evolucao-segura.html`, que já existe e está completo
  (Lote 9). Nenhuma dependência órfã/inconsistente. Diagrama mermaid da
  Seção 4 (subgraph "Lote 10 - Integracao vitrine", nós `T101`/`T102`)
  existe e é coerente com a tabela de dependências.
- Nenhuma tarefa `Bloqueada` sem resolução.
- Nenhum achado simples/débito baixo-médio deste lote — nenhuma tarefa
  nova a criar em `Refatoração Lote-10`.
- Este é o último lote de tarefas de conteúdo/frontend desta reabertura
  (Lote 11 é do Executor, sem chapéus QA/DevSecOps aplicáveis às capturas
  de screenshot em si, e já está registrado à parte).

**Veredito geral do Lote 10: fechamento estrutural confirmado, sem
achado a registrar.** Nenhuma inconsistência que exija redesenho de
dependência/decomposição — não escala ao `coordenador`.

## Checagem de Consistência de Ponta a Ponta — Reabertura Pontual (Lotes 8-11)

Fluxo completo percorrido manualmente contra os arquivos reais, na ordem
que um visitante real percorreria:

1. `apps.html`/`index.html` → card "Evolução Segura" com descrição
   correta para o público real (psicólogo, T10.1) e badge "Ver app"
   (T10.2) apontando para `evolucao-segura.html`.
2. Clique em "Ver app" → cai em `evolucao-segura.html` (Lote 9), que
   usa os 8 componentes de CSS do Lote 8 (`.hero--product`,
   `.problem-card`, `.pillar`, `.feature`, `.shot`, `.notice`, `.specs`,
   `.faq`) sem nenhuma combinação de cor nova além das já verificadas em
   T8.1.
3. Na página, os 2 CTAs "Baixar para Windows" (hero e CTA final) estão
   no estado "indisponível para download nesta fase" — elemento
   não-`<a>`, `disabled`/`aria-disabled="true"`, sem `href` para `.exe`
   nem GitHub Releases, com nota textual visível — decisão explícita do
   usuário (L-11), não um bug.
4. 7 dos 8 screenshots reais (S1-S7) estão publicados em
   `assets/img/evolucao-segura/` e referenciados na página (Lote 11,
   T11.1/T11.4 `Concluída`); o 8º (S8, SmartScreen) está pendente
   (T11.2, L-13) e a Seção 6 (Instalação) já reflete essa ausência
   corretamente com um comentário `TODO` em vez de imagem simulada.

O fluxo é coerente de ponta a ponta: nenhum passo quebra, nenhum link
morto, nenhuma promessa de download real feita ao usuário além do que
foi decidido publicar.

**Status final de todas as lacunas abertas nesta reabertura:**

| Lacuna | Status ao final desta validação |
|---|---|
| L-08 (ativação/licenciamento server-side) | Fora de escopo desta reabertura, por decisão consciente — registrada como risco RT-07 no `SDD.md`; página publicada só com conteúdo explicativo, sem formulário funcional. Não bloqueia o Lote 10. |
| L-09/RT-08 (repositório GitHub privado) | Confirmado `404`/`isPrivate: true` — bloqueia só uma futura liberação real de link de download dentro de `evolucao-segura.html`; deixou de ser pré-requisito de T10.2 (link "Ver app" é interno). Não bloqueia o Lote 10. |
| L-10 (voz da página, 1ª pessoa restrita) | **Resolvida** — decisão adotada e documentada em `UX-SPEC.md` Seção 7, confirmada pelo usuário nesta reabertura. |
| L-12 (licença simplificada, sem tela de chave/contra-chave) | **Resolvida** — seção "Licença de uso" reescrita para afirmar só o verificável (7 dias de teste), sem passo a passo de chave; slot S9 removido. |
| L-13 (screenshot S8 do SmartScreen) | **Ainda pendente** — investigação honesta e documentada (T11.2), sem imagem simulada publicada; não bloqueia o deploy do restante do lote (T9.4 já trata a ausência corretamente com comentário `TODO`). |

**Lotes com ressalva registrada nesta reabertura:**
- **Lote 8 — Validado com ressalvas:** RL8.1 (comentário de contraste
  desatualizado em `assets/css/tokens.css`, replica um número já
  desatualizado do `UX-SPEC.md`) — documentação, sem impacto em nenhuma
  combinação de cor real; virou tarefa em `Refatoração Lote-8`, baixo
  esforço, sem urgência.
- **Lote 9 — Validado com ressalvas:** RL9.1 (nota de Status de T9.6 no
  `TASK.md` cita falha de teste que na verdade já passa) — documentação,
  sem impacto em critério de aceite; virou tarefa em `Refatoração
  Lote-9`, baixo esforço, sem urgência.
- **Lote 10 — Validado, sem ressalvas** (este lote, acima).
- **Lote 11 — 2/3 tarefas concluídas** (T11.1, T11.4 `Concluída`; T11.2
  `Pendente`, investigada e documentada como L-13, sem bloquear o resto
  do fluxo — não é uma tarefa de código/QA/segurança, é uma captura de
  screenshot que depende de um ambiente onde o SmartScreen realmente
  bloqueie o instalador).

Nenhuma dessas 2 ressalvas (RL8.1, RL9.1) e nenhuma das 5 lacunas acima
exige redesenho de dependência/decomposição — nenhuma escala ao
`coordenador` nesta validação.

---


---

## Lote 12 — Página de detalhe padronizada por app (RA-10) — Validação QA (2026-09-18)

**Veredito: APROVADO COM RESSALVAS.** 13 tarefas (T12.1-T12.13) Concluída; nenhuma reprovação crítica.

Verificação real (Playwright/Chromium, servidor estático local, desktop 1280x800 e mobile 390x844, 5 páginas):
- Sem erro de página nem de console (único "ERR_FAILED" = beacon Cloudflare bloqueado por mim no teste, artefato do ambiente); 0 imagens quebradas; sem rolagem horizontal.
- Cards "Ver app" de Destino Ideal e Radar Esportivo em index.html e apps.html apontam para destino-ideal.html/radar-esportivo.html, sem target; Minha Jornada mantém link externo em nova aba (intacto).
- CTA "Abrir app" (hero e final) nas 2 páginas: target=_blank, rel="noopener noreferrer", data-analytics-event correto; URLs iguais às de apps.html.
- Ordem/omissão: Destino Ideal (valor, por dentro, avisos, FAQ, CTA) sem changelog; Radar (valor, prints, FAQ, changelog com 1 entrada, CTA); evolucao-segura sem changelog (sem entradas) e sem regressão.
- Tab: skip link, header, Apps, Sobre, Contato, Voltar, CTA, FAQ, todos com outline visível.
- node dev/html/site-consistency.check.js: OK, 7 páginas. node dev/css/a11y-contrast-check.js: TODAS PASS.

Ressalvas (severidade simples/baixa, viram tarefas em Refatoração Lote-12):
1. RL12.1 (já existia, confirmada, não duplicada): destino-ideal.html linha 66, alt do hero truncado por aspas duplas literais. Curiosamente o check de consistência não detecta.
2. RL12.2 (nova): T12.7 exige "dado 100% fictício"; os prints do Radar mostram dados reais públicos do Brasileirão e o nome "SportsLM" (anterior a T6.5) enquanto a página usa "Radar Esportivo". Não compromete o critério central de página/seções; inconsistência de marca e desvio literal do critério.

Não verificado: conteúdo textual do PDF de origem versus copy; veracidade da entrada "v1.0 setembro de 2026" do changelog do Radar (não há fonte no repo); prints de Destino Ideal não inspecionados um a um (só amostra do Radar shot-01); Firefox/Safari real; leitor de tela.

---

## Lote 13 — Minha Jornada: página de detalhe (RA-10) — Validação QA (2026-09-18)

**Veredito: APROVADO COM RESSALVAS.** 4 tarefas (T13.1-T13.4) Concluída; nenhuma reprovação crítica.

Verificação real (arquivos + scripts; sem navegador nesta rodada):
- node dev/html/site-consistency.check.js: OK, 8 páginas consistentes. node dev/css/a11y-contrast-check.js (fica em dev/css/, não dev/html/): TODAS PASS.
- T13.1: 17 prints shot-01..17 em WebP + PNG; 5 usados na página, todos com width/height. Inspecionados shot-11 e shot-15: dado fictício, sem dado sensível de terceiro (G-17 ok). Sem GIF.
- T13.2: minha-jornada.html com title/description/canonical/OG únicos (canonical https://ljssoftware.com.br/minha-jornada), 0 `[[`, h1 único, h2/h3 sem salto, alts completos (sem aspas quebradas), hero eager e demais 4 imagens lazy, 6 FAQs, changelog omitido (sem fonte), sem demo, sem iframe/script de terceiro além do beacon Cloudflare padrão do site. CTAs externos com target=_blank + rel noopener noreferrer + sr-only.
- T13.3: cards em apps.html e index.html apontam para /minha-jornada, sem target, data-analytics-event mantido, botão "Saiba mais" intacto; sitemap com loc absoluto.

Ressalvas (todas Simples; tarefa continua Concluída, viram Refatoração Lote-13):
1. RL13.1 (Simples): erros de acentuação no copy de minha-jornada.html: kicker "Duvidas" (deve ser "Dúvidas") e figcaptions "(dado ficticio)" (deve ser "fictício") nos 5 prints.
2. RL13.2 (Simples): shot-11 (editor de esboço) mostra defeitos de layout do app (botão [x] do bloco de versículo vazando para fora do card, textarea do ponto cortada, botões quebrando linha); como print de marketing prejudica a percepção. Recapturar em viewport mais largo ou recortar.
3. RL13.3 (Simples/baixa): seções "FAQ" e "baixar" ambas section--alt adjacentes (sem alternância visual); confirmar em navegador.
4. Processo: T13.4 previa "achado simples vira tarefa em Refatoração Lote-13", mas o lote não existia no TASK.md; as RL13.x acima devem ser registradas na Seção 3 (não criadas por mim nesta rodada, pedido restrito a QA-REPORT).

Não verificado: renderização em Chromium desktop/mobile (rolagem horizontal, foco visível na tela), fidelidade do copy ao PDF, peso final das páginas (maior WebP 116 KB, aceitável).

### Lote 13 — Revalidação QA (2026-09-18, commit 7c1af39)

**Veredito atualizado: VALIDADO COM RESSALVA ACEITA (1 Simples adiada).** Nenhuma reprovação Crítica.

- RL13.1 (Simples): RESOLVIDO. Kicker "Dúvidas" e 5 figcaptions "dado fictício" corretos em public/minha-jornada.html.
- RL13.3 (Simples): RESOLVIDO. FAQ sem section--alt (linha ~168); alternância com "baixar" (section--alt) restaurada.
- RL13.2 (Simples): ENCERRADA SEM ALTERAÇÃO por decisão explícita do usuário (app em refatoração). Ressalva aceita/adiada; não reprova.
- Sem regressão: site-consistency.check.js OK (8 páginas; header/footer G-02, sitemap com /minha-jornada, alts); a11y-contrast-check e checks t9-2..t9-6 PASS; G-17 sem dado sensível (só e-mail institucional e token público do beacon Cloudflare).
- Observação (fora do Lote 13): dev/html/evolucao-segura.t9-1.check.js dá 1 FAIL ("comentários de continuação para T9.2-T9.6"), check de andaimes do Lote 9 já superado; não afeta este lote. Sugere-se aposentar/ajustar esse check.
- Não verificado: renderização em navegador.
