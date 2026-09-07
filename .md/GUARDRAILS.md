# GUARDRAILS.md — Site institucional LJSSoftware

**Status:** Aprovado pelo Gestor (chapéu CTO, `guardrails-governance`) em
2026-09-07 — ver Log de Alterações.
**Base:** `SDD.md`, ADRs 001-005, `CTO-REVIEW.md` (Gate 1)
**Data:** 2026-09-07
**Autor:** Coordenador

---

## Regras Inegociáveis

| # | Regra | Origem | Consequência de violação |
|---|---|---|---|
| G-01 | Não introduzir framework, gerador de site (SSG) nem build step (`package.json`/toolchain) neste projeto | ADR-001 | Reverte a decisão de zero dependência de build; exige novo ADR supersedendo ADR-001 antes de qualquer mudança |
| G-02 | Header/Nav e Footer/Contato devem permanecer byte-idênticos entre as 4 páginas HTML | SDD.md, RT-02 / TASK.md Seção 1 | Divergência visual/funcional entre páginas; corrigir replicando o bloco correto nas 4 páginas na mesma tarefa |
| G-03 | Não adicionar nenhuma ferramenta de analytics além do Cloudflare Web Analytics sem novo ADR | ADR-003 | Risco de reintroduzir necessidade de banner de consentimento LGPD (cookies) sem essa decisão ter sido revisada |
| G-04 | Não implementar formulário de contato com envio ao servidor, nem qualquer campo que exija processamento no backend | PRD-TECNICO.md RF-04 | Contraria requisito de produto confirmado pelo stakeholder (fora de escopo); exigiria decisão do Gestor para mudar escopo |
| G-05 | WCAG AA é critério não negociável em toda tela — nenhuma página pode ser considerada pronta com pendência crítica de acessibilidade | UX-SPEC.md Seção 5 | Bloqueia fechamento da tarefa/lote correspondente até corrigir |
| G-06 | Toda página deve especificar (ou justificar explicitamente a não-aplicabilidade) os 4 estados de tela: vazio, carregando, erro, sucesso | UX-SPEC.md Seção 4 | Tela não pode ser marcada `Concluída` sem essa cobertura |
| G-07 | Todo asset de imagem deve ser exportado já otimizado (WebP com fallback) antes de ser versionado no Git | SDD.md, RT-04 | Risco de degradar RNF-01 (LCP < 2.5s); Validador pode reprovar em revisão de performance |
| G-08 | HTTPS obrigatório em toda rota, com redirecionamento automático de `http://` para `https://` | PRD-TECNICO.md RF-05 / SDD.md Seção 7 | Falha de segurança básica; bloqueia deploy em produção |
| G-09 | Headers de segurança (`_headers`: CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) devem estar presentes em toda rota publicada | SDD.md Seção 7 | Débito de segurança a ser apontado pelo Validador (chapéu DevSecOps) em `SECURITY-REVIEW.md` |
| G-10 | Nenhum serviço pago deve ser adicionado à arquitetura sem sinalizar ao Gestor — a solução deve permanecer de custo mínimo/gratuito | PRD-TECNICO.md RNF-06 | Mudança de custo recorrente é decisão de negócio, não técnica — exige aprovação do Gestor/usuário |
| G-11 | Fontes (Unbounded, Outfit) devem permanecer self-hosted nos assets do próprio site, não carregadas via CDN externo do Google Fonts | SDD.md Seção 3 / ADR-005 | Reintroduz requisição a terceiro (impacto de performance/privacidade) sem essa decisão ter sido revisada |
| G-12 | Nenhum componente novo de UI deve ser introduzido fora do design system documentado no `UX-SPEC.md` sem marcá-lo explicitamente como novo e atualizar a Seção 3.2 | UX-SPEC.md Seção 3.2 | Quebra de consistência visual não seria detectável/rastreável |
| G-13 | Mudança de decisão arquitetural já registrada em ADR nunca edita o ADR original — sempre cria um novo ADR com `Status: Superseded by ADR-NNN` no antigo | PIPELINE-CONVENTIONS.md Seção 1 | Perda de rastreabilidade histórica da decisão |
| G-14 | Os 3 arquivos de logo (`logo-ljssoftware.png`, `logo-ljssoftware-transparente.png`, `logo-ljssoftware-icone.png`) são ativos de marca fornecidos pelo usuário — não recriar/substituir por arte nova sem nova decisão explícita do usuário/Gestor | ADR-005 | Perda de fidelidade à identidade visual real da marca já aprovada |

---

## Log de Alterações

| Data | Proposto por | Aprovado por | Mudança | Motivo | Validade |
|---|---|---|---|---|---|
| 2026-09-07 | coordenador | gestor (chapéu CTO) | Criação do rascunho inicial (G-01 a G-13) | Primeira geração do `GUARDRAILS.md`, extraída de `SDD.md`, ADRs 001-004 e `PRD-TECNICO.md`, junto com o `TASK.md` | Permanente (mudança estrutural) |
| 2026-09-07 | coordenador | gestor (chapéu CTO) | G-11 atualizada (Sora/Inter → Unbounded/Outfit); G-14 adicionada (proteção dos ativos de logo reais) | Reabertura pontual do `UX-SPEC.md` (identidade visual "Geométrico/Glass", `ADR-005`, supersede `ADR-004`) — sincronização decorrente da mesma decisão já aprovada pelo usuário, não uma nova regra de negócio | Permanente (mudança estrutural) |
