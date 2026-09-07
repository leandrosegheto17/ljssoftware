# ADR-001 — Arquitetura estática multi-página, sem framework/gerador de site

**Status:** Aceito
**Data:** 2026-09-07
**Autor:** Coordenador (chapéu Software Architect)

## Contexto

O `PRD-TECNICO.md` fecha (RNF-05) que o site deve ser implementável como
estático, sem CMS/painel administrativo, com atualização de conteúdo via nova
build/deploy — confirmado pelo stakeholder que a frequência de atualização
será rara. RNF-06 exige custo mínimo/gratuito. RF-07 exige `<title>` e meta
description específicos "em toda página pública". RF-02 exige que a estrutura
da vitrine de apps suporte, no futuro, substituir o indicador "Em breve" por
um link de saída real, sem exigir redesenho da seção.

Três famílias de solução foram avaliadas:
1. Site estático gerado por framework/SSG (ex.: Astro, Eleventy, Hugo,
   Next.js com export estático).
2. Site estático multi-página em HTML/CSS/JS vanilla, sem build step.
3. Site single-page (uma única URL) com seções por âncora.

## Decisão

Adotar **HTML/CSS/JS vanilla, sem framework nem gerador de site, sem build
step**, organizado em **múltiplas páginas físicas**:

- `index.html` — Home (marca, tagline, CTA para vitrine, prévia de Sobre)
- `apps.html` — Vitrine de apps ("em breve")
- `sobre.html` — Seção Sobre
- `404.html` — Página de erro para rota inexistente

O canal de contato (RF-04) não vira página própria — vive no rodapé,
replicado em todas as páginas acima (link `mailto:` e/ou LinkedIn), por não
ter conteúdo próprio que justifique uma página/URL dedicada.

Cabeçalho (nav), rodapé (contato) e tokens de design (CSS custom properties)
são replicados de forma idêntica entre os HTMLs — sem templating automático.

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| SSG com framework (Astro/Eleventy/Hugo) | Resolveria a duplicação de header/footer, mas introduz dependência de node/build toolchain que precisa de manutenção (atualização de versão, risco de quebra) ao longo de anos de uso raro — o oposto do que RNF-05 pede. Overhead desproporcional para 3-4 páginas estáticas. |
| Single-page com âncoras (`#apps`, `#sobre`) | Simplifica ainda mais (zero duplicação), mas cada seção não tem `<title>`/meta description próprios — conflita diretamente com RF-07 ("toda página pública"), que pede metadados específicos por página, importante para descoberta orgânica de cada assunto (marca, apps, sobre) — objetivo central de RA-02/RA-07. |
| Next.js/React com export estático | Overhead de bundle JS de framework para um site que RF-06 exige ser leve (RNF-01: LCP < 2.5s em 4G) e que não tem necessidade de interatividade complexa — desproporcional. |

## Consequências

- **Positivo:** zero dependências de build/runtime, deploy é a cópia direta
  dos arquivos, menor risco de dependência desatualizada/vulnerável ao longo
  de anos sem manutenção ativa, alinhado a RNF-05/RNF-06.
- **Positivo:** cada página tem controle total de `<title>`/meta description
  (RF-07).
- **Negativo (trade-off aceito):** header/nav e rodapé de contato são
  duplicados em 3-4 arquivos HTML — qualquer mudança neles precisa ser
  replicada manualmente. Mitigação: número de páginas é pequeno (3-4) e
  atualização é rara (RNF-05); `TASK.md` (Seção 1, Diretrizes de
  Implementação) deve registrar a obrigação de manter os blocos de
  header/footer byte-idênticos entre páginas.
- **Gatilho de revisão futura:** se o número de páginas crescer de forma
  relevante (ex.: página própria por app quando publicado), revisitar esta
  decisão e considerar migrar para um SSG leve (ex.: Eleventy) — registrar
  novo ADR nesse momento, não editar este.
