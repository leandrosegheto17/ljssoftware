# ADR-002 — Hospedagem em Cloudflare Pages com DNS gerenciado no Cloudflare

**Status:** Aceito
**Data:** 2026-09-07
**Autor:** Coordenador (chapéu Software Architect)

## Contexto

RA-05/RF-05 exigem publicação em `ljssoftware.com.br` com HTTPS (TLS válido)
e redirecionamento automático de `http://` para `https://`. RNF-06 exige
custo mínimo/gratuito, sem custo recorrente relevante além do domínio já
pago. RNF-01 exige LCP < 2.5s em 4G simulada. RNF-02 pede disponibilidade
compatível com hospedagem padrão de mercado para site estático. DI-01/DI-02
(domínio já registrado em registro.br; certificado TLS a provisionar)
dependem da escolha de plataforma feita aqui.

## Decisão

Hospedar o site em **Cloudflare Pages** (plano gratuito), com o domínio
`ljssoftware.com.br` adicionado como domínio customizado e o **DNS do
domínio migrado para a Cloudflare** (mudança de NS no registro.br para os
nameservers da Cloudflare).

- Deploy via integração direta com o repositório Git (push na branch
  principal dispara novo deploy) — consistente com RNF-05 ("atualizações via
  nova build/deploy").
- TLS gerenciado automaticamente pela Cloudflare (certificado emitido/renovado
  sem intervenção manual), com "Always Use HTTPS" habilitado para satisfazer
  o redirecionamento `http`→`https` de RF-05.
- CDN global da Cloudflare atende ao alvo de LCP de RNF-01 (conteúdo servido
  de edge próximo ao visitante, sem servidor de origem dinâmico).
- `www.ljssoftware.com.br` configurado como redirecionamento 301 para o
  domínio apex (`ljssoftware.com.br`), que é o canônico.

## Alternativas consideradas

| Alternativa | Por que não (ou por que ficou em segundo lugar) |
|---|---|
| GitHub Pages | Também gratuito e com HTTPS automático via Let's Encrypt, mas CDN/edge menos abrangente que Cloudflare para o público-alvo (majoritariamente Brasil) e sem analytics de borda integrado (exigiria DI-04 à parte). Alternativa viável de reserva se a migração de NS para Cloudflare for indesejada pelo stakeholder. |
| Netlify / Vercel (plano free) | Equivalentes em custo/HTTPS/CDN, mas cada um teria de resolver DI-04 (analytics) com ferramenta externa separada; Cloudflare consolida hospedagem + DNS + analytics num único provedor, reduzindo pontos de falha/gestão para um projeto de manutenção rara. |
| Hospedagem compartilhada tradicional (cPanel) via provedor .com.br | Tipicamente tem custo recorrente (raramente há plano estático gratuito de qualidade), contrariando RNF-06. |

## Consequências

- **Positivo:** custo recorrente zero (plano gratuito cobre o volume de
  tráfego esperado por um site institucional), TLS automático, CDN global,
  deploy simples via Git — tudo alinhado a RNF-01/RNF-02/RNF-05/RNF-06/RF-05.
- **Negativo (risco aceito):** dependência de um único provedor (Cloudflare)
  para DNS + hosting + analytics — concentração de risco operacional.
  Mitigação: exportação de zona DNS documentada antes da migração de NS,
  permitindo reverter/trocar de provedor sem perda de configuração (ver
  Seção 6 do `SDD.md`, Riscos Técnicos).
- **Ação exigida do stakeholder:** alterar os nameservers do domínio no
  painel do registro.br para os nameservers fornecidos pela Cloudflare —
  passo fora do controle do Executor/Validador, a ser sinalizado como
  pré-requisito de deploy no `TASK.md`/`DEPLOY.md`.
