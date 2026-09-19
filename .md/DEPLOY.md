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

---

## Confirmação de observabilidade e rollback — pré-Gate de produção (2026-09-08)

**Contexto desta chamada:** T5.1-T5.4 já estão `Concluída` no `TASK.md`,
dupla aprovação confirmada (`QA-REPORT.md` Lote 5: "Aprovado com
ressalvas"; `SECURITY-REVIEW.md` Lote 5: "Aprovado com débito de baixa
severidade" — débito RL5.2/HSTS, sem bloqueio). `git status` está limpo:
não há nenhuma mudança de código pendente de push. **Não houve deploy novo
nesta chamada** — o que está em `https://ljssoftware.com.br` já é o
resultado do último push (commit `d620c29`). Esta seção documenta o modelo
de deploy real do projeto e confirma observabilidade/rollback antes do
Gate 4 formal, sem alterar nenhum arquivo de código do site.

### Modelo de deploy real (deploy contínuo, sem staging clássico)

Este projeto **não usa um comando de deploy manual**. O modelo é:

```
push em `main` → Cloudflare Pages detecta o push (webhook do Git) →
builda (sem build step, ADR-001) → publica automaticamente em:
  - https://ljssoftware.pages.dev   (preview — domínio *.pages.dev fixo do projeto)
  - https://ljssoftware.com.br      (produção — domínio customizado, T5.2)
```

Os dois domínios publicam **exatamente o mesmo build**, a partir do mesmo
push — não existe um ambiente de "staging" separado no sentido clássico
(branch própria, dados diferentes, etc.). O `https://ljssoftware.pages.dev`
funciona como o staging de fato deste projeto: mesmo código, domínio
diferente, útil para verificar um build antes de confirmar que o domínio
customizado está servindo a mesma coisa. Isso já era o comportamento usado
nas validações de T5.1 e T5.4 (ver checklist acima, que verificou o preview
antes/depois do domínio customizado ficar `Active`).

Consequência prática para a Seção 4 do `/deploy` (deploy em staging): **não
há uma ação de "disparar deploy" para executar aqui** — o deploy já
aconteceu no push do commit `d620c29` (Lote 5, validação). O papel deste
agente nesta chamada é confirmar que o pipeline automático está saudável e
que produção reflete esse mesmo commit, não iniciar um novo deploy.

### Verificação real executada nesta chamada

Testes de rede reais contra `https://ljssoftware.com.br` (produção),
executados por este agente:

| Verificação | Resultado |
|---|---|
| `GET /` | HTTP 200. `content-security-policy` presente e correta (`script-src` inclui `static.cloudflareinsights.com`; `connect-src` inclui `cloudflareinsights.com`), demais headers de `_headers` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) presentes. `Server: cloudflare`. |
| Tag do beacon no HTML de `/` | Presente: `<script ... src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "bc3ce694258f45c393941b292ba37ac9"}'>`, imediatamente antes de `assets/js/analytics.js`, como especificado em T5.4. |
| `GET /apps.html` e `/sobre.html` | 308 → segue redirect (comportamento "clean URL" nativo do Cloudflare Pages, já registrado como débito RL5.1, não relacionado a esta verificação) → 200, mesmo token de beacon presente nas duas. |
| `GET /pagina-inexistente-teste-deploy` | 404 real (página `404.html`, T4.x), confirmando que o roteamento de erro está ativo. |
| `GET https://static.cloudflareinsights.com/beacon.min.js` | HTTP 200 — o script do beacon é servido sem erro, sem bloqueio de rede/TLS. |
| `POST https://cloudflareinsights.com/cdn-cgi/rum` (payload sintético, fora do formato exato gerado pelo `beacon.min.js` real em runtime de navegador) | HTTP 404 — **resposta HTTP real recebida** (não timeout, não erro de conexão/TLS/CORS). Confirma que o endpoint do beacon está alcançável pela rede e que a CSP/`_headers` deste projeto não está bloqueando a origem; o 404 é porque o payload/rota usados no teste manual não reproduzem exatamente o que o `beacon.min.js` gera dentro de um navegador real (ex.: `sendBeacon` com corpo/assinatura específicos do script da Cloudflare). |

Essas 5 requisições (`/`, `/apps.html`, `/sobre.html`,
`/pagina-inexistente-teste-deploy`, `beacon.min.js`) geraram pageviews e
uma chamada real ao beacon script — contam como sinal real de tráfego para
o Cloudflare Web Analytics.

**Limitação explícita:** este agente não tem acesso ao painel Cloudflare
(sem credenciais/sessão, mesma limitação já registrada na Seção 1 acima).
Por isso **não é possível confirmar visualmente** no dashboard do Cloudflare
Web Analytics que os pageviews/eventos custom (`contato_email_click`,
`contato_linkedin_click`) aparecem — o que foi confirmado é que (a) o
beacon está corretamente instalado nas páginas reais de produção, (b) a CSP
não bloqueia o script nem o destino do beacon, e (c) o script e o endpoint
respondem via rede sem erro. A confirmação visual no dashboard (contagem de
sessões, eventos custom) depende de acesso ao painel e fica como pendência
para quem tiver a credencial — não bloqueia o Gate de produção, pois a
instrumentação em si está tecnicamente correta e sem erro de rede/CORS/CSP.

### Rollback — capacidade nativa, não testada

