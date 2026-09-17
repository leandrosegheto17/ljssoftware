# ADR-006 — Hospedagem/distribuição do instalador via GitHub Releases

**Status:** Aceito
**Data:** 2026-09-17
**Autor:** Coordenador (chapéu Software Architect) — reabertura pontual (Rodada 3)

## Contexto

`PRD-TECNICO.md` Seção 9.5 (DI-08) exige decisão técnica de onde hospedar o
binário `evolucao-segura.exe` para download a partir da nova página
`evolucao-segura.html` (RF-09), respeitando:
- **G-01** (`SDD.md`/ADR-001): zero build/framework/backend no site.
- **G-10** (`GUARDRAILS.md`): nenhum serviço pago sem sinalizar ao Gestor.
- **PR-08** (`PRD-TECNICO.md`): distribuição sem custo recorrente.

O produto já tem um repositório de código próprio,
`https://github.com/leandrosegheto17/EvolucaoSegura`, citado no
`PRD.md`/`PRD-TECNICO.md` como fonte de screenshots (DI-07). **Verificação
feita nesta reabertura:** uma requisição não autenticada a essa URL retorna
`404`, o que indica que o repositório está hoje **privado** (ou não existe
publicamente no caminho informado) — divergindo da premissa registrada no
`PRD.md` Seção 8.3 ("repositório público"). Essa divergência é tratada como
um pré-requisito de publicação (ver Consequências), não como um bloqueio ao
planejamento em si.

Três famílias de solução foram avaliadas para o binário:
1. **GitHub Releases** do próprio repositório do produto.
2. **Asset versionado dentro do repositório do site** (`public/downloads/`),
   servido pelo próprio Cloudflare Pages.
3. **Processo manual por e-mail** (stakeholder envia o instalador sob
   demanda, sem link direto no site).

## Decisão

Adotar **GitHub Releases do repositório `EvolucaoSegura`** como destino do
CTA de download da nova página, com o **pré-requisito explícito** de que o
repositório (ou, no mínimo, a Release específica que contém o instalador)
seja tornado público pelo stakeholder antes da publicação do link real —
mesmo padrão de dependência manual externa já usado para RT-03 (migração de
NS pelo stakeholder no `registro.br`).

Enquanto esse pré-requisito não for confirmado, o CTA de download da página
aponta para uma âncora interna de espera (mesmo padrão já usado no mockup de
conceito, `href="#baixar"`), nunca para uma URL de arquivo quebrada — RN-01
(`PRD-TECNICO.md`) aplicado por analogia ao botão de download, não só ao
badge do card da vitrine.

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| Asset versionado em `public/downloads/` (repositório do site) | Infla o repositório do site (institucional, hoje só HTML/CSS/JS/imagens pequenas) com um binário de dezenas de MB por versão, sem histórico de versionamento dedicado a releases; toda atualização do app exigiria um novo commit/deploy do site só para trocar o arquivo — acopla o ciclo de release do produto ao ciclo de deploy do site institucional, o que ADR-001 já evita para o próprio código do site |
| Processo manual por e-mail | Contraria diretamente o critério de aceite de RF-09 ("CTA de download... visivelmente identificado como tal"), que pressupõe início de download imediato ao clique, não uma solicitação assíncrona; also adiciona carga operacional recorrente ao stakeholder sem necessidade, já que GitHub Releases resolve o mesmo problema de graça |
| Serviço de hospedagem de arquivo dedicado (ex.: S3, Backblaze B2) | Introduz conta/serviço pago (ainda que com free tier) fora do que já está em uso (Cloudflare + GitHub); violaria G-10 sem necessidade concreta — GitHub Releases já é gratuito, ilimitado para binário público de porte pequeno/médio, e já é a plataforma de código do produto |

## Consequências

- **Positivo:** custo zero, sem novo serviço na arquitetura (G-10
  preservado), versionamento de binário fica naturalmente atrelado ao
  versionamento de código do produto (cada Release = uma versão do app),
  sem acoplar o deploy do site ao deploy do instalador.
- **Positivo:** CDN do GitHub cobre a entrega do binário sem exigir
  nenhuma mudança na infraestrutura Cloudflare do site (ADR-002).
- **Negativo (trade-off aceito):** dependência de um segundo provedor
  externo (GitHub, além de Cloudflare/registro.br já usados) para a
  experiência de download funcionar de ponta a ponta — mitigação: GitHub
  já é usado como plataforma de código-fonte do produto (não é uma
  dependência nova sendo introduzida ao ecossistema do stakeholder).
- **Pré-requisito de publicação (bloqueia só o link real, não o
  desenvolvimento da página):** o repositório `EvolucaoSegura` (ou a
  Release específica) precisa ser tornado público pelo stakeholder antes de
  T10.2 (`TASK.md`) trocar o badge "Em breve" por link real — registrado
  como risco RT-08 no `SDD.md` e como pré-requisito explícito no `TASK.md`,
  mesmo padrão já usado para RT-03.
- **Fora desta decisão:** o fluxo de ativação/licenciamento (chave gerada
  pelo instalador → validação no site → contra-chave) **não** está coberto
  por este ADR — permanece como lacuna registrada (`TASK.md`, Seção 6),
  pois exigiria uma decisão de arquitetura separada (processamento
  server-side, hoje inexistente no site estático) fora do escopo desta
  reabertura pontual (RF-09 cobre só a página de divulgação).
