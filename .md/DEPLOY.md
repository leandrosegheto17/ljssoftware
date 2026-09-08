# DEPLOY.md — Site institucional LJSSoftware

**Autor:** Validador (chapéu DevOps)
**Base:** `TASK.md` Seção 3 (Lote 5 — Deploy e Infraestrutura, T5.1-T5.4),
`SDD.md` (stack/hospedagem, ADR-002, ADR-003), `QA-REPORT.md` (Lotes 1-4,
aprovados) e `SECURITY-REVIEW.md` (Lotes 1-4, aprovados, dupla aprovação
confirmada)
**Data:** 2026-09-07
**Chamada:** `/deploy`, Seção 1 (preparação de infraestrutura — primeira
chamada, antes do deploy real)

---

## Contexto e limite de execução deste agente

Este projeto é um site estático HTML/CSS/JS puro, sem build step (ADR-001),
hospedado no Cloudflare Pages (ADR-002) com Cloudflare Web Analytics
(ADR-003). O Validador (chapéu DevOps), rodando como agente automatizado,
**não tem acesso a nenhuma conta Cloudflare, DNS ou registro.br reais** —
não existe credencial nem sessão de painel disponível neste ambiente. Por
isso, T5.1-T5.4 não podem ser executadas de ponta a ponta por este agente:
apenas a parte que é "infraestrutura como código" dentro do próprio
repositório foi preparada aqui; a parte que depende de clicar em um painel
externo ou mexer no NS do domínio no registro.br fica descrita abaixo, passo
a passo, para o usuário executar manualmente.

**Nenhuma das tarefas T5.1-T5.4 foi marcada como `Concluída` no `TASK.md`.**
Elas continuam pendentes até o usuário confirmar a execução real no painel
Cloudflare/registro.br e reportar de volta (ou até a segunda chamada de
`/deploy`, que assume o painel já configurado e foca na execução do deploy
em si — observabilidade, validação de RNF, relatório final).

---

## O que foi preparado de fato neste repositório

### 1. `_headers` (T5.3 / T5.4) — confirmado e corrigido