O Cloudflare Pages mantém histórico de todos os deploys anteriores
(um por commit/push), com rollback disponível pelo painel: **Workers &
Pages → projeto → aba Deployments → selecionar um deploy anterior na lista
→ "Rollback to this deployment"** (ou opção equivalente, conforme a versão
da UI). Isso promove instantaneamente o build selecionado de volta a
produção, sem precisar reverter/re-buildar a partir do Git.

**Esta capacidade não foi testada de fato nesta chamada** — testá-la
exigiria acesso ao painel Cloudflare (sem credenciais disponíveis neste
ambiente) e provocaria um rollback real em produção, o que também estaria
fora do escopo autorizado desta chamada (nenhum deploy/alteração de estado
de produção). Documentado aqui como **capacidade nativa do provedor,
confirmada pela documentação oficial do Cloudflare Pages, não testada
nesta chamada por falta de acesso ao painel** — não deve ser lida como
"rollback testado e validado".

### Avaliação para o Gate de produção (Seção 5 do `/deploy`)

- Deploy contínuo confirmado ativo e saudável (produção reflete o commit
  `d620c29`, mesmo build do preview `.pages.dev`).
- Observabilidade mínima (Cloudflare Web Analytics, T5.4) confirmada
  tecnicamente ativa via rede real (beacon presente, sem bloqueio de CSP/
  rede) — sem confirmação visual de dashboard por falta de acesso ao
  painel (limitação registrada, não um erro de instrumentação).
- Rollback existe como capacidade nativa do Cloudflare Pages, documentada,
  **não testada** nesta chamada por falta de acesso ao painel.
- Nenhuma mudança de código foi feita nesta chamada.
- Dupla aprovação do Lote 5 (QA + DevSecOps) já confirmada, sem achado
  alto/crítico em aberto; débitos RL5.1 (clean URL) e RL5.2 (HSTS) são
  baixa/média severidade, com prazo registrado, e não bloqueiam deploy.

**Não há bloqueio identificado por este agente para o Gate de produção.**
Duas ressalvas devem ser explicitadas ao usuário antes da confirmação final
do Gate (Seção 5), não como bloqueio, mas como limitação de escopo desta
chamada: (1) a confirmação visual dos eventos no dashboard do Web Analytics
depende de acesso ao painel, que este agente não tem; (2) a capacidade de
rollback é nativa do provedor e documentada, mas não foi exercitada de
fato nesta chamada.

---

## Confirmação de produção (2026-09-08) — `/deploy`, Seção 5 (Gate de produção)

**Confirmado explicitamente pelo usuário.** Este é o registro formal de
fechamento do Gate de produção: o conjunto abaixo está oficialmente
publicado em produção real, após validação final de integração (sem
achado crítico).

- **Data da confirmação:** 2026-09-08
- **Lotes incluídos:** Lote 1, Lote 2, Lote 3, Lote 4, Refatoração Lote-1,
  Refatoração Lote-4, Lote 5 (T5.1-T5.4 — infraestrutura, domínio, HTTPS,
  Web Analytics)
