#!/usr/bin/env node
/**
 * evolucao-segura.t9-3.check.js — teste automatizado do critério de aceite
 * de T9.3 (TASK.md, Lote 9), sem dependências externas (GUARDRAILS.md G-01).
 * Executar com:
 *   node dev/html/evolucao-segura.t9-3.check.js
 *
 * Cobre, por asserção de texto/regex sobre o HTML publicado (mesmo espírito
 * de dev/html/evolucao-segura.t9-1.check.js, T9.1):
 *   1. Seção 4 ("Por dentro") existe com âncora `id="por-dentro"`,
 *      alcançável pelo CTA secundário "Ver por dentro" do hero (T9.1).
 *   2. Exatamente 4 blocos `.feature`, com `.feature--reverse` em pelo
 *      menos 2 deles (alternância visual a partir de 900px, decisão de
 *      detalhe documentada em components.css/T8.2).
 *   3. Cada um dos 4 blocos `.feature` tem `.feature__title`,
 *      `.feature__text` e um `.shot` dentro de `.feature__media`.
 *   4. 6 `<picture>`/`<source type="image/webp">` + `<img>` fallback
 *      (S2-S7) apontando para arquivos reais em disco (webp + png).
 *   5. `alt` não vazio em cada uma das 6 imagens.
 *   6. Nota de proveniência de dado fictício visível na seção (lead da
 *      Seção 4) e aviso `.shot__privacy`/legenda em cada screenshot.
 *   7. S6/S7 lado a lado em `.grid.grid--2col`, fora de `.feature`.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const HTML_PATH = path.join(ROOT, 'public', 'evolucao-segura.html');
const IMG_DIR = path.join(ROOT, 'public', 'assets', 'img', 'evolucao-segura');

let failures = 0;

function check(label, condition) {
  if (condition) {
    console.log(`PASS  ${label}`);
  } else {
    console.log(`FAIL  ${label}`);
    failures += 1;
  }
}

if (!fs.existsSync(HTML_PATH)) {
  console.log(`FAIL  public/evolucao-segura.html existe`);
  process.exit(1);
}

const html = fs.readFileSync(HTML_PATH, 'utf8');

// --- 1. Seção e âncora ----------------------------------------------------
check(
  'seção "Por dentro" existe com id="por-dentro"',
  /<section class="section section--alt" id="por-dentro" aria-labelledby="pordentro-titulo">/.test(html)
);

check(
  'CTA secundário do hero aponta para #por-dentro (T9.1)',
  /<a class="hero__cta hero__cta--secondary" href="#por-dentro">Ver por dentro<\/a>/.test(html)
);

// Recorta só o miolo da Seção 4, da âncora até o `</section>` de
// fechamento (a seção não tem `<section>` aninhada), para as checagens de
// contagem não vazarem para outras seções do mesmo arquivo (edição
// concorrente das demais tarefas do Lote 9).
const secaoMatch = html.match(/<section class="section section--alt" id="por-dentro"[\s\S]*?<\/section>/);
check('seção 4 delimitada corretamente até o `</section>` de fechamento', !!secaoMatch);
const secao = secaoMatch ? secaoMatch[0] : '';

check(
  'nota de proveniência de dado fictício visível no lead da seção',
  /Todas as capturas abaixo vêm de um acervo de demonstração/.test(secao) &&
    /Nenhum dado real de paciente é exibido neste site/.test(secao)
);

// --- 2. 4 blocos .feature, com alternância ------------------------------
const featureBlocks = secao.match(/<div class="feature( feature--reverse)?">/g) || [];
check('exatamente 4 blocos `.feature` na seção', featureBlocks.length === 4);

const reverseBlocks = secao.match(/<div class="feature feature--reverse">/g) || [];
check('pelo menos 2 dos 4 blocos usam `.feature--reverse` (alternância)', reverseBlocks.length >= 2);

// --- 3. Cada .feature com título + texto + .shot dentro de .feature__media
check(
  '4 `.feature__title` e 4 `.feature__text` na seção',
  (secao.match(/feature__title/g) || []).length === 4 &&
    (secao.match(/feature__text/g) || []).length === 4
);

check(
  '4 `.shot` dentro de `.feature__media` (S2-S5)',
  (secao.match(/<div class="feature__media">\s*<figure class="shot">/g) || []).length === 4
);

// --- 4/5. 6 screenshots (S2-S7): <picture>/<source webp> + <img> fallback,
//          arquivos reais em disco, alt não vazio -------------------------
const slots = ['s2', 's3', 's4', 's5', 's6', 's7'];
for (const slot of slots) {
  const webpPath = path.join(IMG_DIR, `shot-${slot}.webp`);
  const pngPath = path.join(IMG_DIR, `shot-${slot}.png`);

  check(`arquivo real shot-${slot}.webp existe em disco`, fs.existsSync(webpPath));
  check(`arquivo real shot-${slot}.png (fallback) existe em disco`, fs.existsSync(pngPath));

  const sourceRe = new RegExp(
    `<source srcset="assets/img/evolucao-segura/shot-${slot}\\.webp" type="image/webp">`
  );
  check(`<source type="image/webp"> aponta para shot-${slot}.webp`, sourceRe.test(secao));

  const imgRe = new RegExp(
    `<img[^>]*src="assets/img/evolucao-segura/shot-${slot}\\.png"[^>]*alt="([^"]+)"`
  );
  const imgMatch = secao.match(imgRe);
  check(
    `<img> fallback de shot-${slot}.png com alt não vazio`,
    !!imgMatch && imgMatch[1].trim().length > 0
  );
}

// --- 6. Aviso de dado fictício em cada screenshot -----------------------
check(
  '4 legendas `.shot__privacy` nos blocos S2-S5 (conteúdo clínico/fictício)',
  (secao.match(/shot__privacy/g) || []).length === 4
);

check(
  'legendas de S6/S7 avisam ausência de dado clínico/paciente',
  /Sem dado de paciente — captura segura\./.test(secao) &&
    /Sem conteúdo clínico na tela — captura de baixo risco\./.test(secao)
);

// --- 7. S6/S7 lado a lado, fora de .feature -----------------------------
check(
  'S6/S7 agrupados em `.grid.grid--2col`, sem envolver `.feature`',
  /<div class="grid grid--2col"[^>]*>\s*<figure class="shot">\s*<span class="shot__tag shot__tag--ready">SLOT S6/.test(secao)
);

console.log('');
if (failures > 0) {
  console.log(`${failures} verificação(ões) FAIL.`);
  process.exit(1);
} else {
  console.log('TODAS as verificações PASS.');
}
