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

---

## Lote 4 — SEO, Acessibilidade e Segurança Transversal

**Escopo auditado:** T4.1-T4.4 — já aprovadas funcionalmente pelo chapéu QA
(`QA-REPORT.md`, seção "Lote 4", veredito "Aprovado com ressalvas", 1 achado
Simples em T4.4 sem relação com segurança — lacuna na nota de implementação
sobre quais páginas dependem de `style-src 'unsafe-inline'`, sem impacto na
CSP real). Pré-condição de auditoria satisfeita.

**Natureza do lote:** primeiro lote a introduzir headers de segurança HTTP
(`_headers`, T4.4 — implementa G-09, antes pendente) e metadados SEO/Open
Graph com URLs absolutas do domínio de produção (T4.1). T4.2 altera só CSS
(opacidade de um blob do gradiente) e 3 headings em `apps.html`; T4.3
introduz `robots.txt`/`sitemap.xml`. Continua sem lógica de servidor, sem
endpoint, sem formulário (G-04 seguindo intacto) — a superfície de ataque
cresce qualitativamente pela primeira vez neste lote (headers de borda), não
por código novo executado no navegador.

**Metodologia:** leitura linha a linha de `_headers` (a peça central deste
lote do ponto de vista de segurança) contra os recursos reais das 4 páginas
(reexecução independente da varredura de `style=`/`<style>`/`<script>`
inline e de domínio externo, não aceite da nota do Executor nem do QA como
prova), leitura de `robots.txt`/`sitemap.xml` por rota sensível vazada,
leitura completa das 16 novas tags Open Graph (4 por página) por URL de
domínio não autorizado ou dado sensível, leitura de `assets/css/a11y-
contrast-check.js` por I/O de rede/dependência externa (mesma checagem já
aplicada aos scripts Node dos Lotes 1/2), varredura por segredo/token
embutido em todos os arquivos novos/alterados do lote, e confirmação do
status atual de RL1.2 (débito de segurança do Lote 1) no `TASK.md`.

### Arquivos auditados

`_headers`, `robots.txt`, `sitemap.xml`, `assets/css/a11y-contrast-check.js`,
as 16 tags Open Graph/favicon novas em `index.html`, `apps.html`,
`sobre.html`, `404.html` (cabeçalho `<head>` completo de cada uma), o bloco
`<style>` inline de `404.html`, os atributos `style=` inline de `apps.html`/
`sobre.html`, e a seção "Hero (T3.1)" de `assets/css/components.css`
(checagem de não-contaminação da mudança de opacidade do blob).

### 1. `_headers` — CSP e demais headers de segurança (G-09, tarefa mais relevante do lote)

**Achado: nenhum bloqueante; 1 ponto de atenção avaliado e aceito (não vira débito separado).**

Leitura linha a linha do arquivo real:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://static.cloudflarewebanalytics.io; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self' https://static.cloudflarewebanalytics.io; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
```

- **(a) Domínio externo único e autorizado — confirmado.** `grep` deste
  Validador por `https?://` no arquivo inteiro retorna exatamente 2
  ocorrências, ambas `https://static.cloudflarewebanalytics.io` (em
  `script-src` e `connect-src`) — nenhum outro domínio em nenhuma diretiva.
  Esse é precisamente o host do beacon do Cloudflare Web Analytics já
  documentado em `assets/js/analytics.js` (T2.4) e autorizado por
  ADR-003/G-11 (única ferramenta de analytics permitida sem novo ADR).
  Nenhum CDN de fonte, script de terceiro, tag manager ou pixel de
  rastreamento aparece em nenhuma diretiva. G-11/ADR-003 satisfeitas também
  na camada de headers, não só no código-fonte já auditado nos Lotes 1-3.
- **(b) `style-src 'self' 'unsafe-inline'` — necessidade reconfirmada
  independentemente, e 1 caso a mais do que a nota do Executor documentou
  (mesmo achado já capturado pelo QA como RL4.1).** Varredura própria deste
  Validador (`grep` por `style=` e por `<style` nas 4 páginas): confirma
  `apps.html` (linha 78-79, atributo `style=`), `sobre.html` (linhas 51-69,
  atributos `style=`) e **`404.html`** (linhas 20-70, bloco
  `<style>...</style>` completo no `<head>`) — os 3 casos dependem de
  `'unsafe-inline'` para não serem bloqueados pela CSP. A diretiva cobre os
  3 corretamente (a especificação CSP não distingui `style=` inline de
  `<style>` inline para efeito de `'unsafe-inline'` em `style-src`) — a
  política real já é suficiente e correta, confirmando a conclusão do QA de
  que o achado é só uma lacuna na documentação da nota (RL4.1), não um
  problema funcional/de segurança na CSP.
  - **Avaliação de segurança adicional deste Validador (dimensão não
    coberta pelo achado do QA, que tratou só da documentação):**
    `'unsafe-inline'` em `style-src` é, por definição, um relaxamento da CSP
    — mas o vetor de ataque que ele reabre é especificamente CSS-based
    attribute/data exfiltration (ex.: seletores de atributo `input[value^=
    "a"]` para inferir caractere a caractere um valor de formulário, ou
    `@import`/`url()` disparando requisição condicional) e "CSS injection"
    via `<style>` controlado por um atacante — nenhum dos dois se aplica
    aqui: (i) o site não tem `<form>`/`<input>` de dado sensível (G-04, RF-04
    — não há nada para um atacante inferir via seletor CSS malicioso); (ii)
    os 3 casos de CSS inline são texto estático do próprio código-fonte
    versionado, não gerado a partir de input do usuário/parâmetro de
    URL/dado de terceiro — não há caminho para um atacante injetar `style=`/
    `<style>` arbitrário nessas páginas (ausência de XSS confirmada nos
    Lotes 1-3, reafirmada aqui: nenhuma interpolação de string em HTML,
    `innerHTML`, ou template no lado cliente). **Conclusão: o relaxamento é
    necessário, o risco residual é teoricamente não-nulo mas praticamente
    inexplorável na arquitetura atual do site (sem input de usuário, sem
    geração dinâmica de HTML/CSS) — não atinge o limiar de severidade Baixa
    para virar um item de débito separado.** Não duplica RL4.1 (que trata só
    da lacuna de documentação); nenhuma nova entrada de `Refatoração
    Lote-4` criada por este achado.
- **(c) `X-Frame-Options: DENY` e `frame-ancestors 'none'` — presentes e
  coerentes.** Os dois mecanismos (header legado + diretiva CSP moderna)
  bloqueiam clickjacking via `<iframe>`/`<frame>`/`<object>`/`<embed>` de
  qualquer origem, incluindo a própria (`'none'`, não `'self'`) —
  apropriado para um site institucional sem necessidade de ser embutido em
  nenhum contexto. Redundância intencional (cobertura de navegadores que só
  suportam um dos dois mecanismos), não um erro.
- **(d) `Referrer-Policy: strict-origin-when-cross-origin` e
  `Permissions-Policy` — adequados.** `strict-origin-when-cross-origin` é o
  valor padrão recomendado atual (envia origem completa só em navegação
  same-origin/HTTPS-para-HTTPS, reduzido para só a origem em cross-origin,
  nada em downgrade HTTPS→HTTP) — coerente com G-08 (HTTPS obrigatório,
  ainda pendente de ativação no Lote 5, mas a política já antecipa o
  comportamento correto). `Permissions-Policy` nega `camera`, `microphone`,
  `geolocation`, `payment`, `usb` — nenhum desses recursos é usado pelo
  site, negação por padrão é a prática correta — e inclui `interest-
  cohort=()`, opt-out explícito do FLoC/Topics (tracking baseado em
  cohort do navegador, fora do controle de cookies/JS do próprio site) —
  reforça G-03 (nenhum tracking além do Cloudflare Web Analytics) mesmo
  contra mecanismo de rastreamento embutido no navegador do visitante.
- **(e) Cobertura de rota — `/*`, todas as rotas, conforme G-09.** Único
  bloco no arquivo, path `/*` — confirmado que não há bloco mais específico
  nem exceção que reduza a cobertura a um subconjunto de páginas. As 4
  páginas reais, os arquivos de smoke-test (se publicados) e qualquer rota
  futura ficam igualmente cobertos.
- **(f) Nenhum segredo/token embutido.** Varredura por padrões de segredo
  (`api[_-]?key`, `secret`, `password`, chave privada, `AKIA`, `Bearer `,
  `token`) no arquivo inteiro: zero ocorrências — `_headers` não contém
  nenhuma credencial, nem mesmo o token público do Cloudflare Web Analytics
  (que só será inserido em T5.4, no HTML das páginas via `data-cf-beacon`,
  não neste arquivo).
- **Confirmação independente de que as diretivas restritivas (`default-src
  'self'`, `img-src 'self'`, `font-src 'self'`, `object-src 'none'`,
  `base-uri 'self'`, `form-action 'self'`) não bloqueiam nenhum recurso
  real:** reconfirmado por leitura das 4 páginas e de `assets/css/*.css` —
  único `<img>` é local (`assets/img/logo/...`), `@font-face` só referencia
  `.woff2` local, nenhum `<object>`/`<embed>`, nenhum `<form>` (G-04),
  nenhuma navegação `base` customizada.
- **Pendência não-bloqueante, já sinalizada pelo QA, reafirmada aqui do
  ponto de vista de segurança:** a aplicação real dos headers em produção
  (preview deploy do Cloudflare Pages) e a ausência de erro de bloqueio no
  console do navegador só são verificáveis após deploy — este Validador não
  trata isso como achado nem como bloqueio desta auditoria estática; é
  responsabilidade do chapéu DevOps confirmar na preparação de
  infraestrutura (`/deploy`, primeira chamada) antes do deploy de produção.

