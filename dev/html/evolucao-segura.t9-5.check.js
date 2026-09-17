#!/usr/bin/env node
/**
 * evolucao-segura.t9-5.check.js — teste automatizado do critério de aceite
 * de T9.5 (TASK.md, Lote 9), sem dependências externas (GUARDRAILS.md G-01).
 * Executar com:
 *   node dev/html/evolucao-segura.t9-5.check.js
 *
 * Cobre, por asserção de texto/regex sobre o HTML publicado (mesmo espírito
 * de dev/html/evolucao-segura.t9-1.check.js):
 *   1. Seção 7 (Licença de uso, id="licenca") existe, com exatamente 1
 *      `.pillar` e sem `.pillar__list`.
 *   2. Conteúdo simplificado presente: 7 dias de teste, bloqueio só da
 *      escrita, leitura/exportação em PDF disponíveis, frase honesta de
 *      fechamento sobre o passo a passo pós-teste.
 *   3. Nenhum <input>/<form> de ativação em toda a página (G-04).
 *   4. Nenhum passo a passo de chave/contra-chave, nem como `.steps`
 *      dentro da Seção 7, nem como prosa (palavras "chave"/"contra-chave").
 *   5. Nenhum screenshot (`.shot`) dentro da Seção 7 (slot S9 removido).
 *   6. Seção 8 (Requisitos de sistema, id="requisitos") existe com
 *      `.specs`, `<caption>`, `scope="row"` e as linhas de dado real
 *      esperadas, incluindo `.badge` explícito para "Espaço em disco".
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const HTML_PATH = path.join(ROOT, 'public', 'evolucao-segura.html');

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

// --- 1. Seção 7 — Licença de uso -----------------------------------------
const licencaMatch = htmlNoComments.match(
  /<section class="section" id="licenca"[^>]*>([\s\S]*?)<\/section>/
);
check('seção "Licença de uso" (id="licenca") existe', !!licencaMatch);

const licencaBody = licencaMatch ? licencaMatch[1] : '';

check(
  'exatamente 1 `.pillar` dentro da seção de licença',
  (licencaBody.match(/class="glass-card pillar"/g) || []).length === 1
);

check(
  '`.pillar` da licença NÃO usa `.pillar__list`',
  !/pillar__list/.test(licencaBody)
);

// --- 2. Conteúdo simplificado ---------------------------------------------
check('menciona "7 dias" (teste)', /7 dias/.test(licencaBody));
check(
  'bloqueia apenas a escrita',
  /bloqueia apenas a escrita/.test(licencaBody)
);
check(
  'leitura continua disponível',
  /leitura[\s\S]{0,60}continua disponível/.test(licencaBody)
);
check(
  'exportação em PDF continua disponível',
  /exportação em PDF/.test(licencaBody)
);
check(
  'frase honesta de fechamento sobre o passo a passo pós-teste',
  /passo a passo para continuar usando depois do teste ainda está\s+sendo definido/.test(
    licencaBody
  )
);

// --- 3. Sem campo de formulário funcional em toda a página (G-04) --------
check('nenhum `<input>` em toda a página', !/<input\b/i.test(htmlNoComments));
check('nenhum `<form>` em toda a página', !/<form\b/i.test(htmlNoComments));

// --- 4. Sem passo a passo de chave/contra-chave --------------------------
check(
  'seção de licença não usa `.steps`',
  !/class="steps"/.test(licencaBody)
);
check(
  'seção de licença não menciona "contra-chave"',
  !/contra-chave/i.test(licencaBody)
);
check(
  'seção de licença não menciona "chave" (mecanismo de ativação)',
  !/\bchave\b/i.test(licencaBody)
);

// --- 5. Sem screenshot na seção de licença (slot S9 removido) ------------
check('seção de licença não tem `.shot` (screenshot)', !/class="shot"/.test(licencaBody));

// --- 6. Seção 8 — Requisitos de sistema (.specs) -------------------------
const requisitosMatch = htmlNoComments.match(
  /<section class="section section--alt" id="requisitos"[^>]*>([\s\S]*?)<\/section>/
);
check('seção "Requisitos de sistema" (id="requisitos") existe', !!requisitosMatch);

const requisitosBody = requisitosMatch ? requisitosMatch[1] : '';

check('`.specs` (tabela) presente', /<table class="specs">/.test(requisitosBody));
check('`<caption>` presente', /<caption>/.test(requisitosBody));
check(
  '`scope="row"` usado em todos os `<th>` de linha',
  (requisitosBody.match(/<th scope="row">/g) || []).length ===
    (requisitosBody.match(/<th\b/g) || []).length &&
    (requisitosBody.match(/<th\b/g) || []).length > 0
);

check(
  'linha "Sistema operacional" com Windows 10/11 (64 bits)',
  /Sistema operacional[\s\S]{0,20}Windows 10 ou Windows 11 \(64 bits\)/.test(requisitosBody)
);
check(
  'linha macOS/Linux não suportados',
  /macOS \/ Linux[\s\S]{0,20}Não suportados nesta versão/.test(requisitosBody)
);
check(
  'linha de conexão à internet: não necessária para uso, só para baixar/instalar',
  /Conexão com a internet[\s\S]{0,120}Não é necessária para usar o app/.test(requisitosBody)
);
check(
  'linha "Onde ficam os dados" menciona acervo criptografado local, sem servidor do fornecedor',
  /Onde ficam os dados[\s\S]{0,150}criptografado[\s\S]{0,80}Não há servidor nosso/.test(
    requisitosBody
  )
);
check(
  'linha "Perfil de uso" menciona um profissional/um computador/um acervo, não multiusuário',
  /Perfil de uso[\s\S]{0,120}Não é multiusuário/.test(requisitosBody)
);
check(
  'linha "Espaço em disco" usa `.badge` "A confirmar" (sem número inventado)',
  /Espaço em disco[\s\S]{0,40}<span class="badge">A confirmar<\/span>/.test(requisitosBody)
);

console.log('');
if (failures > 0) {
  console.log(`${failures} verificação(ões) FAIL.`);
  process.exit(1);
} else {
  console.log('TODAS as verificações PASS.');
}
