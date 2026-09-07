# PRD.md — Site institucional LJSSoftware

**Status:** Rascunho refinado (Loop A, Rodada 2) — todas as 6 Perguntas em
Aberto da Rodada 1 foram respondidas pelo stakeholder e incorporadas abaixo.
Nenhuma pergunta em aberto pendente nesta rodada.
**Gate 1:** Aprovado com ressalvas (ver `CTO-REVIEW.md`).
**Data:** 2026-09-07 (Rodada 1) — atualizado 2026-09-07 (Rodada 2)
**Autor:** Gestor (chapéu PM)

---

## 1. Problema e Contexto

A LJSSoftware é a marca sob a qual o stakeholder desenvolve aplicativos. O
domínio `ljssoftware.com.br` já foi registrado, mas atualmente não há nenhum
site publicado nele. Sem uma presença web própria, os apps desenvolvidos pelo
stakeholder não têm um ponto central de descoberta/apresentação — potenciais
usuários, parceiros ou recrutadores que busquem pela marca ou pelo domínio não
encontram nada além do registro do domínio em si.

O problema a resolver: **a LJSSoftware não tem um canal digital próprio que
apresente, de forma centralizada, quem é a marca e quais aplicativos ela
produz.**

## 2. Público-Alvo

**Confirmado pelo stakeholder (Rodada 2).** Como nenhum app está publicado no
lançamento do site (todos em desenvolvimento), o foco inicial do público-alvo
é institucional/portfólio, não conversão direta para apps:
- Visitantes interessados em conhecer a marca LJSSoftware e o que está sendo
  desenvolvido (portfólio "em breve") — foco primário da fase 1.
- Parceiros de negócio, recrutadores ou potenciais clientes de serviços de
  desenvolvimento que queiram avaliar o trabalho do stakeholder e entrar em
  contato.
- Usuários finais em potencial dos apps passa a ser público **secundário**
  nesta fase — só se torna relevante como fluxo de conversão direta quando o
  primeiro app for publicado (fase futura).
- Idioma: **confirmado pt-BR único** — sem versão em inglês na fase 1.

## 3. Objetivo de Sucesso

**Redefinido na Rodada 2** — como nenhum app está publicado no lançamento, a
métrica original de "cliques de saída para os apps" não se aplica ainda
(não há destino de saída real para medir). Objetivo de sucesso ajustado ao
cenário confirmado pelo stakeholder:

**Objetivo mensurável da fase 1 (lançamento):** ter o site publicado e no ar
em `ljssoftware.com.br`, com identidade visual básica própria, apresentando a
marca e o portfólio de apps em desenvolvimento com status "em breve", e com
um canal de contato visível e funcional (link direto de e-mail e/ou
LinkedIn).

**Métrica de acompanhamento pós-lançamento (fase 1):** número de cliques no
canal de contato (e-mail/LinkedIn), medido via analytics básico, como sinal
de interesse gerado pelo site — meta numérica a ser definida após os
primeiros dados reais de tráfego (não há baseline histórico, por ser site
novo).

**Métrica futura (fase 2, quando houver ao menos 1 app publicado):** retomar
a métrica original de número de cliques/saída do site para a página/loja de
cada app — a ser reativada quando RA-02 passar a ter link de saída real para
pelo menos um app.

## 4. Escopo

### Dentro do escopo (fase 1)
- Página inicial (home) com apresentação da marca LJSSoftware.
- Seção/listagem dos aplicativos em desenvolvimento, todos exibidos com
  status **"em breve"** (nenhum tem link de saída real no lançamento —
  confirmado pelo stakeholder).
- Seção "Sobre" com apresentação breve do stakeholder/marca.
- Canal de contato simples: link direto de e-mail e/ou LinkedIn — **sem
  formulário, sem backend de envio** (confirmado pelo stakeholder).
- **Identidade visual básica** própria da marca: nome/wordmark (mesmo que só
  tipográfico), paleta de cores — **entra no escopo da fase 1**, pois não
  existe identidade visual prévia (confirmado pelo stakeholder). Pode ser tão
  simples quanto um wordmark em texto estilizado; logotipo elaborado não é
  requisito.
- Publicação no domínio já registrado (`ljssoftware.com.br`), com HTTPS, em
  solução de **custo mínimo/gratuito** (ex.: hospedagem estática) — sem prazo
  fixo de lançamento (confirmado pelo stakeholder).

### Fora do escopo (fase 1) — justificativa
- **Área de login/conta de usuário:** não há indício de necessidade de
  autenticação para um site de divulgação; adiado até haver caso de uso
  concreto.
- **Blog/conteúdo editorial recorrente:** aumentaria escopo e manutenção sem
  demanda declarada; pode ser fase 2 se o stakeholder quiser marketing de
  conteúdo.
- **Internacionalização (múltiplos idiomas):** **confirmado fora de escopo**
  pelo stakeholder — só português (pt-BR) na fase 1.
- **Painel administrativo/CMS:** **confirmado fora de escopo** pelo
  stakeholder — atualização de conteúdo será rara, então site estático
  simples é suficiente; CMS adicionaria custo/complexidade sem benefício
  correspondente.
- **Formulário de contato com backend de envio:** **confirmado fora de
  escopo** — o canal de contato será um link direto (e-mail/LinkedIn), sem
  necessidade de processar envios no servidor.
- **Links de saída reais para apps:** fora de escopo da fase 1 por não haver
  app publicado ainda — entra em fase futura, quando o primeiro app for
  lançado.

## 5. Requisitos de Alto Nível

