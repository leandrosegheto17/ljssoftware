# PRD-TECNICO.md — Site institucional LJSSoftware

**Status:** Rascunho refinado (Loop A, Rodada 2) — todos os itens antes
marcados `[PENDENTE]` foram resolvidos com as respostas do stakeholder às 6
Perguntas em Aberto do `PRD.md`. Documento pronto para o checklist de
aprovação do chapéu BA (ver seção final).
**Base:** `PRD.md` (atualizado 2026-09-07, Rodada 2)
**Data:** 2026-09-07 (Rodada 1) — atualizado 2026-09-07 (Rodada 2)
**Autor:** Gestor (chapéu Business Analyst)

---

## 1. Requisitos Funcionais

### RF-01 — Página inicial (Home) [deriva de RA-01]
**Descrição:** O site deve exibir uma página inicial que apresenta a marca
LJSSoftware ao visitante.
**Critério de aceite (EARS):**
- O sistema DEVE exibir, ao carregar a URL raiz do domínio, o nome da marca
  (LJSSoftware) e uma frase de apresentação curta (tagline).
- O sistema DEVE exibir na home um ponto de acesso visível (link/botão) para
  a seção de listagem de apps (RF-02).

### RF-02 — Listagem/vitrine de apps [deriva de RA-02] — Resolvido (Rodada 2)
**Descrição:** O site deve listar os aplicativos em desenvolvimento pela
LJSSoftware. Confirmado pelo stakeholder: nenhum app está publicado no
lançamento — todos devem ser exibidos com status "em breve".
**Critério de aceite (EARS):**
- O sistema DEVE exibir, para cada app cadastrado, ao menos: nome e descrição
  curta.
- QUANDO um app não tiver destino de publicação disponível (situação de
  todos os apps na fase 1), o sistema DEVE exibir um indicador visual de
  status "Em breve" no lugar de um link clicável, sem apresentar link
  quebrado ou vazio.
- QUANDO um app futuramente for publicado (fora do escopo da fase 1, mas a
  estrutura deve suportar), o sistema DEVE permitir substituir o indicador
  "Em breve" por um link de saída funcional para aquele app específico, sem
  exigir redesenho da seção.
- A quantidade e os nomes dos apps a listar na fase 1 serão fornecidos pelo
  stakeholder como conteúdo (não são parte do critério de aceite estrutural
  deste requisito, que é sobre o comportamento do componente de listagem).

### RF-03 — Seção "Sobre" [deriva de RA-03]
**Descrição:** Seção com apresentação breve do stakeholder/marca.
**Critério de aceite (EARS):**
- O sistema DEVE exibir uma seção "Sobre" acessível a partir da home, com um
  texto descrevendo a proposta da LJSSoftware.

### RF-04 — Canal de contato [deriva de RA-04] — Resolvido (Rodada 2)
**Descrição:** Forma de o visitante entrar em contato com o stakeholder.
Confirmado pelo stakeholder: link simples de e-mail e/ou LinkedIn — sem
formulário, sem backend de envio.
**Critério de aceite (EARS):**
- O sistema DEVE exibir, em local visível do site (ex.: home e/ou rodapé),
  um link de e-mail (`mailto:`) e/ou um link para o perfil de LinkedIn do
  stakeholder.
- QUANDO o visitante clicar no link de e-mail, o sistema DEVE abrir o
  cliente de e-mail padrão do dispositivo com o destinatário já preenchido.
- QUANDO o visitante clicar no link de LinkedIn, o sistema DEVE abrir o
  perfil em nova aba.
- O sistema NÃO DEVE apresentar formulário de contato nem qualquer campo que
  exija processamento de envio no servidor (fora de escopo, confirmado).

### RF-05 — Publicação com HTTPS no domínio próprio [deriva de RA-05]
**Descrição:** O site deve estar acessível publicamente em
`ljssoftware.com.br` com conexão segura.
**Critério de aceite (EARS):**
- O sistema DEVE responder em `https://ljssoftware.com.br` com certificado
  TLS válido.
- QUANDO o visitante acessar via `http://`, o sistema DEVE redirecionar
  automaticamente para `https://`.

### RF-06 — Responsividade [deriva de RA-06]
**Descrição:** O layout deve se adaptar a diferentes tamanhos de tela.
**Critério de aceite (EARS):**
- O sistema DEVE exibir corretamente todo o conteúdo da home, da listagem de
  apps, da seção "Sobre" e do canal de contato em telas com largura a partir
  de 360px (mobile) até resoluções desktop comuns, sem sobreposição de
  elementos ou necessidade de rolagem horizontal.

