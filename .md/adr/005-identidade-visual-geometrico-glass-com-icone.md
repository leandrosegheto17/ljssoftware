# ADR-005 — Identidade visual final: direção "Geométrico/Glass" com ícone de marca (supersede ADR-004)

**Status:** Aceito
**Data:** 2026-09-07
**Autor:** Coordenador (chapéus Software Architect + UX/UI) — consolidando decisão
já tomada diretamente pelo usuário/stakeholder (orquestrador), fora do fluxo
formal dos comandos
**Supersede:** ADR-004 (`004-identidade-visual-produzida-internamente.md`)

## Contexto

O ADR-004 fixou a identidade visual como um **wordmark 100% tipográfico**,
explicitamente **sem símbolo/ilustração**, com base no piso mínimo de aceite
de INT-03 (`PRD-TECNICO.md`) e na premissa de produção interna sem designer
externo (PR-06).

Posteriormente, fora do fluxo formal do `/definir_organizar` (reabertura
pontual), o usuário forneceu a arte-fonte de uma logo já existente da marca
(ícone geométrico "U/S" entrelaçado + texto "LJS Software"), usou a skill de
design/Artifact para gerar e comparar 5 conceitos visuais completos de home
page a partir dessa logo, e escolheu uma direção final ("Geométrico/Glass"),
incluindo um ajuste posterior específico de layout do cabeçalho.

Isso contradiz diretamente a cláusula "sem símbolo/ilustração" do ADR-004: a
identidade final **inclui** um ícone de marca, usado no cabeçalho ao lado do
nome. O próprio ADR-004 já previa esse cenário como consequência aceita:

> "Negativo (limite aceito): [...] se o stakeholder decidir no futuro que
> quer uma identidade visual mais elaborada (logotipo ilustrativo, sistema de
> ícones), isso é uma mudança de escopo de produto — deve passar pelo Gestor
> antes de gerar novo ADR/atualização de UX-SPEC.md."

Como quem tomou e aprovou a decisão foi o próprio usuário/orquestrador
(autoridade final sobre o conjunto SDD.md + UX-SPEC.md + TASK.md, acima do
Gestor interno), esse gate está satisfeito por decisão direta — não é uma
decisão do Coordenador sozinho. Este ADR apenas formaliza, com o mecanismo de
"Superseded by" exigido pelos guardrails (ADRs são imutáveis), o registro
dessa mudança de decisão.

## Decisão

A identidade visual do site passa a ser a direção **"Geométrico/Glass"**,
inspirada nas formas entrelaçadas do ícone de marca "U/S" já existente:

- **Uso de ícone de marca real** (não gerado internamente, fornecido pelo
  usuário) — revoga a cláusula "sem símbolo/ilustração" do ADR-004. Lockup
  usado apenas no cabeçalho: ícone (56px) + texto "LJS Software" lado a lado
  (não mais o lockup vertical original da arte-fonte).
- **Ativos de imagem já produzidos**, sem necessidade de nova produção:
  `logo-ljssoftware.png` (original), `logo-ljssoftware-transparente.png`
  (lockup completo, fundo removido), `logo-ljssoftware-icone.png` (ícone
  isolado, fundo removido) — todos em `.md/assets/`. Ver detalhe de
  raster-vs-vetor na Seção 3.1 do `UX-SPEC.md`.
- **Paleta de cores** substituída pela paleta "Geométrico/Glass" (fundo navy
  `#0B2545` com mesh gradient decorativo, cards "glass" translúcidos com
  blur, acento teal `#7FE3D2`) — substitui integralmente a paleta indigo/teal
  original do ADR-004/UX-SPEC.md Seção 3.1 anterior.
- **Tipografia** trocada de Sora/Inter para **Unbounded** (títulos/display) e
  **Outfit** (corpo) — mantém a postura já fixada no `SDD.md` (Google Fonts,
  auto-hospedadas em `assets/fonts/`, sem CDN externo); só os nomes das
  fontes mudam, não a política de hospedagem.
- **Cabeçalho com tratamento visual próprio**: fundo branco sólido
  (`#FFFFFF`), destacando-se do restante da página (fundo escuro) — decisão
  específica para dar contraste ao ícone, resultado de uma iteração adicional
  com o usuário após os 5 conceitos iniciais.
- Especificação completa (paleta, tipografia, componentes, layout de
  cabeçalho) em `UX-SPEC.md`, Seção 3.1 (revisada).

## Alternativas consideradas

Não houve alternativas formais avaliadas pelo Coordenador nesta decisão — a
escolha entre os 5 conceitos visuais e o ajuste de cabeçalho foi feita
diretamente pelo usuário, fora do fluxo formal de proposição/avaliação de
alternativas dos agentes. Este ADR não reabre nem propõe alternativa à
escolha já feita; apenas a registra formalmente.

## Consequências

- **Positivo:** identidade visual mais robusta e alinhada à marca real do
  stakeholder (usa a logo já existente, em vez de uma identidade tipográfica
  genérica criada do zero); resolve de forma mais completa RF-08/RA-08.
- **Positivo:** ativos de imagem já produzidos e disponíveis, sem custo
  adicional de produção nem dependência de designer externo — a premissa de
  PR-06 (produção sem contratação externa) continua válida, só o método
  mudou (uso de arte-fonte fornecida pelo próprio usuário + skill de
  design/Artifact para explorar direções, em vez de wordmark tipográfico
  puro).
- **Negativo (aceito):** os arquivos de logo transparente/ícone são PNG com
  fundo removido, não vetores reais (SVG) — se no futuro for necessário
  escalar a logo em tamanhos muito grandes sem perda de qualidade, uma
  vetorização de verdade a partir da arte-fonte original (ou por serviço
  especializado) ainda seria recomendável. Não é bloqueio para o escopo atual
  (ícone usado só em 56px no cabeçalho).
- **Negativo (aceito):** RT-05 do `SDD.md` ("identidade visual produzida
  internamente pode não atingir nível de polimento de designer profissional")
  fica parcialmente mitigado pelo uso da logo real do usuário, mas a paleta/
  layout "Geométrico/Glass" em si segue sendo produção interna (via skill de
  design), sujeita ao mesmo risco de polimento — sem mudança de tratamento de
  risco necessária.
- **Impacto no `TASK.md` (Loop C, ainda não aprovado):** tarefas do Lote 1
  (Fundação de Design System) e do Lote 2 (Header/Nav) que assumiam a
  identidade visual anterior (wordmark tipográfico Sora/Inter, paleta
  indigo/teal, sem ícone) precisam de revisão antes da aprovação do Loop C —
  detalhado na Seção 6 do `UX-SPEC.md` e endereçado separadamente pelo
  Coordenador do Loop C.

## Status do ADR-004

`004-identicade-visual-produzida-internamente.md` passa a
**Status: Superseded by ADR-005** — conteúdo original mantido intacto
(imutabilidade de ADR), apenas o campo de status é atualizado, conforme
mecanismo padrão de superseding.
