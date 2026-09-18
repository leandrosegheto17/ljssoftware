# PRD.md — Site institucional LJSSoftware

**Status:** Rascunho refinado (Loop A, Rodada 2), com **Adendo (Rodada 3 —
reabertura pontual)** para a demanda "página de divulgação de app desktop
(Evolução Segura)". Rodadas 1-2 permanecem válidas e não foram reescritas;
ver Seção 8 para o adendo completo.
**Gate 1:** Aprovado com ressalvas (Rodada 1-2) / **Aprovado** (Adendo Rodada
3 — ver `CTO-REVIEW.md`, "Gate 1 — Reabertura pontual").
**Data:** 2026-09-07 (Rodada 1) — atualizado 2026-09-07 (Rodada 2) —
atualizado 2026-09-17 (Adendo Rodada 3)
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

---

## 8. Adendo (Rodada 3 — reabertura pontual, 2026-09-17)

**Contexto:** demanda pontual do stakeholder após publicação do site e de
`apps.html`/`index.html` já em produção com os 6 apps do portfólio (Lote 6,
T6.4/T6.5). O app **Evolução Segura** é uma aplicação **desktop** (executável
para download local), diferente dos demais apps do portfólio, que são apps
web publicados com URL própria (Destino Ideal, Radar Esportivo já com link
real; Minha Jornada publicado, com página interna `/minha-jornada` desde 2026-09-18, Lote 13; Meu Objetivo, Gestão da Pelada ainda "Em breve").
**Gate 1 desta rodada: Aprovado** (ver `CTO-REVIEW.md`).

### 8.1 Novo requisito de alto nível

| # | Requisito | Prioridade | Justificativa |
|---|---|---|---|
| RA-09 | Página de divulgação própria dentro do site para apps do tipo "desktop/instalável" (ex.: `evolucao-segura.html`), com descrição do app, screenshots reais do produto, proposta de valor e CTA de download do executável | Alta | Sem essa página, o link "Ver app" de um app desktop cairia direto num download de arquivo binário sem contexto — quebra a confiança/experiência de conversão que os demais apps (web) resolvem naturalmente com sua própria página de produto/loja |

### 8.2 Critério de roteamento do link "Ver app" (ajuste a RA-02)

RA-02 (listagem/vitrine dos apps) é ampliado com uma regra explícita de
produto, aplicável a todo app que hoje ou no futuro tiver seu badge "Em
breve" substituído por link real:

- **[Revisado 2026-09-18, RA-10/RN-05 — G-15 revisada]** Todo app publicado,
  web ou desktop, roteia o card para página interna (URL pública `/[slug]`, sem extensão; arquivo `[slug].html`); a URL
  externa (web) ou o download (desktop) vive só no CTA dentro da página.
  Nunca link direto para binário. Os dois itens abaixo ficam como histórico
  do critério anterior, **substituído**:
- ~~**App web publicado** ... link direto para a URL~~ (substituído).
- **App desktop/instalável** (distribuído como executável para download
  local, sem URL de produto própria — ex.: Evolução Segura): o link "Ver
  app" do card aponta para uma **página de divulgação própria dentro do
  site** (URL `/[nome-do-app]`, arquivo `[nome-do-app].html`), e é essa página — não o card — que oferece
  o CTA de download do executável.

Este critério é o que decide, para qualquer app futuro do portfólio, qual
dos dois padrões de link usar — não é uma decisão pontual só para Evolução
Segura.

### 8.3 Escopo (adendo)

**Dentro do escopo desta rodada:**
- Nova página `evolucao-segura.html` (página de divulgação, dentro do site,
  mesmo domínio/infra já em produção).
- Troca do badge "Em breve" do card "Evolução Segura" em `apps.html` e
  `index.html` por link real apontando para `evolucao-segura.html` (mesmo
  padrão RF-02 já usado para os outros apps, mas com destino interno em vez
  de externo).
- Captura de screenshots reais do produto Evolução Segura, a partir de duas
  fontes possíveis: o repositório público
  `https://github.com/leandrosegheto17/EvolucaoSegura` e/ou execução local
  do executável instalado em
  `C:\Users\leand\AppData\Local\EvolucaoSegura\evolucao-segura.exe` — tarefa
  de execução (Executor), a detalhar no `TASK.md`.
- CTA de download do executável **dentro** da nova página (não no card da
  vitrine) — o destino técnico do download (ex.: GitHub Releases do próprio
  repositório) é decisão do Coordenador no SDD.md.
- Requisitos de sistema do app (SO suportado, espaço em disco etc.), se
  informação estiver disponível no repositório/produto, exibidos na nova
  página como conteúdo de apoio à decisão de download.

