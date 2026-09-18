#!/usr/bin/env node
/*
 * site-consistency.check.js (T12.3, mitigacao de RT-02 / G-02)
 * Sem dependencias, sem package.json (G-01). Nunca publicado (fora de public/).
 * Uso: node dev/html/site-consistency.check.js   -> exit 0 (ok) / 1 (falhas)
 *
 * Checks: Header/Footer byte a byte (unica variacao: aria-current="page"),
 * aria-current permitido, 1 <h1>, title/description/canonical unicos,
 * HTML (exceto 404) no sitemap.xml, sem href a .exe/Release nos cards,
 * card "Ver app" de app cuja pagina interna existe aponta para ela.
 * Paginas de app ainda inexistentes (destino-ideal, radar-esportivo) sao
 * simplesmente nao verificadas ate serem criadas.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', '..', 'public');
const ORIGIN = 'https://ljssoftware.com.br/';
const APP_PAGES = ['evolucao-segura.html', 'destino-ideal.html', 'radar-esportivo.html'];
// aria-current permitido por pagina: href do item de nav (null = nenhum)
const ALLOWED_CURRENT = {
  'index.html': [], 'apps.html': ['apps.html'], 'sobre.html': ['sobre.html'], '404.html': [],
};
APP_PAGES.forEach((p) => { ALLOWED_CURRENT[p] = ['apps.html']; });
const APP_SLUGS = { 'app-destino-ideal': 'destino-ideal.html', 'app-radar-esportivo': 'radar-esportivo.html', 'app-evolucao-segura': 'evolucao-segura.html' };

const failures = [];
const fail = (f, msg) => failures.push(`${f}: ${msg}`);
const read = (f) => fs.readFileSync(path.join(PUBLIC, f), 'utf8');
const block = (html, tag) => {
  const start = html.search(new RegExp('<' + tag + '[ >]'));
  const end = html.indexOf('</' + tag + '>', start);
  return start < 0 || end < 0 ? null : html.slice(start, end + tag.length + 3);
};
const stripCurrent = (s) => s.replace(/ aria-current="page"/g, '');
const decode = (s) => s.replace(/\s+/g, ' ').trim();

const files = fs.readdirSync(PUBLIC).filter((f) => f.endsWith('.html')).sort();
const pages = {};
files.forEach((f) => { pages[f] = read(f).replace(/<!--[\s\S]*?-->/g, ''); }); // comentarios nao renderizam

// Header/Footer
let ref = null;
for (const f of files) {
  const h = block(pages[f], 'header'), ft = block(pages[f], 'footer');
  if (!h) { fail(f, 'sem <header>'); continue; }
  if (!ft) { fail(f, 'sem <footer>'); continue; }
  const cur = { h: stripCurrent(h), ft: stripCurrent(ft) };
  if (!ref) ref = { f, ...cur };
  else {
    if (cur.h !== ref.h) fail(f, `Header diverge de ${ref.f} (G-02)`);
    if (cur.ft !== ref.ft) fail(f, `Footer diverge de ${ref.f} (G-02)`);
  }
  // aria-current so no item permitido, dentro do header
  const all = (pages[f].match(/aria-current="page"/g) || []).length;
  const inHeader = [...h.matchAll(/<a[^>]*href="([^"]*)"[^>]*aria-current="page"/g)].map((m) => m[1]);
  if (all !== inHeader.length) fail(f, 'aria-current="page" fora do item de nav do Header');
  const allowed = ALLOWED_CURRENT[f] || [];
  if (inHeader.length !== allowed.length || inHeader.some((x, i) => x !== allowed[i])) {
    fail(f, `aria-current="page" em [${inHeader}] mas esperado [${allowed}]`);
  }
}

// h1, title, description, canonical
const seen = { title: {}, description: {}, canonical: {} };
for (const f of files) {
  const html = pages[f];
  const h1 = (html.replace(/<!--[\s\S]*?-->/g, '').match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(f, `esperado 1 <h1>, encontrado ${h1}`);
  const t = html.match(/<title>([\s\S]*?)<\/title>/);
  const d = html.match(/<meta\s+name="description"\s+content="([^"]*)"/);
  const c = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/);
  const vals = { title: t && decode(t[1]), description: d && decode(d[1]), canonical: c && c[1] };
  for (const k of Object.keys(vals)) {
    if (!vals[k]) {
      if (k === 'canonical' && f === '404.html') continue; // 404 nao e indexada
      fail(f, `${k} ausente`); continue;
    }
    if (seen[k][vals[k]]) fail(f, `${k} duplicado com ${seen[k][vals[k]]}`); else seen[k][vals[k]] = f;
  }
  if (vals.canonical && !vals.canonical.startsWith(ORIGIN)) fail(f, `canonical nao absoluto: ${vals.canonical}`);
  if (vals.canonical && f !== 'index.html' && vals.canonical !== ORIGIN + f) fail(f, `canonical esperado ${ORIGIN + f}`);
}

// sitemap
let sitemap = '';
try { sitemap = fs.readFileSync(path.join(PUBLIC, 'sitemap.xml'), 'utf8'); } catch (e) { fail('sitemap.xml', 'nao encontrado'); }
const locs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
for (const f of files) {
  if (f === '404.html') continue;
  const loc = f === 'index.html' ? ORIGIN : ORIGIN + f;
  if (!locs.includes(loc)) fail('sitemap.xml', `falta ${loc} (${f})`);
}
for (const l of locs) {
  const f = l === ORIGIN ? 'index.html' : l.slice(ORIGIN.length);
  if (!files.includes(f)) fail('sitemap.xml', `lista pagina inexistente ${l}`);
}

// cards
for (const f of ['index.html', 'apps.html']) {
  if (!pages[f]) continue;
  for (const m of pages[f].replace(/<!--[\s\S]*?-->/g, '').matchAll(/<a\b[^>]*class="badge badge--link"[^>]*>/g)) {
    const tag = m[0];
    const href = (tag.match(/href="([^"]*)"/) || [])[1] || '';
    const ev = (tag.match(/data-analytics-event="([^"]*)"/) || [])[1] || '';
    if (/\.exe(\?|#|$)/i.test(href) || /releases?\b/i.test(href)) fail(f, `card ${ev || href} aponta para binario/Release: ${href}`);
    const page = APP_SLUGS[ev];
    if (page && files.includes(page) && href !== page) fail(f, `card ${ev}: href "${href}" deveria ser "${page}"`);
  }
}

if (failures.length) {
  console.error(`FALHAS (${failures.length}):`);
  failures.forEach((x) => console.error(' - ' + x));
  process.exit(1);
}
console.log(`OK: ${files.length} paginas consistentes.`);
