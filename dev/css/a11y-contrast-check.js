#!/usr/bin/env node
/**
 * a11y-contrast-check.js — auditoria de contraste WCAG AA (T4.2)
 *
 * Sem dependências externas (GUARDRAILS.md G-01). Executar com:
 *   node assets/css/a11y-contrast-check.js
 *
 * Reaproveita a mesma fórmula de `tokens.contrast-check.js` (T1.1) —
 * sRGB -> linear -> luminância relativa -> razão (L1+0.05)/(L2+0.05) — e
 * estende a verificação para:
 *
 *   1. As 5 combinações sólidas já cobertas por `tokens.contrast-check.js`
 *      (revalidação cross-page, sem duplicar lógica de composição de cor).
 *   2. Combinações introduzidas pelos componentes dos Lotes 2/3
 *      (botão "Contato" do header, botão "Contato" do overlay mobile, CTAs
 *      do hero/seção de contato, badge "Em breve", heading/link das seções
 *      da Home).
 *   3. O PIOR CASO do mesh gradient do Hero (T3.1) — cor sólida do blob mais
 *      intenso de cada gradiente, composta sobre `--color-bg`, reproduzindo
 *      por código os valores hoje só documentados em comentário em
 *      `components.css` (>=5.98:1) — pendência sinalizada em QA-REPORT.md,
 *      seção T3.1, para ser reverificada por script nesta tarefa (T4.2).
 *   4. O PIOR CASO composto de texto sobre `.glass-card` (`--glass-bg`,
 *      rgba(255,255,255,0.08)) IMEDIATAMENTE SOBRE o ponto mais intenso do
 *      mesh gradient (não apenas sobre a cor sólida `--color-bg`) — cenário
 *      explicitamente citado no UX-SPEC.md Seção 3.1/5 ("atenção especial ao
 *      texto sobre os cards 'glass' — fundo translúcido sobre o gradiente de
 *      fundo") e ainda não verificado por nenhum script anterior. Hoje nenhum
 *      `.glass-card` real está posicionado sobre `.hero` nas 4 páginas (os
 *      cards "glass" ficam sobre `--color-bg` sólido em `.home-apps`/
 *      `.home-about`/`sobre.html`) — este é o pior caso do *design system*
 *      (UX-SPEC.md permite a combinação), verificado preventivamente.
 */

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance([r, g, b]) {
  const [R, G, B] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]) {
  return (
    '#' +
    [r, g, b]
      .map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function contrastRatioRgb(rgbA, rgbB) {
  const lA = relativeLuminance(rgbA);
  const lB = relativeLuminance(rgbB);
  const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA];
  return (lighter + 0.05) / (darker + 0.05);
}

function contrastRatio(hexA, hexB) {
  return contrastRatioRgb(hexToRgb(hexA), hexToRgb(hexB));
}

/**
 * Composição "source-over" (alpha blending) de uma cor translúcida
 * `fg` (rgb + alpha 0-1) sobre um fundo opaco `bg` (rgb), reproduzindo o
 * mesmo comportamento do CSS (`color-mix`/`rgba` sobre fundo opaco).
 */
function compositeOver(fgRgb, alpha, bgRgb) {
  return [
    alpha * fgRgb[0] + (1 - alpha) * bgRgb[0],
    alpha * fgRgb[1] + (1 - alpha) * bgRgb[1],
    alpha * fgRgb[2] + (1 - alpha) * bgRgb[2],
  ];
}

// --- Tokens (tokens.css, T1.1) ------------------------------------------
const COLOR_BG = hexToRgb('#0B2545');
const COLOR_BG_GRADIENT_1 = hexToRgb('#146B8C');
const COLOR_BG_GRADIENT_2 = hexToRgb('#1FB6A6');
const TEXT_INVERSE = '#EAF6F4';
const TEXT_INVERSE_SECONDARY = '#B9D6D0';
const COLOR_ACCENT = '#7FE3D2';
const HEADER_BG = '#FFFFFF';
const HEADER_TEXT = '#0B2545';
const HEADER_NAV_TEXT = '#264A6E';
const GLASS_BG_ALPHA = 0.08; // rgba(255,255,255,0.08)
const GLASS_FG_RGB = [255, 255, 255];

let allPass = true;
function report(name, ratio, minAA) {
  const pass = ratio >= minAA;
  if (!pass) allPass = false;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name} -> ${ratio.toFixed(2)}:1 (mínimo AA: ${minAA}:1)`);
  return pass;
}

console.log('--- 1. Combinações sólidas da tabela de tokens (Seção 1.2 do TASK.md) ---');
report('--color-text-inverse (#EAF6F4) sobre --color-bg (#0B2545)', contrastRatio(TEXT_INVERSE, '#0B2545'), 4.5);
report('--color-text-inverse-secondary (#B9D6D0) sobre --color-bg (#0B2545)', contrastRatio(TEXT_INVERSE_SECONDARY, '#0B2545'), 4.5);
report('--color-accent (#7FE3D2) sobre --color-bg (#0B2545)', contrastRatio(COLOR_ACCENT, '#0B2545'), 3.0);
report('--color-header-text (#0B2545) sobre --color-header-bg (#FFFFFF)', contrastRatio(HEADER_TEXT, HEADER_BG), 4.5);
report('--color-header-nav-text (#264A6E) sobre --color-header-bg (#FFFFFF)', contrastRatio(HEADER_NAV_TEXT, HEADER_BG), 4.5);

console.log('\n--- 2. Componentes dos Lotes 2/3 (revalidação cross-page) ---');
report('Botão "Contato" do header: #FFFFFF sobre --color-bg (#0B2545)', contrastRatio('#FFFFFF', '#0B2545'), 4.5);
report('Outline de foco sobre o header branco: --color-header-text sobre --color-header-bg (UI, 3:1)', contrastRatio(HEADER_TEXT, HEADER_BG), 3.0);
report('Ícone hamburguer: --color-header-text sobre --color-header-bg (UI, 3:1)', contrastRatio(HEADER_TEXT, HEADER_BG), 3.0);
report('Overlay mobile — links: --color-text-inverse sobre --color-bg', contrastRatio(TEXT_INVERSE, '#0B2545'), 4.5);
report('Overlay mobile — CTA "Contato" reestilizado: --color-bg sobre --color-accent', contrastRatio('#0B2545', COLOR_ACCENT), 4.5);
report('Overlay mobile — outline de foco: --color-accent sobre --color-bg (UI, 3:1)', contrastRatio(COLOR_ACCENT, '#0B2545'), 3.0);
report('Hero/Contato — CTA primário: --color-bg sobre --color-accent', contrastRatio('#0B2545', COLOR_ACCENT), 4.5);
report('Hero/Contato — CTA secundário (outline): --color-text-inverse sobre --color-bg', contrastRatio(TEXT_INVERSE, '#0B2545'), 4.5);
report('Badge "Em breve": --color-bg sobre --color-accent', contrastRatio('#0B2545', COLOR_ACCENT), 4.5);
report('Heading/link das seções Home (Apps/Sobre/Contato): --color-text-inverse sobre --color-bg', contrastRatio(TEXT_INVERSE, '#0B2545'), 4.5);
report('Link de acento das seções Home: --color-accent sobre --color-bg (UI/texto grande, 3:1)', contrastRatio(COLOR_ACCENT, '#0B2545'), 3.0);
report('Rodapé — link de contato: --color-text-inverse-secondary sobre --color-bg', contrastRatio(TEXT_INVERSE_SECONDARY, '#0B2545'), 4.5);
report('Rodapé — link em hover/foco: --color-accent sobre --color-bg', contrastRatio(COLOR_ACCENT, '#0B2545'), 4.5);

console.log('\n--- 3. Pior caso do mesh gradient do Hero (T3.1) — reverificação por script ---');
// Reproduz os 2 blobs do Hero em components.css (T3.1): color-mix(in srgb,
// var(--color-bg-gradient-X) Y%, transparent) composto sobre --color-bg
// sólido (background-color: var(--color-bg) por trás do background-image).
// Achado de T4.2 (ver components.css, seção "Hero (T3.1)"): a opacidade
// original do blob 2 (45%) reprovava --color-text-inverse-secondary no
// cenário composto (item 4 abaixo) — corrigida para 28% nesta mesma tarefa.
// Este script já reflete o valor CORRIGIDO (28%), aplicado em components.css.
const gradient2Blend = compositeOver(COLOR_BG_GRADIENT_2, 0.28, COLOR_BG); // blob 2 (topo direito), 28% opacidade (corrigido de 45% em T4.2)
const gradient1Blend = compositeOver(COLOR_BG_GRADIENT_1, 0.55, COLOR_BG); // blob 1 (topo esquerdo) / blob 3 (base), 55%/40% — 55% é o mais intenso, inalterado
console.log(`  Blob --color-bg-gradient-2 a 28% sobre --color-bg -> ${rgbToHex(gradient2Blend)}`);
console.log(`  Blob --color-bg-gradient-1 a 55% sobre --color-bg -> ${rgbToHex(gradient1Blend)}`);
const meshWorstBlend = contrastRatioRgb(hexToRgb(TEXT_INVERSE), gradient2Blend) <
  contrastRatioRgb(hexToRgb(TEXT_INVERSE), gradient1Blend)
  ? gradient2Blend
  : gradient1Blend;
report('--color-text-inverse sobre blob --color-bg-gradient-2 a 28% (pior blob, cantos)', contrastRatioRgb(hexToRgb(TEXT_INVERSE), gradient2Blend), 4.5);
report('--color-text-inverse sobre blob --color-bg-gradient-1 a 55%', contrastRatioRgb(hexToRgb(TEXT_INVERSE), gradient1Blend), 4.5);
report('--color-text-inverse-secondary sobre blob --color-bg-gradient-2 a 28% (pior blob)', contrastRatioRgb(hexToRgb(TEXT_INVERSE_SECONDARY), gradient2Blend), 4.5);

console.log('\n--- 4. Pior caso: texto sobre .glass-card (glass-bg composto) sobre o mesh gradient ---');
// .glass-card = rgba(255,255,255,0.08) composta sobre o que estiver atrás.
// Pior caso solicitado pelo QA-REPORT.md (T3.1) / UX-SPEC.md Seção 3.1/5:
// glass-bg sobre o ponto mais intenso do mesh gradient (não só --color-bg
// sólido), já que glass-bg CLAREIA o fundo (branco translúcido) e portanto
// reduz ainda mais o contraste de --color-text-inverse-secondary (o tom de
// texto mais escuro/próximo do fundo claro).
const glassOverSolidBg = compositeOver(GLASS_FG_RGB, GLASS_BG_ALPHA, COLOR_BG);
const glassOverMeshWorst = compositeOver(GLASS_FG_RGB, GLASS_BG_ALPHA, meshWorstBlend);
console.log(`  .glass-card sobre --color-bg sólido -> ${rgbToHex(glassOverSolidBg)}`);
console.log(`  .glass-card sobre o pior blob do mesh gradient (${rgbToHex(meshWorstBlend)}) -> ${rgbToHex(glassOverMeshWorst)}`);
report('--color-text-inverse sobre .glass-card sobre --color-bg sólido', contrastRatioRgb(hexToRgb(TEXT_INVERSE), glassOverSolidBg), 4.5);
report('--color-text-inverse-secondary sobre .glass-card sobre --color-bg sólido', contrastRatioRgb(hexToRgb(TEXT_INVERSE_SECONDARY), glassOverSolidBg), 4.5);
report('--color-text-inverse sobre .glass-card sobre o PIOR blob do mesh gradient (pior caso do design system)', contrastRatioRgb(hexToRgb(TEXT_INVERSE), glassOverMeshWorst), 4.5);
const worstCasePass = report(
  '--color-text-inverse-secondary sobre .glass-card sobre o PIOR blob do mesh gradient (PIOR CASO GERAL)',
  contrastRatioRgb(hexToRgb(TEXT_INVERSE_SECONDARY), glassOverMeshWorst),
  4.5
);

console.log('\n--- 5. Borda do glass-card sobre o pior caso (informativo — não é um "componente de UI" sob WCAG 1.4.11) ---');
// --glass-border NÃO conta para `allPass`: `.glass-card` é um container de
// conteúdo estático (article/div), não um controle interativo, e seu limite
// visual já é perceptível pela mudança de tom do preenchimento translúcido
// (--glass-bg) em relação ao fundo — a borda é reforço decorativo, não o
// único meio de identificar o card. Corrigir para 3:1 exigiria alpha ~0.44
// (mais que o dobro do atual 0.18), alterando visivelmente a aparência
// "glass" em todo o site — seria redesenho (vedado por GUARDRAILS.md G-12),
// não uma correção pontual. Medido e documentado para rastreabilidade, sem
// bloquear o resultado do script.
const glassBorderOverMeshWorst = compositeOver(GLASS_FG_RGB, 0.18, meshWorstBlend); // --glass-border
const borderRatio = contrastRatioRgb(glassBorderOverMeshWorst, meshWorstBlend);
console.log(`INFO  --glass-border sobre o PIOR blob do mesh gradient -> ${borderRatio.toFixed(2)}:1 (referência 3:1 — não aplicável, ver nota acima; não conta para o resultado do script)`);

console.log(`\n${allPass ? 'TODAS as combinações PASS.' : 'ATENÇÃO: uma ou mais combinações FALHAM (ver acima).'}`);
if (!worstCasePass) {
  console.log('Pior caso composto (glass sobre mesh gradient) abaixo do mínimo AA — ver nota de correção em TASK.md T4.2.');
}
process.exit(allPass ? 0 : 1);