**Fora do escopo desta rodada — justificativa:**
- **Design visual/layout da nova página:** decisão do Coordenador (UX/UI) no
  `UX-SPEC.md`/SDD.md, não deste chapéu.
- **Geração dos prints em si:** tarefa de execução do Executor, não decisão
  de produto — este adendo só registra a necessidade e a fonte.
- **Hospedagem/distribuição do binário `.exe`:** decisão técnica do
  Coordenador (ex.: GitHub Releases vs. asset no próprio repositório do
  site), respeitando G-01 (zero build/framework) e G-10 (sem serviço pago)
  do `GUARDRAILS.md`.
- **Aplicar o mesmo padrão retroativamente a outros apps "Em breve"**
  (Meu Objetivo, Gestão da Pelada; Minha Jornada já publicado, Lote 13): fora de escopo agora —
  cada um só entra quando for publicado, aplicando o critério da Seção 8.2
  conforme seu tipo real (web ou desktop) nesse momento.

### 8.4 Objetivo de sucesso (ajuste)

Sem alteração da métrica geral já registrada na Seção 3. Adição pontual: a
página `evolucao-segura.html`, quando publicada, passa a contar como um dos
"destinos de saída reais" mencionados na métrica futura de fase 2 (Seção 3)
— com a particularidade de que, para este app, o "destino de saída real" é
uma página própria do site (não externa), então a métrica de acompanhamento
inclui também o CTA de download dentro dessa página como evento a
instrumentar (decisão de ferramenta/analytics é técnica, cabe ao
Coordenador).

### 8.5 Premissas e riscos (adendo)

| # | Premissa/Risco | Tipo | Dono | Prazo de validação |
|---|---|---|---|---|
| PR-07 | Screenshots reais e suficientes do produto podem ser obtidos a partir do repositório GitHub e/ou da execução local do executável, sem exigir arte/mockup criado do zero | Premissa | Executor | Antes de finalizar o conteúdo da nova página `evolucao-segura.html` |
| PR-08 | O executável (`evolucao-segura.exe`) pode ser distribuído para download sem custo recorrente (ex.: via GitHub Releases do repositório já existente), compatível com G-10 do `GUARDRAILS.md` | Premissa | Coordenador | Antes de definir a hospedagem do binário no SDD.md |
| PR-09 | O critério de roteamento (Seção 8.2: web = link direto, desktop = página própria) é suficiente para todos os apps restantes do portfólio (Meu Objetivo, Gestão da Pelada; Minha Jornada já publicado), sem exigir um terceiro padrão | Premissa | Gestor (chapéu PM) | Reavaliar quando cada um desses apps for publicado |

### 8.6 Perguntas em aberto (adendo)

Nenhuma pergunta em aberto pendente nesta rodada — o pedido do stakeholder já
definiu o comportamento desejado (página de divulgação própria, com
screenshots reais, em vez de link direto de download) com detalhe suficiente
para o adendo do `PRD-TECNICO.md` (Seção 9, chapéu BA).

---

**Checklist de pronto (chapéu PM) — Adendo Rodada 3:**
- [x] Problema/ajuste declarado em termos verificáveis (distinção
      web-publicado vs. desktop-instalável, com razão de UX/negócio
      explícita)
- [x] Escopo do adendo com "dentro"/"fora" e justificativa
- [x] Novo requisito de alto nível com prioridade justificada (RA-09)
- [x] Premissas/riscos do adendo com dono e prazo (PR-07 a PR-09)
- [x] `stakeholder-alignment-check`: pedido veio diretamente do stakeholder
      nesta reabertura, sem conflito com o Gate 1 original (confirmado no
      Gate 1 desta rodada, `CTO-REVIEW.md`)
- [x] Nenhuma Pergunta em Aberto pendente nesta rodada

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

---

## 9. Adendo (Rodada 4 — "Página de detalhe padronizada por app", RASCUNHO, 2026-09-18)

