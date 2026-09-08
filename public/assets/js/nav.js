/**
 * nav.js — Toggle do menu mobile (LJSSoftware)
 *
 * Fonte: .md/TASK.md Seção 1.1 (estrutura de arquivos) + Lote 2, T2.2.
 * JS puro, sem framework/biblioteca (GUARDRAILS.md G-01). Depende do
 * markup do header definido em `assets/css/components.css` (bloco de
 * referência da seção "Header / Nav (T2.1)", estendido em T2.2 com
 * `.site-header__toggle` e `id="site-header-nav"` na `<nav>`).
 *
 * Incluir com `<script src="assets/js/nav.js" defer></script>` antes de
 * `</body>`, em toda página que usa o header padrão.
 *
 * Comportamento:
 *  - Clique no botão hamburguer (`.site-header__toggle`) alterna
 *    `aria-expanded`/`aria-label` e a classe de estado `data-open` na nav.
 *    Como o toggle é um elemento `<button>` nativo, `Enter`/`Space` já
 *    disparam o `click` sem handler adicional (semântica HTML nativa).
 *  - `Escape` fecha o menu quando aberto, devolvendo o foco ao botão.
 *  - Ao abrir, o foco move para o primeiro item navegável dentro do menu
 *    (gerenciamento de foco).
 *  - Se o viewport cruzar para >=768px (tablet/desktop, breakpoint de
 *    colapso do UX-SPEC.md Seção 6) com o menu aberto, o estado é resetado
 *    via `matchMedia` — evita o overlay ficar "preso" aberto atrás da nav
 *    horizontal que reaparece nesse breakpoint.
 *  - `overflow: hidden` no `<body>` enquanto o overlay está aberto
 *    (classe `has-open-mobile-nav`, ver components.css) evita scroll duplo
 *    atrás do overlay.
 *  - Correção de QA-REPORT.md (T2.2, Achado Crítico #1): abaixo de 768px,
 *    com o menu FECHADO, `.site-header__nav` recebe o atributo HTML
 *    `inert`. `inert` remove o subárvore inteira (os 3 links + o CTA) da
 *    árvore de acessibilidade e da ordem de tabulação automaticamente, sem
 *    precisar gerenciar `tabindex` em cada `<a>` individualmente — resolve
 *    a "armadilha de foco em elementos invisíveis fora da tela" descrita no
 *    achado. É removido ao abrir o menu (`openMenu`) e reaplicado ao fechar
 *    (`closeMenu`), sempre em sincronia com `aria-expanded`/`data-open`.
 *    Decisão: sem fallback de `tabindex="-1"` por navegador antigo — suporte
 *    a `inert` é amplo em navegadores modernos (Chrome/Edge 102+, Firefox
 *    112+, Safari 15.5+, todos de 2022 ou antes) e o projeto não tem
 *    build step/polyfill (GUARDRAILS.md G-01, JS puro sem framework); um
 *    fallback duplicaria a lógica de sincronização em cada link só para
 *    cobrir navegadores já residuais. Em >=768px (nav horizontal, sem
 *    overlay) `inert` nunca é aplicado — a nav ali é sempre visível/
 *    focável normalmente, independente de `aria-expanded` (que só existe
 *    para o estado do overlay mobile).
 *
 * Nota: cada `<header class="site-header">` da página é conectado de forma
 * independente (`aria-controls` do toggle -> `id` da nav correspondente,
 * com fallback para a nav mais próxima do mesmo header caso o `id` não
 * resolva). Em produção cada página real tem só um header; o suporte a
 * múltiplos é só o que permite o smoke-test (`header.smoke.html`) demonstrar
 * as 3 variantes do bloco de referência na mesma página, cada uma com
 * comportamento próprio.
 */
(function () {
  'use strict';

  function setupOneMobileNav(toggle) {
    var controlsId = toggle.getAttribute('aria-controls');
    var nav = controlsId ? document.getElementById(controlsId) : null;

    if (!nav) {
      var header = toggle.closest('.site-header');
      nav = header ? header.querySelector('.site-header__nav') : null;
    }

    if (!nav) {
      return;
    }

    var firstFocusable = nav.querySelector(
      '.site-header__nav-link, .site-header__cta'
    );

    // Breakpoint de colapso (UX-SPEC.md Seção 6 / components.css "Menu
    // mobile (T2.2)"): só abaixo de 768px a nav vira overlay controlado por
    // `aria-expanded`. Em >=768px é a nav horizontal normal e nunca deve
    // ficar `inert`, independentemente do estado de `aria-expanded`.
    var mobileMql = window.matchMedia('(max-width: 767.98px)');

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    // Sincroniza `inert` no overlay com o estado atual (aberto/fechado) e
    // com o breakpoint — corrige QA-REPORT.md T2.2 Achado Crítico #1.
    function syncInertState() {
      if (mobileMql.matches && !isOpen()) {
        nav.setAttribute('inert', '');
      } else {
        nav.removeAttribute('inert');
      }
    }

    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu');
      nav.setAttribute('data-open', 'true');
      document.body.classList.add('has-open-mobile-nav');
      syncInertState();

      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    function closeMenu(returnFocusToToggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
      nav.removeAttribute('data-open');
      document.body.classList.remove('has-open-mobile-nav');
      syncInertState();

      if (returnFocusToToggle !== false) {
        toggle.focus();
      }
    }

    // Estado inicial (carregamento da página): menu sempre começa fechado
    // (`aria-expanded="false"` já é o valor no HTML) — aplica `inert` de
    // imediato abaixo de 768px, antes de qualquer interação do usuário.
    syncInertState();

    toggle.addEventListener('click', function () {
      if (isOpen()) {
        closeMenu(false);
      } else {
        openMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        closeMenu(true);
      }
    });

    // Reset de segurança: se a janela crescer para o breakpoint de
    // desktop/tablet (nav horizontal reaparece via CSS de T2.1) enquanto o
    // overlay mobile está aberto, fecha o estado sem tentar mover foco
    // (elemento pode não estar mais visível). Também resincroniza `inert`
    // em qualquer travessia do breakpoint (inclusive voltando para <768px),
    // já que `closeMenu` só é chamado quando o menu estava aberto.
    var desktopMql = window.matchMedia('(min-width: 768px)');
    function handleBreakpointChange(mql) {
      if (mql.matches && isOpen()) {
        closeMenu(false);
      } else {
        syncInertState();
      }
    }

    if (typeof desktopMql.addEventListener === 'function') {
      desktopMql.addEventListener('change', handleBreakpointChange);
    } else if (typeof desktopMql.addListener === 'function') {
      // Fallback para navegadores mais antigos (ex.: Safari < 14).
      desktopMql.addListener(handleBreakpointChange);
    }
  }

  function setupAllMobileNavs() {
    var toggles = document.querySelectorAll('.site-header__toggle');
    for (var i = 0; i < toggles.length; i += 1) {
      setupOneMobileNav(toggles[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAllMobileNavs);
  } else {
    setupAllMobileNavs();
  }
})();