### 2. Meta tags SEO/Open Graph (T4.1) — domínio externo e vazamento de metadado

**Achado: nenhum.**

- Varredura própria (`grep` por `https?://` nas 16 tags Open Graph + tags
  de favicon das 4 páginas): a única URL absoluta usada em `og:image`/
  `og:url` em todas as 4 páginas é `https://ljssoftware.com.br/...` — o
  domínio de produção real do projeto, documentado em `SDD.md` Seção 3
  (`ljssoftware.com.br`) e no fluxograma de arquitetura (linha 54), e
  citado em ADR-002 (hospedagem/DNS) — não um domínio externo/de terceiro.
  Nenhuma outra tag `<meta>` introduzida por T4.1 referencia URL de
  domínio diferente.
- `og:image` aponta para `assets/img/logo/logo-ljssoftware-transparente.png`
  — arquivo real, local, já auditado nos Lotes 1/3 (G-14, nenhuma arte
  nova) — não expõe nenhum ativo novo nem dado sensível (é o logotipo
  público da marca).
- `og:title`/`og:description` espelham `<title>`/`meta description` já
  auditados funcionalmente pelo QA — nenhum conteúdo além do texto
  institucional público das próprias páginas; nenhum comentário/atributo
  novo introduzido por T4.1 contém caminho local, credencial ou informação
  de ambiente de desenvolvimento.
- `<link rel="icon">`/`apple-touch-icon>` referenciam só os 4 arquivos de
  favicon já existentes e auditados em T1.4 (Lote 1) — nenhum arquivo novo
  de favicon introduzido, nenhuma superfície nova.

### 3. `robots.txt` / `sitemap.xml` (T4.3) — vazamento de rota sensível

**Achado: nenhum.**

- `robots.txt`: `User-agent: *` / `Allow: /` (permissivo, esperado para site
  institucional público) + `Disallow: /assets/css/*.smoke.html` — o padrão
  cobre `base.smoke.html`, `footer.smoke.html`, `header.smoke.html`,
  `tokens.smoke.html` (os 4 arquivos de smoke-test residentes em
  `assets/css/`, confirmado por listagem de diretório), reforçando em
  camada de crawler a tag `<meta name="robots" content="noindex,
  nofollow">` que cada um já tem individualmente (Lotes 1/2, incluindo
  `base.smoke.html` — ver item 4 abaixo, RL1.2 agora corrigida). Nenhuma
  rota de desenvolvimento/admin/staging (ex.: `/admin`, `/dev`, `/.git`,
  `/config`) é mencionada em nenhuma direção — nem para permitir nem para
  bloquear, coerente com "site sem servidor/backend" (G-01/G-04).
  `Sitemap: https://ljssoftware.com.br/sitemap.xml` aponta para o próprio
  arquivo do domínio de produção, sem vazamento.
- **Ponto observado, não um achado:** `assets/fonts/fonts.smoke.check.js`
  (fora de `assets/css/`) não está coberto pelo padrão `Disallow` de
  `robots.txt`, que só cobre `assets/css/*.smoke.html` — mas esse arquivo
  já tem sua própria tag `<meta name="robots" content="noindex, nofollow">`
  desde o Lote 1 (auditado e confirmado então), que é a camada de proteção
  primária contra indexação (funciona independente de `robots.txt`); o
  `Disallow` de `robots.txt` é reforço defensivo adicional, não a única
  barreira. Não é uma lacuna de segurança — é o mesmo risco residual de
  publicação indevida de artefato de desenvolvimento já registrado desde o
  Lote 1 (recomendação operacional ao chapéu DevOps: pipeline de deploy
  deve publicar só as páginas reais).
- `sitemap.xml`: XML bem formado, 3 `<loc>` absolutas em
  `https://ljssoftware.com.br/`, `404.html` corretamente excluído — nenhuma
  URL de rota não-pública, nenhum parâmetro de query sensível, nenhum
  identificador interno.

### 4. `assets/css/a11y-contrast-check.js` (T4.2) — escopo de execução (mesma checagem dos Lotes 1/2)

**Achado: nenhum; confirmação do padrão já aprovado.**

- Leitura completa do arquivo: script Node standalone, sem `require`/
  `import` de módulo de terceiro (`package.json` inexistente, coerente com
  G-01), sem nenhuma chamada de rede (`fetch`/`http.request`/`https.get`),
  sem `fs.writeFileSync`/escrita em disco — só funções puras de cálculo de
  cor/contraste (`srgbToLinear`, `relativeLuminance`, `compositeOver`,
  `contrastRatio`) operando sobre constantes hexadecimais hardcoded no
  próprio arquivo, sem leitura de arquivo externo (diferente de
  `tokens.contrast-check.js`/`fonts.smoke.check.js`, T1.1/T1.2, que liam
  arquivos do repositório — aqui nem isso: os valores são copiados
  manualmente dos tokens reais, conferidos linha a linha por este Validador
  contra `tokens.css`/`components.css`, mesma verificação já registrada
  pelo QA).
- `grep` por `<script.*a11y-contrast-check` nas 4 páginas reais e em
  qualquer `.html` do projeto: nenhuma ocorrência — não é servido ao
  visitante, é ferramenta de desenvolvimento/CI local, mesmo padrão de
  `tokens.contrast-check.js`/`fonts.smoke.check.js` já auditado no Lote 1.
- Mudança de opacidade do blob 2 do Hero (`components.css`, seção
  "Hero (T3.1)") e os 3 headings alterados em `apps.html`: confirmado por
  leitura direta que ambas as mudanças são estritamente CSS declarativo
  (`color-mix()`, `background-image`) e troca de tag semântica
  (`<h3>`→`<h2>`) — nenhum atributo de evento, nenhum `<script>` novo,
  nenhuma URL/CDN introduzida por essas 2 alterações. Não introduz nada
  fora do escopo CSS/HTML declarativo, conforme escopo desta auditoria.

### 5. Dado sensível / segredo commitado (varredura geral do lote)

**Achado: nenhum.**

- Varredura por padrões de segredo (`api[_-]?key`, `secret`, `password`,
  chave privada, `AKIA`, `Bearer `, `token`) em todos os arquivos
  novos/alterados do lote (`_headers`, `robots.txt`, `sitemap.xml`,
  `a11y-contrast-check.js`, as 4 páginas HTML, `components.css`): nenhuma
  ocorrência de segredo real. Nenhum arquivo binário novo neste lote.

### 6. Conformidade regulatória (LGPD)

**N/A / sem mudança de conclusão.** T4.1-T4.4 não introduzem nenhuma coleta,
processamento ou exposição de dado pessoal do visitante: meta tags SEO são
metadado público de página, `_headers` é configuração de borda sem payload
de dado de visitante, `robots.txt`/`sitemap.xml` são arquivos de descoberta
de crawler, e a auditoria de acessibilidade (T4.2) não toca em nenhum ponto
de coleta de dado. Mesma conclusão já registrada nos Lotes 1-3 — beacon do
Cloudflare Web Analytics continua inativo (T5.4 pendente).

### 7. Confirmação do débito de segurança pendente do Lote 1 (RL1.2)

**RL1.2 — corrigida, fora do escopo deste lote, confirmado por leitura do `TASK.md`.**

- `TASK.md`, seção "Refatoração Lote-1": RL1.2 (`<meta name="robots"
  content="noindex, nofollow">` em `assets/css/base.smoke.html`) está com
  Status **`Concluída`** — confirmado também por leitura direta do arquivo
  (`assets/css/base.smoke.html` tem a tag, na mesma posição/formatação dos
  outros 3 smoke-tests). O débito de baixa severidade do Lote 1 não está
  mais em aberto; não há prazo a monitorar para ele.
- RL1.1 (favicon.ico multi-tamanho) segue **Pendente** no `TASK.md` — não é
  um item de segurança (é achado funcional do QA sobre fidelidade de
  metadado do ícone), fora do escopo desta auditoria de segurança; sinalizado
  apenas para registro de que não foi perdido de vista, mesmo prazo já
  definido (antes do deploy de produção, Lote 5).

### 8. Requisitos de segurança operacional para o chapéu DevOps

- Confirmar em preview deploy real (primeira chamada de `/deploy`, antes do
  deploy de produção): headers de `_headers` de fato aplicados a `/*` e
  ausência de erro de bloqueio de CSP no console do navegador nas 4
  páginas — pendência estática já antecipada pelo QA e por este Validador,
  não bloqueante, mas deve ser checklist item do chapéu DevOps antes de
  liberar produção.
- G-08 (HTTPS obrigatório + redirect automático) é escopo do Lote 5 (T5.3)
  — `Referrer-Policy: strict-origin-when-cross-origin` já configurado
  antecipando esse comportamento, mas a ativação real do "Always Use
  HTTPS" e do redirect `www`→apex continua pendente, fora deste lote.
- Mantém-se a recomendação já registrada nos Lotes 1-3: o pipeline de
  deploy deve publicar só as páginas reais + assets associados, excluindo
  `*.smoke.html`/scripts de verificação Node (`tokens.contrast-check.js`,
  `fonts.smoke.check.js`, e agora também `a11y-contrast-check.js`).
- Quando T5.4 habilitar o beacon real do Cloudflare Web Analytics,
  reconfirmar que o domínio físico do `<script src=...>` inserido no HTML
  bate exatamente com `https://static.cloudflarewebanalytics.io` já
  liberado em `script-src`/`connect-src` de `_headers` — se o domínio
  oficial divergir nesse momento (já sinalizado como possível pela nota do
  Executor em T4.4), `_headers` precisa de ajuste pontual antes do beacon
  funcionar, senão a CSP bloqueará o próprio analytics.