**Gate 1:** Aprovado com ressalvas (`CTO-REVIEW.md`, "Gate 1 — Reabertura
pontual (Página de detalhe padronizada por app)"). Seções 1-8 não foram
reescritas.

### 9.1 Problema e objetivo

Hoje só Evolução Segura tem página própria. Destino Ideal e Radar Esportivo
apontam direto para fora (perdem a chance de indexar no domínio da marca e
de dar contexto antes da saída) e três apps estão "Em breve". Objetivo:
um template reutilizável de página de app (proposta de valor, prints/demo,
FAQ, changelog), derivado de `evolucao-segura.html`, que torne cada app
publicado uma porta de entrada indexável.

**Métrica de sucesso (mensurável):** (a) 100% dos apps publicados do
portfólio com página própria válida no template, sem link "Ver app" quebrado;
(b) cada página indexada (aparecer em `site:ljssoftware.com.br`) em até 30
dias após publicação; (c) cliques no CTA principal de cada página medidos no
Cloudflare Web Analytics (baseline = 0 hoje; meta numérica a definir após 30
dias de dados reais).

### 9.2 Novo requisito de alto nível

| # | Requisito | Prioridade | Justificativa |
|---|---|---|---|
| RA-10 | Template padronizado de página de app, com seções fixas (proposta de valor, prints/demo, FAQ, changelog, CTA) e aplicado a cada app publicado | Alta | Entrega o ganho de SEO/confiança sem reescrever a cada app; reduz custo marginal de cada página nova |

### 9.3 Escopo

**Dentro:**
- Template (esqueleto HTML documentado, copiado manualmente) derivado de
  `evolucao-segura.html`, com seções obrigatórias e opcionais definidas.
- Páginas para os apps **publicados**: Destino Ideal, Radar Esportivo e
  Minha Jornada (Lote 13, L-14 resolvida em 2026-09-18); Evolução Segura é migrada/validada contra o
  template sem perda de conteúdo.
- Seção de changelog em texto simples, com entradas datadas mantidas à mão.
- Atualização dos cards em `apps.html`/`index.html` para os destinos novos.

**Fora (justificativa):**
- **Páginas de Meu Objetivo e Gestão da Pelada:** sem produto
  publicado, sem prints/changelog reais; página vazia indexável prejudica
  SEO e promete o que não existe. Entram quando cada app for publicado.
  **[Atualizado 2026-09-18, Lote 13 / L-14]** Minha Jornada é app publicado
  e entra no padrão de página interna (`/minha-jornada`, `minha-jornada.html`).
- **Geração automática de páginas / SSG / CMS:** viola G-01 e RNF-05.
- **Demo interativa hospedada por nós ou embed de terceiro:** exigiria
  backend (G-16) ou novo terceiro (G-09/G-03). "Demo" = GIF/vídeo curto
  estático próprio.
- **Layout/design final do template:** decisão do Coordenador
  (`UX-SPEC.md`).

### 9.4 Premissas e riscos

| # | Premissa/Risco | Tipo | Dono | Prazo |
|---|---|---|---|---|
| PR-10 | Os apps publicados têm prints reais e informação suficiente para preencher as seções obrigatórias | Premissa | Stakeholder/Executor | **Validada (2026-09-18):** conteúdo vem do PDF do manual de cada app, fornecido pelo usuário (como no Minha Jornada); prints e textos saem dele |
| PR-11 | O padrão manual (copiar HTML, G-02 byte-idêntico) segue sustentável com 3-4 páginas de app; gatilho de RT-02 pode ser atingido | Risco | Coordenador | **Validada como risco aceito (2026-09-18):** usuário aprovou o padrão manual; Coordenador ainda avalia RT-02/ADR-001 no SDD.md |
| PR-12 | Nas páginas de app web, o CTA "Abrir app" dentro da página (um clique a mais) pode reduzir cliques ao app | Risco | Gestor (PM) | **Validada como risco aceito (2026-09-18):** usuário aprovou a mudança; medir após 30 dias |
| PR-13 | Seção de changelog é omitida até haver a primeira entrada | Premissa | Gestor (PM) | **Validada (2026-09-18):** changelog manual em HTML aceito |

### 9.5 Decisões do usuário (2026-09-18) — perguntas em aberto FECHADAS

**Recorte aprovado pelo usuário (RA-10).** Decisões:
1. **Roteamento de apps web:** SIM. Destino Ideal e Radar Esportivo passam a
   apontar para página interna, com botão "Abrir app" para a URL externa
   dentro dela. **Substitui o critério "web = link direto" da Seção 8.2**
   (revisão de G-15/G-02 **aplicada** em `GUARDRAILS.md`, 2026-09-18).
2. **Apps "Em breve":** sem página; ela só é criada quando o app estiver
   pronto (RN-04).
3. **Fonte de conteúdo:** PDF do manual de cada app, fornecido pelo usuário
   (como no Minha Jornada); prints e textos saem dele.
4. **Changelog:** manual em HTML, aceito.
5. **Demo:** GIF é suficiente.

Nenhuma pergunta em aberto pendente. Próximo passo: acionar o Coordenador.

**Checklist (PM):** problema verificável [x]; público (visitante buscando
o app) [x]; métrica com baseline/meta parcial (meta numérica pendente de 30
dias de dados) [x]; dentro/fora com justificativa [x]; prioridade justificada
[x]; premissas com dono e prazo [x]; alinhamento com Gate 1 [x, ressalvas
registradas]; perguntas em aberto pendentes [x] (5 fechadas em 9.5).
