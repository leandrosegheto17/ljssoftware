#!/usr/bin/env node
/**
 * fonts.smoke.check.js — Verificação automática de T1.2 (G-11).
 *
 * Não é um framework de teste (o projeto não tem build/dependência —
 * ADR-001/G-01); é um script Node standalone, sem dependências externas,
 * que pode ser rodado manualmente com `node assets/fonts/fonts.smoke.check.js`.
 *
 * O que verifica:
 *   1. Nenhum arquivo do projeto (HTML/CSS) referencia
 *      fonts.googleapis.com ou fonts.gstatic.com (CDN externo do Google
 *      Fonts) — via <link>, @import ou url().
 *   2. Todo bloco @font-face em assets/css/tokens.css tem
 *      `font-display: swap`.
 *   3. Os 4 arquivos .woff2 esperados existem em assets/fonts/ e não
 *      estão vazios.
 *
 * Sai com código 0 se tudo passar, 1 se alguma checagem falhar (para uso
 * em CI/hook local, se algum dia for adicionado, sem exigir build step).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const ROOT = path.join(REPO_ROOT, 'public');
const EXTERNAL_FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
let failures = [];

function walk(dir, exts, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.claude' || entry.name === '.md') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, exts, files);
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

// 1. Nenhuma referência a CDN externo de fontes.
const filesToScan = walk(ROOT, ['.html', '.css']);
for (const file of filesToScan) {
  const content = fs.readFileSync(file, 'utf8');
  for (const host of EXTERNAL_FONT_HOSTS) {
    if (content.includes(host)) {
      failures.push(
        `Referência externa proibida (G-11): "${host}" encontrada em ${path.relative(ROOT, file)}`
      );
    }
  }
}

// 2. font-display: swap em todo @font-face de tokens.css.
const tokensPath = path.join(ROOT, 'assets', 'css', 'tokens.css');
if (fs.existsSync(tokensPath)) {
  const css = fs.readFileSync(tokensPath, 'utf8');
  const fontFaceBlocks = css.match(/@font-face\s*\{[^}]*\}/g) || [];
  if (fontFaceBlocks.length === 0) {
    failures.push('Nenhum bloco @font-face encontrado em assets/css/tokens.css');
  }
  fontFaceBlocks.forEach((block, i) => {
    if (!/font-display:\s*swap/.test(block)) {
      failures.push(`Bloco @font-face #${i + 1} em tokens.css sem "font-display: swap"`);
    }
  });
} else {
  failures.push('assets/css/tokens.css não encontrado');
}

// 3. Arquivos .woff2 esperados presentes e não vazios.
const expectedFonts = [
  'unbounded-v12-latin-500.woff2',
  'unbounded-v12-latin-700.woff2',
  'outfit-v15-latin-400.woff2',
  'outfit-v15-latin-600.woff2',
];
for (const fontFile of expectedFonts) {
  const fontPath = path.join(ROOT, 'assets', 'fonts', fontFile);
  if (!fs.existsSync(fontPath)) {
    failures.push(`Arquivo de fonte ausente: assets/fonts/${fontFile}`);
  } else if (fs.statSync(fontPath).size === 0) {
    failures.push(`Arquivo de fonte vazio: assets/fonts/${fontFile}`);
  }
}

if (failures.length > 0) {
  console.error('FALHA — fonts.smoke.check.js encontrou problema(s):\n');
  failures.forEach((f) => console.error(' - ' + f));
  process.exit(1);
} else {
  console.log('OK — nenhuma referência a CDN externo de fontes; font-display: swap presente; 4 arquivos .woff2 presentes.');
  process.exit(0);
}