| # | Requisito | Prioridade | Justificativa |
|---|---|---|---|
| RA-01 | Home com apresentação da marca | Alta | Núcleo do objetivo — sem isso não há site |
| RA-02 | Listagem/vitrine dos apps, todos com status "em breve" (sem link de saída na fase 1) | Alta | É o objetivo de negócio central (divulgação/portfólio), ajustado ao fato confirmado de que nenhum app está publicado ainda |
| RA-03 | Seção "Sobre" | Média | Reforça credibilidade da marca, mas não bloqueia o objetivo central |
| RA-04 | Canal de contato simples (e-mail e/ou LinkedIn, sem formulário) | Média | Importante para conversão de interesse (parceria/oportunidade); formato confirmado como link direto, sem backend |
| RA-05 | Publicação no domínio próprio com HTTPS, custo mínimo/gratuito | Alta | Sem publicação não há entrega; HTTPS é padrão mínimo de confiança/segurança; custo mínimo confirmado como restrição do stakeholder |
| RA-06 | Responsividade (mobile/desktop) | Alta | Site de divulgação será acessado majoritariamente por link direto/redes sociais, tipicamente em mobile |
| RA-07 | SEO básico (título, meta description, favicon) | Média | Ajuda descoberta orgânica pelo nome da marca/apps |
| RA-08 | Identidade visual básica (wordmark/nome estilizado + paleta de cores) | Alta | Não existe identidade visual prévia; sem ela não é possível produzir RA-01/RA-07 de forma consistente com a marca |

## 6. Premissas e Riscos

| # | Premissa/Risco | Tipo | Status | Resposta/Evidência (Rodada 2) |
|---|---|---|---|---|
| PR-01 | Existe pelo menos 1 app já publicado/disponível para divulgar no lançamento do site | Premissa | **Refutada** | Stakeholder confirmou que nenhum app está publicado — todos em desenvolvimento. RA-02 ajustado para exibir todos com status "em breve". |
| PR-02 | Idioma principal é pt-BR | Premissa | **Confirmada** | Stakeholder confirmou: só português (pt-BR) na fase 1, sem inglês. |
| PR-03 | Não há necessidade de captura de leads (ex.: newsletter) na fase 1 | Premissa | **Confirmada** | Stakeholder confirmou: contato via link simples (e-mail/LinkedIn), sem formulário/captura estruturada. |
| PR-04 | Solução técnica pode ser um site estático simples (sem backend/CMS dinâmico) | Premissa | **Confirmada** | Stakeholder confirmou atualização de conteúdo rara, reforçando a adequação de site estático sem CMS. Decisão final de arquitetura ainda cabe ao Coordenador no SDD.md, mas a premissa de produto está resolvida. |
| PR-05 | Orçamento/prazo não foram informados — risco de expectativa desalinhada se a solução proposta implicar custo recorrente | Risco | **Mitigado** | Stakeholder confirmou preferência por solução gratuita/baixo custo e sem prazo fixo de lançamento — remove a pressão de prazo e orienta o Coordenador a priorizar hospedagem sem custo recorrente relevante. |

**Nova premissa registrada na Rodada 2:**

| # | Premissa/Risco | Tipo | Dono | Prazo de validação |
|---|---|---|---|---|
| PR-06 | Identidade visual básica (wordmark + paleta) pode ser produzida dentro do próprio processo de execução, sem necessidade de contratação externa de designer | Premissa | Coordenador/Executor | Antes de iniciar a implementação visual (fase de execução) |

## 7. Perguntas em Aberto

Nenhuma pergunta em aberto pendente nesta rodada. Todas as 6 perguntas da
Rodada 1 foram respondidas pelo stakeholder e incorporadas nas Seções 2, 3,
4, 5 e 6 acima. Registro das respostas para rastreabilidade:

1. **Apps a divulgar:** nenhum publicado ainda — todos em desenvolvimento;
   exibir com status "em breve" no lançamento.
2. **Contato:** link simples (e-mail e/ou LinkedIn) — sem formulário, sem
   backend de envio.
3. **Idioma:** só português (pt-BR) — sem inglês na fase 1.
4. **Orçamento/prazo:** custo mínimo/gratuito, sem prazo fixo de lançamento.
5. **Frequência de atualização de conteúdo:** rara — confirma adequação de
   site estático simples, sem CMS/painel administrativo.
6. **Identidade visual:** não existe — precisa ser criada como parte do
   escopo (mesmo que básica: wordmark em texto + paleta de cores).

---

**Checklist de pronto (chapéu PM) — Rodada 2:**
- [x] Problema declarado em termos verificáveis
- [x] Público-alvo nomeado especificamente (institucional/portfólio na fase
      1, apps como público secundário até haver publicação)
- [x] Objetivo de sucesso é métrica mensurável, com meta ajustada ao cenário
      real confirmado (site publicado + contato, sem baseline histórico por
      ser site novo — meta numérica a refinar após primeiros dados)
- [x] Escopo com "dentro"/"fora" e justificativa, todos os pontos antes em
      aberto agora resolvidos com a resposta do stakeholder
- [x] Requisitos de alto nível com prioridade justificada (RA-01 a RA-08)
- [x] Premissas/riscos com dono e prazo — PR-01 a PR-05 resolvidas/mitigadas
      nesta rodada, PR-06 nova registrada
- [x] `stakeholder-alignment-check`: único stakeholder é o próprio dono do
      projeto; respostas da Rodada 2 confirmam alinhamento com o Gate 1 —
      nenhum conflito identificado
- [x] Nenhuma Pergunta em Aberto pendente (Seção 7 fechada nesta rodada)
