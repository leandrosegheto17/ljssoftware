# CTO-REVIEW.md

Log de pareceres do chapéu CTO (Gestor). Cada entrada corresponde a um Gate formal
(1 ou 4) ou a um parecer ad hoc (SDD.md/TASK.md), com data, achados e veredito.

---

## Gate 1 — Pré-descoberta

**Data:** 2026-09-07
**Skill aplicada:** `tech-strategy-review`
**Artefato de entrada:** Briefing de negócio (conversa direta com o stakeholder,
sem artefato formal prévio) — LJSSoftware, domínio `ljssoftware.com.br` já
registrado, sem site publicado.

### Briefing recebido

> "Agora que tenho um domínio ljssoftware.com.br quero pensar em uma página
> inicial. Acho que quero um site de divulgação dos apps que estou
> desenvolvendo. Vamos pensar em algo."

### Achados

1. **Objetivo de negócio declarado explicitamente:** sim. O objetivo não é
   genérico ("fazer um site bonito") — é criar presença digital institucional
   para a marca LJSSoftware com a finalidade específica de divulgar um
   portfólio de aplicativos desenvolvidos pelo stakeholder. Isso é suficiente
   para caracterizar um objetivo de negócio real (geração de visibilidade e
   canal de descoberta para os apps), atendendo ao critério do Gate 1.
2. **Hipótese de alinhamento com roadmap/orçamento de longo prazo:** plausível
   e de baixo risco. Um site institucional/vitrine é tipicamente um projeto de
   escopo pequeno, custo de infraestrutura baixo (hospedagem estática ou
   similar) e não compromete capacidade de longo prazo do stakeholder, que já
   investiu no domínio — sinal de intenção de continuidade da marca.
3. **Capacidade:** nenhum gap óbvio identificado. O tipo de projeto (site de
   divulgação/portfólio) é compatível com a natureza do solicitante
   (desenvolvedor de software), sem indício de que exija squad, orçamento ou
   prazo fora do alcance de uma iniciativa individual/pequena.
4. **Lacunas relevantes para as próximas fases (chapéu PM/BA), não para o Gate
   1 em si:** não foram informados ainda (a) quais apps serão divulgados, se
   já publicados ou em desenvolvimento; (b) público-alvo do site; (c) se há
   necessidade de captura de leads/contato; (d) idioma principal (assume-se
   pt-BR pelo domínio .com.br, a confirmar); (e) orçamento/prazo; (f)
   preferência por site estático simples vs. solução com backend/CMS. Nenhuma
   dessas lacunas invalida o objetivo de negócio declarado — são detalhamento
   de produto, não pré-requisito de viabilidade estratégica.

### Veredito

**Aprovado com ressalvas.**

**Ressalvas (a resolver pelo chapéu PM/BA nas próximas etapas, não bloqueiam o
início do levantamento):**
- O `PRD.md` deve necessariamente registrar como premissas/perguntas em aberto
  os pontos (a)-(f) do achado 4, cada um com dono e prazo de validação.
- O objetivo de sucesso do `PRD.md` não pode ficar em métrica vaga (ex.:
  "divulgar bem os apps") — precisa de uma métrica mensurável, ainda que
  provisória (ex.: nº de visitas, nº de cliques para os apps, cadastro de
  contato), sujeita a ajuste após confirmação com o stakeholder.

Libera-se o início do chapéu PM (levantamento de produto).

---

## Governança de GUARDRAILS.md — Rascunho inicial (G-01 a G-14)

**Data:** 2026-09-07
**Skill aplicada:** `guardrails-governance`
**Artefato de entrada:** `.md/GUARDRAILS.md` (rascunho proposto pelo
Coordenador, status "aguardando aprovação"), com base em `SDD.md`, ADRs
001-005, `PRD-TECNICO.md`, `TASK.md` e `CTO-REVIEW.md` (Gate 1).

### Análise

Duas propostas pendentes no Log de Alterações, ambas classificadas como
**mudança estrutural** (não exceção pontual, portanto sem prazo de
expiração — vigem a partir de agora até nova mudança formal):

1. **Criação do rascunho inicial (G-01 a G-13).** Motivo declarado: primeira
   geração extraída de `SDD.md`, ADRs 001-004, `PRD-TECNICO.md` e `TASK.md`.
   Motivo válido e verificável — cada regra foi conferida contra a origem
   citada:
   - G-01 (zero build/framework) → ADR-001, confirmado em `SDD.md`.
   - G-02 (header/footer byte-idênticos) → `SDD.md` RT-02 / `TASK.md`.
   - G-03 (sem analytics além de Cloudflare Web Analytics) → ADR-003,
     confirmado.
   - G-04 (sem formulário com processamento em backend) → `PRD-TECNICO.md`
     RF-04, confirmado (RF-04 registra decisão de contato via link
     simples, sem formulário).
   - G-05/G-06 (WCAG AA, 4 estados de tela) → `UX-SPEC.md`, consistente com
     o restante do pipeline.
   - G-07 (imagens WebP otimizadas) → `SDD.md` RT-04, confirmado.
   - G-08 (HTTPS obrigatório) → `PRD-TECNICO.md` RF-05, confirmado.
   - G-09 (headers de segurança) → `SDD.md` Seção 7.
   - G-10 (nenhum serviço pago sem sinalizar o Gestor) → `PRD-TECNICO.md`
     RNF-06, confirmado — regra corretamente escala decisão de custo
     recorrente ao Gestor, não a decide tecnicamente.
   - G-11 a G-14: ver item 2 abaixo (já refletem o estado atualizado).
   Nenhuma contradição encontrada entre as regras entre si nem contra
   `SDD.md`/`CTO-REVIEW.md` (Gate 1) — todas reforçam a diretriz de solução
   estática, de custo mínimo, sem backend, já validada estrategicamente.

2. **G-11 atualizada (Sora/Inter → Unbounded/Outfit) e G-14 adicionada
   (proteção dos ativos de logo reais).** Motivo declarado: sincronização
   com `ADR-005` (identidade visual "Geométrico/Glass", supersede
   `ADR-004`), decisão já tomada pelo usuário — não é uma nova regra de
   negócio. Motivo válido: confirmado em `SDD.md` (ADR-005 presente na
   tabela de decisões, com `ADR-004` corretamente marcado como
   "Superseded by ADR-005", em conformidade com a própria G-13 do
   documento — nenhuma edição de ADR original, só supersessão). Sem efeito
   colateral: G-11/G-14 não contradizem nenhuma outra regra.

Formato da tabela Log de Alterações estava incompleto (faltava a coluna
`Validade`, exigida pela skill `guardrails-governance` e por
`PIPELINE-CONVENTIONS.md` §5) e as duas linhas estavam com "Aprovado por:
(pendente)". Corrigido diretamente em `GUARDRAILS.md` (autoria própria do
Gestor sobre o Log de Alterações), preenchendo `Aprovado por: gestor
(chapéu CTO)` e `Validade: Permanente (mudança estrutural)` nas duas
entradas, e atualizando o `Status` do cabeçalho do documento.

### Veredito

**Aprovado.**

As 14 regras (G-01 a G-14) e as duas entradas do Log de Alterações estão
rastreáveis à origem declarada, sem contradição interna nem com decisões
já validadas em `SDD.md`/`CTO-REVIEW.md`. `GUARDRAILS.md` está liberado
como guardrail vigente do projeto a partir desta data.

---
