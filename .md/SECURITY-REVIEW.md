# SECURITY-REVIEW.md — Site institucional LJSSoftware

**Autor:** Validador (chapéu DevSecOps)
**Base:** `TASK.md` Seção 3 (Lote 1), `SDD.md` Seção 7 (Requisitos de
Segurança), `GUARDRAILS.md` (G-01, G-03, G-07, G-09, G-11), `QA-REPORT.md`
(Lote 1 — Aprovado com ressalvas)
**Data:** 2026-09-07

---

## Lote 1 — Fundação de Design System

**Escopo auditado:** T1.1-T1.5, já aprovadas funcionalmente pelo chapéu QA
(`QA-REPORT.md`, veredito "Aprovado com ressalvas", 1 achado Simples sem
relação com segurança). Pré-condição de auditoria satisfeita.

**Natureza do lote:** artefatos de fundação estáticos (tokens CSS, reset/grid,
fontes self-hosted, favicons, ativos de logo) — sem lógica de servidor, sem
input de usuário, sem endpoint, sem autenticação/autorização/dado em trânsito
além do próprio navegador do visitante buscando arquivos estáticos. Superfície
de ataque proporcionalmente pequena, conforme já antecipado em `SDD.md` Seção
7. G-09 (headers de segurança via `_headers`) é escopo do Lote 4 e não é
avaliado aqui.

**Metodologia:** inspeção direta de cada artefato no disco (não a nota de
implementação do Executor nem o veredito do QA como base de aprovação),
reexecução independente dos dois scripts Node do lote
(`tokens.contrast-check.js`, `fonts.smoke.check.js`), varredura por
referência a CDN/domínio externo em todo `assets/`, varredura por segredo/
credencial nos arquivos-texto do lote, e inspeção binária dos PNGs/ICO por
payload embutido (polyglot) e metadado sensível (caminho local, usuário).

### Arquivos auditados

`assets/css/tokens.css`, `assets/css/base.css`, `assets/css/tokens.smoke.html`,
`assets/css/base.smoke.html`, `assets/css/tokens.contrast-check.js`,
`assets/fonts/*.woff2` (4 arquivos), `assets/fonts/fonts.smoke.check.js`,
`assets/fonts/fonts.smoke.html`, `assets/img/favicon/*` (4 arquivos),
`assets/img/logo/*` (3 arquivos).

### 1. Dependência externa / CDN não autorizado (G-11)

**Achado: nenhum.**

- Varredura por `fonts.googleapis.com`/`fonts.gstatic.com`/`cdn.`/
  `http://`/`https://` em todo `assets/` retornou match apenas dentro do
  próprio texto do script de verificação `fonts.smoke.check.js` (que cita os
  hosts como constantes de checagem, não como referência ativa) — nenhuma
  referência real em `.css`/`.html` de produção.
- `fonts.smoke.check.js` reexecutado por este Validador (`node
  assets/fonts/fonts.smoke.check.js`): **OK** — confirma independentemente
  ausência de CDN externo, `font-display: swap` presente nos 4 `@font-face`,
  4 arquivos `.woff2` presentes e não vazios.
- G-11 satisfeita.

### 2. Dado sensível / segredo commitado

**Achado: nenhum.**

- Varredura por padrões de segredo (`api[_-]?key`, `secret`, `password`,
  chave privada, `AKIA`, `Bearer `) nos arquivos de texto do lote: sem
  ocorrência.
