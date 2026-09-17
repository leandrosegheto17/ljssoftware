# GUARDRAILS.md — Site institucional LJSSoftware

**Status:** Aprovado pelo Gestor (chapéu CTO, `guardrails-governance`) em
2026-09-07 e, para a extensão de G-02 e as novas G-15 a G-17 (Rodada 3), em
2026-09-17 — ver Log de Alterações e `CTO-REVIEW.md`, seção "Governança de
GUARDRAILS.md — Rodada 3".
**Base:** `SDD.md`, ADRs 001-006, `CTO-REVIEW.md` (Gate 1 + Gate 1
Reabertura pontual)
**Data original:** 2026-09-07 · **Data desta revisão:** 2026-09-17
**Autor:** Coordenador

---

## Regras Inegociáveis

| # | Regra | Origem | Consequência de violação |
|---|---|---|---|
| G-01 | Não introduzir framework, gerador de site (SSG) nem build step (`package.json`/toolchain) neste projeto | ADR-001 | Reverte a decisão de zero dependência de build; exige novo ADR supersedendo ADR-001 antes de qualquer mudança |
| G-02 | Header/Nav e Footer/Contato devem permanecer byte-idênticos entre **todas** as páginas HTML do site (lista viva em `TASK.md` Seção 1.1 — hoje 5: `index.html`, `apps.html`, `sobre.html`, `evolucao-segura.html`, `404.html`; a única variação permitida é o atributo `aria-current="page"` no item de nav correspondente, incl. no item-mãe "Apps" para páginas de produto sem item de nav próprio, `UX-SPEC.md` Seção 7) | SDD.md, RT-02 / TASK.md Seção 1 | Divergência visual/funcional entre páginas; corrigir replicando o bloco correto em todas as páginas na mesma tarefa |
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
| G-15 | **[Novo, Rodada 3]** O card de um app na vitrine (`apps.html`)/prévia (`index.html`) nunca aponta diretamente para um arquivo de download (executável/binário) — apps do tipo `desktop` sempre roteiam para uma página de divulgação própria (`[nome-do-app].html`); só essa página oferece o CTA de download real | PRD-TECNICO.md RN-03 / SDD.md Seção 5 (modelo de dados, campo `tipo`) | Contraria requisito de produto confirmado pelo stakeholder; corrigir trocando o `href` do badge/link para a página própria, nunca para o arquivo |
| G-16 | **[Novo, Rodada 3]** Nenhuma funcionalidade que exija processamento server-side (ex.: validação de chave/contra-chave de licenciamento) pode ser implementada no site institucional sem novo ADR que reavalie G-01/G-04 (zero build/framework/backend) — a versão atual desse fluxo, se existir em alguma página, é sempre conteúdo explicativo estático, nunca um formulário funcional | ADR-001, ADR-006, SDD.md RT-07 | Reverteria a garantia "zero backend" do site sem decisão arquitetural formal; exige novo ADR + sinalização ao Gestor antes de implementar |
| G-17 | **[Novo, Rodada 3]** Nenhuma captura de tela publicada no site pode exibir dado real de paciente/cliente do stakeholder — toda captura de conteúdo clínico do Evolução Segura (ou de qualquer app com dado sensível de terceiro) usa dado 100% fictício criado especificamente para a captura | TASK.md Seção 1.2 / PRD-TECNICO.md RF-09 | Risco de exposição de dado sensível real; corrigir recapturando a tela com dado fictício antes de publicar |

---

## Log de Alterações

| Data | Proposto por | Aprovado por | Mudança | Motivo | Validade |
|---|---|---|---|---|---|
| 2026-09-07 | coordenador | gestor (chapéu CTO) | Criação do rascunho inicial (G-01 a G-13) | Primeira geração do `GUARDRAILS.md`, extraída de `SDD.md`, ADRs 001-004 e `PRD-TECNICO.md`, junto com o `TASK.md` | Permanente (mudança estrutural) |
| 2026-09-07 | coordenador | gestor (chapéu CTO) | G-11 atualizada (Sora/Inter → Unbounded/Outfit); G-14 adicionada (proteção dos ativos de logo reais) | Reabertura pontual do `UX-SPEC.md` (identidade visual "Geométrico/Glass", `ADR-005`, supersede `ADR-004`) — sincronização decorrente da mesma decisão já aprovada pelo usuário, não uma nova regra de negócio | Permanente (mudança estrutural) |
| 2026-09-17 | coordenador | gestor (chapéu CTO) | G-02 reescrita (de "4 páginas" para "todas as páginas", com regra explícita de `aria-current`); G-15, G-16, G-17 adicionadas (roteamento de app desktop/RN-03, proibição de backend sem novo ADR, proibição de dado real de paciente em screenshot) | Reabertura pontual (Rodada 3) para RF-09 (página de divulgação de app desktop, Evolução Segura) — `PRD.md` Seção 8, `PRD-TECNICO.md` Seção 9, `ADR-006` | Permanente (mudança estrutural) |