### RF-07 — SEO básico [deriva de RA-07]
**Descrição:** Metadados mínimos para descoberta orgânica.
**Critério de aceite (EARS):**
- O sistema DEVE incluir, em toda página pública, uma tag `<title>` e uma
  meta description específicas para o conteúdo da página.
- O sistema DEVE servir um favicon reconhecível da marca.

### RF-08 — Identidade visual básica [deriva de RA-08] — Resolvido (Rodada 2)
**Descrição:** Não existe identidade visual prévia da LJSSoftware. Confirmado
pelo stakeholder: precisa ser criada como parte do escopo, podendo ser tão
simples quanto um wordmark tipográfico (nome estilizado em texto) e uma
paleta de cores — sem exigência de logotipo ilustrativo elaborado.
**Critério de aceite (EARS):**
- O sistema DEVE apresentar, de forma consistente em todas as páginas, um
  wordmark (nome "LJSSoftware" estilizado tipograficamente) e uma paleta de
  cores fixa (mínimo: 1 cor primária, 1 cor de destaque/CTA, cores neutras de
  texto/fundo).
- O favicon (RF-07) DEVE ser derivado do mesmo wordmark/paleta, garantindo
  consistência visual da marca.
- Este requisito NÃO exige a criação de um logotipo ilustrativo/símbolo
  gráfico — um wordmark tipográfico simples satisfaz o critério de aceite.

---

## 2. Requisitos Não-Funcionais

| # | Requisito | Critério de aceite (EARS) |
|---|---|---|
| RNF-01 | Desempenho de carregamento | O sistema DEVE carregar a home com tempo de exibição do conteúdo principal (LCP) abaixo de 2.5s em conexão 4G simulada. |
| RNF-02 | Disponibilidade | O sistema DEVE estar acessível publicamente com disponibilidade compatível com hospedagem padrão de mercado para site estático/institucional (meta de referência: 99.5% mensal, ajustável conforme provedor escolhido no SDD.md). |
| RNF-03 | Idioma do conteúdo | **Resolvido (Rodada 2).** O sistema DEVE apresentar todo o conteúdo textual em português (pt-BR). O sistema NÃO DEVE incluir seletor de idioma nem versão em inglês na fase 1 (confirmado como fora de escopo). |
| RNF-04 | Acessibilidade básica | O sistema DEVE fornecer texto alternativo (`alt`) para toda imagem informativa e manter contraste de texto mínimo adequado para leitura (WCAG AA como referência). |
| RNF-05 | Manutenibilidade de conteúdo | **Resolvido (Rodada 2).** Stakeholder confirmou atualização de conteúdo rara. O sistema DEVE ser implementável como site estático (conteúdo versionado em arquivo/código-fonte), SEM exigir painel administrativo ou CMS dinâmico — confirmado como fora de escopo. Atualizações de conteúdo (ex.: novo app publicado) serão feitas via nova build/deploy, não via interface administrativa. |
| RNF-06 | Custo de operação | O sistema DEVE ser hospedado em solução de custo mínimo ou gratuito (ex.: hospedagem estática), sem exigir custo recorrente relevante além do domínio já pago pelo stakeholder — confirmado como restrição de orçamento. |

---

## 3. Regras de Negócio

| # | Regra | Racional |
|---|---|---|
| RN-01 | Um app sem link de destino disponível deve ser exibido com status "Em breve", nunca como link quebrado ou ausente. | Evita experiência de erro (404/link morto) e mantém transparência sobre o estágio do produto. |
| RN-02 | Todo link de saída para um app deve abrir identificando claramente que o visitante está saindo do site da LJSSoftware para o destino do app (ex.: indicação visual ou abertura em nova aba). | Evita confusão do usuário sobre em qual site está navegando; boa prática de UX para links de saída. |

> Nota: regras de negócio adicionais (ex.: critérios para remover um app da
> vitrine, ordenação da listagem) não puderam ser levantadas por falta de
> informação sobre o portfólio real de apps — a revisitar quando a Pergunta
> em Aberto 1 do `PRD.md` for respondida.

---

## 4. Fluxos de Usuário/Processo

### Fluxo principal: Visitante descobre um app através do site