---

## Achados deste lote (resumo)

| # | Item | Severidade | Status | Ação |
|---|---|---|---|---|
| — | Nenhum achado novo de severidade Baixa, Média, Alta ou Crítica neste lote | — | — | — |

Nenhum achado **Alto/Crítico** neste lote. Nenhum achado de compliance
obrigatório em aberto. O achado Simples do QA em T4.4 (RL4.1, lacuna de
documentação sobre `404.html` também depender de `style-src
'unsafe-inline'`) foi confirmado e ampliado com uma avaliação de segurança
própria deste Validador (item 1.b acima) — concluída como risco residual
não explorável na arquitetura atual do site, sem gerar uma nova entrada de
débito em `Refatoração Lote-4` (não duplica RL4.1).

## Fechamento — Lote 4 (chapéu DevSecOps)

- Nenhum achado de severidade alta/crítica.
- Nenhum item de compliance obrigatório pendente (LGPD: N/A).
- Nenhum item novo de débito de baixa/média severidade a registrar em
  `Refatoração Lote-4` — o único achado do lote (RL4.1, do QA) já está
  registrado e é de documentação, sem dimensão de segurança adicional que
  justifique item próprio (avaliado e descartado no item 1.b acima).
- Débito de segurança do Lote 1 (RL1.2) confirmado **corrigido** — não há
  mais prazo a monitorar antes do deploy de produção por conta dele.
- Nenhum achado de relevância estratégica a sinalizar ao Gestor neste lote.
- Nada nesta auditoria exige redesenho de dependência/decomposição — não
  escala ao `coordenador`.

**Veredito geral do Lote 4 (chapéu DevSecOps): Aprovado, sem ressalvas e
sem débito de segurança novo registrado.** A CSP de `_headers` restringe
corretamente a `'self'` + o único domínio de beacon autorizado
(ADR-003/G-11), `X-Frame-Options: DENY`/`frame-ancestors 'none'` protegem
contra clickjacking, `Referrer-Policy`/`Permissions-Policy` estão
adequados, a cobertura é `/*` (G-09 satisfeita) e nenhum segredo está
embutido no arquivo. Nenhum achado bloqueia deploy. Combinado com o
veredito funcional do chapéu QA ("Aprovado com ressalvas", 1 achado Simples
de documentação, `QA-REPORT.md`), o Lote 4 tem a dupla aprovação (QA +
DevSecOps) necessária para o chapéu DevOps considerar este build no fluxo
de deploy — sujeito ainda: (1) à confirmação em preview real de que
`_headers` é de fato aplicado em produção sem erro de CSP no console
(pendência não-bloqueante já sinalizada acima); (2) ao fechamento
estrutural do lote (checagem de dependências/tarefas `Bloqueada`), que este
Validador realiza a seguir; e (3) aos débitos de baixa severidade ainda
pendentes de outros lotes (RL1.1, favicon multi-tamanho, não relacionado a
segurança) antes do deploy de produção efetivo (Lote 5).

---

## Refatoração Lote-1

**Escopo auditado:** RL1.1 e RL1.2 — as 2 tarefas do lote `Refatoração
Lote-1`, ambas `Concluída` no `TASK.md` e já aprovadas funcionalmente pelo
chapéu QA sem ressalvas (`QA-REPORT.md`, seção "Refatoração Lote-1").
Pré-condição de auditoria satisfeita.