- Inspeção binária dos 6 PNGs e do `.ico` por strings ASCII contendo caminho
  local (`C:\`, `/home/`, nome de usuário do ambiente de desenvolvimento):
  sem ocorrência — nenhum metadado de editor de imagem vazando informação do
  ambiente local.
- Inspeção binária por payload embutido tipo polyglot (`<script`,
  `javascript:`, `onerror=`, `onload=`) nos PNGs/ICO: sem ocorrência.

### 3. Scripts do lote (`.js`) — escopo de execução

**Achado: nenhum problema; confirmação documentada.**

- `assets/css/tokens.contrast-check.js` e `assets/fonts/fonts.smoke.check.js`
  são scripts Node.js standalone, sem dependências externas (`npm`/
  `package.json` inexistente, coerente com G-01), com comentário de cabeçalho
  explícito declarando esse escopo ("não é framework de teste", "script Node
  standalone"). Ambos reexecutados nesta auditoria com o resultado esperado
  (ver acima) e leitura de código confirma que fazem apenas: (a) cálculo de
  contraste de cor em memória, sem I/O de rede; (b) leitura de arquivos do
  próprio repositório (`fs.readFileSync`/`readdirSync`) para varredura de
  texto, sem escrita, sem execução de código externo, sem rede.
- Nenhum dos dois é referenciado por `<script src=...>` em qualquer HTML —
  não fazem parte do bundle servido ao visitante do site; são ferramentas de
  desenvolvimento/CI local, nunca expostas em produção.

### 4. Arquivos de smoke-test — risco de publicação indevida

**Achado Baixo (débito registrado).**

- `assets/css/tokens.smoke.html` e `assets/fonts/fonts.smoke.html` têm
  `<meta name="robots" content="noindex, nofollow">` e comentário explícito
  no próprio arquivo declarando que não fazem parte do fluxo de páginas reais
  do site (`index.html`/`apps.html`/`sobre.html`/`404.html`, conforme TASK.md
  Seção 1.1).
- **`assets/css/base.smoke.html` não tem essa mesma tag `robots`**,
  divergindo do padrão dos outros dois arquivos de smoke-test do mesmo lote.
  Confirmado por varredura: nenhuma página real do site referencia nenhum dos
  3 arquivos `.smoke.html` (`grep` por `smoke` em todo `*.html` do projeto
  retorna só os 3 próprios arquivos de smoke-test) — ou seja, hoje não há
  risco de navegação acidental a partir do site. O risco residual é apenas de
  indexação por crawler caso o arquivo seja publicado (ele está fora da
  estrutura de páginas do TASK.md, mas nada no repositório impede fisicamente
  que a hospedagem estática sirva o arquivo se alguém tiver a URL direta,
  já que Cloudflare Pages serve qualquer arquivo estático publicado no
  diretório do site).
  - **Severidade: Baixa.** Não compromete nenhum requisito de segurança
    obrigatório (G-09/HTTPS não afetados; nenhum dado sensível exposto no
    conteúdo do arquivo — é só CSS de demonstração). Não bloqueia deploy.
  - **Status: débito registrado**, com ação corretiva de baixo esforço
    (adicionar a mesma tag `<meta name="robots" content="noindex, nofollow">`
    já usada em `tokens.smoke.html`/`fonts.smoke.html`).

### 5. Conformidade regulatória (LGPD)

**N/A para este lote.** Nenhum dado pessoal é coletado, processado ou
armazenado pelos artefatos do Lote 1 (CSS, fontes, favicons, ativos de logo).
Avaliação de LGPD será relevante a partir do lote que introduzir o Cloudflare
Web Analytics (T2.4, fora deste escopo) — `SDD.md` Seção 7 já antecipa que a
coleta planejada é agregada/anonimizada, sem cookie.

### 6. Requisitos de segurança operacional para o chapéu DevOps

Registrado aqui como insumo para quando o chapéu DevOps preparar a
infraestrutura/CI-CD (independente deste lote específico, já que a preparação
de infra não espera lote fechar):

- Nenhum segredo/credencial a gerenciar neste lote (site 100% estático, sem
  variável de ambiente sensível) — o único cuidado operacional é garantir que
  o processo de deploy publique **apenas** os arquivos das páginas reais
  (`index.html`, `apps.html`, `sobre.html`, `404.html`) e seus assets
  associados, evitando publicar artefatos de desenvolvimento (`.smoke.html`,
  `*.contrast-check.js`, `*.smoke.check.js`) que hoje não representam risco
  de segurança per se, mas não têm função em produção e ficam expostos
  desnecessariamente se todo o repositório for publicado sem filtro. Sugerido
  como item de configuração do pipeline (`cicd-pipeline-configuration`), não
  como bloqueio deste lote.
- G-09 (headers de segurança via `_headers`) permanece pendente para o Lote 4,
  conforme já registrado em `GUARDRAILS.md` — sem impacto neste lote.

---

## Achados deste lote (resumo)

| # | Item | Severidade | Status | Ação |
|---|---|---|---|---|
| 1 | `assets/css/base.smoke.html` sem `<meta name="robots" content="noindex, nofollow">` (presente nos outros 2 smoke-test do lote) | **Baixa** | Débito registrado, não bloqueia deploy | Tarefa em `Refatoração Lote-1` (ver abaixo) |
| 2 | Recomendação operacional: pipeline de deploy deve publicar só as 4 páginas reais + assets associados, excluindo `.smoke.html`/scripts de verificação Node | **Informativo** | Requisito operacional para o chapéu DevOps (`cicd-pipeline-configuration`), não é achado de código | Sem tarefa própria — insumo direto para configuração de pipeline |

Nenhum achado **Alto/Crítico** neste lote. Nenhum achado de compliance
obrigatório em aberto.

## Fechamento — Lote 1 (chapéu DevSecOps)

- Nenhum achado de severidade alta/crítica.
- Nenhum item de compliance obrigatório pendente.
- Item de severidade Baixa (#1 acima) registrado como débito, com tarefa
  criada por este Validador em `Refatoração Lote-1` (mesmo lote de
  refatoração já aberto pelo chapéu QA para RL1.1):

  **Refatoração Lote-1 (atualização)**
  | ID | Tarefa | Origem | Prazo sugerido |
  |---|---|---|---|
  | RL1.1 | Regenerar `assets/img/favicon/favicon.ico` com as 3 resoluções (16/32/48px) realmente embutidas no arquivo `.ico` (hoje contém só 16×16) | QA-REPORT.md, T1.4 | Antes do deploy de produção (Lote 5); não bloqueia avanço do Lote 2/3 |
  | RL1.2 | Adicionar `<meta name="robots" content="noindex, nofollow">` em `assets/css/base.smoke.html`, alinhando com `tokens.smoke.html`/`fonts.smoke.html` | SECURITY-REVIEW.md, achado #1 | Antes do deploy de produção (Lote 5); não bloqueia avanço do Lote 2/3 |

  Nenhum dos dois itens exige redesenho de dependência/decomposição — não
  escala ao `coordenador`.
- Nenhum achado de relevância estratégica a sinalizar ao Gestor neste lote.

**Veredito geral do Lote 1 (chapéu DevSecOps): Aprovado com débito de baixa
severidade** (1 achado Baixo, registrado em `Refatoração Lote-1` como RL1.2,
prazo antes do deploy de produção). Não há achado que bloqueie deploy. O lote
está liberado, do ponto de vista de segurança, para prosseguir — a decisão de
deploy em si segue as regras normais de dupla aprovação (QA + DevSecOps sobre
o mesmo lote), a cargo do chapéu DevOps quando o momento de deploy chegar.

---

## Lote 2 — Componentes Compartilhados

**Escopo auditado:** T2.1, T2.2, T2.3, T2.4 — já aprovadas funcionalmente pelo
chapéu QA (`QA-REPORT.md`, seção "Lote 2", veredito "Aprovado", sem ressalvas
remanescentes após a revalidação pós-correção de T2.2). Pré-condição de
auditoria satisfeita.

**Natureza do lote:** primeiro lote a introduzir JS puro executado no
navegador do visitante (`nav.js`, `analytics.js`) e o primeiro código de
analytics real do projeto (T2.4, ainda sem o beacon oficial habilitado —
T5.4 pendente). Continua sem lógica de servidor, sem endpoint, sem
autenticação/autorização — superfície de ataque ainda pequena, mas
qualitativamente diferente do Lote 1 por incluir manipulação de DOM e uma
dependência (defensiva, ainda inativa) de API global de terceiro
(Cloudflare).

**Metodologia:** inspeção direta de cada artefato no disco (não a nota de
implementação do Executor nem o veredito do QA como base de aprovação),
leitura linha a linha de `assets/js/nav.js` e `assets/js/analytics.js`,
varredura por CDN/domínio externo e por segredo/credencial em todos os
arquivos do lote, varredura por uso de cookies/`localStorage`/
`sessionStorage`, confirmação de que os smoke-tests do lote têm a tag
`robots noindex,nofollow` e não são referenciados por nenhuma página real
(só citados em comentário de proveniência), e inspeção das 4 páginas reais
do Lote 3 (parcial) como evidência de integração — mesma metodologia já
usada no Lote 1, estendida à análise de JS.

### Arquivos auditados

`assets/css/components.css` (seções "Header / Nav (T2.1)", "Menu mobile
(T2.2)", "Footer/Contato (T2.3)" — seções de T3.x tocadas só como checagem de
não-contaminação), `assets/js/nav.js`, `assets/js/analytics.js`,
`assets/css/header.smoke.html`, `assets/css/footer.smoke.html`, e, como
evidência de integração real, `index.html`, `apps.html`, `sobre.html`,
`404.html`.

### 1. Dependência externa / CDN não autorizado (G-11 / ADR-003)

**Achado: nenhum.**

- Varredura por `http://`/`https://`/`cdn.` em `components.css`, `nav.js` e
  `analytics.js`: a única ocorrência de URL é em **comentário** de
  `analytics.js`, documentando o `<script src="https://
  static.cloudflarewebanalytics.io/beacon.min.js">` que será incluído
  separadamente em T5.4 (fora deste lote) — não é uma referência ativa, é
  documentação de como a integração futura deve ser feita, e o host
  (`static.cloudflarewebanalytics.io`) é precisamente a ferramenta autorizada
  por ADR-003/G-11 (Cloudflare Web Analytics), não um SDK adicional.
- Leitura completa de `analytics.js`: não carrega nenhum script externo, não
  faz `fetch`/`XMLHttpRequest`, não injeta `<script>`. Toda a lógica é
  `try/catch` chamando (se existir) `window.__cfBeacon.track(...)` ou
  `window.zaraz.track(...)` — ambas APIs do próprio Cloudflare, nunca de
  outro fornecedor. Nenhuma outra ferramenta de tracking (Google Analytics,
  Meta Pixel, Hotjar etc.) é referenciada em nenhum arquivo do lote.
- Nenhum uso de `document.cookie`, `localStorage` ou `sessionStorage` em
  `nav.js`/`analytics.js` (varredura confirmada, zero ocorrências fora do
  comentário que declara essa ausência como garantia de design).
- G-11/ADR-003 satisfeitas.

### 2. Segurança de manipulação de DOM em `nav.js`

**Achado: nenhum.**

- Leitura de ponta a ponta de `assets/js/nav.js`: nenhuma ocorrência de
  `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` ou
  `eval`/`Function(...)`/concatenação de string para construir
  markup/seletor a partir de dado externo. Todas as operações de DOM são
  `setAttribute`/`removeAttribute`/`classList.add`/`classList.remove`/
  `querySelector`/`closest`/`focus`, com seletores fixos definidos no
  próprio código-fonte (não derivados de input do usuário/URL/query string).
- A lógica nova de `inert` (correção do achado Crítico #1 do QA, ver
  `QA-REPORT.md`) usa exclusivamente `nav.setAttribute('inert', '')` /
  `nav.removeAttribute('inert')` — `inert` é um atributo HTML padrão,
  puramente declarativo (não executa código, não interpreta string como
  markup); não introduz nenhum vetor novo.
- `aria-controls`/`getElementById` usados para localizar a `<nav>`
  correspondente ao toggle: o valor de `aria-controls` vem do próprio
  atributo HTML estático da página (não de query string/hash/entrada do
  usuário), então não há vetor de DOM-based XSS via manipulação de URL.
- `analytics.js`: mesma checagem — `target.closest('[data-analytics-event]')`
  e leitura de `getAttribute('data-analytics-event')` usados só como chave
  de um objeto de mapeamento fixo (`EVENT_NAMES`), nunca passados a
  `eval`/`innerHTML`/construção de seletor dinâmico. Se a chave não existir
  no mapa, a função retorna sem efeito (`if (!eventName) { return; }`) —
  não há como um atributo `data-analytics-event` arbitrário (ainda que
  nenhuma entrada do projeto permita isso hoje) forçar execução de código.
- `node --check` reexecutado nos dois arquivos por este Validador: sem erro
  de sintaxe (mesmo resultado já relatado pelo QA, confirmado
  independentemente).

### 3. Scripts de smoke-test — risco de publicação indevida (mesma checagem do Lote 1)

**Achado: nenhum problema novo; confirmação do padrão já corrigido.**

- `assets/css/header.smoke.html` e `assets/css/footer.smoke.html` **têm**
  `<meta name="robots" content="noindex, nofollow">` — confirmado por
  leitura direta de cada arquivo (linha 6 e linha 7, respectivamente). A
  correção de T2.2 (aplicação do `inert`) não alterou essa tag por engano.
- Nenhuma página real (`index.html`, `apps.html`, `sobre.html`, `404.html`)
  carrega ou faz `<a href>`/`<script src>`/`<link>` para os arquivos
  `.smoke.html` — a única menção a eles nas páginas reais é em
  **comentário HTML** (`<!-- ... copiado literalmente de
  assets/css/header.smoke.html ... -->`), documentando a proveniência do
  bloco copiado, sem nenhum efeito de carregamento/navegação. Confirmado por
  `grep` dedicado nas 4 páginas.
- Mesmo risco residual já registrado no Lote 1 (achado Baixo, RL1.2, ainda
  pendente de correção em `base.smoke.html`): se a hospedagem publicar o
  diretório inteiro sem filtro, os arquivos `.smoke.html`/`.smoke.check.js`
  ficam acessíveis por URL direta, embora sem indexação por crawler (tag
  `robots` presente nos 2 novos smoke-tests deste lote) e sem exposição de
  dado sensível (conteúdo é só markup/CSS de demonstração). Não é um achado
  novo deste lote — reforça a recomendação operacional já registrada (item
  #2 do Lote 1) de o pipeline de deploy publicar só as páginas reais.

### 4. Links externos — proteção contra reverse tabnabbing

**Achado: nenhum.**

- `rel="noopener"` confirmado presente no link de LinkedIn
  (`target="_blank"`) em `footer.smoke.html` e nas 3 páginas reais que já
  integram o rodapé (`apps.html` linha 124, `sobre.html` linha 107,
  `404.html` linha 124) — reconfirmado por este Validador, não só herdado
  do veredito funcional do QA. Isso neutraliza o vetor clássico de
  `window.opener` (a nova aba não consegue redirecionar a aba de origem).
- `rel="noreferrer"` não está presente, apenas `noopener` — aceitável: o
  vazamento de `Referer` para o LinkedIn (destino institucional público, não
  um terceiro arbitrário) não é um requisito de segurança do projeto
  (`SDD.md` Seção 7 não exige `noreferrer` para links de contato
  institucionais) e não expõe dado sensível (a URL de origem não contém
  parâmetro sensível). Não é um achado.
- Link `mailto:` não usa `target="_blank"` (abre o cliente de e-mail do
  sistema operacional, não uma aba do navegador) — `rel="noopener"` não se
  aplica a esse tipo de link; nenhuma exposição correspondente.

### 5. Dado sensível / segredo commitado

**Achado: nenhum.**

- Varredura por padrões de segredo (`api[_-]?key`, `secret`, `password`,
  chave privada, `AKIA`, `Bearer `, `token`) em `components.css`, `nav.js`,
  `analytics.js`, `header.smoke.html`, `footer.smoke.html`: a única
  ocorrência da palavra "token" está no **comentário de exemplo** de
  `analytics.js` (`data-cf-beacon='{"token": "..."}'`), documentando a
  sintaxe pública do atributo do script oficial do Cloudflare (valor
  literal `"..."`, sem nenhum token real embutido) — não é um segredo
  commitado.
- Os placeholders de contato (Lacuna L-01) — `contato@ljssoftware.com.br` e
  `https://www.linkedin.com/company/ljssoftware` — são endereço
  institucional/corporativo de contato público e URL de página institucional
  pública da empresa no LinkedIn, não dado pessoal de indivíduo nem
  credencial. Aceitável, conforme já antecipado na tarefa (substituição
  final em T6.1 não muda essa natureza).
- Nenhum novo asset binário neste lote (T2.1-T2.4 são só CSS/JS/HTML) —
  inspeção de payload embutido em binário, portanto, não se aplica; confirmado
  que nenhum `.png`/`.ico`/outro binário foi adicionado ou alterado neste
  lote (`components.css`/`nav.js`/`analytics.js`/os 2 `.smoke.html` são os
  únicos artefatos novos/alterados).

### 6. Conformidade regulatória (LGPD)

**Achado: nenhum; primeira avaliação com analytics real presente.**

- T2.4 introduz o primeiro código de analytics do projeto, mas o beacon
  oficial do Cloudflare Web Analytics **ainda não está habilitado** (T5.4
  pendente) — hoje, em produção, `trackEvent()` executa o `try/catch`,
  não encontra `window.__cfBeacon`/`window.zaraz` e retorna silenciosamente,
  sem nenhuma coleta de dado efetivamente ocorrendo.
- Mesmo quando o beacon for habilitado (T5.4), a natureza do Cloudflare Web
  Analytics é agregada/anonimizada, sem cookie e sem fingerprinting
  individual (conforme já antecipado em `SDD.md` Seção 7 e reafirmado no
  comentário de `analytics.js`) — os eventos custom disparados aqui
  (`contato_email_click`, `contato_linkedin_click`) são só um **nome de
  evento agregado**, sem payload de dado pessoal do visitante (nenhum
  e-mail, IP, identificador de sessão ou cookie é lido/enviado por este
  código — `trackEvent(eventName)` recebe só a string fixa do nome do
  evento, nunca dado do visitante).
- Os dados de contato exibidos (e-mail/LinkedIn institucionais) são
  informação da própria empresa, não do visitante — não há coleta de dado
  pessoal de terceiro neste lote.
- Conclusão: nenhuma reavaliação de LGPD é necessária além da já registrada
  no Lote 1; T2.4 não altera essa conclusão porque o mecanismo de coleta
  real ainda está inativo e, mesmo quando ativado, não processa dado pessoal
  identificável do visitante conforme desenhado.

### 7. Requisitos de segurança operacional para o chapéu DevOps

- Mantém-se a recomendação já registrada no Lote 1: o pipeline de deploy deve
  publicar só as páginas reais + assets associados, excluindo
  `*.smoke.html`/scripts de verificação Node — agora reforçada por incluir
  também `assets/css/header.smoke.html` e `assets/css/footer.smoke.html`
  (2 arquivos novos deste lote, mesma categoria de risco Baixo já tratado).
- Novo item para T5.4 (fora deste lote, mas relevante para o chapéu DevOps
  preparar antecipadamente): ao habilitar o beacon oficial do Cloudflare Web
  Analytics, confirmar que o `data-cf-beacon` usa o token real da conta via
  configuração servida no HTML (não há segredo de servidor envolvido, pois
  o token do Web Analytics é público por design — visível no código-fonte
  de qualquer site que o usa) — não é um segredo a proteger via variável de
  ambiente/CI, diferente de uma API key privada.

---

## Achados deste lote (resumo)

| # | Item | Severidade | Status | Ação |
|---|---|---|---|---|
| — | Nenhum achado novo de severidade Baixa, Média, Alta ou Crítica neste lote | — | — | — |

Nenhum achado **Alto/Crítico** neste lote. Nenhum achado de compliance
obrigatório em aberto. O risco residual de publicação indevida de
smoke-tests (mesma categoria do achado Baixo já registrado no Lote 1) não
gera uma nova entrada de débito porque os 2 smoke-tests deste lote **já**
têm a mitigação (`robots noindex,nofollow`) presente desde a origem — não é
um achado deste lote, é confirmação de que o padrão certo foi seguido.

## Fechamento — Lote 2 (chapéu DevSecOps)

- Nenhum achado de severidade alta/crítica.
- Nenhum item de compliance obrigatório pendente (LGPD: N/A, coleta
  agregada/anonimizada, beacon ainda inativo).
- Nenhum item novo de débito de baixa/média severidade a registrar em
  `Refatoração Lote-2` — o único risco residual (publicação indevida de
  artefato de desenvolvimento) já está coberto pela recomendação
  operacional de pipeline (item 7 acima e item já existente do Lote 1), não
  por uma tarefa de código.
- Nenhum achado de relevância estratégica a sinalizar ao Gestor neste lote.

**Veredito geral do Lote 2 (chapéu DevSecOps): Aprovado, sem ressalvas e sem
débito registrado.** Nenhum achado bloqueia deploy. Combinado com o veredito
funcional do chapéu QA ("Aprovado", `QA-REPORT.md`), o Lote 2 tem a dupla
aprovação (QA + DevSecOps) necessária para o chapéu DevOps considerar este
build no fluxo de deploy, quando o momento chegar — sujeito ainda ao
fechamento estrutural do lote (checagem de dependências/tarefas
`Bloqueada`), que este Validador realiza a seguir.

---

## Lote 3 — Páginas

**Escopo auditado:** T3.1-T3.6 — já aprovadas funcionalmente pelo chapéu QA
(`QA-REPORT.md`, seção "Lote 3 — Páginas", veredito "Aprovado", sem
ressalvas). Pré-condição de auditoria satisfeita.

**Natureza do lote:** primeiro lote a produzir as 4 páginas HTML reais do
site (`index.html`, `apps.html`, `sobre.html`, `404.html`), integrando o
header/nav (T2.1/T2.2), o footer/contato (T2.3) e o analytics (T2.4) já
auditados no Lote 2, mais CSS novo aditivo em `components.css` (seções
"Hero (T3.1)", "Vitrine de Apps / App Card (T3.4)", "Home — Seções
Apps/Sobre (T3.2)", "Home — Seção de Contato (T3.3)"). Nenhum JS novo —
continua sem lógica de servidor, sem endpoint, sem
autenticação/autorização. Primeira vez que a seção de contato (T3.3)
aparece fora do rodapé, replicando os mesmos 2 links de contato
(e-mail/LinkedIn) com o mesmo padrão de `data-analytics-event`.

**Metodologia:** inspeção direta de cada uma das 4 páginas e das 4 seções
novas de `components.css` no disco (não a nota de implementação do
Executor nem o veredito do QA como base de aprovação), varredura por
`on\w+=`/`javascript:` nas 4 páginas (com checagem manual de falsos
positivos — `content=`/`aria-controls=` batem no regex ingênuo mas não são
handlers de evento), varredura por `<script` fora dos 2 `<script src=...
defer>` já auditados, varredura por `https?://`/`cdn\.` nas 4 páginas e nas
4 seções novas de CSS, confirmação de `rel="noopener"` em todo
`target="_blank"`, e leitura de todos os comentários HTML das 4 páginas
por informação sensível/vazamento de metadado.

### Arquivos auditados

`index.html`, `apps.html`, `sobre.html`, `404.html` (as 4 páginas
completas), `assets/css/components.css` (seções "Hero (T3.1)", "Vitrine de
Apps / App Card (T3.4)", "Home — Seções Apps/Sobre (T3.2)", "Home — Seção
de Contato (T3.3)").

### 1. Injeção de conteúdo / XSS estático

**Achado: nenhum.**

- Varredura por `on\w+=` (padrão ingênuo de atributo de evento inline) nas
  4 páginas: os únicos matches são falsos positivos do regex — `content=`
  (de `<meta name="viewport"/"description" content="...">`) e
  `aria-controls=` (a substring "on" + "trols" + "=" bate o padrão
  ingênuo, mas não é `onclick=`/`onload=`/etc.) — confirmado por leitura
  manual de cada ocorrência nas 4 páginas. Nenhum atributo de evento
  inline real (`onclick=`, `onerror=`, `onload=`, `onmouseover=`, etc.)
  em nenhuma das 4 páginas.
- Varredura por `javascript:` em `href`/qualquer atributo nas 4 páginas:
  nenhuma ocorrência.
- Varredura por `<script` nas 4 páginas: só os 2
  `<script src="assets/js/nav.js" defer>`/`<script
  src="assets/js/analytics.js" defer>` já auditados no Lote 2, presentes
  ao final do `<body>` de cada uma das 4 páginas (byte-idênticos entre
  si). Nenhuma página introduziu `<script>` inline, bloco `<style>` com
  `expression()`/`behavior:` (vetor legado do IE, não aplicável aqui de
  qualquer forma) ou lógica JS nova. O `<style>` inline de `404.html`
  (linhas 11-61) contém só CSS declarativo específico da página
  (`.error-page*`), sem `<script>` embutido nem `expression()`.
- Confirma o ponto 7 do escopo desta auditoria: nenhuma página introduziu
  `<script>` inline ou lógica nova além dos 2 arquivos já existentes.

### 2. Links externos — `rel="noopener"` em todo `target="_blank"`

**Achado: nenhum.**

- Todo `target="_blank"` nas 4 páginas está acompanhado de
  `rel="noopener"`, confirmado por leitura direta:
  - `index.html`: rodapé (linha 227) e, pela primeira vez, também o botão
    "Ver no LinkedIn" da nova seção de contato (T3.3, linha 187) — ambos
    com `rel="noopener"`.
  - `apps.html` (linha 124), `sobre.html` (linha 107), `404.html` (linha
    124): rodapé, mesma proteção.
  - Nenhuma ocorrência de `target="_blank"` sem `rel="noopener"`
    correspondente em nenhuma das 4 páginas.
- Mesma conclusão já registrada no Lote 2 sobre `rel="noreferrer"`: sua
  ausência não é um achado (destino institucional público, sem parâmetro
  sensível na URL de origem).
- Link `mailto:contato@ljssoftware.com.br` (rodapé e, pela primeira vez,
  seção de contato de `index.html`) não usa `target="_blank"` — não
  aplicável.

### 3. Dependência externa / CDN não autorizado (G-11/ADR-003)

**Achado: nenhum.**

- Varredura por `https?://`/`cdn\.` nas 4 páginas: a única ocorrência real
  de URL externa é `https://www.linkedin.com/company/ljssoftware`, que já
  é o placeholder de contato avaliado como aceitável desde o Lote 2 (não é
  SDK/dependência de execução, é apenas o destino de um link de
  navegação). Nenhum `<script src=`/`<link>` aponta para domínio externo
  em nenhuma das 4 páginas — todas as referências de `<link
  rel="stylesheet">` e `<script src=>` apontam para `assets/...` local
  (`assets/css/tokens.css`, `assets/css/base.css`,
  `assets/css/components.css`, `assets/js/nav.js`,
  `assets/js/analytics.js`).
- Varredura por `url(`+`http`/`cdn` nas 4 seções novas de
  `components.css` (Hero, Vitrine de Apps, Home Apps/Sobre, Home Contato):
  nenhuma ocorrência — nenhum `background-image`/`@font-face`/`@import`
  externo introduzido; as formas decorativas do Hero (`.decorative-shape`)
  e o mesh gradient usam só `radial-gradient()`/`color-mix()` em CSS puro,
  sem asset externo.
- `<img src="assets/img/logo/logo-ljssoftware-icone.png">` (header/footer,
  repetido nas 4 páginas): local, já auditado no Lote 1.
- G-11/ADR-003 satisfeitas.

### 4. Metadados/comentários HTML vazados

**Achado: nenhum.**

- Leitura de todos os comentários HTML das 4 páginas: são exclusivamente
  comentários de proveniência/engenharia (referência a qual tarefa
  originou o bloco — "T3.2 adiciona aqui", "copiado literalmente de
  assets/css/header.smoke.html", referência a `TASK.md`/`SDD.md`/Lacunas
  L-01/L-02/L-03/L-06), documentação de decisão de detalhe tomada em
  silêncio, ou nota sobre placeholder pendente de substituição futura
  (T4.1/T6.1/T6.2/T6.3). Nenhum comentário contém caminho local de
  desenvolvimento (`C:\`, `/home/`), credencial, token, URL interna de
  ambiente não-produtivo, ou nota que revele informação de negócio não
  destinada ao público (ex.: preço, nome de cliente real, infraestrutura
  interna).
- Mesma checagem no bloco `<style>` inline de `404.html`: nenhum
  comentário além de `/* Estilos específicos da página 404 (não fazem
  parte de components.css) */` — puramente descritivo.
- Consistente com o Lote 1/2, onde a mesma categoria de comentário de
  proveniência já havia sido avaliada como aceitável (documentação de
  engenharia, não vazamento).

### 5. Placeholders de contato (Lacuna L-01)

**Achado: nenhum; confirmação de réplica consistente.**

- `contato@ljssoftware.com.br` e
  `https://www.linkedin.com/company/ljssoftware` são os mesmos placeholders
  já avaliados como aceitáveis no Lote 2 (endereço institucional/URL
  pública da empresa, não dado pessoal nem credencial) — confirmados
  byte-idênticos nas 4 páginas (rodapé) e, pela primeira vez, também na
  seção de contato de `index.html` (T3.3). Nenhuma variação/erro de
  digitação entre as 5 ocorrências (4 rodapés + 1 seção de contato)
  encontrada.
- Ambos os locais mantêm o mesmo `data-analytics-event` já documentado em
  `analytics.js` (T2.4) — `contato-email`/`contato-linkedin` — sem
  necessidade de alteração naquele arquivo (a seção de contato reaproveita
  a mesma convenção de atributo, não uma nova).

### 6. Atributos `data-*`/`aria-*` — consistência de integração

**Achado: nenhum problema; confirmação rápida (fora do escopo de UX/a11y,
que é do QA).**

- `aria-controls="site-header-nav"`/`aria-expanded="false"`/
  `aria-label="Abrir menu"` no botão de toggle: idênticos nas 4 páginas,
  valor de `aria-controls` aponta para o `id="site-header-nav"` presente
  no mesmo documento (não referência quebrada/cross-document) — sem
  implicação de segurança adicional, e consistente com o já auditado no
  Lote 2 (o valor não vem de input do usuário/URL).
- `aria-current="page"` presente só no item de nav correspondente a cada
  página (`apps.html`→"Apps", `sobre.html`→"Sobre"; `index.html`/
  `404.html` sem nenhum item marcado, coerente com não serem itens do
  próprio menu) — nenhum atributo duplicado/inconsistente que sugerisse
  cópia incorreta do bloco de referência.
- `data-analytics-event` presente só nos elementos esperados (2 links de
  contato do rodapé + 2 botões da seção de contato de `index.html`) — não
  encontrado em nenhum elemento fora desse padrão (ex.: nenhum
  `data-analytics-event` "órfão" em botão/link que não deveria disparar
  evento).
- Nenhum atributo `data-*` desconhecido/não documentado introduzido nas 4
  páginas.

### 7. Conformidade regulatória (LGPD)

**Achado: nenhum; mesma conclusão dos lotes anteriores, reforçada.**

- A seção de contato da Home (T3.3), primeira vez que aparece fora do
  rodapé, não introduz formulário nem qualquer campo de coleta de dado do
  visitante — são apenas 2 links/botões (`mailto:`/LinkedIn), mesma
  natureza dos links já existentes no rodapé desde o Lote 2. Nenhum
  `<input>`/`<form>`/mecanismo de submissão de dado em nenhuma das 4
  páginas.
- Os 2 `data-analytics-event` da seção de contato dependem do mesmo
  `analytics.js` já avaliado no Lote 2: dispara evento agregado com nome
  fixo, sem payload de dado pessoal do visitante, e o beacon oficial
  ainda está inativo (T5.4 pendente).
- Os dados de contato exibidos (e-mail/LinkedIn institucionais) continuam
  sendo informação da própria empresa, não do visitante.
- Conclusão: nenhuma reavaliação de LGPD é necessária além da já
  registrada nos Lotes 1/2; T3.3 não muda essa conclusão.

### 8. Requisitos de segurança operacional para o chapéu DevOps

- Mantém-se a recomendação já registrada nos Lotes 1/2: o pipeline de
  deploy deve publicar só as páginas reais (agora confirmadas como
  `index.html`, `apps.html`, `sobre.html`, `404.html`, todas na raiz do
  repositório, conforme TASK.md Seção 1.1) + assets associados, excluindo
  `*.smoke.html`/scripts de verificação Node.
- Novo item de confirmação para o chapéu DevOps: `404.html` está na raiz
  do repositório, convenção nativa esperada pela Cloudflare Pages para
  página de erro 404 — nenhuma configuração adicional de rota é
  necessária no pipeline para este comportamento funcionar (já confirmado
  também pelo QA, do ponto de vista funcional).

---

## Achados deste lote (resumo)

| # | Item | Severidade | Status | Ação |
|---|---|---|---|---|
| — | Nenhum achado novo de severidade Baixa, Média, Alta ou Crítica neste lote | — | — | — |

Nenhum achado **Alto/Crítico** neste lote. Nenhum achado de compliance
obrigatório em aberto. O risco residual de publicação indevida de
smoke-tests (categoria já registrada no Lote 1 como débito Baixo, RL1.2,
ainda pendente antes do deploy de produção) não é reavaliado aqui porque
nenhum arquivo `.smoke.html` faz parte do escopo deste lote.

## Fechamento — Lote 3 (chapéu DevSecOps)

- Nenhum achado de severidade alta/crítica.
- Nenhum item de compliance obrigatório pendente (LGPD: N/A, seção de
  contato da Home não introduz coleta de dado; beacon de analytics ainda
  inativo).
- Nenhum item novo de débito de baixa/média severidade a registrar em
  `Refatoração Lote-3` — nenhum achado deste lote atinge o limiar de
  registro (todos os pontos verificados vieram limpos).
- Nenhum achado de relevância estratégica a sinalizar ao Gestor neste
  lote.

**Veredito geral do Lote 3 (chapéu DevSecOps): Aprovado, sem ressalvas e
sem débito registrado.** Nenhum achado bloqueia deploy. Combinado com o
veredito funcional do chapéu QA ("Aprovado", `QA-REPORT.md`, seção "Lote
3 — Páginas"), o Lote 3 tem a dupla aprovação (QA + DevSecOps) necessária
para o chapéu DevOps considerar este build no fluxo de deploy, quando o
momento chegar — sujeito ainda ao fechamento estrutural do lote (checagem
de dependências/tarefas `Bloqueada`), que este Validador realiza a
seguir, e ao débito de baixa severidade já pendente desde o Lote 1
(RL1.2, `assets/css/base.smoke.html` sem tag `robots`), que continua sem
prazo vencido (ainda antes do deploy de produção, Lote 5).