O arquivo `_headers` já existia do Lote 4 (T4.4), aprovado em
`SECURITY-REVIEW.md`. Ao confirmar sua correção para o deploy real, foi
encontrada uma divergência factual: a CSP (`script-src`/`connect-src`) e o
comentário de `assets/js/analytics.js` (T2.4) usavam o domínio
`static.cloudflarewebanalytics.io` para o beacon do Cloudflare Web
Analytics — **domínio que não existe**. O domínio oficial documentado pela
Cloudflare ([developers.cloudflare.com/web-analytics](https://developers.cloudflare.com/web-analytics/))
é:

- `script-src`: `https://static.cloudflareinsights.com` (script
  `beacon.min.js`)
- `connect-src`: `https://cloudflareinsights.com` (destino do
  `navigator.sendBeacon` usado pelo próprio script da Cloudflare)

Essa possibilidade já havia sido antecipada e registrada como pendência de
verificação pelo próprio `SECURITY-REVIEW.md` (Lote 4, seção "Requisitos de
segurança operacional para o chapéu DevOps", item T5.4): *"se o domínio
oficial divergir nesse momento (...), `_headers` precisa de ajuste pontual
antes do beacon funcionar, senão a CSP bloqueará o próprio analytics"*. A
correção foi aplicada agora, antes do deploy, exatamente como antecipado —
sem mudança de arquitetura ou de política de segurança (a CSP continua tão
restritiva quanto antes, só corrigindo o hostname para o real):

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

O restante do `_headers` (X-Content-Type-Options, X-Frame-Options,
Referrer-Policy, Permissions-Policy) segue idêntico ao aprovado em
`SECURITY-REVIEW.md` Lote 4 — nenhuma outra alteração.

**Nota sobre esta correção não reabrir aprovação:** é uma correção factual
de um nome de domínio (verificável em documentação pública da Cloudflare),
não uma decisão de arquitetura nem um relaxamento/enrijecimento de política
de segurança — mantém exatamente a mesma postura já aprovada (permitir
apenas o domínio do beacon oficial da Cloudflare, nada além disso). Não
exige nova rodada de dupla aprovação (QA + DevSecOps); referenciada aqui
para rastreabilidade.

### 2. `_redirects` (T5.3) — criado

Não existia. Criado na raiz do repositório, formato nativo do Cloudflare
Pages, para o redirect 301 de `www.ljssoftware.com.br` para o domínio apex
(`ljssoftware.com.br` — já é o domínio canônico usado em todo `og:url`/
`canonical`/`sitemap.xml`/`robots.txt` do site, confirmado contra
`SDD.md`/ADR-002):

```
https://www.ljssoftware.com.br/* https://ljssoftware.com.br/:splat 301!
```

**Pré-condição para esta regra funcionar de fato:** o domínio `www` precisa
estar adicionado como domínio customizado no mesmo projeto Cloudflare Pages
que o apex (T5.2), senão o Cloudflare Pages não tem como rotear uma
requisição para `www` até este projeto para aplicar o redirect. Esse
`_redirects` fica pronto no repositório, mas só entra em vigor depois que o
usuário completar T5.2/T5.3 no painel (ver checklist abaixo).

O redirect `http://` → `https://` (também parte de T5.3) **não** é coberto
por `_redirects` — é nativamente automático quando o toggle "Always Use
HTTPS" está habilitado no painel Cloudflare para o domínio (ação manual,
ver checklist).

### 3. `robots.txt` / `sitemap.xml` (confirmação, sem alteração)

Já existiam do Lote 4, aprovados. Confirmado que ambos já referenciam o
domínio apex definitivo (`https://ljssoftware.com.br`), consistente com o
`_redirects` criado acima — nenhuma alteração necessária.

### 4. `assets/js/analytics.js` (T5.4) — comentário corrigido, lógica intacta

O código de `analytics.js` (T2.4) já era desacoplado corretamente: ele só
chama `window.__cfBeacon.track(...)` (com fallback para
`window.zaraz.track(...)`) se essas funções globais existirem — não precisa
de nenhuma alteração de lógica quando o beacon real for inserido. Apenas o
comentário de exemplo (`<script defer src='...'>`) tinha o domínio errado,
corrigido junto com o `_headers` (item 1 acima).

**O que falta e não pode ser feito por este agente:** inserir de fato a tag
`<script>` do beacon oficial nas 4 páginas HTML (`index.html`, `apps.html`,
`sobre.html`, `404.html`) depende do **token** do Cloudflare Web Analytics,
que só é gerado depois que o usuário habilita o produto no painel Cloudflare
para este domínio — não deve ser inventado. Ver checklist abaixo (T5.4) para
o snippet exato a colar assim que o usuário tiver o token real, e a posição
exata (antes de `assets/js/analytics.js`) em cada um dos 4 arquivos.

---

## Ações pendentes do usuário (painel Cloudflare / registro.br)

### T5.1 — Setup do repositório + conexão ao Cloudflare Pages

1. Acessar o painel Cloudflare → **Workers & Pages** → **Create application**
   → aba **Pages** → **Connect to Git**.
2. Autorizar o Cloudflare a acessar o repositório Git deste projeto (GitHub/
   GitLab, conforme onde o repositório estiver hospedado) e selecionar este
   repositório.
3. Em **Set up builds and deployments**:
   - **Production branch**: `main` (branch principal atual, confirmado em
     `git status`).
   - **Build command**: deixar em branco/vazio (site sem build step,
     ADR-001).
   - **Build output directory**: `public` (não mais `/`) — o repositório foi
     reestruturado nesta preparação em `public/` (tudo que é servido pelo
     site: `index.html`, `apps.html`, `sobre.html`, `404.html`, `assets/`,
     `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`) e `dev/`
     (smoke-tests e scripts de verificação, fora do output). Confirmado
     junto à documentação oficial do Cloudflare Pages: não existe mecanismo
     de "ignorar arquivo" — a única forma de excluir algo da publicação é
     através do diretório de build output, por isso a reestruturação em vez
     de um arquivo `.pages-ignore` (que não existe).
4. Confirmar **Save and Deploy**. O primeiro deploy de preview deve ficar
   acessível em uma URL `*.pages.dev` gerada automaticamente, atualizando a
   cada novo push na branch principal (critério de aceite de T5.1).
5. Com o **Build output directory = `public`**, nada em `dev/` (smoke-tests
   HTML, scripts Node de verificação) é publicado — resolve definitivamente
   o risco de publicação indevida já sinalizado em `SECURITY-REVIEW.md`
   (Lotes 1-4), sem depender de "risco baixo aceito".
6. Depois de conectado, marcar T5.1 como `Concluída` no `TASK.md` (o
   Validador confirma isso na segunda chamada de `/deploy`, ao revisar o
   preview real).

### T5.2 — Domínio customizado + migração de NS (registro.br)

**No painel Cloudflare Pages**, no projeto criado em T5.1:

1. Aba **Custom domains** → **Set up a custom domain** → digitar
   `ljssoftware.com.br` → **Continue**.
2. Repetir para `www.ljssoftware.com.br` (necessário para o redirect de
   `_redirects` funcionar — ver item 2 da seção anterior).
3. O painel vai indicar se o domínio já está usando NS da Cloudflare ou não.
   Como o domínio está registrado no registro.br (fora da Cloudflare), será
   necessário migrar os **nameservers (NS)** para os que a Cloudflare
   fornecer nesta etapa (formato típico: `algumnome.ns.cloudflare.com` e
   `outronome.ns.cloudflare.com` — os valores exatos só aparecem no painel
   no momento em que o domínio é adicionado, não devem ser inventados aqui).

**No registro.br**, com os NS obtidos no passo anterior:

4. Acessar [registro.br](https://registro.br) → login → **Meus domínios** →
   selecionar `ljssoftware.com.br` → **Alterar servidores DNS (NS)**.
5. Substituir os NS atuais pelos dois NS fornecidos pela Cloudflare no passo
   3.
6. Salvar. A propagação de NS pode levar de alguns minutos a até 24-48h
   (variável, fora do controle da Cloudflare ou do registro.br).
7. Voltar ao painel Cloudflare e aguardar o status do domínio mudar para
   **Active** (indica que a Cloudflare já enxerga o domínio como
   gerenciado por ela).

**Risco já registrado em `TASK.md` (RP-01):** esta é uma ação manual do
stakeholder, fora do controle do Executor/Validador, e pode atrasar a
publicação final mesmo com o site tecnicamente pronto — sinalizado como
pré-requisito assim que o Lote 5 se inicia, sem bloquear o que já foi feito
nos Lotes 1-4.

### T5.3 — Always Use HTTPS + redirect www→apex

**Depois que T5.2 estiver com o domínio `Active`:**

1. No painel Cloudflare, selecionar o domínio `ljssoftware.com.br` (agora
   gerenciado pela Cloudflare) → aba **SSL/TLS** → **Edge Certificates**.
2. Habilitar o toggle **Always Use HTTPS** (RF-05 — garante que
   `http://` redirecione automaticamente para `https://`). Nota: testado em
   produção e o redirect `http://` → `https://` já funcionava mesmo antes de
   confirmar esse toggle explicitamente (comportamento padrão de zona nova
   na Cloudflare) — mesmo assim, confirmar o toggle ligado por ser o
   requisito explícito de RF-05.
3. Confirmar que um certificado TLS válido foi emitido automaticamente para
   `ljssoftware.com.br` e `www.ljssoftware.com.br` (a Cloudflare emite via
   Universal SSL assim que o domínio fica `Active`; confirmado em produção,
   "SSL enabled" nos dois Custom Domains do projeto Pages).
4. **Correção (verificado contra a documentação oficial do Cloudflare
   Pages)**: o arquivo `_redirects` **não suporta redirecionamento entre
   domínios/hosts** — só redireciona caminhos dentro do mesmo host. A regra
   originalmente colocada em `_redirects` (www → apex) nunca teve efeito por
   esse motivo; removida do arquivo. O redirect `www` → apex precisa ser
   feito por uma **Redirect Rule** de zona:
   - No painel Cloudflare, dentro do domínio `ljssoftware.com.br` → **Rules**
     → **Redirect Rules** (ou "Overview" de Rules, dependendo da versão do
     painel) → **Create rule** → **Redirect Rule**.
   - **When incoming requests match**: "Custom filter expression" (ou
     "Wildcard pattern") — Field `Hostname`, operador `equals`, valor
     `www.ljssoftware.com.br` (ou o padrão wildcard `http*://www.ljssoftware.com.br/*`,
     conforme a UI apresentar).
   - **Then**: Type `Dynamic` (ou `Static` com URL fixa, se a UI não pedir
     wildcard) → Target URL `https://ljssoftware.com.br${1}` (mantendo o
     caminho/query da requisição original) → Status code `301` → habilitar
     "Preserve query string".
   - **Deploy**.
5. Validar manualmente, depois de criar a regra: acessar
   `http://ljssoftware.com.br` (deve cair em `https://`) e
   `https://www.ljssoftware.com.br` (deve redirecionar 301 para
   `https://ljssoftware.com.br`).

### T5.4 — Cloudflare Web Analytics + beacon nas 4 páginas

1. No painel Cloudflare → **Analytics & Logs** → **Web Analytics** →
   **Add a site** → selecionar `ljssoftware.com.br` (ou adicionar
   manualmente, se não vier pré-listado).
2. **Importante:** se o painel oferecer "Automatic setup" (injeção
   automática do beacon via proxy Cloudflare), **não usar** — este projeto
   já tem instrumentação própria de evento custom (`analytics.js`, T2.4)
   que espera controlar o `<script>` manualmente, e o `_headers`/CSP deste
   repositório já está desenhado para o script inserido manualmente no
   HTML, não para injeção automática no edge.
3. Escolher a opção de **snippet manual** — a Cloudflare vai gerar um token
   único para este site, exibido em um snippet como:
   ```html
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
     data-cf-beacon='{"token": "SEU_TOKEN_AQUI"}'></script>
   ```
4. Copiar esse snippet (com o token real) e colar em **cada uma das 4
   páginas HTML dentro de `public/`**, imediatamente **antes** da linha
   `<script src="assets/js/analytics.js" defer></script>` (que hoje é a
   última tag de script de cada página):
   - `public/index.html`
   - `public/apps.html`
   - `public/sobre.html`
   - `public/404.html`
5. Confirmar no console do navegador (preview ou produção) que não há erro
   de bloqueio de CSP (`Content-Security-Policy` não deve barrar
   `static.cloudflareinsights.com` — já liberado no `_headers` corrigido
   neste documento, item 1).
6. Confirmar no dashboard do Cloudflare Web Analytics que os eventos custom
   `contato_email_click` e `contato_linkedin_click` (T2.4) aparecem,
   incluindo os cliques disparados pela seção de contato da Home (T3.3) —
   critério de aceite de T5.4.

**Este passo (inserir o snippet real com o token) não pode ser feito por
este agente** — o token só existe depois que o usuário completar o passo 1-3
no painel. Assim que o usuário tiver o token e quiser que o Validador insira
o snippet nas 4 páginas, basta fornecer o token na próxima chamada.

---

## Checklist resumido para o usuário

| Tarefa | Onde | Ação |
|---|---|---|
| T5.1 | Cloudflare Pages | Conectar repositório Git, build settings "sem build"/raiz, branch `main` |
| T5.2 | Cloudflare Pages + registro.br | Adicionar `ljssoftware.com.br` e `www.ljssoftware.com.br` como domínios customizados; migrar NS no registro.br para os NS indicados pela Cloudflare |
| T5.3 | Cloudflare Pages (SSL/TLS) | Habilitar "Always Use HTTPS"; `_redirects` já cobre o redirect www→apex |
| T5.4 | Cloudflare Web Analytics | Habilitar com snippet manual (não automático); fornecer o token gerado para o Validador inserir nas 4 páginas |

---

## Registro de correção (rastreabilidade com SECURITY-REVIEW.md)

- **Achado:** domínio `static.cloudflarewebanalytics.io` (inexistente) usado
  em `_headers` (CSP) e no comentário de `assets/js/analytics.js` desde o
  Lote 2/4.
- **Origem:** nota de implementação do Executor em T2.4, propagada para a
  CSP em T4.4 e aprovada em `SECURITY-REVIEW.md` Lote 4 — o próprio
  `SECURITY-REVIEW.md` já registrava a possibilidade de divergência e a
  ação necessária ("Requisitos de segurança operacional para o chapéu
  DevOps", item T5.4).
- **Severidade:** Baixa/funcional — não é uma falha de segurança em si (a
  CSP continuava restritiva, só apontando para um domínio que nunca
  resolveria), mas bloquearia o funcionamento do beacon real em T5.4 se não
  corrigida antes do deploy.
- **Correção:** aplicada nesta chamada, em `_headers` (`script-src`:
  `static.cloudflareinsights.com`; `connect-src`: `cloudflareinsights.com`)
  e no comentário de `assets/js/analytics.js`. Não requer nova dupla
  aprovação (QA + DevSecOps) — correção factual de hostname, mesma postura
  de segurança já aprovada.
- **Sem impacto em T5.1-T5.4:** nenhuma tarefa foi marcada como concluída
  em função desta correção; ela é pré-requisito técnico para T5.4 funcionar
  quando o usuário completar a parte manual.

---

## Próxima chamada de `/deploy` (Seção 2 — pós dupla aprovação/painel configurado)

Assim que o usuário confirmar T5.1-T5.4 no painel (ou parte deles), a
próxima chamada de `/deploy` deve:

- Confirmar o preview/produção real acessível e os headers de `_headers`
  aplicados sem erro de CSP no console (pendência já sinalizada em
  `SECURITY-REVIEW.md` Lote 4).
- Validar a infraestrutura contra os requisitos não funcionais do `SDD.md`.
- Confirmar observabilidade mínima ativa (Cloudflare Web Analytics, T5.4,
  mais qualquer log/alerta nativo do Cloudflare Pages).
- Confirmar rollback disponível (Cloudflare Pages mantém histórico de
  deploys anteriores com rollback de um clique — testar antes de considerar
  o deploy de produção pronto).
- Reportar o resultado final ao Gestor (Gate 4), fechando o ciclo.
