/**
 * app-modal.js — Modal "Saiba mais" dos cards de app (LJSSoftware)
 *
 * Fonte: .md/TASK.md Seção 3, Lote 7 (T7.1). JS puro, sem framework/
 * biblioteca (GUARDRAILS.md G-01). Depende do markup definido em
 * `assets/css/components.css`, seção "App Card — botão 'Saiba mais' +
 * Modal (T7.1)": um `<div class="app-modal" id="app-modal" hidden>` único
 * por página + N botões `.app-card__more` com `data-app-name`/
 * `data-app-summary`.
 *
 * Incluir com `<script src="assets/js/app-modal.js" defer></script>` antes
 * de `</body>`, em toda página que tiver cards de app com o botão "Saiba
 * mais" (hoje: `apps.html`, `index.html`).
 *
 * Comportamento:
 *  - Clique em qualquer `.app-card__more` abre o modal, preenchendo título/
 *    texto a partir dos atributos `data-app-name`/`data-app-summary` do
 *    próprio botão clicado — sem duplicar conteúdo em JS.
 *  - Fecha ao clicar no overlay, no botão de fechar (`data-app-modal-close`)
 *    ou pressionar `Escape`; o foco volta para o botão "Saiba mais" que
 *    abriu o modal (gerenciamento de foco).
 *  - Ao abrir, todo o restante do `<body>` recebe o atributo `inert`
 *    (mesma técnica já usada em `nav.js` para o overlay do menu mobile) —
 *    remove a página de trás da árvore de acessibilidade e da ordem de
 *    `Tab` enquanto o modal está aberto, sem precisar de um "focus trap"
 *    manual (o único elemento focável dentro do modal é o botão de
 *    fechar). Removido ao fechar.
 *  - `overflow: hidden` no `<body>` (classe `app-modal-open`, ver
 *    components.css) evita scroll da página por trás enquanto o modal está
 *    aberto.
 *  - `prefers-reduced-motion: reduce` já é neutralizado globalmente em
 *    `base.css` — este componente não define nenhuma transição própria.
 */
(function () {
  'use strict';

  function setupAppModal() {
    var modal = document.getElementById('app-modal');
    if (!modal) {
      return;
    }

    var titleEl = modal.querySelector('.app-modal__title');
    var textEl = modal.querySelector('.app-modal__text');
    var closeEls = modal.querySelectorAll('[data-app-modal-close]');
    var triggers = document.querySelectorAll('.app-card__more');

    var lastFocused = null;
    var inertSiblings = [];

    function isOpen() {
      return !modal.hidden;
    }

    function openModal(trigger) {
      lastFocused = trigger;

      if (titleEl) {
        titleEl.textContent = trigger.getAttribute('data-app-name') || '';
      }
      if (textEl) {
        textEl.textContent = trigger.getAttribute('data-app-summary') || '';
      }

      inertSiblings = [];
      var bodyChildren = document.body.children;
      for (var i = 0; i < bodyChildren.length; i += 1) {
        var child = bodyChildren[i];
        if (child !== modal && !child.hasAttribute('inert')) {
          child.setAttribute('inert', '');
          inertSiblings.push(child);
        }
      }

      modal.hidden = false;
      document.body.classList.add('app-modal-open');

      var closeBtn = modal.querySelector('.app-modal__close');
      if (closeBtn) {
        closeBtn.focus();
      }
    }

    function closeModal() {
      if (!isOpen()) {
        return;
      }

      modal.hidden = true;
      document.body.classList.remove('app-modal-open');

      for (var i = 0; i < inertSiblings.length; i += 1) {
        inertSiblings[i].removeAttribute('inert');
      }
      inertSiblings = [];

      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
      lastFocused = null;
    }

    for (var t = 0; t < triggers.length; t += 1) {
      triggers[t].addEventListener('click', function (event) {
        openModal(event.currentTarget);
      });
    }

    for (var c = 0; c < closeEls.length; c += 1) {
      closeEls[c].addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAppModal);
  } else {
    setupAppModal();
  }
})();
