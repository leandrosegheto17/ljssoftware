#!/usr/bin/env node
/**
 * tokens.contrast-check.js — validação automatizada de contraste WCAG AA
 * para os tokens de cor da paleta "Geométrico/Glass" (T1.1).
 *
 * Sem dependências externas (G-01 — sem toolchain de build). Executar com:
 *   node assets/css/tokens.contrast-check.js
 *
 * Sai com código 0 se todas as combinações passam WCAG AA (>=4.5:1 texto
 * normal / >=3:1 texto grande ou UI), código 1 caso contrário.
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

function contrastRatio(hexA, hexB) {
  const lA = relativeLuminance(hexToRgb(hexA));
  const lB = relativeLuminance(hexToRgb(hexB));
  const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA];
  return (lighter + 0.05) / (darker + 0.05);
}

// Combinações exigidas pelo TASK.md Seção 1.2 / UX-SPEC.md Seção 3.1
const checks = [
  { name: '--color-text-inverse (#EAF6F4) sobre --color-bg (#0B2545)', fg: '#EAF6F4', bg: '#0B2545', minAA: 4.5 },
  { name: '--color-text-inverse-secondary (#B9D6D0) sobre --color-bg (#0B2545)', fg: '#B9D6D0', bg: '#0B2545', minAA: 4.5 },
  { name: '--color-accent (#7FE3D2) sobre --color-bg (#0B2545)', fg: '#7FE3D2', bg: '#0B2545', minAA: 3.0 },
  { name: '--color-header-text (#0B2545) sobre --color-header-bg (#FFFFFF)', fg: '#0B2545', bg: '#FFFFFF', minAA: 4.5 },
  { name: '--color-header-nav-text (#264A6E) sobre --color-header-bg (#FFFFFF)', fg: '#264A6E', bg: '#FFFFFF', minAA: 4.5 },
];

let allPass = true;
for (const check of checks) {
  const ratio = contrastRatio(check.fg, check.bg);
  const pass = ratio >= check.minAA;
  if (!pass) allPass = false;
  console.log(
    `${pass ? 'PASS' : 'FAIL'}  ${check.name} -> ${ratio.toFixed(2)}:1 (mínimo AA: ${check.minAA}:1)`
  );
}

process.exit(allPass ? 0 : 1);
