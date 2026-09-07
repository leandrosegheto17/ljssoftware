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
