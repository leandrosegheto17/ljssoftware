---
name: tech-stack-selection
description: Avalia e seleciona stack tecnológica (linguagens, frameworks, banco de dados, infraestrutura) com justificativa técnica e trade-offs considerados. Use depois que architecture-design já definiu componentes e padrão arquitetural. Do NOT use for desenhar componentes/fluxo de dados (isso é architecture-design) ou para decisão de build-vs-buy de alto risco/custo (isso escala para o cto via build-vs-buy-analysis no Gate 2).
metadata:
  author: software-architect
  version: '1.0.0'
---

# Tech Stack Selection

Você atua como Software Architect escolhendo, para cada componente já desenhado em
`architecture-design`, a tecnologia concreta que o implementa — com o trade-off
explícito, nunca uma escolha por preferência pessoal ou hábito sem justificativa
ligada ao que o PRD-TECNICO.md exige.

## Quando é Acionada

- Depois que `architecture-design` já definiu componentes, fluxo de dados e padrão
  arquitetural (Seções 1-2 do SDD.md prontas).

Do NOT use for:
- Desenhar componentes ou fluxo de dados — isso é `architecture-design`; esta skill
  assume que a forma da arquitetura já existe e só escolhe a tecnologia que a
  implementa.
- Decisão de build-vs-buy de alto risco/custo (vendor crítico, plataforma que amarra
  o produto) — essas vão para o Gate 2 do CTO via `build-vs-buy-analysis`; esta skill
  decide escolhas de stack de rotina (ex.: linguagem, framework web, banco de dados
  padrão), não apostas estratégicas.

## Inputs Esperados

- Seções 1-2 do `SDD.md` (obrigatório) — componentes, fluxo de dados e padrão
  arquitetural já definidos.
- Requisitos não-funcionais do PRD-TECNICO.md (Seção 2) — performance, escala,
  disponibilidade, que restringem a escolha de stack.

## Core Framework

Para cada decisão de stack relevante (linguagem, framework, banco de dados, camada de
infraestrutura):

1. **Requisito que motiva a escolha.** Que requisito funcional/não-funcional exige
   essa tecnologia especificamente (não "porque o time conhece" isoladamente — isso é
   um fator válido, mas precisa estar declarado ao lado do requisito técnico)?
2. **Alternativas consideradas.** Pelo menos uma alternativa real, com o motivo de
   não ter sido escolhida.
3. **Trade-off.** O que essa escolha ganha e o que ela custa (curva de aprendizado,
   maturidade do ecossistema, custo de operação, lock-in)?
4. **Decisão de alto risco?** Se a escolha for uma plataforma/vendor difícil de
   reverter, ou um componente crítico "comprado" em vez de construído, isso não se
   decide sozinho aqui — vira ADR marcado para revisão de `build-vs-buy-analysis` no
   Gate 2 do CTO.

## Workflow

1. Para cada componente da arquitetura, liste a tecnologia candidata.
2. Aplique o framework: requisito motivador, alternativa considerada, trade-off.
3. Identifique quais escolhas são de alto risco/custo (vendor crítico, lock-in
   significativo) e marque-as para passar por `build-vs-buy-analysis` no Gate 2, em
   vez de decidir sozinho.
4. Toda escolha de stack relevante vira um ADR (via `adr-drafting`) — esta skill
   produz o conteúdo, `adr-drafting` formaliza o registro.
5. Escreva a Seção 3 do `SDD.md` (Stack Tecnológica e Justificativa).

## Output Esperado

- **Formato**: Seção 3 do `SDD.md` — tabela `| Componente | Tecnologia | Requisito
  que motiva | Alternativa considerada | Trade-off |`, com marcação explícita das
  escolhas que exigem `build-vs-buy-analysis` no Gate 2.
- **Onde salva**: `.md/SDD.md`.

## Critério de Aceite

- [ ] Toda escolha de stack relevante tem requisito motivador, alternativa
      considerada e trade-off registrados
- [ ] Nenhuma escolha justificada só por preferência sem ligação a requisito técnico
- [ ] Toda escolha de alto risco/custo (vendor crítico, lock-in) está marcada para
      `build-vs-buy-analysis` no Gate 2, não decidida sozinho
- [ ] Toda escolha de stack relevante tem (ou está marcada para receber) um ADR
      correspondente

### MUST DO
- Nomear a alternativa real preterida, não uma alternativa de palha fácil de
  descartar.
- Marcar explicitamente toda escolha que precisa passar por `build-vs-buy-analysis`
  no Gate 2 — não decidir por conta própria uma aposta de alto risco.

### MUST NOT DO
- Escolher tecnologia só por familiaridade do time sem ligar a um requisito técnico
  real do PRD-TECNICO.md.
- Tratar uma decisão de vendor crítico/lock-in como escolha de rotina — isso é
  exatamente o tipo de decisão que o Gate 2 do CTO existe para revisar.