**Natureza do lote:** RL1.1 é a regeneração de um artefato binário
(`assets/img/favicon/favicon.ico`), sem lógica de servidor nem input de
usuário — mesma natureza de baixa superfície de ataque já registrada para o
restante dos favicons no Lote 1. RL1.2 é a correção do próprio débito Baixo
registrado por este Validador no Lote 1 (achado #1): adição de uma única
tag `<meta name="robots">` em `assets/css/base.smoke.html`, sem lógica
nova.

**Metodologia:** inspeção binária de `favicon.ico` por parsing direto do
cabeçalho ICO (contagem de imagens, offsets e tamanhos de cada entrada,
para confirmar embedding real e não sobreposição/corrupção), extração de
todas as strings ASCII imprimíveis (≥4 caracteres) do arquivo completo com
varredura por padrão de payload polyglot (`<script`, `javascript:`,
`onerror=`, `onload=`) e por metadado de ambiente local (`C:\`, `/home/`,
`Users`, nome de usuário do ambiente de desenvolvimento, `OneDrive`,
`LJSSoftware`); `git diff` linha a linha de `assets/css/base.smoke.html`
contra a versão do Lote 1 para confirmar que nenhuma mudança além da tag
`robots` foi introduzida.

### Arquivos auditados

`assets/img/favicon/favicon.ico`, `assets/css/base.smoke.html`.

### 1. RL1.1 — `favicon.ico` multi-resolução: payload embutido / metadado sensível

**Achado: nenhum.**

- Parsing do cabeçalho ICO confirma **3 entradas reais**: 16×16 (844 bytes,
  offset 54), 32×32 (2249 bytes, offset 898), 48×48 (3810 bytes, offset
  3147) — tamanho total do arquivo 6957 bytes, offsets e tamanhos
  consistentes entre si (cada entrada começa exatamente onde a anterior
  termina, sem sobreposição, e nenhuma extrapola o fim do arquivo). Cada
  entrada é um PNG embutido válido (assinatura confirmada pelos chunks
  `IHDR`/`IDAT`/`IEND` presentes 3 vezes, um conjunto por resolução) — este
  é o formato ICO moderno padrão (imagens PNG comprimidas dentro do
  container ICO), não uma anomalia. Resolve de fato o achado funcional do
  QA (antes só 16×16 estava presente).
- Extração de todas as strings ASCII imprimíveis do arquivo (90 strings no
  total): nenhuma corresponde a `<script`, `javascript:`, `onerror=` ou
  `onload=` — as únicas strings legíveis são os marcadores de chunk PNG
  (`IHDR`, `IDATx`, `IEND`) e sequências de bytes de dados de imagem
  comprimidos (ruído binário sem significado textual, esperado em qualquer
  PNG). Nenhum payload polyglot embutido.
- Mesma varredura por caminho local (`C:\`), diretório home (`/home/`),
  nome de usuário/pasta do ambiente de desenvolvimento (`Users`, `leand`,
  `leandro`, `OneDrive`, `LJSSoftware`): nenhuma ocorrência em nenhuma das
  90 strings extraídas — nenhum metadado de ambiente de desenvolvimento
  vazou para o binário regenerado.
- Conclusão: RL1.1 é um artefato binário limpo, sem payload embutido e sem
  vazamento de metadado sensível.

### 2. RL1.2 — tag `robots` em `base.smoke.html`: escopo da mudança

**Achado: nenhum; confirmação de que o débito foi corrigido sem efeito
colateral.**

- `git diff` de `assets/css/base.smoke.html` contra a versão commitada no
  Lote 1 mostra exatamente **uma linha adicionada**:
  `<meta name="robots" content="noindex, nofollow">`, inserida na mesma
  posição relativa (logo após `<title>`, antes dos `<link rel="stylesheet">`)
  já usada em `tokens.smoke.html`/`fonts.smoke.html`/`header.smoke.html`/
  `footer.smoke.html`. Nenhuma outra linha do arquivo foi tocada — nenhum
  `<style>`, nenhum CSS de smoke-test, nenhum `<script>` foi
  adicionado/alterado/removido.
- Isso corrige de fato o achado Baixo #1 registrado no Lote 1: dos 5
  arquivos `.smoke.html` do projeto, todos agora têm a mesma tag `robots`
  (`base.smoke.html`, `tokens.smoke.html`, `fonts.smoke.html`,
  `header.smoke.html`, `footer.smoke.html`), fechando a divergência de
  padrão identificada. `robots.txt` (Lote 4) já reforçava esse arquivo
  específico com `Disallow: /assets/css/*.smoke.html`, mas a proteção
  primária (a tag `<meta name="robots">` no próprio arquivo, ativa
  independente de `robots.txt`) só passou a existir de fato com esta
  correção.
- Nenhuma nova superfície de risco introduzida — a mudança é estritamente
  aditiva e restrita a uma tag de metadado declarativo, sem impacto
  funcional além do já validado pelo QA.

### 3. Conformidade regulatória (LGPD)

**N/A.** Nenhuma das duas tarefas introduz coleta, processamento ou
exposição de dado pessoal — mesma conclusão já registrada para o Lote 1.

### 4. Requisitos de segurança operacional para o chapéu DevOps

- Nenhum item novo. Mantém-se a recomendação já registrada desde o Lote 1:
  o pipeline de deploy deve publicar só as páginas reais + assets
  associados, excluindo `*.smoke.html`/scripts de verificação Node — agora
  com o risco residual de `base.smoke.html` mitigado em uma camada a mais
  (tag `robots` própria, além do `Disallow` de `robots.txt`).

---

## Achados deste lote (resumo)

| # | Item | Severidade | Status | Ação |
|---|---|---|---|---|
| — | Nenhum achado novo de severidade Baixa, Média, Alta ou Crítica neste lote | — | — | — |

Nenhum achado **Alto/Crítico** neste lote. Nenhum achado de compliance
obrigatório em aberto.

## Fechamento — Refatoração Lote-1 (chapéu DevSecOps)

- Nenhum achado de severidade alta/crítica em RL1.1 ou RL1.2.
- Nenhum item de compliance obrigatório pendente.
- RL1.2 confirmado como **correção efetiva** do débito Baixo #1 registrado
  no Lote 1 — não há mais nenhum débito de segurança em aberto herdado do
  Lote 1 (RL1.1 nunca foi um item de segurança; era achado funcional do
  QA, também já corrigido e auditado aqui do ponto de vista de segurança
  do binário).
- Nenhum item novo de débito de baixa/média severidade a registrar — nada
  a acrescentar a `Refatoração Lote-1` nem a abrir uma nova refatoração.
- Nenhum achado de relevância estratégica a sinalizar ao Gestor.
- Nada nesta auditoria exige redesenho de dependência/decomposição — não
  escala ao `coordenador`.

**Veredito geral da Refatoração Lote-1 (chapéu DevSecOps): Aprovado, sem
ressalvas e sem débito de segurança pendente.** RL1.1 (favicon
multi-resolução) não contém payload embutido nem metadado sensível; RL1.2
corrigiu de fato o único débito de segurança do Lote 1, sem efeito
colateral. Combinado com o veredito funcional do chapéu QA ("Aprovado",
`QA-REPORT.md`, seção "Refatoração Lote-1"), este lote de refatoração tem a
dupla aprovação (QA + DevSecOps) necessária para o chapéu DevOps considerar
o build no fluxo de deploy — sujeito apenas ao fechamento estrutural do
lote e aos demais débitos/pendências não relacionados à segurança já
registrados em lotes anteriores (nenhum deles bloqueante).

---

## Refatoração Lote-4

**Escopo auditado:** RL4.1 — única tarefa implementada do lote `Refatoração
Lote-4`, `Concluída` no `TASK.md` e já aprovada funcionalmente pelo chapéu
QA com ressalvas (`QA-REPORT.md`, seção "Refatoração Lote-4" — 1 achado
Simples de referência de linha imprecisa, sem impacto no critério de
aceite central, sem retorno ao `executor`; virou a tarefa RL4.2, ainda
`Pendente` no `TASK.md`). Pré-condição de auditoria satisfeita. RL4.2 está
fora do escopo desta auditoria — é ajuste ainda não implementado sobre o
próprio comentário aqui avaliado.

**Natureza do lote:** RL4.1 é puramente documental — um comentário novo
(linhas `#`) no topo de `_headers`, sem nenhuma alteração de diretiva real
da CSP ou de qualquer outro header de segurança. Superfície de ataque
inalterada; a relevância de segurança do item está inteiramente em (a)
garantir que o comentário não vaze segredo e (b) garantir que a
documentação não induza, no futuro, uma remoção incorreta de
`'unsafe-inline'` de `style-src` por sub-representar quais páginas
dependem dela.

**Metodologia:** leitura integral de `_headers` (todas as 29 linhas,
comentário e diretivas), comparação linha a linha da diretiva
`Content-Security-Policy` real contra a última versão já auditada e
aprovada na seção "Lote 4" acima, varredura por padrão de segredo/
credencial restrita ao texto do comentário novo, e reexecução independente
do `grep` por `style=` em `apps.html`/`sobre.html` para validar as
afirmações factuais do comentário sobre quais arquivos — e, mais
importante para a motivação de segurança de RL4.1, que os 3 arquivos
citados batem com a realidade do código (não faltou nenhum).

### Arquivos auditados

`_headers` (integral), `apps.html`, `sobre.html`, `404.html` (grep/leitura
pontual de confirmação).

### 1. Comentário novo — estritamente documentação, nenhuma diretiva real alterada

**Achado: nenhum.**

- `_headers` linhas 1-9: bloco de comentário novo (todas as linhas
  iniciadas por `#`), citando os 3 arquivos que dependem de `style-src
  'unsafe-inline'` (`apps.html`, `sobre.html`, `404.html`) e a
  justificativa técnica (dois padrões de estilo inline — atributo `style=`
  e bloco `<style>` — ambos exigidos pela especificação CSP a estarem sob
  a mesma diretiva).
- A diretiva `Content-Security-Policy` real (linha 24 do arquivo atual)
  tem `style-src 'self' 'unsafe-inline'` — textualmente idêntica, nessa
  parte específica, à mesma diretiva já auditada e aprovada na seção "Lote
  4" acima (linha 701 daquele registro). Nenhuma palavra de `style-src` foi
  alterada por RL4.1.
- **Nota de escopo, não um achado desta tarefa:** a linha completa de CSP
  no `_headers` atual difere da registrada na seção "Lote 4" no domínio de
  `script-src`/`connect-src` (`static.cloudflarewebanalytics.io` →
  `static.cloudflareinsights.com`/`cloudflareinsights.com`). Essa mudança
  é de uma correção separada, já documentada no próprio arquivo (linhas
  11-22, "CORRECAO (Validador, chapeu DevOps, preparação de T5.4)"),
  atribuída a uma preparação de infraestrutura do chapéu DevOps fora do
  escopo de RL4.1/deste lote de refatoração, e sem nenhuma relação com
  `style-src`. Confirmado que, além dessa correção de domínio já registrada
  e datada, nenhuma outra diretiva (`default-src`, `script-src`, `img-src`,
  `font-src`, `connect-src`, `object-src`, `base-uri`, `form-action`,
  `frame-ancestors`) nem nenhum dos demais headers
  (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`) foi tocado — todos idênticos aos já auditados e
  aprovados na seção "Lote 4".
- Confirma o ponto 1 do escopo desta auditoria: a mudança de RL4.1 é
  estritamente um comentário novo, sem efeito na política de segurança
  real.

### 2. Varredura por segredo/credencial no comentário novo

**Achado: nenhum.**

- Varredura por padrões de segredo (`api[_-]?key`, `secret`, `password`,
  chave privada, `AKIA`, `Bearer `, `token`) nas 22 linhas de comentário do
  arquivo (as 9 do bloco novo de RL4.1 + as 13 do bloco de correção de
  domínio já auditado): nenhuma ocorrência. O texto é inteiramente
  documentação técnica sobre CSP/dependência de páginas — nenhum valor de
  credencial, chave ou token, real ou de exemplo, embutido.

### 3. Precisão factual do comentário — motivação de segurança real de RL4.1

**Achado: nenhum problema na citação dos 3 arquivos; achado Simples do QA
confirmado sem dimensão de segurança adicional (ver item 4).**

- A motivação de segurança de RL4.1 não é o comentário em si (que não
  altera nenhum controle), mas **evitar que uma documentação incompleta
  induza um desenvolvedor futuro a remover `'unsafe-inline'` de
  `style-src`** por acreditar, incorretamente, que menos páginas dependem
  dela do que na realidade — o que quebraria a página não citada. Esse é
  precisamente o risco que motivou o achado original do QA em T4.4 (nota
  do Executor não citava `404.html`).
- Reexecução independente da varredura por `style=`/`<style` nas 4 páginas
  reais (mesmo método já usado na auditoria do Lote 4 acima): confirma que
  são exatamente 3 os arquivos dependentes de `'unsafe-inline'` —
  `apps.html` (2 atributos `style=`, linhas 78-79), `sobre.html` (5
  atributos `style=`, linhas 51-69) e `404.html` (bloco `<style>` no
  `<head>`, linhas 20-70). O comentário atual de `_headers` cita
  corretamente os 3, sem faltar nenhum e sem incluir nenhum arquivo a
  mais — a lacuna que motivou RL4.1 está de fato fechada.
- Nenhum quarto arquivo do projeto (`index.html`, `assets/css/*.smoke.html`)
  usa `style=`/`<style>` inline (confirmado por grep dedicado) — se
  `'unsafe-inline'` fosse removida hoje com base só na leitura do
  comentário, nenhuma página adicional além das 3 já citadas seria afetada
  incorretamente. O comentário está, portanto, completo o suficiente para
  cumprir sua função preventiva.

### 4. Achado Simples do QA (referência de linha "~67-68" vs real 78-79) — sem dimensão de segurança adicional

**Achado: nenhum, confirmação.**

- Reexecução independente do grep em `apps.html`: os 2 atributos `style=`
  reais estão nas linhas **78-79**, não "~67-68" como o comentário afirma
  — confirma exatamente o achado já registrado pelo QA (`QA-REPORT.md`,
  seção "Refatoração Lote-4", achado #1, RL4.2).
- **Avaliação de segurança própria deste Validador:** essa imprecisão é
  estritamente de *localização* (o número da linha dentro do arquivo
  citado), não de *identificação* (qual arquivo depende da diretiva). O
  arquivo certo (`apps.html`) já está corretamente citado como dependente
  de `'unsafe-inline'`; o número de linha errado não muda essa conclusão
  nem cria um cenário em que um desenvolvedor futuro decida remover a
  diretiva por achar que `apps.html` não depende dela — o comentário afirma
  claramente que depende, só erra em qual linha exata. Não há, portanto,
  caminho para esse achado motivar uma remoção incorreta de
  `'unsafe-inline'` (o risco real que este Validador avalia neste lote,
  item 3 acima). **Não atinge o limiar de achado de segurança** — é
  puramente uma imprecisão de referência para navegação humana no código,
  já corretamente classificada pelo QA como Simples e encaminhada como
  RL4.2, sem necessidade de tratamento adicional por este Validador nem de
  nova entrada de débito em `Refatoração Lote-4`.

### 5. Conformidade regulatória (LGPD)

**N/A.** Comentário de documentação técnica sobre CSP, sem nenhuma coleta,
processamento ou exposição de dado pessoal — mesma conclusão já registrada
para o Lote 4.

### 6. Requisitos de segurança operacional para o chapéu DevOps

- Nenhum item novo. Mantêm-se os já registrados na seção "Lote 4" acima —
  em particular, a confirmação em preview real de que `_headers` é
  aplicado sem erro de CSP no console, e a reconciliação do domínio real
  do beacon do Cloudflare Web Analytics (já em andamento, conforme o
  próprio comentário de correção presente no arquivo, linhas 11-22, datado
  desta preparação de infraestrutura).

---

## Achados deste lote (resumo)

| # | Item | Severidade | Status | Ação |
|---|---|---|---|---|
| — | Nenhum achado novo de severidade Baixa, Média, Alta ou Crítica neste lote | — | — | — |

Nenhum achado **Alto/Crítico** neste lote. Nenhum achado de compliance
obrigatório em aberto. O achado Simples do QA (RL4.2, referência de linha
imprecisa) foi avaliado quanto à dimensão de segurança (item 4 acima) e
confirmado como não tendo nenhuma — não gera nova entrada de débito em
`Refatoração Lote-4`, permanece só como a tarefa RL4.2 já criada pelo QA.

## Fechamento — Refatoração Lote-4 (chapéu DevSecOps)

- Nenhum achado de severidade alta/crítica em RL4.1.
- Nenhum item de compliance obrigatório pendente.
- Nenhum item novo de débito de baixa/média severidade a registrar — RL4.2
  (correção de linha, já criada pelo QA) não tem dimensão de segurança
  adicional que justifique tratamento próprio deste Validador.
- Nenhum achado de relevância estratégica a sinalizar ao Gestor.
- Nada nesta auditoria exige redesenho de dependência/decomposição — não
  escala ao `coordenador`.

**Veredito geral da Refatoração Lote-4 (chapéu DevSecOps): Aprovado, sem
ressalvas e sem débito de segurança novo.** RL4.1 é estritamente
documentação — nenhuma diretiva de CSP ou outro header foi alterada;
nenhum segredo/credencial no comentário; os 3 arquivos citados como
dependentes de `'unsafe-inline'` batem com a realidade do código,
neutralizando o risco real que motivou a tarefa (remoção futura incorreta
da diretiva). O achado Simples do QA (RL4.2) é confirmado como imprecisão
de referência sem dimensão de segurança. Combinado com o veredito funcional
do chapéu QA ("Aprovado com ressalvas", `QA-REPORT.md`, seção "Refatoração
Lote-4"), este lote de refatoração tem a dupla aprovação (QA + DevSecOps)
necessária para o chapéu DevOps considerar o build no fluxo de deploy —
sujeito apenas ao fechamento estrutural do lote e aos demais
débitos/pendências não relacionados à segurança já registrados em lotes
anteriores (nenhum deles bloqueante; RL4.2 e RL1.1 seguem `Pendente`,
ambos com prazo antes do deploy de produção, nenhum de natureza de
segurança).

---

## Lote 5 — Deploy e Infraestrutura

**Escopo auditado:** T5.1, T5.2, T5.3, T5.4 — já aprovadas funcionalmente
pelo chapéu QA (`QA-REPORT.md`, seção "Lote 5", veredito "Aprovado com
ressalvas", 1 achado Simples em T5.3 — redirect `308` "clean URL" do
Cloudflare Pages, sem relação com segurança, registrado como RL5.1). Pré-
condição de auditoria satisfeita.

**Natureza do lote:** primeiro lote com infraestrutura real publicada —
domínio de produção ativo (`ljssoftware.com.br`, migrado do registro.br
para NS da Cloudflare), certificado TLS emitido, headers de borda
efetivamente servidos (não só declarados em arquivo), beacon real do
Cloudflare Web Analytics ativo com token de produção. Diferente dos Lotes
1-4 (auditoria 100% estática sobre arquivo em disco), aqui a superfície
auditável é a infraestrutura publicada em si — a fonte de verdade é a
resposta HTTP real, não o arquivo do repositório (que é apenas a
declaração de intenção até o deploy aplicá-la).

**Metodologia:** este Validador tem acesso de rede real (sem acesso a
paineis administrativos) e foi usado para auditar `https://ljssoftware.com.br`,
`https://www.ljssoftware.com.br`, `http://ljssoftware.com.br` e
`http://www.ljssoftware.com.br` via `curl` (status code, headers de
resposta completos, `Location` de redirect), `openssl s_client` para
inspecionar o certificado TLS real (emissor, validade, CN), consulta DNS
real (`nslookup`) aos registros MX, TXT (SPF) e TXT de `_dmarc`, requisição
HTTP direta a 8 arquivos de `dev/` (os mesmos já verificados pelo QA do
ponto de vista funcional, aqui auditados quanto a conteúdo sensível),
varredura de segredo/credencial em todo o repositório (não só no
código-fonte do lote), leitura completa dos 4 arquivos HTML publicados
(`public/*.html`) por vazamento de PII no evento custom de analytics, e
verificação cruzada do snippet do beacon contra a documentação oficial
pública da Cloudflare (`developers.cloudflare.com/web-analytics`) via
busca na web, para confirmar que não foi adulterado.

### 1. Headers de segurança em produção real (G-09, SDD.md Seção 7)

**Veredito: Aprovado.**

`curl -I https://ljssoftware.com.br/` retorna, na resposta HTTP real:

```
content-security-policy: default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
permissions-policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
x-frame-options: DENY
```

- **Byte a byte idêntico** ao conteúdo de `public/_headers` no repositório
  — confirma que o deploy aplicou exatamente a política declarada, sem
  divergência entre o que foi versionado e o que está de fato servido.
  Resolve a pendência explicitamente deixada em aberto pelo Lote 4
  ("verificação em preview/produção real depende do deploy, fora do
  escopo de execução local daquela tarefa") — este Validador é quem
  confirma essa verificação agora, com acesso de rede real.
- **CSP sem diretiva permissiva demais — confirmado.** Nenhuma ocorrência
  de `'unsafe-eval'` em nenhuma diretiva. Nenhum wildcard `*` em
  `script-src` (nem em nenhuma outra diretiva) — a única diretiva com
  `'unsafe-inline'` é `style-src`, já auditada e justificada nos Lotes
  4/RL4.1/RL4.2 (3 páginas com CSS inline estático, sem interpolação de
  dado externo, sem `<form>`/input de usuário que torne o vetor de
  CSS-exfiltration explorável — conclusão reafirmada aqui, nenhuma mudança
  de superfície neste lote).
- **Domínios liberados são exatamente os necessários para o beacon — sem
  excesso.** `grep` deste Validador pela resposta HTTP real confirma
  exatamente 2 ocorrências de domínio externo, ambas do Cloudflare Web
  Analytics: `https://static.cloudflareinsights.com` em `script-src`
  (origem do `beacon.min.js`) e `https://cloudflareinsights.com` em
  `connect-src` (destino do `navigator.sendBeacon` disparado pelo próprio
  script da Cloudflare, confirmado contra a documentação oficial — é o
  host correto, não `static.cloudflareinsights.com` repetido, porque o
  `sendBeacon` do script vai para o domínio "raiz" do produto, não para o
  subdomínio `static.*` que só serve o arquivo `.js`). Nenhum outro CDN,
  tag manager, pixel de terceiro ou domínio de fonte externo presente —
  G-11/ADR-003 satisfeitas também na resposta HTTP real, não só no
  arquivo-fonte.
- Confirma, com acesso de rede real, o item que o `SECURITY-REVIEW.md`
  Lote 4 havia deixado como "não verificável nesta auditoria estática": a
  correção de domínio (`static.cloudflarewebanalytics.io` → domínio real)
  registrada em `DEPLOY.md`/T5.1-T5.4 está de fato em produção, aplicada
  corretamente.

### 2. TLS/HTTPS (G-08, SDD.md Seção 7)

**Veredito: Aprovado, com 1 achado Baixo (observação, não bloqueante).**

- Certificado TLS real inspecionado via `openssl s_client` +
  `openssl x509`: `subject=CN=ljssoftware.com.br`,
  `issuer=Google Trust Services, CN=WE1`, válido de `Sep 8 2026` a
  `Dec 7 2026` — certificado válido, emissor confiável (Cloudflare
  Universal SSL, ciclo curto de ~90 dias com renovação automática, padrão
  do produto). Nenhum erro de handshake, nenhum aviso de nome incompatível.
- `http://ljssoftware.com.br` → `301` → `https://ljssoftware.com.br/` —
  confirmado por requisição real (header `Location`), reconfirmando o já
  verificado pelo QA.
- `http://www.ljssoftware.com.br` → `301` → `https://www.ljssoftware.com.br/`
  → (segundo hop) `301` → `https://ljssoftware.com.br/` — o primeiro hop
  redireciona para HTTPS no mesmo host (`www`), o segundo aplica a
  Redirect Rule de zona (T5.3) para o domínio apex. Ambos os hops
  permanecem em HTTPS a partir do segundo salto — nenhum ponto da cadeia
  fica em HTTP às claras após o primeiro redirect, e o primeiro redirect
  em si (`http://www` → `https://www`) já é a proteção mínima exigida por
  G-08. Não há downgrade possível: toda variante (`http`/`https` ×
  apex/`www`) converge para `https://ljssoftware.com.br/` sem nenhum
  caminho que permaneça em texto claro além do primeiro salto inevitável
  de quem digitou `http://` explicitamente.
- **Achado Baixo (novo, deste Validador) — ausência de HSTS
  (`Strict-Transport-Security`).** Nenhuma das respostas reais
  (apex/`www`, com/sem `https`) inclui o header `Strict-Transport-Security`.
  **Avaliação de exigência formal:** nem G-08 (`GUARDRAILS.md`) nem a
  Seção 7 do `SDD.md` (que lista explicitamente os 5 headers exigidos —
  CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy` — sem incluir HSTS) exigem esse header
  nominalmente; G-08 exige apenas "TLS obrigatório... HTTP redireciona
  para HTTPS automaticamente", satisfeito pelo redirect `301` confirmado
  acima. **Portanto não é uma violação de requisito obrigatório do
  projeto** — é uma camada adicional de defesa (elimina a janela teórica
  em que um usuário que sempre digita `http://` ou segue um link antigo
  em `http://` fica exposto a um ataque de downgrade/interceptação no
  primeiro request, antes do redirect do servidor acontecer; HSTS resolve
  isso client-side, via cache do navegador, a partir da segunda visita).
  **Severidade: Baixa** (não compromete nenhum requisito obrigatório
  hoje; o site já força HTTPS via redirect server-side em toda rota).
  Recomendação: habilitar "Enable HSTS" no painel Cloudflare (SSL/TLS →
  Edge Certificates — mesma seção onde "Always Use HTTPS" já foi
  habilitado em T5.3), com `max-age` inicial conservador (ex.: 6 meses) e
  sem `preload` até confirmar estabilidade, dado que é uma ação
  praticamente sem custo/risco para este site (sem subdomínio HTTP
  legado, sem necessidade de HTTP em nenhuma rota). Ação registrada como
  débito em `Refatoração Lote-5` (RL5.2, ver Fechamento abaixo) — não
  bloqueia deploy.

### 3. Exposição de `dev/` (checagem de segurança sobre o já confirmado pelo QA)

**Veredito: Aprovado.**

- Requisição HTTP real a 8 arquivos de `dev/` (os 3 `.smoke.html`
  originais dos Lotes 1/2 mais os 2 scripts `.js` de contraste e os 2
  arquivos de fonte movidos na reestruturação desta fase):
  `dev/css/tokens.smoke.html`, `dev/css/base.smoke.html`,
  `dev/css/header.smoke.html`, `dev/css/footer.smoke.html`,
  `dev/css/tokens.contrast-check.js`, `dev/css/a11y-contrast-check.js`,
  `dev/fonts/fonts.smoke.check.js`, `dev/fonts/fonts.smoke.html` —
  **os 8 respondem `404`** em `https://ljssoftware.com.br/dev/...`,
  confirmado por este Validador independentemente da checagem funcional
  do QA (que testou 1 arquivo representativo). Resolve definitivamente,
  do ponto de vista de segurança, o risco de "publicação indevida de
  artefato de desenvolvimento" registrado como recomendação operacional
  desde o Lote 1 e como débito Baixo em RL1.2 (que tratava só da tag
  `robots` de 1 arquivo específico, mitigação de indexação — agora
  superada por uma barreira mais forte: o arquivo simplesmente não é
  publicado).
- **Avaliação de conteúdo dos scripts `.js` de `dev/`, do ponto de vista
  de segurança (mesmo que hoje não publicados — defesa em profundidade
  contra reconfiguração futura acidental do Build output directory):**
  releitura completa de `dev/css/tokens.contrast-check.js`,
  `dev/css/a11y-contrast-check.js` e `dev/fonts/fonts.smoke.check.js`
  confirma, nesta auditoria, que nenhum dos 3 contém segredo/credencial,
  caminho de sistema de arquivos local (`C:\`, `/home/`), endpoint
  interno, ou qualquer informação que não fosse apropriada para um
  visitante ver — são só cálculo de contraste de cor e varredura de
  padrão de texto em arquivos do próprio repositório, sem I/O de rede
  (mesma conclusão já registrada nos Lotes 1/2 para as versões anteriores
  destes scripts, reconfirmada após o `git mv` para `dev/`, sem alteração
  de conteúdo além do caminho). Mesmo se um erro de configuração futuro
  reexpuser `dev/`, o pior cenário é vazamento de ferramentas de
  desenvolvimento sem valor de exploração (nenhum dado sensível, nenhuma
  lógica de servidor, nenhuma credencial).

### 4. DNS — MX/SPF/DMARC (RT-03, decisão de não aceitar/enviar e-mail no domínio)

**Veredito: Aprovado.**

Consulta DNS real (`nslookup`) contra os servidores autoritativos, após a
migração de NS para a Cloudflare (T5.2):

- **MX:** `ljssoftware.com.br MX preference = 0, mail exchanger = (root)`
  — "null MX" (RFC 7505), declara explicitamente que o domínio não aceita
  e-mail. Confirmado correto.
- **SPF (TXT):** `"v=spf1 -all"` — política "hard fail" total, nenhum
  servidor autorizado a enviar e-mail em nome do domínio. Confirmado
  correto e consistente com o null MX (nenhuma contradição entre "não
  recebe" e "ninguém pode enviar como se fosse este domínio").
  Complemento verificado: com `-all` (hard fail) em vez de `~all` (soft
  fail), qualquer tentativa de spoofing do domínio em e-mail é rejeitada
  de forma mais estrita pelos servidores receptores que respeitam SPF —
  postura correta para um domínio que nunca deve enviar e-mail.
- **DMARC (TXT em `_dmarc.ljssoftware.com.br`):**
  `"v=DMARC1; p=reject;"` — política de rejeição total para mensagens que
  falhem alinhamento SPF/DKIM, reforçando o null MX/SPF acima em uma
  terceira camada. Confirmado correto.
- **Conclusão:** as 3 camadas (MX, SPF, DMARC) continuam corretas e
  mutuamente consistentes após a migração de NS para a Cloudflare —
  nenhuma regressão da decisão já tomada (RT-03) de que o domínio não
  deve aceitar nem permitir envio de e-mail em seu nome, reduzindo a
  superfície de spoofing/phishing usando o domínio institucional.
- **Observação (não um achado, item de rastreabilidade):** esta
  configuração de DNS (null MX/SPF/DMARC) não está documentada em nenhum
  artefato `.md` do projeto (`TASK.md`, `SDD.md`, `DEPLOY.md`) — foi
  confirmada apenas por consulta DNS direta nesta auditoria. Não é um
  achado de segurança (a configuração real está correta), mas é uma
  lacuna de rastreabilidade: um auditor futuro sem acesso de rede não
  teria como confirmar essa decisão só pelos artefatos do repositório.
  Sugestão de baixo custo: registrar esses 3 valores em `DEPLOY.md` (ou
  em uma nova nota de T5.2) na próxima vez que o chapéu DevOps tocar o
  arquivo — não gera tarefa própria em `Refatoração Lote-5` por ser
  puramente documental e não bloquear nada.

### 5. Cloudflare Web Analytics — integridade do snippet e ausência de PII (T5.4)

**Veredito: Aprovado.**

- Snippet publicado, idêntico nas 4 páginas (`public/index.html:260`,
  `public/apps.html:171`, `public/sobre.html:139`, `public/404.html:160`):
  ```html
  <script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "bc3ce694258f45c393941b292ba37ac9"}'></script>
  ```
- **Verificação contra a documentação oficial da Cloudflare** (busca
  dirigida a `developers.cloudflare.com/web-analytics`): o formato
  `<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "..."}'>` é uma variante
  **oficial e documentada** do snippet manual (alternativa ao formato com
  `defer`, usada para habilitar configuração adicional via `type=module`,
  ex. `spa`) — **não é uma adulteração**, é uma das duas formas
  legítimas que a própria Cloudflare distribui no painel. Domínio
  (`static.cloudflareinsights.com`), nome do arquivo (`beacon.min.js`) e
  formato do atributo `data-cf-beacon` batem exatamente com a
  documentação pública.
  Fonte: [Web Analytics for Single Page Applications (SPAs) · Cloudflare Web Analytics docs](https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/)
- `https://static.cloudflareinsights.com/beacon.min.js` responde `200`
  quando requisitado diretamente (confirmado via `curl`) — script real,
  hospedado pela própria Cloudflare, não um domínio typosquatted/
  intermediário.
- **Ausência de PII no evento custom — confirmado por leitura de
  `assets/js/analytics.js` (inalterado desde T2.4/Lote 2, já auditado):**
  `trackEvent(eventName)` recebe e envia apenas a string fixa do nome do
  evento (`contato_email_click`/`contato_linkedin_click`, valores
  literais do mapa `EVENT_NAMES`, nunca construídos a partir de dado do
  visitante) para `window.__cfBeacon.track(...)`. Nenhum e-mail, IP
  manual, identificador de sessão, cookie ou qualquer dado do visitante é
  lido ou passado como argumento. Mesma conclusão já registrada nos Lotes
  2/3, agora confirmada com o beacon **realmente ativo** em produção
  (antes apenas teórica, pois o beacon estava inativo).

### 6. Segredos/credenciais

**Veredito: Aprovado.**

- Varredura por padrão de segredo (`api[_-]?key`, `secret`, `password`,
  chave privada, `AKIA`, `Bearer `) em **todo o repositório** (não só nos
  artefatos deste lote): as únicas ocorrências estão em documentação
  genérica de skills do próprio pipeline de agentes (`.claude/skills/
  aws-advisor/`, `.claude/skills/cloudflare-deploy/`,
  `.claude/PIPELINE-CONVENTIONS.md`) — texto de referência sobre boas
  práticas de gestão de segredos em nuvem (ex.: exemplos de
  `OPENAI_API_KEY`/`Bearer $CF_API_TOKEN` em documentação de terceiros
  vendorizada como skill), **não credenciais reais do projeto**. Nenhuma
  ocorrência nos arquivos publicados (`public/`), no repositório de
  desenvolvimento (`dev/`) ou em qualquer artefato de infraestrutura
  (`_headers`, `_redirects`, `robots.txt`, `sitemap.xml`).
- O token do Cloudflare Web Analytics (`bc3ce694258f45c393941b292ba37ac9`,
  presente nas 4 páginas) é público por design — a própria Cloudflare
  documenta que esse token é visível no código-fonte de qualquer site que
  usa o produto (não é uma API key privada, não concede nenhum acesso de
  escrita/leitura à conta) — consistente com a avaliação já registrada em
  `SECURITY-REVIEW.md` Lote 2 ("não é um segredo a proteger via variável
  de ambiente/CI"). Nenhuma ação necessária.
- Nenhum arquivo de configuração com credencial de conta Cloudflare ou
  registro.br presente no repositório — confirmado por varredura de nome
  de arquivo (`*credential*`, `*.env`, `*wrangler.toml*`,
  `*.cloudflare*`) e por leitura do `git status`: nenhum arquivo desse
  tipo rastreado ou não rastreado. Consistente com o modelo operacional
  já descrito em `DEPLOY.md` (autenticação feita fora do repositório, via
  painel/OAuth do Cloudflare Pages conectado ao Git).

### 7. Conformidade regulatória (LGPD)

**Veredito: N/A / Aprovado — mesma conclusão dos lotes anteriores, agora
com o beacon realmente ativo.**

- T5.4 ativa, pela primeira vez, o beacon real do Cloudflare Web
  Analytics — mas não muda a natureza da coleta já avaliada nos Lotes
  1-4: é um produto de analytics **agregado, sem cookie, sem
  fingerprinting individual**, por desenho do próprio produto Cloudflare
  (confirmado na documentação oficial consultada nesta auditoria, item 5
  acima) — nenhuma mudança na avaliação de compliance por essa ativação
  em si.
- Os eventos custom (`contato_email_click`/`contato_linkedin_click`)
  continuam sendo apenas nomes de evento agregados, sem payload de dado
  pessoal identificável do visitante (item 5 acima).
- Nenhum `<form>`/campo de coleta de dado em nenhuma das 4 páginas
  publicadas (G-04 seguindo intacto em produção, confirmado por leitura
  direta de `public/*.html`).
- **Conclusão: T5.4 não muda a conclusão de LGPD já registrada nos Lotes
  1-4** — a coleta permanece agregada/anonimizada/sem cookie mesmo com o
  beacon ativo, exatamente como antecipado em `SDD.md` Seção 7.

### 8. Requisitos de segurança operacional para o chapéu DevOps

- Nenhum item bloqueante. Recomendações:
  - Habilitar HSTS no painel Cloudflare (achado Baixo, item 2 acima,
    RL5.2).
  - Documentar a configuração DNS (null MX/SPF/DMARC) em `DEPLOY.md` na
    próxima janela de manutenção desse arquivo (observação, item 4 acima,
    sem tarefa própria).
  - Nenhuma ação nova além das já registradas nos Lotes 1-4 (RL1.1,
    RL1.2, RL4.1, RL4.2, todas de natureza não-bloqueante, seguem seu
    próprio prazo).

---

## Achados deste lote (resumo)

| # | Item | Severidade | Status | Ação |
|---|---|---|---|---|
| 1 | Ausência de `Strict-Transport-Security` (HSTS) em todas as respostas reais (apex/`www`) — não exigido nominalmente por G-08/SDD.md Seção 7 (que já são satisfeitos pelo redirect `301` real, confirmado), mas é uma camada adicional de defesa contra downgrade no primeiro request | **Baixa** | Débito registrado, não bloqueia deploy | Tarefa em `Refatoração Lote-5` (RL5.2, ver abaixo) |

Nenhum achado **Alto/Crítico** neste lote. Nenhum achado de compliance
obrigatório em aberto. Nenhuma diretiva de CSP permissiva demais. Nenhum
segredo/credencial exposto. `dev/` confirmado inacessível por requisição
real. DNS (MX/SPF/DMARC) confirmado correto pós-migração de NS. Beacon do
Web Analytics confirmado autêntico (documentação oficial) e sem PII.

## Fechamento — Lote 5 (chapéu DevSecOps)

- Nenhum achado de severidade alta/crítica.
- Nenhum item de compliance obrigatório pendente (LGPD: coleta
  agregada/anonimizada, sem cookie, mesmo com beacon ativo).
- Item de severidade Baixa (#1 acima) registrado como débito, com tarefa
  criada por este Validador em `Refatoração Lote-5` (mesmo lote de
  refatoração já aberto pelo chapéu QA para RL5.1):

  **Refatoração Lote-5 (atualização)**
  | ID | Tarefa | Origem | Prazo sugerido |
  |---|---|---|---|
  | RL5.1 | Resolver a duplicidade de URL introduzida pelo redirect `308` automático do Cloudflare Pages (`.html` → sem extensão) | QA-REPORT.md, achado #1 (T5.3) | Antes do deploy de produção final (após o Lote 6) |
  | RL5.2 | Habilitar HSTS (`Strict-Transport-Security`) no painel Cloudflare (SSL/TLS → Edge Certificates → Enable HSTS), com `max-age` inicial conservador (ex.: 6 meses), sem `preload` até confirmar estabilidade | SECURITY-REVIEW.md, achado #1 (Lote 5) | Antes do deploy de produção final (após o Lote 6); não bloqueia o deploy atual — o site já força HTTPS via redirect `301` server-side em toda rota, satisfazendo G-08 |

  Nenhum dos dois itens exige redesenho de dependência/decomposição — não
  escala ao `coordenador`. RL5.2 é uma ação de painel (mesma natureza de
  T5.2/T5.3), não uma correção de código — o chapéu DevOps é o dono
  natural da execução, quando o usuário confirmar acesso ao painel.
- Nenhum achado de relevância estratégica a sinalizar ao Gestor neste
  lote — HSTS é um endurecimento operacional de baixo custo, não uma
  decisão de negócio/compliance.

**Veredito geral do Lote 5 (chapéu DevSecOps): Aprovado com débito de
baixa severidade** (1 achado Baixo — ausência de HSTS, registrado como
RL5.2, prazo antes do deploy de produção final). Nenhum achado bloqueia
deploy. Combinado com o veredito funcional do chapéu QA ("Aprovado com
ressalvas", `QA-REPORT.md`, seção "Lote 5"), o Lote 5 tem a dupla
aprovação (QA + DevSecOps) necessária para o chapéu DevOps considerar este
build (já em produção) formalmente liberado pelo processo de governança —
o débito de segurança de baixa severidade (RL5.2), com prazo definido, não
impede o deploy seguir normalmente, conforme a regra geral de aprovação
condicional para achados de severidade baixa/média.

---

## Lote 6 — Confirmação de Conteúdo Pendente

**Escopo auditado:** T6.1, T6.2, T6.3 — já aprovadas funcionalmente pelo
chapéu QA (`QA-REPORT.md`, seção "Lote 6 — Confirmação de Conteúdo
Pendente", veredito "Aprovado, sem ressalvas técnicas"). Pré-condição de
auditoria satisfeita.

**Natureza do lote:** lote só de conteúdo (texto/URL), sem lógica nova —
e-mail confirmado sem mudança de valor, URL de LinkedIn institucional
trocada pelo perfil pessoal do stakeholder (decisão de negócio já tomada e
registrada no `TASK.md`, não reaberta aqui), e os 3 nomes/descrições reais
de app substituindo os placeholders da vitrine/prévia da Home. Nenhum
arquivo `.css`/`.js` tocado neste lote (confirmado por `git diff`/histórico
de commits — só `index.html`, `apps.html`, `sobre.html`, `404.html` e o
bloco de referência `dev/css/footer.smoke.html` foram alterados).

**Metodologia:** auditoria feita **primariamente por requisição HTTP real**
contra a produção (`https://ljssoftware.com.br`), mesma exigência já
aplicada pelo QA neste lote — não a nota de implementação do Executor nem o
veredito do QA como base de aprovação. As 4 páginas reais foram buscadas
via `curl` diretamente da internet (`index.html`, `apps.html`/`sobre.html`
via redirect `308` já registrado em RL5.1, `404.html` via rota inexistente
real, confirmando o redirect `/404` também documentado em RL5.1) e salvas
para inspeção linha a linha. Varredura por padrão de dado pessoal (nome,
e-mail alternativo, telefone, CPF) em todo o HTML servido; confirmação de
`rel="noopener"` em toda ocorrência do link de LinkedIn; varredura por
atributo de evento inline/`javascript:`/`<script>` novo introduzido pelos 3
nomes/descrições de app; leitura de todos os comentários HTML das 4 páginas
por vazamento de metadado além do já avaliado nos Lotes 1-5; reavaliação
específica de LGPD para a troca de URL institucional → pessoal.

### Arquivos auditados

`index.html`, `apps.html`, `sobre.html`, `404.html` (as 4 páginas reais,
buscadas via HTTP real em produção, não do disco).

### 1. Vazamento de dado sensível

**Achado: nenhum.**

- Varredura por padrão de dado pessoal (nome completo, e-mail alternativo,
  telefone, `+55`, CPF/RG, WhatsApp) nas 4 páginas reais: a única ocorrência
  de identificador pessoal do stakeholder é o **slug da própria URL de
  LinkedIn** (`linkedin.com/in/leandro-segheto-moraes-90879b138`), repetida
  nas 5 posições esperadas (4 rodapés + 1 CTA da seção de contato da Home) —
  exatamente o mesmo valor, sem variação. **Essa exposição é a decisão de
  negócio já tomada e registrada pelo próprio stakeholder** (`TASK.md`,
  T6.1: "por decisão do stakeholder, o placeholder... foi substituído pelo
  perfil pessoal") — não reaberta aqui, conforme instrução. Nenhum outro
  dado pessoal (e-mail alternativo ao institucional, telefone, endereço,
  documento) foi encontrado em nenhuma das 4 páginas.
- E-mail: `contato@ljssoftware.com.br`, institucional/corporativo, sem
  mudança de valor em T6.1 — mesma conclusão já registrada nos Lotes 1-5.
  Confirmado servido com a ofuscação automática da Cloudflare (Scrape
  Shield) já avaliada e aceita pelo QA em T6.1 — não introduz um vetor novo
  (o script de decodificação é first-party, `/cdn-cgi/...`, já coberto por
  `script-src 'self'` na CSP de `_headers`, Lote 4).
- Os 3 nomes/descrições de app (Curta Mais, Bíblia Fácil, My Money) são
  texto de produto genérico ("sugestões de destino/roteiro/orçamento para
  viagem", "leitura bíblica diária", "controle financeiro em família") —
  nenhum dado pessoal de terceiro, nenhum dado interno de negócio (preço,
  métrica de uso, nome de cliente) exposto.

### 2. Links externos — `rel="noopener"` no novo link de LinkedIn pessoal

**Achado: nenhum.**

- Confirmado por leitura direta da resposta HTTP real: as 5 ocorrências do
  link de LinkedIn (rodapé de `index.html`, `apps.html`, `sobre.html`,
  `404.html`, mais o CTA "Ver no LinkedIn" da seção de contato da Home) têm
  `target="_blank"` **e** `rel="noopener"` — nenhuma ocorrência sem a
  proteção. A troca de URL institucional → pessoal em T6.1 preservou o
  atributo em todos os 5 pontos (confirmado que não é um valor herdado do
  cache/HTML antigo, mas parte do HTML servido atualmente com a nova URL).
- Mesma conclusão já registrada nos Lotes 2/3 sobre `rel="noreferrer"`: sua
  ausência continua não sendo um achado — o destino (perfil de LinkedIn,
  ainda que pessoal) não é um terceiro arbitrário/malicioso, e a URL de
  origem (`ljssoftware.com.br/...`) não carrega parâmetro sensível que o
  vazamento de `Referer` exporia.

### 3. Injeção de conteúdo / XSS estático

**Achado: nenhum.**

- Os 3 nomes/descrições de app são texto estático dentro de
  `<h2 class="app-card__name">`/`<p class="app-card__description">`
  (`apps.html`) e `<h3 class="app-card__name">`/`<p
  class="app-card__description">` (`index.html`) — mesma estrutura de
  markup já auditada e aprovada nos Lotes 3/4, só o conteúdo textual foi
  trocado (confirmado por diff estrutural: mesmas classes, mesmo número de
  elementos, nenhum atributo novo).
- Varredura por `on\w+=`/`javascript:`/`<script` nas 4 páginas reais (mesma
  metodologia do Lote 3, já com checagem manual de falso-positivo de
  `content=`/`aria-controls=`): nenhuma ocorrência nova além dos 2
  `<script src=... defer>` (`nav.js`/`analytics.js`) já auditados.
- Nenhuma interpolação de string/template no lado cliente em nenhum arquivo
  do projeto (confirmado nos Lotes 2/3, reafirmado aqui por não haver
  nenhum JS novo neste lote) — não há vetor pelo qual o texto de um
  nome/descrição de app pudesse ter sido tratado como HTML dinâmico; é
  literal no arquivo `.html` versionado e servido como tal.

### 4. Conformidade regulatória (LGPD) — reavaliação específica da troca de URL

**Achado: nenhum; raciocínio confirmado.**

- A troca do link institucional (`linkedin.com/company/ljssoftware`) pelo
  perfil pessoal do próprio stakeholder é uma decisão do titular do dado
  sobre o próprio dado — o stakeholder é ao mesmo tempo quem decide expor a
  informação e a pessoa a quem ela pertence (não há coleta de dado de
  terceiro nem de visitante envolvida). Do ponto de vista de LGPD, isso é
  equivalente a qualquer pessoa optar por divulgar publicamente seu próprio
  perfil profissional — não há tratamento de dado pessoal por parte do site
  em relação ao **visitante**, que é o sujeito que o RF-04/G-04 e a
  avaliação de LGPD dos Lotes 1-5 sempre trataram.
- O único ponto que exigiria atenção adicional seria se a URL/slug expusesse
  **mais** do que o próprio stakeholder já publicou como público no
  LinkedIn (ex.: se o link levasse a um recurso privado/não indexável) — não
  é o caso: é a URL canônica pública do próprio perfil, o mesmo tipo de link
  que qualquer visitante poderia obter fazendo uma busca pelo nome do
  stakeholder.
- Conclusão: **não há mudança na avaliação de LGPD já registrada nos Lotes
  1-5** — a troca de URL não introduz coleta, processamento ou exposição de
  dado de terceiro; é decisão de negócio do próprio titular sobre o próprio
  dado, já formalmente registrada no `TASK.md` (T6.1), não reaberta.

### 5. Metadados/comentários HTML vazados

**Achado: nenhum.**

- Leitura de todos os comentários HTML das 4 páginas reais servidas em
  produção: os comentários relacionados a T6.1 (`index.html` linha ~200,
  `apps.html` linha ~115) dizem apenas "Placeholders de e-mail/LinkedIn
  (Lacuna L-01) a substituir em T6.1" — **texto residual de proveniência de
  engenharia, já presente antes da substituição** (referência à tarefa, não
  ao valor específico nem à natureza pessoal/provisória do novo link).
  **Confirmado que a nota de negócio mais sensível/detalhada — "LinkedIn
  provisório = perfil pessoal, pendência de troca futura quando a empresa
  tiver página própria" — existe só no `TASK.md` (repositório de
  planejamento) e não foi replicada em nenhum comentário HTML publicado**:
  varredura dedicada por "provis"/"pessoal"/"empresa ainda não tem
  página"/"trocar" nas 4 páginas reais não encontrou nenhuma ocorrência.
  Isso é o comportamento correto — o comentário público não precisa (nem
  deveria) expor o racional de negócio por trás da URL provisória.
- Nenhum comentário novo introduzido por T6.2 (troca dos 3 apps) além do já
  existente desde T3.4 (nota sobre trocar o badge por link real em T6.2,
  texto de proveniência já avaliado no Lote 3/4) — nenhum dado sensível.
- Nenhum comentário novo de T6.3 (nenhuma alteração de código, conforme o
  próprio `TASK.md`).

### 6. Requisitos de segurança operacional para o chapéu DevOps

- Nenhum item novo. O comportamento de ofuscação de e-mail da Cloudflare
  (Scrape Shield) já está registrado como decisão de produto do usuário em
  `DEPLOY.md`/`CTO-REVIEW.md` — nenhuma ação adicional necessária deste
  lote.
- Recomendação de rotina (não um achado, reforço do já registrado nos Lotes
  1-5): ao substituir novamente a URL de LinkedIn no futuro (empresa passar
  a ter página própria, pendência já sinalizada em T6.1), confirmar que os
  5 pontos (4 rodapés + CTA da Home) são atualizados juntos no mesmo
  commit, preservando `target="_blank" rel="noopener"` e o
  `data-analytics-event` — mesma disciplina de RT-02/G-02 já aplicada neste
  lote.

---

## Achados deste lote (resumo)

| # | Item | Severidade | Status | Ação |
|---|---|---|---|---|
| — | Nenhum achado novo de severidade Baixa, Média, Alta ou Crítica neste lote | — | — | — |

Nenhum achado **Alto/Crítico** neste lote. Nenhum achado de compliance
obrigatório em aberto. Nenhum dado pessoal além do já decidido pelo próprio
stakeholder (URL do seu perfil de LinkedIn) foi encontrado exposto.

## Fechamento — Lote 6 (chapéu DevSecOps)

- Nenhum achado de severidade alta/crítica.
- Nenhum item de compliance obrigatório pendente (LGPD: troca de URL
  institucional → pessoal avaliada especificamente neste lote, sem impacto
  na conclusão já registrada — é decisão do próprio titular sobre o próprio
  dado, não coleta de dado do visitante).
- Nenhum item novo de débito de baixa/média severidade a registrar em
  `Refatoração Lote-6` (lote não precisa ser criado neste momento — nenhum
  achado deste lote atinge o limiar de registro).
- Nenhum achado de relevância estratégica a sinalizar ao Gestor neste lote
  — a decisão de expor o LinkedIn pessoal já é uma decisão de negócio
  tomada e registrada pelo próprio stakeholder, não uma descoberta nova
  deste Validador.

**Veredito geral do Lote 6 (chapéu DevSecOps): Aprovado, sem ressalvas e
sem débito registrado.** Nenhum achado bloqueia deploy. Combinado com o
veredito funcional do chapéu QA ("Aprovado, sem ressalvas técnicas",
`QA-REPORT.md`, seção "Lote 6"), o Lote 6 tem a dupla aprovação (QA +
DevSecOps) necessária para o chapéu DevOps considerar este build (já em
produção com o conteúdo definitivo) formalmente liberado pelo processo de
governança. Os débitos de baixa severidade ainda pendentes de lotes
anteriores (RL1.2, RL4.1, RL4.2, RL5.1, RL5.2) continuam sem prazo vencido
e não bloqueiam este lote nem o deploy de produção final.