```mermaid
flowchart TD
    A[Visitante acessa ljssoftware.com.br] --> B[Home carrega]
    B --> C{Visitante quer ver os apps?}
    C -- Sim --> D[Acessa listagem de apps]
    D --> E{App está publicado?}
    E -- Sim --> F[Clica no link de saída do app]
    F --> G[Sai do site LJSSoftware para o destino do app]
    E -- Não --> H[Vê indicador "Em breve"]
    C -- Não, quer saber sobre a marca --> I[Acessa seção Sobre]
    C -- Não, quer contato --> J[Acessa canal de contato]
    J --> K[Clica em link de e-mail ou LinkedIn]
    K --> L[Sai do site para o cliente de e-mail ou perfil de LinkedIn]
```

**Caminhos alternativos:**
- Visitante chega direto em uma página interna via link compartilhado (ex.:
  link direto para a seção de apps) — o sistema deve permitir navegação de
  volta à home a partir de qualquer seção.
- Visitante acessa via `http://` — redirecionado para `https://` (RF-05)
  antes de qualquer outro fluxo.

---

## 5. Dependências e Integrações

| # | Dependência/Integração | Tipo | Observação |
|---|---|---|---|
| DI-01 | Domínio `ljssoftware.com.br` | Já existente | Confirmado pelo stakeholder; requer configuração de DNS apontando para a hospedagem escolhida (decisão do Coordenador no SDD.md). |
| DI-02 | Certificado TLS/HTTPS | A provisionar | Tipicamente automático em provedores modernos (ex.: Let's Encrypt via plataforma de hospedagem) — decisão de plataforma no SDD.md. |
| DI-03 | Destinos de link de cada app (loja de apps, site próprio do app, repositório) | **Resolvido — não aplicável na fase 1.** | Confirmado que nenhum app está publicado; RF-02 usa status "em breve" para todos, sem link de destino real. Esta dependência só passa a existir em fase futura, quando o primeiro app for publicado. |
| DI-04 | Ferramenta de analytics | A definir no SDD.md | Ajustado ao objetivo de sucesso redefinido (Seção 3 do `PRD.md`): deve medir cliques no canal de contato (RF-04) como sinal de interesse na fase 1, não cliques de saída para apps (que ficam para fase futura). Ferramenta específica é decisão técnica do Coordenador, respeitando LGPD se houver coleta de dados de visitantes. |
| DI-05 | Canal de contato (e-mail/LinkedIn) | **Resolvido.** | Confirmado como link direto (`mailto:` e/ou URL de LinkedIn) — não há integração de envio de e-mail nem backend a provisionar, pois não há formulário (confirmado fora de escopo). |
| DI-06 | Identidade visual (wordmark + paleta) | **Resolvido — entra em escopo.** | Confirmado pelo stakeholder que não existe identidade visual prévia e que ela deve ser criada como parte do escopo (RF-08/RA-08). Passa a ser um artefato de entrada que o Executor precisa produzir (ou receber definido pelo Coordenador/stakeholder) antes/durante a implementação visual — não é mais uma dependência externa pendente, e sim um item do próprio escopo de execução. |

---

## 6. Premissas e Riscos Resolvidos

| # (origem PRD.md) | Premissa/Risco | Situação |
|---|---|---|
| PR-01 | Existe ao menos 1 app publicado para divulgar no lançamento | **Refutada com evidência direta do stakeholder (Rodada 2):** nenhum app está publicado — todos em desenvolvimento. RF-02/DI-03 ajustados para refletir isso (status "em breve" para todos, sem link de destino real na fase 1). |
| PR-02 | Idioma principal é pt-BR | **Confirmada com evidência direta do stakeholder (Rodada 2):** só português, sem versão em inglês na fase 1. RNF-03 fechado. |
| PR-03 | Não há necessidade de captura de leads na fase 1 | **Confirmada com evidência direta do stakeholder (Rodada 2):** contato via link simples (e-mail/LinkedIn), sem formulário. RF-04/DI-05 fechados. |
| PR-04 | Solução técnica pode ser site estático simples | **Premissa de produto confirmada** pelo stakeholder (atualização de conteúdo rara, Rodada 2) — RNF-05 fechado nesse nível. A decisão final de arquitetura (qual stack/hospedagem estática) permanece com o Coordenador no SDD.md, mas não há mais ambiguidade de requisito de produto impedindo essa decisão. |
| PR-05 | Risco de expectativa de orçamento/prazo desalinhada | **Mitigado com evidência direta do stakeholder (Rodada 2):** preferência explícita por solução gratuita/baixo custo (RNF-06) e sem prazo fixo de lançamento — reduz o risco de expectativa desalinhada para o Coordenador planejar o TASK.md. |
| PR-06 (nova, origem PRD.md Rodada 2) | Identidade visual básica pode ser produzida sem contratação externa de designer | **Registrada, não resolvida nesta rodada** — depende de avaliação de capacidade do Coordenador/Executor na fase de execução; não é uma resolução de requisito de produto, e sim uma validação de viabilidade técnica/prática a ser feita adiante. |

> Todas as premissas herdadas da Rodada 1 foram validadas ou refutadas com
> evidência citada (resposta direta do stakeholder, registrada no `PRD.md`
> Seção 6/7), conforme exigido antes de aprovar este documento.

---

## 7. Interpretações Registradas

| # | Ambiguidade | Interpretação adotada | Porquê |
|---|---|---|---|
| INT-01 (atualizado Rodada 2) | RA-04 ("canal de contato") não especificava, na Rodada 1, se seria simples (link) ou complexo (formulário com envio) | Resolvida pela resposta direta do stakeholder: link simples (e-mail/LinkedIn), sem formulário. RF-04 especificado com esse formato definitivo — não é mais interpretação do BA, e sim decisão de produto já confirmada. | Registrado aqui apenas para rastreabilidade histórica da ambiguidade original; a decisão em si veio do stakeholder (chapéu PM/BA não decidiu por conta própria algo que era escopo de produto). |
| INT-02 | RA-01 não define se "apresentação da marca" inclui texto longo institucional ou apenas tagline curta | Adotada a interpretação mínima (tagline curta) como piso de aceite em RF-01, permitindo que texto mais elaborado seja adicionado sem violar o critério de aceite | Interpretação de detalhe de conteúdo dentro do requisito já aceito (RA-01), não altera o que é o produto — compatível com o papel do chapéu BA de resolver ambiguidade de interpretação, não de escopo. |
| INT-03 (nova, Rodada 2) | RA-08 ("identidade visual básica") não especifica se exige logotipo ilustrativo/símbolo gráfico | Adotada a interpretação mínima: wordmark tipográfico (nome estilizado em texto) + paleta de cores satisfaz o critério de aceite de RF-08; logotipo ilustrativo não é exigido | Interpretação de nível de detalhe dentro do requisito já aceito pelo stakeholder ("mesmo que básica/minimalista... talvez um logotipo simples em texto/wordmark" — palavras do próprio stakeholder), não altera o que foi pedido, apenas fixa o piso mínimo de aceite para o Executor. |

---

## Checklist de pronto (chapéu BA) — Rodada 2

- [x] Todo requisito funcional tem critério de aceite testável — RF-01 a
      RF-08 completos, incluindo RF-02 e RF-04, antes pendentes, agora
      resolvidos com o formato definitivo confirmado pelo stakeholder.
- [x] Toda regra de negócio tem racional declarado (RN-01, RN-02)
- [x] O fluxo de usuário principal tem pontos de decisão e caminhos
      alternativos mapeados (Seção 4), incluindo o fluxo de contato completo
      (antes pendente)
- [x] Toda dependência/integração conhecida está nomeada e resolvida (Seção
      5) — DI-03 marcada como não aplicável na fase 1 (não há apps
      publicados), DI-05 e DI-06 resolvidas
- [x] Toda premissa/risco herdado do PM foi validada ou refutada com
      evidência citada — PR-01 a PR-05 resolvidas com resposta direta do
      stakeholder (Seção 6); PR-06 (nova) registrada como pendente de
      avaliação de viabilidade na execução, não bloqueia este documento
- [x] Toda ambiguidade resolvida está registrada na Seção 7 (INT-01
      atualizada, INT-02 mantida, INT-03 nova)

**Conclusão:** este documento está pronto para handoff de contexto ao
Coordenador (SDD.md) e ao Executor/Validador. Pontos que permanecem como
decisão técnica (não de produto) para o Coordenador resolver no SDD.md:
escolha de stack/hospedagem estática (RNF-05/RNF-06), ferramenta de
analytics (DI-04) e avaliação de viabilidade de produção interna da
identidade visual (PR-06).
