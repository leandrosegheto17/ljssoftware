#!/usr/bin/env node
/**
 * evolucao-segura.t9-6.check.js — teste automatizado do critério de aceite
 * de T9.6 (TASK.md, Lote 9), sem dependências externas (GUARDRAILS.md G-01).
 * Executar com:
 *   node dev/html/evolucao-segura.t9-6.check.js
 *
 * Cobre, por asserção de texto/regex sobre o HTML publicado (mesmo espírito
 * de dev/html/evolucao-segura.t9-1.check.js e ...t9-5.check.js):
 *   1. Seção 9 (Dúvidas, id implícito via aria-labelledby="faq-titulo") existe
 *      com `.faq` e exatamente 5 `<details class="glass-card faq__item">`.
 *   2. Seção 10 (CTA final, id="baixar") existe com `.final-cta`.
 *   3. Botão "Baixar para Windows" do CTA final é elemento não-`<a>`
 *      (`<button disabled aria-disabled="true">`), sem `href` para `.exe`/
 *      GitHub Releases, sem `href="#"`/JS simulando destino, reaproveitando
 *      `.hero__cta`/`.hero__cta--primary` (mesmo estado do CTA do hero,
 *      T9.1) e com nota textual visível avisando indisponibilidade.
 *   4. Nenhum link real de download (`.exe`/github.com/releases) em toda a
 *      página.
 *   5. Rodapé (`<footer class="site-footer">`) presente, byte-idêntico ao
 *      de public/apps.html (G-02).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const HTML_PATH = path.join(ROOT, 'public', 'evolucao-segura.html');
const APPS_PATH = path.join(ROOT, 'public', 'apps.html');

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

// --- 1. Seção 9 — Dúvidas / FAQ -------------------------------------------
const faqMatch = htmlNoComments.match(
  /<section class="section" aria-labelledby="faq-titulo">([\s\S]*?)<\/section>/
);
check('seção "Dúvidas" (aria-labelledby="faq-titulo") existe', !!faqMatch);

const faqBody = faqMatch ? faqMatch[1] : '';

check('`.faq` presente', /class="faq"/.test(faqBody));
check(
  'exatamente 5 `<details class="glass-card faq__item">`',
  (faqBody.match(/<details class="glass-card faq__item">/g) || []).length === 5
);
check(
  'exatamente 5 `<summary class="faq__q">`',
  (faqBody.match(/<summary class="faq__q">/g) || []).length === 5
);
check(
  'exatamente 5 `<p class="faq__a">`',
  (faqBody.match(/class="faq__a"/g) || []).length === 5
);
check('nenhum `<script>` dentro da seção de dúvidas (sem JS)', !/<script/i.test(faqBody));

// --- 2. Seção 10 — CTA final -----------------------------------------------
const ctaMatch = htmlNoComments.match(
  /<section class="section section--alt" id="baixar"[^>]*>([\s\S]*?)<\/section>/
);
check('seção "CTA final" (id="baixar") existe', !!ctaMatch);

const ctaBody = ctaMatch ? ctaMatch[1] : '';

check('`.final-cta` presente dentro de `.glass-card`', /class="glass-card final-cta"/.test(ctaBody));
check('`.final-cta__title` presente', /class="final-cta__title"/.test(ctaBody));
check('`.final-cta__text` presente', /class="final-cta__text"/.test(ctaBody));

// --- 3. Botão "Baixar para Windows" no estado indisponível ----------------
check(
  'botão "Baixar para Windows" reaproveita `.hero__cta`/`.hero__cta--primary`',
  /<button type="button" class="hero__cta hero__cta--primary" disabled aria-disabled="true">Baixar para Windows<\/button>/.test(
    ctaBody
  )
);
check('nota textual de indisponibilidade visível junto ao botão', /Download ainda não disponível nesta fase\./.test(ctaBody));
check(
  'CTA final NÃO é uma âncora com href para o botão de download',
  !/<a[^>]*>\s*Baixar para Windows/.test(ctaBody)
);

// --- 4. Nenhum link real de download em toda a página ----------------------
check('nenhum `href` para arquivo `.exe`', !/href="[^"]*\.exe"/i.test(htmlNoComments));
check('nenhum `href` para github.com (Releases)', !/href="[^"]*github\.com/i.test(htmlNoComments));
check(
  'nenhum `href="#"` (destino simulado) em botão de download',
  !/Baixar para Windows[\s\S]{0,5}<\/a>/.test(htmlNoComments) &&
    !/<a[^>]*href="#"[^>]*>\s*Baixar para Windows/.test(htmlNoComments)
);

// --- 5. Rodapé byte-idêntico ao de public/apps.html (G-02) ------------------
const footerMatch = htmlNoComments.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
check('`<footer class="site-footer">` presente', !!footerMatch);

if (fs.existsSync(APPS_PATH)) {
  const appsHtml = fs.readFileSync(APPS_PATH, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const appsFooterMatch = appsHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
  check(
    'rodapé é byte-idêntico ao de public/apps.html',
    !!footerMatch && !!appsFooterMatch && footerMatch[0] === appsFooterMatch[0]
  );
} else {
  check('public/apps.html existe para comparação do rodapé', false);
}

console.log('');
if (failures > 0) {
  console.log(`${failures} verificação(ões) FAIL.`);
  process.exit(1);
} else {
  console.log('TODAS as verificações PASS.');
}