- **URL de produção:** `https://ljssoftware.com.br`
- **Modelo de deploy:** contínuo, via Cloudflare Pages, a cada push em
  `main` (sem staging clássico separado — ver seção "Modelo de deploy
  real" acima)
- **Dupla aprovação confirmada:** `QA-REPORT.md` (Aprovado/Aprovado com
  ressalvas em todos os lotes) + `SECURITY-REVIEW.md` (Aprovado/Aprovado
  com débito de baixa severidade — RL5.2/HSTS — sem bloqueio), sobre o
  mesmo conjunto de lotes acima
- **Snapshot final de disponibilidade (nesta chamada):** `GET
  https://ljssoftware.com.br` → HTTP 200, confirmado por requisição HTTP
  real
- **Decisão do usuário — Email Address Obfuscation (Scrape Shield,
  Cloudflare):** a validação de integração anterior identificou, como
  achado informativo (não bloqueante), que este recurso da Cloudflare
  reescreve automaticamente `mailto:` no HTML servido e injeta um script
  de decodificação no client, fora do controle do código-fonte do site.
  Perguntado explicitamente, **o usuário decidiu manter o recurso
  ligado**. Não há nenhuma ação adicional exigida no código do site em
  função dessa decisão — registrado aqui apenas para rastreabilidade,
  sem gerar tarefa em `Refatoração Lote-X`.
- **Débitos abertos, sem bloqueio de deploy (já registrados em
  `QA-REPORT.md`/`SECURITY-REVIEW.md`):** RL5.1 (clean URL em
  `/apps`/`/sobre`, redirecionando via 308), RL5.2 (HSTS ainda não
  habilitado no painel Cloudflare) — ambos baixa/média severidade, com
  prazo registrado, não impedem a confirmação deste Gate.
- **Observabilidade:** Cloudflare Web Analytics ativo (T5.4), beacon
  confirmado presente e sem bloqueio de CSP/rede nas 4 páginas (ver
  seção acima); confirmação visual de dashboard pendente de acesso ao
  painel (limitação de escopo do agente, não falha de instrumentação).
- **Rollback:** capacidade nativa do Cloudflare Pages, documentada, não
  exercitada de fato (sem acesso ao painel neste ambiente).

**Veredito:** Gate de produção fechado. Nenhum achado crítico em aberto.
Pronto para o registro de fechamento do Gestor (Gate 4).

---

## Confirmação de produção (2026-09-08) — Lote 6, T6.4

Registro de publicação do Lote 6 — Confirmação de Conteúdo Pendente,
incluindo a tarefa nova T6.4. Validação (chapéus QA e DevSecOps) concluída
sem achado bloqueante, atualizando `QA-REPORT.md` e `SECURITY-REVIEW.md`
(nova seção "T6.4"). Publicado no mesmo modelo de deploy contínuo já
descrito acima ("Modelo de deploy real") — o push em `main` já é o
mecanismo de publicação em produção real, sem staging clássico separado.
O usuário confirmou explicitamente, via pergunta direta, que queria
publicar agora, antes do push acontecer.

- **Data da confirmação:** 2026-09-08
- **Commit publicado:** `77444f9` ("T6.4 concluida: 3 novos apps..."),
  branch `main`
- **Lotes incluídos:** Lote 6 — Confirmação de Conteúdo Pendente, com
  destaque para **T6.4** (conteúdo novo desde o último registro de
  publicação, commit `d620c29`): adiciona 3 novos apps — **SportsLM**
  ("Suas notícias em um único lugar"), **FutebolApp** ("Gestão completa do
  seu grupo de futebol") e **Evolução Segura** ("Prontuário digital
  simples, com seus dados sempre com você") — à vitrine `public/apps.html`
  e à prévia de apps da Home `public/index.html`, mantendo paridade de
  conteúdo entre as duas páginas (6 cards em cada). Nenhum CSS novo — grid
  responsivo já acomodava os itens extras.
- **URL de produção confirmada:** `https://ljssoftware.com.br/` (Home) e
  `https://ljssoftware.com.br/apps.html` (via redirect 308 conhecido,
  débito RL5.1, ainda não corrigido) — confirmado por requisição HTTP real
  (`curl -sL`), ambas retornando os 6 cards de apps: `Curta Mais`, `Bíblia
  Fácil`, `My Money`, `SportsLM`, `FutebolApp`, `Evolução Segura`.
- **Modelo de deploy:** contínuo, via Cloudflare Pages, a cada push em
  `main` (sem staging clássico separado — ver seção "Modelo de deploy
  real" acima)
- **Dupla aprovação confirmada:** `QA-REPORT.md` (seção "T6.4") +
  `SECURITY-REVIEW.md` (seção "T6.4"), ambos sem achado bloqueante
- **Débitos abertos, sem bloqueio de deploy (já registrados
  anteriormente):** RL5.1 (clean URL em `/apps`/`/sobre`, redirecionando
  via 308), RL5.2 (HSTS ainda não habilitado no painel Cloudflare) — ambos
  baixa/média severidade, com prazo registrado, não impedem a confirmação
  deste registro
- **Incidentes/rollback:** nenhum incidente reportado, nenhum rollback
  necessário

**Veredito:** publicação do Lote 6 (T6.4) confirmada em produção real, sem
achado crítico. Pronto para o registro de fechamento do Gestor (Gate 4).

## Confirmação de produção (2026-09-08) — Lote 6, T6.5

Registro de publicação da tarefa nova T6.5 do Lote 6 — Confirmação de
Conteúdo Pendente. Validação (chapéus QA e DevSecOps) concluída sem achado
bloqueante, atualizando `QA-REPORT.md` e `SECURITY-REVIEW.md` (nova seção
"T6.5"). Publicado no mesmo modelo de deploy contínuo já descrito acima
("Modelo de deploy real") — o push em `main` já é o mecanismo de publicação
em produção real, sem staging clássico separado. O usuário confirmou
explicitamente, via pergunta direta, que queria publicar agora, antes do
push acontecer.

- **Data da confirmação:** 2026-09-08
- **Commit publicado:** `17a8af5` ("T6.5 concluida: renomeia 5 apps na
  vitrine e na Home"), branch `main`
- **Lotes incluídos:** Lote 6 — Confirmação de Conteúdo Pendente, com
  destaque para **T6.5** (conteúdo alterado desde o último registro de
  publicação, commit `77444f9`): renomeia nome/descrição de 5 dos 6 apps já
  publicados — **Curta Mais → Destino Ideal** ("Decida para onde ir e
  organize tudo em um só lugar"), **Bíblia Fácil → Minha Jornada** ("Leitura
  bíblica guiada e preparo de estudos, tudo em um app"), **My Money → Meu
  Objetivo** ("Defina uma meta, um prazo, e saiba exatamente quanto
  guardar"), **SportsLM → Radar Esportivo** ("Suas notícias esportivas,
  sempre em dia") e **FutebolApp → Gestão da Pelada** ("Tudo sobre o seu
  grupo de futebol, em um único app") — em `public/apps.html` e
  `public/index.html`. **Evolução Segura** permanece inalterado. Nenhum CSS
  ou JS tocado; edição cirúrgica de texto, mesma estrutura/markup dos 6
  cards já validada em T6.4.
- **URL de produção confirmada:** `https://ljssoftware.com.br/` (Home) e
  `https://ljssoftware.com.br/apps.html` (via redirect 308 conhecido,
  débito RL5.1, ainda não corrigido, seguido até `/apps`) — confirmado por
  requisição HTTP real (`curl -sD -`), ambas retornando os 6 cards de apps
  com os 5 nomes novos (`Destino Ideal`, `Minha Jornada`, `Meu Objetivo`,
  `Radar Esportivo`, `Gestão da Pelada`) e `Evolução Segura` inalterado;
  nenhum nome antigo (`Curta Mais`, `Bíblia Fácil`, `My Money`, `SportsLM`,
  `FutebolApp`) remanescente em nenhuma das duas páginas.
- **Modelo de deploy:** contínuo, via Cloudflare Pages, a cada push em
  `main` (sem staging clássico separado — ver seção "Modelo de deploy
  real" acima)
- **Observabilidade e headers de segurança — sem regressão:** beacon do
  Cloudflare Web Analytics (`static.cloudflareinsights.com/beacon.min.js`,
  mesmo token `bc3ce694...`) presente em ambas as páginas em produção;
  headers `content-security-policy`, `x-frame-options: DENY`,
  `x-content-type-options: nosniff`, `referrer-policy:
  strict-origin-when-cross-origin` e `permissions-policy` confirmados
  idênticos aos já validados antes desta mudança, em ambas as respostas
  HTTP reais. `strict-transport-security` segue ausente — não é regressão
  desta tarefa, é o débito já conhecido RL5.2 (HSTS ainda não habilitado no
  painel Cloudflare).
- **Dupla aprovação confirmada:** `QA-REPORT.md` (seção "T6.5") +
  `SECURITY-REVIEW.md` (seção "T6.5"), ambos sem achado bloqueante
- **Débitos abertos, sem bloqueio de deploy (já registrados
  anteriormente, sem relação com esta mudança):** RL5.1 (clean URL em
  `/apps`/`/sobre`, redirecionando via 308), RL5.2 (HSTS ainda não
  habilitado no painel Cloudflare) — ambos baixa/média severidade, com
  prazo registrado, não impedem a confirmação deste registro
- **Incidentes/rollback:** nenhum incidente reportado, nenhum rollback
  necessário

**Veredito:** publicação da T6.5 (Lote 6) confirmada em produção real, sem
achado crítico. Pronto para o registro de fechamento do Gestor (Gate 4).

---

## Confirmação de produção (2026-09-08) — Lote 7, T7.1

Registro de publicação do Lote 7 — Botão "Saiba mais" + Modal nos Cards de
App, tarefa única T7.1. Dupla aprovação (chapéus QA e DevSecOps) já
concluída antes do commit, veredito "Validado com ressalvas" — 2 achados
**simples** de documentação (sem bloqueio, sem exigir retorno ao
`executor`), registrados como tarefas em `Refatoração Lote-7` (RL7.1,
RL7.2) pelo próprio Validador na checagem estrutural do lote, ver
`.md/QA-REPORT.md` e `.md/TASK.md`. Publicado no mesmo modelo de deploy
contínuo já descrito acima ("Modelo de deploy real") — o push em `main` já
é o mecanismo de publicação em produção real, sem staging clássico
separado. O usuário confirmou explicitamente, via pedido direto ("commit
push deploy"), que queria publicar agora.

- **Data da confirmação:** 2026-09-08
- **Commit publicado:** `2dfeaa3` ("Publica Lote 7/T7.1: botao Saiba mais +
  modal nos cards de app"), branch `main`
- **O que mudou:** botão "Saiba mais" adicionado ao lado do badge "Em
  breve" nos 6 cards de `public/apps.html` e nos 6 cards replicados em
  `public/index.html`; clique abre um modal "glass" acessível (foco preso
  via `inert` no restante do `<body>`, fecha por `Escape`/clique no
  overlay/botão de fechar, foco devolvido ao botão que abriu) com o nome do
  app e um resumo comercial (texto redigido pelo Executor e aprovado
  explicitamente pelo usuário antes da implementação, idêntico nas duas
  páginas — RT-02). CSS novo, inteiramente aditivo, em
  `public/assets/css/components.css` (seção "App Card — botão 'Saiba mais'
  + Modal (T7.1)"), reaproveitando somente tokens já existentes em
  `tokens.css` (nenhum token novo). JS novo `public/assets/js/app-modal.js`
  (IIFE, sem framework — G-01), mesma técnica de `inert` já usada em
  `nav.js` (T2.2) para travar a página por trás enquanto o modal está
  aberto. Nenhum outro arquivo tocado: `tokens.css`, `base.css`, `nav.js`,
  `analytics.js`, `sobre.html`, `404.html` e `_headers` permanecem
  inalterados — nenhum recurso novo de origem externa, nenhuma mudança de
  CSP necessária (script novo é same-origin, servido de
  `assets/js/app-modal.js`).
- **URL de produção confirmada:** `https://ljssoftware.com.br/` (Home) e
  `https://ljssoftware.com.br/apps.html` (via redirect 308 conhecido,
  débito RL5.1, ainda não corrigido, seguido até `/apps`) — confirmado por
  requisição HTTP real (`curl`), ambas retornando 6 ocorrências de
  `class="app-card__more"` e 1 ocorrência de `id="app-modal"` no HTML
  servido, com a tag `<script src="assets/js/app-modal.js" defer>`
  presente; `assets/js/app-modal.js` respondendo `200` (após a propagação
  inicial: primeira checagem retornou `404`, segunda tentativa ~15s depois
  já retornou `200` — dentro do esperado para deploy contínuo via
  Cloudflare Pages).
- **Modelo de deploy:** contínuo, via Cloudflare Pages, a cada push em
  `main` (sem staging clássico separado — ver seção "Modelo de deploy
  real" acima)
- **Observabilidade e headers de segurança — sem regressão:** beacon do
  Cloudflare Web Analytics (`static.cloudflareinsights.com/beacon.min.js`,
  mesmo token `bc3ce694...`) e `assets/js/analytics.js` presentes em ambas
  as páginas em produção; `assets/js/nav.js` também presente, sem
  regressão. Headers `content-security-policy`, `x-frame-options: DENY`,
  `x-content-type-options: nosniff`, `referrer-policy:
  strict-origin-when-cross-origin` e `permissions-policy` confirmados
  idênticos aos já validados antes desta mudança, em `/` e em `/apps`
  (canônico), em ambas as respostas HTTP reais. `strict-transport-security`
  segue ausente — não é regressão desta tarefa, é o débito já conhecido
  RL5.2 (HSTS ainda não habilitado no painel Cloudflare).
- **Dupla aprovação confirmada:** `QA-REPORT.md` (seção "Lote 7 — Botão
  'Saiba mais' + Modal nos Cards de App", T7.1 "Aprovado") +
  `SECURITY-REVIEW.md` (seção correspondente ao Lote 7), sem achado
  bloqueante.
- **Débitos abertos, sem bloqueio de deploy:**
  - **RL7.1** (novo, baixo esforço) — corrigir o comentário de verificação
    de contraste em `components.css` (seção do T7.1): o par
    `--color-accent` sobre o fundo do botão é `--color-accent` sobre o
    composto `.glass-card` (~8.06:1, ainda PASS AA), não o par sólido
    `--color-accent`/`--color-bg` (10.13:1) citado no comentário —
    correção só de documentação, nenhuma mudança de CSS/comportamento
    real.
  - **RL7.2** (novo, baixo esforço) — adicionar o nó do Lote 7/T7.1 ao
    diagrama mermaid da Seção 4 do `TASK.md`, refletindo a dependência já
    documentada em texto (T3.4/T3.2 → T7.1).
  - **RL5.1** (já conhecido) — clean URL em `/apps`/`/sobre`, redirecionando
    via 308.
  - **RL5.2** (já conhecido) — HSTS ainda não habilitado no painel
    Cloudflare.
  Todos de baixa/média severidade, com prazo registrado (RL7.1/RL7.2 sem
  urgência, baixo esforço; RL5.1/RL5.2 já com prazo definido em registros
  anteriores) — nenhum bloqueia esta confirmação de deploy.
- **Incidentes/rollback:** nenhum incidente reportado, nenhum rollback
  necessário.

**Veredito:** publicação da T7.1 (Lote 7) confirmada em produção real, sem
achado crítico.

---

## Confirmação de produção (2026-09-17) — Lote 8, Lote 9 e Lote 10 (Rodada 3)

Registro de confirmação final do Gate de produção para os três lotes da
Rodada 3 — Lote 8 (Fundação de Componentes da Página de Produto), Lote 9
(página `public/evolucao-segura.html`) e Lote 10 (Integração na Vitrine,
`apps.html`/`index.html`). O push já havia acontecido antes desta chamada
(commit `ad8d919`, mesmo modelo de deploy contínuo já descrito acima em
"Modelo de deploy real" — não há uma ação de "disparar deploy" a executar
aqui). O papel desta chamada foi a confirmação final exigida pela Seção 4
do `/deploy`: reconfirmar que nada mudou desde os vereditos já registrados,
checar regressão cruzada entre os 3 lotes publicados juntos, e rodar
verificação de rede real contra produção.

- **Data da confirmação:** 2026-09-17
- **Commit publicado:** `ad8d919` ("Publica pagina de divulgacao do
  Evolucao Segura (Lotes 8-10, Rodada 3)"), branch `main`
- **Lotes incluídos:** Lote 8 (fundação de 8 componentes CSS reutilizáveis
  em `components.css`/`tokens.css`, sem tela renderizada), Lote 9 (página
  `public/evolucao-segura.html` completa — hero, prova social, capturas de
  tela, instalação, licença, requisitos e FAQ), Lote 10 (card real
  "Evolução Segura" em `apps.html`/`index.html` apontando para a nova
  página via `href="evolucao-segura.html"`)

### 1. Nada mudou entre os vereditos já registrados e o push

`QA-REPORT.md` e `SECURITY-REVIEW.md` (seções "Lote 8", "Lote 9" e "Lote
10") foram commitados **no mesmo commit** que publicou o código
(`ad8d919`) — não há, por construção, nenhuma janela de divergência entre
o que foi validado e o que foi publicado. `git status` confirma árvore de
trabalho limpa (nada pendente de commit/push) e `git diff ad8d919~1
ad8d919 --stat` sobre os arquivos de produto (`public/apps.html`,
`public/index.html`, `public/evolucao-segura.html`,
`public/assets/css/components.css`, `public/assets/css/tokens.css`)
confirma exatamente o escopo descrito nos vereditos — nenhum arquivo extra,
nenhuma mudança de última hora fora do que QA/DevSecOps já auditaram.

- **Lote 8:** `QA-REPORT.md`, "Veredito geral do Lote 8: Aprovado com
  ressalvas" (1 achado Simples, RL8.1, comentário de contraste em
  `components.css` — documentação, não bloqueante) + `SECURITY-REVIEW.md`,
  "Veredito geral do Lote 8 (chapéu DevSecOps): Aprovado, sem ressalvas e
  sem débito registrado" — dupla aprovação confirmada.
- **Lote 9:** `QA-REPORT.md`, "Veredito geral do Lote 9: Aprovado com
  ressalvas" (1 achado Simples, RL9.1, nota de Status desatualizada em
  `TASK.md`/T9.6 — documentação, não bloqueante) + `SECURITY-REVIEW.md`,
  "Veredito geral do Lote 9 (chapéu DevSecOps): Aprovado, sem ressalvas e
  sem débito registrado" — dupla aprovação confirmada.
- **Lote 10:** `QA-REPORT.md`, "Veredito geral do Lote 10: Aprovado, sem
  ressalvas" + `SECURITY-REVIEW.md`, "Veredito geral do Lote 10 (chapéu
  DevSecOps): Aprovado, sem ressalvas e sem débito registrado" — dupla
  aprovação confirmada.

### 2. Regressão cruzada entre os 3 lotes publicados juntos

Verificação específica que a validação por lote isolado não cobre —
confirmar que os componentes do Lote 8 realmente renderizam corretamente
dentro da página real do Lote 9, e que o ponto de entrada do Lote 10
realmente leva à página do Lote 9 sem quebra:

- **Lote 8 → Lote 9 (consumo dos componentes):** `evolucao-segura.html`
  carrega `assets/css/tokens.css` e `assets/css/components.css` (mesmos
  arquivos do Lote 8) e usa as classes documentadas nos comentários de
  referência do Lote 8 (`hero hero--product`, `.faq`, `.faq__item`,
  `.faq__q`, `.faq__a`, entre outras) — confirmado tanto no HTML fonte
  quanto na resposta HTTP real de produção (ver seção 3). Nenhum dos 8
  componentes ficou órfão (documentado sem uso) nem foi duplicado/
  reescrito no Lote 9.
- **Lote 10 → Lote 9 (navegação real):** o card "Evolução Segura" em
  `apps.html` e `index.html` usa `<a class="badge badge--link"
  href="evolucao-segura.html" data-analytics-event="app-evolucao-segura">Ver
  app</a>` — link real, não placeholder — confirmado no HTML servido pela
  produção (ambas as páginas). Clicar nesse link é a integração cruzada
  entre os 3 lotes: o card do Lote 10 leva à página do Lote 9, que usa os
  componentes do Lote 8.
- **Sem regressão nos demais cards:** os outros 5 cards de `apps.html`/
  `index.html` (Destino Ideal, Minha Jornada, Meu Objetivo, Radar
  Esportivo, Gestão da Pelada) permanecem com o badge "Em breve" e o botão
  "Saiba mais"/modal do Lote 7 intactos — nenhuma mudança de CSS/JS do
  Lote 8-10 tocou nesses cards.
- **Estado do CTA de download — sem regressão da decisão de escopo:** os 2
  CTAs de download em `evolucao-segura.html` (`Baixar para Windows`)
  seguem no estado "Indisponível para download nesta fase" —
  `<button ... disabled aria-disabled="true">` — confirmado no HTML de
  produção, conforme decisão do usuário (RN-03/UX-SPEC.md Seção 4) já
  registrada nos vereditos de Lote 9.
- **Observabilidade e headers — sem regressão:** beacon do Cloudflare Web
  Analytics (mesmo token `bc3ce694...`) e `assets/js/analytics.js`
  presentes em `evolucao-segura.html`; `assets/js/nav.js` também presente.
  Headers de `_headers` (`content-security-policy`, `x-frame-options:
  DENY`, `x-content-type-options: nosniff`, `referrer-policy:
  strict-origin-when-cross-origin`, `permissions-policy`) idênticos aos já
  validados em lotes anteriores, confirmados em todas as 4 URLs
  verificadas nesta chamada (ver seção 3). `strict-transport-security`
  segue ausente — não é regressão desta publicação, é o débito já
  conhecido RL5.2 (HSTS ainda não habilitado no painel Cloudflare).

Nenhuma regressão cruzada encontrada entre os 3 lotes.

### 3. Verificação de rede real contra produção

Requisições HTTP reais executadas nesta chamada contra
`https://ljssoftware.com.br` (mesmo padrão do fechamento do Lote 5):

| Verificação | Resultado |
|---|---|
| `GET /` | HTTP 200. Headers de `_headers` presentes e corretos (CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy). `Server: cloudflare`. |
| `GET /apps.html` | HTTP 308 → `Location: /apps` (redirect "clean URL" já conhecido, débito RL5.1, não relacionado a esta publicação) → segue para `GET /apps` → HTTP 200, mesmos headers de segurança presentes; HTML servido contém o card real "Evolução Segura" com `<a class="badge badge--link" href="evolucao-segura.html" data-analytics-event="app-evolucao-segura">Ver app</a>`. |
| `GET /evolucao-segura.html` | HTTP 308 → `Location: /evolucao-segura` → segue para `GET /evolucao-segura` → HTTP 200, mesmos headers de segurança presentes; HTML confirma `tokens.css`/`components.css` carregados, classes `hero hero--product`/`.faq` presentes, 7 imagens `assets/img/evolucao-segura/shot-s{1..7}.png` referenciadas, CTA de download em estado `disabled`. |
| `GET /index.html` (via `/`) | HTTP 200; HTML confirma o mesmo card "Evolução Segura" com o mesmo link `href="evolucao-segura.html"` replicado na Home, paridade mantida com `apps.html`. |
| `GET /assets/img/evolucao-segura/shot-s1.png`, `shot-s4.png`, `shot-s7.png` | HTTP 200 cada — capturas de tela reais, servidas sem erro. |
| `GET /assets/img/icons/icon-evolucao-segura.svg` | HTTP 200 — ícone do card servido sem erro. |
| `GET /assets/css/components.css` e `/assets/css/tokens.css` | HTTP 200 cada — os dois arquivos do Lote 8 servidos sem erro, consumidos pelas 3 páginas (`apps.html`, `index.html`, `evolucao-segura.html`). |

Todas as URLs listadas no pedido de confirmação (`/`, `/apps.html`,
`/index.html`, `/evolucao-segura.html`) responderam com status HTTP
saudável (200 direto ou 200 após o redirect 308 já conhecido), headers de
segurança de `_headers` intactos, e o link "Ver app" nos cards navegando
de fato para `evolucao-segura.html`.

### 4. Achados abertos avaliados para bloqueio

- **RL8.1** (Lote 8, Simples/documentação — comentário de contraste em
  `components.css`) — baixo esforço, não bloqueia.
- **RL9.1** (Lote 9, Simples/documentação — nota de Status de T9.6 no
  `TASK.md`) — baixo esforço, não bloqueia.
- **RL5.1** (clean URL em `/apps`/`/evolucao-segura`, redirecionando via
  308) e **RL5.2** (HSTS ainda não habilitado no painel Cloudflare) — já
  conhecidos, baixa/média severidade, com prazo registrado, não bloqueiam.
- **L-08/RT-07** (ativação/licenciamento server-side, fora de escopo por
  decisão consciente) e **L-09/RT-08** (repositório GitHub privado,
  bloqueia só uma futura liberação de link de download) — já registrados
  no fechamento do Lote 10, não bloqueiam esta publicação (nenhum CTA de
  download está ativo).
- **T11.2/screenshot do SmartScreen** — pendência de outro lote/rodada,
  fora do escopo destes 3 lotes (Lote 8, 9, 10 não incluem T11.x). Não
  bloqueia esta confirmação.

Nenhum achado de severidade alta/crítica em aberto relativo aos Lotes 8,
9 e 10. Nenhum compliance obrigatório pendente.

**Veredito:** confirmação final de Gate de produção dos Lotes 8, 9 e 10
(Rodada 3) fechada, sem achado crítico e sem regressão cruzada entre os
lotes publicados juntos. Verificação de rede real contra produção
confirma as 4 URLs saudáveis, headers de segurança intactos e a
integração real (card → página → componentes) funcionando de ponta a
ponta. Débitos abertos (RL8.1, RL9.1, RL5.1, RL5.2) são todos baixa
severidade/baixo esforço, com prazo registrado, e não impedem este Gate.
Pronto para o registro de fechamento do Gestor (Gate 4).


## Deploy em staging (2026-09-18) — Lotes 12 e 13

Chapéu DevOps (deployment-execution, observability-setup, non-functional-requirement-validation). Modelo de deploy contínuo (ver "Modelo de deploy real"): push em `main` já publicou; nenhuma ação de disparo, nenhum push/commit de código nesta chamada. Objetivo: confirmar pipeline saudável e staging (https://ljssoftware.pages.dev) refletindo HEAD.

**Commit verificado:** `9fb4e36` (HEAD = origin/main). Nota: não há como ler o commit servido pelo Pages sem o painel; a equivalência é inferida pelo conteúdo servido (páginas/rotas/assets do Lote 12 e 13 presentes).

### Verificações em staging (curl real)

| Verificação | Resultado |
|---|---|
| `/`, `/apps`, `/minha-jornada`, `/evolucao-segura`, `/destino-ideal`, `/radar-esportivo`, `/sitemap.xml` | 200 em todas |
| URL inexistente (`/naoexiste-xyz`) | 404 real (6208 B, página 404 própria) |
| Headers CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy (em `/minha-jornada`) | Presentes e idênticos ao `public/_headers` (comparação textual) |
| Beacon Cloudflare Web Analytics (`static.cloudflareinsights.com`) | Presente em minha-jornada, evolucao-segura, destino-ideal, radar-esportivo |
| Assets de minha-jornada (css base/components/tokens, js analytics/nav, favicons, logo, shot-01/04/08/11/15) | Todos 200 |
| Card Minha Jornada em `/apps` | `href="/minha-jornada"` presente |
| HSTS | Ausente (débito RL5.2 conhecido) |

### Comparação staging × produção (ljssoftware.com.br)

- Status idênticos (200 x7, 404 real) e os 5 headers de segurança idênticos.
- Beacon presente nas páginas comparadas em staging; diff completo de HTML feito só em `/minha-jornada`.
- Única diferença encontrada: produção serve ~257 B a mais por página porque o Cloudflare Email Protection ofusca o e-mail do rodapé (`/cdn-cgi/l/email-protection`, `data-cfemail`), enquanto o staging (`pages.dev`) mantém `mailto:` em texto. É comportamento da zona do domínio, não diferença de build. Ressalva: com JS bloqueado o e-mail em produção aparece como "[email protected]".

### RNFs (site estático)

- HTTPS: 200 sobre TLS, `ssl_verify_result=0` (certificado válido) em staging. Produção respondeu 200 em HTTPS.
- Headers de segurança: ver acima (OK). CSP restringe origens a `self` + beacon.
- Terceiros em `/minha-jornada`: apenas beacon Cloudflare; links externos são `<a>` (LinkedIn, minha-jornada-ljs.pages.dev), sem carga de recurso. `img-src 'self'`.
- Peso: minha-jornada 16 KB HTML; shots 22–61 KB cada; components.css 85 KB (maior recurso, sem minificação verificada); 4 ocorrências de `loading="lazy"` na página.
- Disponibilidade: todas as requisições responderam 200/404 esperados no momento da checagem (amostra única, não é SLA).

### Observabilidade e rollback

- Observabilidade: beacon Web Analytics ativo (snippet presente e permitido pela CSP). Não foi verificado o recebimento de dados no painel.
- HSTS ausente (RL5.2, débito conhecido).
- Rollback: capacidade nativa do Cloudflare Pages (reverter para deployment anterior). NÃO exercitado nesta chamada (sem acesso ao painel); permanece "disponível, não testado".

### Débitos abertos

RL12.2 (decisão registrada, ver GUARDRAILS), RL13.1–RL13.3, RL5.2 (HSTS), teste desatualizado `evolucao-segura.t9-1` (não-regressão, registrado no QA-REPORT), demais itens de `Refatoração Lote-X` pendentes no TASK.md.

### Escopo da publicação

Lotes 12 e 13 verificados em staging. O Lote 11 está parcial (T11.2 pendente) e NÃO deve ser considerado fechado por esta publicação.

### Não verificado (ressalvas)

- Commit efetivamente servido/estado do deployment no painel do Pages.
- Rollback e recebimento de eventos do beacon.
- Beacon e diff completo em todas as páginas de detalhe em produção; diff HTML só em minha-jornada.
- Todas as imagens/assets das demais páginas; lazy loading em todas as imagens.
- Janela pós-deploy de 24h.
- Sem "confirmação de produção" registrada: depende de confirmação explícita do usuário.

**Veredito staging:** saudável, reflete HEAD `9fb4e36` por evidência de conteúdo; sem achado bloqueante.

## Confirmação de produção (2026-09-18) — Lotes 12 e 13

- **Data:** 2026-09-18. Confirmação explícita do usuário nesta sessão.
- **Commits:** 9d8f8fc (Lote 12), 6cb3201 (refatorações RL5.1, RL7.1, RL7.2, RL8.1, RL9.1, RL12.1), f303a6e (decisão RL12.2 + GUARDRAILS), 9fb4e36 (Lote 13). HEAD `9fb4e36`, sincronizado com origin/main.
- **Lotes incluídos:** Lote 12 e Lote 13. O Lote 11 NÃO é fechado por esta publicação (T11.2 pendente).
- **URL:** https://ljssoftware.com.br
- **Modelo de deploy:** contínuo (push em main publica no Cloudflare Pages; mesmo build do staging). Nenhum push/deploy disparado nesta chamada.
- **Dupla aprovação:** QA + DevSecOps, ambos "Validado com ressalvas".

### Verificação HTTP em produção (checagem única, não é SLA)

- Status 200: `/`, `/apps`, `/minha-jornada`, `/evolucao-segura`, `/destino-ideal`, `/radar-esportivo`, `/sobre`, `/sitemap.xml`, `/robots.txt`. Rota inexistente retorna 404 real.
- Headers presentes em `/`: CSP, Permissions-Policy, Referrer-Policy, X-Content-Type-Options, X-Frame-Options. HSTS ausente (RL5.2).
- Beacon Cloudflare presente no HTML de `/evolucao-segura`, `/destino-ideal` e `/radar-esportivo`.
- Imagens: 60 arquivos de imagem de `public/assets` (limitados a 60 pela amostragem) responderam 200 em produção.

### Observabilidade e rollback

- Observabilidade: beacon Web Analytics ativo no HTML (permitido pela CSP). Recebimento de eventos no painel NÃO verificado.
- Rollback: nativo do Cloudflare Pages (reverter para deployment anterior). NÃO exercitado; "disponível, não testado".

### Débitos abertos (sem bloqueio)

RL12.2, RL13.1, RL13.2, RL13.3, RL5.2 (HSTS), teste desatualizado `evolucao-segura.t9-1` e demais itens de `Refatoração Lote-X` pendentes no TASK.md.

### Nota Cloudflare Email Protection

Segue ligado por decisão anterior do usuário. Em produção o e-mail do rodapé é ofuscado (`data-cfemail`); com JS bloqueado aparece como "[email protected]".

### Não verificado

- Commit efetivamente servido/estado do deployment no painel do Pages.
- Rollback e recebimento de eventos do beacon.
- Diff completo de HTML das páginas de detalhe; imagens além da amostra de 60 (existência apenas, não conteúdo/lazy loading).
- Janela pós-deploy de 24h.

**Incidentes:** nenhum observado.

**Veredito produção:** publicado e saudável na checagem realizada; sem achado bloqueante. Ressalvas acima permanecem abertas.
