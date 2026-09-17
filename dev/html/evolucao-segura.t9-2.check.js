#!/usr/bin/env node
/**
 * evolucao-segura.t9-2.check.js — teste automatizado do critério de aceite
 * de T9.2 (TASK.md, Lote 9), sem dependências externas (GUARDRAILS.md G-01).
 * Executar com:
 *   node dev/html/evolucao-segura.t9-2.check.js
 *
 * Cobre, por asserção de texto/regex sobre o HTML publicado (mesmo espírito
 * de dev/html/evolucao-segura.t9-1.check.js, T9.1):
 *   1. Seção 3 ("Proposta de valor") logo após a Seção 2 ("O problema"),
 *      com exatamente 3 `.pillar` completos (numeração + título + texto +
 *      lista).
 *   2. `.pillar` compõe `.glass-card` (herda o fallback `@supports not
 *      (backdrop-filter)` automaticamente por composição de classe — regra
 *      já verificada em tokens.css/T3.4/T8.2, não revalidada aqui).
 *   3. Seção 5 ("Conformidade") presente, com o texto institucional sobre a
 *      Resolução CFP nº 001/2022, e SEM nenhum componente visual novo (sem
 *      `.glass-card`/`.pillar`/`.problem-card` dentro dela) — só o invólucro
 *      genérico de seção (`.section`/`.section__head`/...).
 *   4. Os marcadores de continuação de T9.3/T9.4/T9.5/T9.6 continuam
 *      presentes (nenhum outro trecho do arquivo foi tocado por esta
 *      tarefa).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const HTML_PATH = path.join(ROOT, 'public', 'evolucao-segura.html');
const CSS_PATH = path.join(ROOT, 'public', 'assets', 'css', 'components.css');

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
const htmlNoComments = html.replace(/<!--[\s\S]*?-->/g, '');

// --- 1. Seção 3 — Proposta de valor (3 .pillar) -------------------------
const secao2Idx = html.indexOf('id="problema-titulo"');
const secao3Idx = html.indexOf('id="valor-titulo"');
const secao4Idx = html.indexOf('id="pordentro-titulo"');

check('Seção 2 ("O problema") presente antes da Seção 3', secao2Idx !== -1 && secao2Idx < secao3Idx);
check('Seção 3 ("Proposta de valor", id="valor-titulo") presente', secao3Idx !== -1);

check(
  'título da Seção 3 é "Três coisas, bem feitas"',
  /<h2 class="section__title" id="valor-titulo">Três coisas, bem feitas<\/h2>/.test(html)
);

const pillarMatches = htmlNoComments.match(/class="glass-card pillar"/g) || [];
check('exatamente 3 `.pillar` (compostos com `.glass-card`) na Seção 3 + 1 na Seção 7 (T9.5)', pillarMatches.length === 4);

// Isola o trecho da Seção 3 (entre valor-titulo e pordentro-titulo) para
// checagens específicas dos 3 pillars desta seção, sem contar o pillar da
// Seção 7 (Licença de uso, T9.5).
const secao3End = secao4Idx !== -1 ? secao4Idx : html.length;
const secao3Html = html.slice(secao3Idx, secao3End);

const pillarsNaSecao3 = secao3Html.match(/class="glass-card pillar"/g) || [];
check('exatamente 3 `.pillar` dentro da Seção 3', pillarsNaSecao3.length === 3);

check(
  'os 3 `.pillar` da Seção 3 têm numeração (.pillar__num 1/2/3)',
  /pillar__num" aria-hidden="true">1<\/span>/.test(secao3Html) &&
    /pillar__num" aria-hidden="true">2<\/span>/.test(secao3Html) &&
    /pillar__num" aria-hidden="true">3<\/span>/.test(secao3Html)
);

check(
  'cada `.pillar` da Seção 3 tem título (h3) + texto + lista (.pillar__list)',
  (secao3Html.match(/pillar__title/g) || []).length === 3 &&
    (secao3Html.match(/pillar__text/g) || []).length === 3 &&
    (secao3Html.match(/pillar__list/g) || []).length === 3
);

check(
  'grid da Seção 3 usa `.grid.grid--3col`',
  /<div class="grid grid--3col">/.test(secao3Html)
);

// --- 2. Fallback @supports herdado do .glass-card (não revalidado, só
//        confirma que a regra-base ainda existe e cobre .pillar por
//        composição de classe) ------------------------------------------
const css = fs.readFileSync(CSS_PATH, 'utf8');
check(
  'regra `.glass-card` com fallback `@supports not (backdrop-filter)` ainda existe (tokens.css)',
  (() => {
    const tokensPath = path.join(ROOT, 'public', 'assets', 'css', 'tokens.css');
    if (!fs.existsSync(tokensPath)) return false;
    const tokens = fs.readFileSync(tokensPath, 'utf8');
    return /@supports not \(backdrop-filter/.test(tokens) && /\.glass-card/.test(tokens);
  })()
);
check(
  '`.pillar` está definido como variante de conteúdo do `.glass-card` em components.css (mesmo seletor de `.problem-card`)',
  /\.problem-card,\s*\n\.pillar\s*\{/.test(css)
);

// --- 3. Seção 5 — Conformidade -------------------------------------------
const secao5SectionIdx = html.indexOf('aria-labelledby="cfp-titulo"');
const secao5Idx = html.indexOf('id="cfp-titulo"');
check('Seção 5 ("Conformidade", id="cfp-titulo") presente', secao5Idx !== -1 && secao5SectionIdx !== -1);
check('Seção 5 vem depois da Seção 4 ("Por dentro")', secao4Idx !== -1 && secao4Idx < secao5Idx);

check(
  'título da Seção 5 cita a obrigação de guarda por 5 anos',
  /<h2 class="section__title" id="cfp-titulo">Guardar por 5 anos é obrigação sua\. O formato do registro também é\.<\/h2>/.test(html)
);

check(
  'kicker da Seção 5 cita a Resolução CFP nº 001\\/2022',
  /<p class="section__kicker">Resolução CFP nº 001\/2022<\/p>/.test(html)
);

// Isola o trecho da Seção 5 para confirmar ausência de componente visual
// novo (sem .glass-card/.pillar/.problem-card dentro dela).
const secao6Idx = html.indexOf('id="instalacao-titulo"');
const secao5End = secao6Idx !== -1 ? secao6Idx : html.length;
const secao5Html = html.slice(secao5SectionIdx, secao5End);

check(
  'Seção 5 não usa nenhum componente visual novo (sem `.glass-card`/`.pillar`/`.problem-card`)',
  !/glass-card/.test(secao5Html) && !/class="[^"]*\bpillar\b/.test(secao5Html) && !/problem-card/.test(secao5Html)
);

check(
  'Seção 5 reaproveita só o invólucro genérico (`.section__head`/`.section__kicker`/`.section__title`/`.section__lead`)',
  /section__head section__head--center/.test(secao5Html) &&
    (secao5Html.match(/section__lead/g) || []).length === 2
);

// --- 4. Marcadores de continuação (T9.3-T9.6) intactos -------------------
check(
  'nenhum outro trecho do arquivo foi tocado — marcadores/seções de T9.3-T9.6 continuam presentes',
  /id="por-dentro"/.test(html) &&
    /id="instalacao"/.test(html) &&
    /id="licenca"/.test(html) &&
    /id="requisitos"/.test(html)
);

console.log('');
if (failures > 0) {
  console.log(`${failures} verificação(ões) FAIL.`);
  process.exit(1);
} else {
  console.log('TODAS as verificações PASS.');
}
