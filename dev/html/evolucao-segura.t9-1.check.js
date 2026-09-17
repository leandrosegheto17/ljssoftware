#!/usr/bin/env node
/**
 * evolucao-segura.t9-1.check.js — teste automatizado do critério de aceite
 * de T9.1 (TASK.md, Lote 9), sem dependências externas (GUARDRAILS.md G-01).
 * Executar com:
 *   node dev/html/evolucao-segura.t9-1.check.js
 *
 * Cobre, por asserção de texto/regex sobre o HTML publicado (mesmo espírito
 * de `dev/css/a11y-contrast-check.js`, T4.2 — script Node puro, PASS/FAIL
 * por linha, sem framework de teste novo):
 *   1. Arquivo existe em public/, `lang="pt-BR"`, `<title>`/meta description
 *      próprios e não vazios.
 *   2. Header idêntico ao de apps.html, com `aria-current="page"` só no
 *      item de nav "Apps" (não em "Home"/"Sobre").
 *   3. Hero de produto (`.hero--product`) com <picture>/<source
 *      type="image/webp"> + <img> fallback apontando para os 2 arquivos
 *      reais de S1 (webp + png) em disco.
 *   4. CTA "Ver por dentro" funcional (`<a href="#por-dentro">`).
 *   5. CTA "Baixar para Windows" no estado "indisponível para download
 *      nesta fase": elemento `<button>` com `disabled`, nunca `<a>`, sem
 *      `href` para `.exe`/GitHub Releases nem `href="#"`; nota textual
 *      visível junto ao botão.
 *   6. CSS do botão desabilitado usa `cursor: not-allowed` e opacidade
 *      reduzida (visualmente distinto do CTA secundário).
 *   7. 3 `.problem-card` na Seção 2.
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
// Cópia sem comentários HTML — algumas checagens abaixo usam contagem
// exata de ocorrências (ex.: `aria-current="page"`), e os próprios
// comentários explicativos do arquivo citam esses trechos como texto,
// o que geraria falso-negativo/falso-positivo se não removidos aqui.
const htmlNoComments = html.replace(/<!--[\s\S]*?-->/g, '');

// --- 1. Documento -----------------------------------------------------
check('<html lang="pt-BR">', /<html lang="pt-BR">/.test(html));

const titleMatch = html.match(/<title>(.*?)<\/title>/s);
check('<title> presente e não vazio', !!titleMatch && titleMatch[1].trim().length > 0);

const descMatch = html.match(/<meta name="description" content="(.*?)">/s);
check('meta description presente e não vazia', !!descMatch && descMatch[1].trim().length > 0);

// --- 2. Header ----------------------------------------------------------
check('skip-link presente antes do header', /<a class="skip-link" href="#main">/.test(html));

const ariaCurrentMatches = htmlNoComments.match(/aria-current="page"/g) || [];
check('aria-current="page" aparece exatamente 1 vez', ariaCurrentMatches.length === 1);

check(
  'aria-current="page" está no link "Apps" (não em Home/Sobre)',
  /href="apps\.html" aria-current="page">Apps<\/a>/.test(html)
);

check(
  'link "Sobre" do header sem aria-current',
  /href="sobre\.html">Sobre<\/a>/.test(html) && !/href="sobre\.html" aria-current/.test(html)
);

// --- 3. Hero de produto / screenshot S1 ---------------------------------
check('seção hero usa `.hero--product`', /<section class="hero hero--product">/.test(html));

check(
  '<picture> com <source type="image/webp"> + <img> fallback',
  /<source srcset="assets\/img\/evolucao-segura\/shot-s1\.webp" type="image\/webp">/.test(html) &&
    /<img[^>]*src="assets\/img\/evolucao-segura\/shot-s1\.png"[^>]*alt="[^"]+"/.test(html)
);

check(
  'arquivo real shot-s1.webp existe em disco',
  fs.existsSync(path.join(ROOT, 'public', 'assets', 'img', 'evolucao-segura', 'shot-s1.webp'))
);
check(
  'arquivo real shot-s1.png (fallback) existe em disco',
  fs.existsSync(path.join(ROOT, 'public', 'assets', 'img', 'evolucao-segura', 'shot-s1.png'))
);

// --- 4. CTA "Ver por dentro" --------------------------------------------
check(
  'CTA "Ver por dentro" é <a> funcional para #por-dentro',
  /<a class="hero__cta hero__cta--secondary" href="#por-dentro">Ver por dentro<\/a>/.test(html)
);

// --- 5. CTA "Baixar para Windows" — estado "indisponível nesta fase" ----
const primaryCtaMatch = html.match(/<button[^>]*class="hero__cta hero__cta--primary"[^>]*>Baixar para Windows<\/button>/);
check('CTA primário é <button>, não <a>', !!primaryCtaMatch);
check('CTA primário tem atributo disabled', !!primaryCtaMatch && /disabled/.test(primaryCtaMatch[0]));
check('CTA primário tem aria-disabled="true"', !!primaryCtaMatch && /aria-disabled="true"/.test(primaryCtaMatch[0]));

check(
  'nenhum <a> do documento aponta para .exe/GitHub Releases',
  !/href="[^"]*\.exe"/i.test(htmlNoComments) && !/github\.com\/[^"]*releases/i.test(htmlNoComments)
);

check(
  'CTA primário não usa href="#" disfarçando destino',
  !/href="#"/.test(htmlNoComments)
);

check(
  'nota textual "Download ainda não disponível nesta fase." visível junto ao botão',
  /<p class="hero__cta-note">Download ainda não disponível nesta fase\.<\/p>/.test(html)
);

// --- 6. Estilo visual do estado desabilitado (components.css) -----------
const css = fs.readFileSync(CSS_PATH, 'utf8');
const disabledRuleMatch = css.match(/\.hero__cta--primary:disabled[\s\S]*?\{([\s\S]*?)\}/);
check('regra CSS `.hero__cta--primary:disabled` existe', !!disabledRuleMatch);
check(
  '`.hero__cta--primary:disabled` usa cursor: not-allowed',
  !!disabledRuleMatch && /cursor:\s*not-allowed/.test(disabledRuleMatch[1])
);
check(
  '`.hero__cta--primary:disabled` reduz opacidade (distinto do CTA secundário)',
  !!disabledRuleMatch && /opacity:\s*0\.\d+/.test(disabledRuleMatch[1])
);

// --- 7. Seção 2 — "O problema" (3 .problem-card) ------------------------
const problemCardMatches = html.match(/class="glass-card problem-card"/g) || [];
check('exatamente 3 `.problem-card` na Seção 2', problemCardMatches.length === 3);

check(
  'cada .problem-card tem ícone, título (h3) e texto',
  (html.match(/problem-card__icon/g) || []).length === 3 &&
    (html.match(/problem-card__title/g) || []).length === 3 &&
    (html.match(/problem-card__text/g) || []).length === 3
);

// --- 8. Marcadores para as próximas sub-tarefas (T9.2-T9.6) -------------
check(
  'comentários de continuação para T9.2-T9.6 presentes (sem sobrepor seções)',
  /T9\.2 adiciona aqui/.test(html) &&
    /T9\.3 adiciona aqui/.test(html) &&
    /T9\.4 adiciona aqui/.test(html) &&
    /T9\.5 adiciona aqui/.test(html) &&
    /T9\.6 adiciona aqui/.test(html)
);

console.log('');
if (failures > 0) {
  console.log(`${failures} verificação(ões) FAIL.`);
  process.exit(1);
} else {
  console.log('TODAS as verificações PASS.');
}
