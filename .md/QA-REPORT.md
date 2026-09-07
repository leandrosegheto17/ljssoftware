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
