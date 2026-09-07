# ADR-003 — Analytics via Cloudflare Web Analytics

**Status:** Aceito
**Data:** 2026-09-07
**Autor:** Coordenador (chapéu Software Architect)

## Contexto

`PRD.md` (Seção 3, redefinida na Rodada 2) define como métrica de
acompanhamento pós-lançamento o **número de cliques no canal de contato**
(e-mail/LinkedIn), como sinal de interesse gerado pelo site. DI-04 do
`PRD-TECNICO.md` deixa a ferramenta de analytics como decisão técnica do
Coordenador, "respeitando LGPD se houver coleta de dados de visitantes".
RNF-06 exige custo mínimo/gratuito.

## Decisão

Usar **Cloudflare Web Analytics** (gratuito, incluído no mesmo provedor
escolhido em ADR-002), com:
- Beacon de pageview padrão (sem cookies, sem fingerprinting, dados
  agregados) para visão geral de tráfego.
- Evento customizado (`data-cf-beacon` + chamada de evento) disparado nos
  cliques dos links de e-mail (`mailto:`) e LinkedIn no rodapé, atendendo
  diretamente à métrica de sucesso do `PRD.md`.

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| Google Analytics (GA4) | Usa cookies/identificadores e coleta mais invasiva de dados pessoais — exigiria banner de consentimento (LGPD), aumentando escopo de UX/legal para um site institucional simples sem essa necessidade declarada. Também é mais um provedor externo a gerenciar. |
| Plausible / Simple Analytics (self-host ou SaaS) | Privacy-first como o Cloudflare, mas tem custo recorrente no plano SaaS (contraria RNF-06) ou exige infraestrutura própria para self-host (contraria a premissa de site 100% estático sem servidor, ADR-001). |
| Nenhum analytics | Deixaria a métrica de sucesso do `PRD.md` (cliques no canal de contato) sem forma de medição — não atende ao objetivo de negócio declarado. |

## Consequências

- **Positivo:** sem custo adicional, sem cookies, sem necessidade de banner
  de consentimento sob LGPD (dados agregados e anonimizados, sem
  identificação de visitante individual) — reduz escopo de UX/legal.
- **Positivo:** mesmo provedor de hosting/DNS (ADR-002), reduzindo número de
  integrações externas a gerenciar.
- **Negativo (limite aceito):** Cloudflare Web Analytics é mais simples que
  ferramentas dedicadas (sem funis avançados, sem segmentação rica) —
  suficiente para a métrica declarada (contagem de cliques), mas não serve
  para análises futuras mais sofisticadas. Se a fase 2 (apps publicados)
  exigir métricas de conversão mais elaboradas, revisitar com novo ADR.
