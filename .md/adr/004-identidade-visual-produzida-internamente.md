# ADR-004 — Identidade visual básica produzida internamente (wordmark tipográfico)

**Status:** Superseded by ADR-005 (`005-identidade-visual-geometrico-glass-com-icone.md`)
**Data:** 2026-09-07
**Autor:** Coordenador (chapéus Software Architect + UX/UI)

## Contexto

RF-08/RA-08 exigem identidade visual básica (wordmark + paleta de cores),
inexistente hoje. INT-03 do `PRD-TECNICO.md` já fixou o piso mínimo de
aceite: wordmark tipográfico satisfaz o requisito, sem exigir logotipo
ilustrativo. PR-06 do `PRD.md`/`PRD-TECNICO.md` registra como premissa a
validar se a identidade visual pode ser produzida sem contratação externa de
designer.

## Decisão

Produzir a identidade visual **internamente, dentro do próprio processo de
execução** (chapéu UX/UI do Coordenador define a especificação em
`UX-SPEC.md`; o Executor implementa), sem contratação externa de designer:

- Wordmark 100% tipográfico: "LJSSoftware" com tratamento visual (peso/cor
  diferenciados no segmento "LJS"), sem símbolo/ilustração — conforme
  INT-03.
- Paleta de cores definida por combinação de tokens de contraste testável
  (WCAG AA), não por exploração visual iterativa de design.
- Fontes de uso gratuito (Google Fonts, licença open-source), sem custo de
  licenciamento tipográfico.
- Favicon derivado por recorte/monograma do próprio wordmark (ex.: "LJ" em
  bloco colorido), sem arte nova.

Especificação completa em `UX-SPEC.md` (Seção 3, Design System).

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| Contratar designer externo | Contraria RNF-06 (custo mínimo/gratuito) e não há indicação de orçamento para isso; também adicionaria prazo de ida-e-volta desproporcional ao porte do projeto. |
| Gerar identidade via ferramenta de IA de design de marca (logo generators) | Ferramentas desse tipo tendem a gerar símbolos/ilustrações (além do wordmark), o que INT-03 explicitamente não exige, e muitas cobram por uso comercial dos arquivos gerados em alta resolução — risco de custo oculto. |

## Consequências

- **Positivo:** PR-06 fica resolvida como confirmada — é viável produzir a
  identidade visual básica sem designer externo, dentro do escopo do
  Coordenador/Executor.
- **Positivo:** custo zero, sem dependência de terceiros ou prazo externo.
- **Negativo (limite aceito):** resultado visual é deliberadamente simples
  (sem ilustração/símbolo gráfico); se o stakeholder decidir no futuro que
  quer uma identidade visual mais elaborada (logotipo ilustrativo, sistema de
  ícones), isso é uma mudança de escopo de produto — deve passar pelo Gestor
  antes de gerar novo ADR/atualização de `UX-SPEC.md`.
