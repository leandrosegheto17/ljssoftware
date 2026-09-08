/**
 * analytics.js — T2.4 (Lote 2)
 *
 * Instrumenta o disparo de eventos custom de Cloudflare Web Analytics no
 * clique dos links/botões de contato (e-mail e LinkedIn), presentes no
 * rodapé de todas as páginas (T2.3) e, na Home, na seção de contato (T3.3).
 *
 * Como incluir (Lote 3, ao montar as páginas reais):
 *   <script src="assets/js/analytics.js" defer></script>
 *   — incluir em toda página que contenha o rodapé (`.footer-link`) e/ou a
 *   seção de contato da Home (T3.3), depois do beacon oficial de Cloudflare
 *   Web Analytics (T5.4):
 *   <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
 *     data-cf-beacon='{"token": "..."}'></script>
 *   CORREÇÃO (Validador, chapéu DevOps, /deploy Seção 1): o domínio correto
 *   documentado pela Cloudflare é static.cloudflareinsights.com (não
 *   static.cloudflarewebanalytics.io, usado erroneamente nesta nota
 *   original de T2.4) — já corrigido também em `_headers` (script-src/
 *   connect-src). Ver .md/DEPLOY.md, T5.4.
 *
 * ADR-003 / GUARDRAILS.md G-03: única ferramenta de analytics permitida é o
 * Cloudflare Web Analytics. Este arquivo NÃO usa cookies, NÃO usa
 * localStorage/sessionStorage para tracking, e não carrega nenhum SDK de
 * terceiros — apenas invoca (quando presente) a função global exposta pelo
 * beacon script do próprio Cloudflare.
 *
 * SUPOSIÇÃO DE API (documentar para o Validador conferir em T5.4):
 * O beacon script do Cloudflare Web Analytics (beacon.min.js) expõe, quando
 * carregado, a função global `window.__cfBeacon.track(eventName, payload)`
 * para eventos custom (API documentada publicamente pela Cloudflare em
 * "Custom Events" do Web Analytics). Não há garantia, neste momento
 * (beacon real só habilitado em T5.4), do nome exato/assinatura definitiva
 * dessa função nesta conta/versão do beacon — por isso a chamada abaixo é
 * defensiva: tenta, nesta ordem, `window.__cfBeacon.track(...)` e, como
 * alternativa mais amplamente documentada em integrações de terceiros,
 * `window.zaraz.track(...)` (Cloudflare Zaraz, quando o projeto usa Zaraz
 * para gerenciar o Web Analytics). Se nenhuma das duas existir (beacon
 * ainda não carregado, ex. em dev/preview antes de T5.4, ou bloqueado por
 * ad-blocker), a chamada é ignorada silenciosamente — nunca lança erro e
 * nunca bloqueia a navegação do link.
 *
 * Convenção `data-analytics-event` (para quem implementar T3.3):
 * Qualquer link/botão de contato — no rodapé (T2.3) ou na seção de contato
 * da Home (T3.3) — deve ter um destes atributos:
 *   data-analytics-event="contato-email"     -> dispara "contato_email_click"
 *   data-analytics-event="contato-linkedin"   -> dispara "contato_linkedin_click"
 * Isso desacopla a instrumentação do seletor de classe (`.footer-link` só
 * existe no rodapé); os botões novos da Home em T3.3 só precisam do mesmo
 * atributo `data-analytics-event` para serem instrumentados automaticamente
 * por este script, sem nenhuma alteração aqui.
 */
(function () {
  'use strict';

  var EVENT_NAMES = {
    'contato-email': 'contato_email_click',
    'contato-linkedin': 'contato_linkedin_click'
  };

  /**
   * Dispara um evento custom no Cloudflare Web Analytics, de forma
   * "fire and forget": nunca lança erro, nunca atrasa/bloqueia o clique.
   * @param {string} eventName
   */
  function trackEvent(eventName) {
    try {
      if (
        window.__cfBeacon &&
        typeof window.__cfBeacon.track === 'function'
      ) {
        window.__cfBeacon.track(eventName);
        return;
      }
      if (window.zaraz && typeof window.zaraz.track === 'function') {
        window.zaraz.track(eventName);
        return;
      }
      // Beacon ainda não carregado (ex.: dev/preview antes de T5.4) ou
      // bloqueado — não é um erro, apenas não há o que reportar agora.
    } catch (err) {
      // Nunca deixar uma falha de analytics afetar a navegação do usuário.
      if (window.console && typeof window.console.warn === 'function') {
        window.console.warn('[analytics.js] falha ao disparar evento custom (ignorada):', err);
      }
    }
  }

  /**
   * Handler de clique: identifica o tipo de link de contato pelo atributo
   * data-analytics-event (convenção compartilhada entre rodapé e a seção de
   * contato da Home) e dispara o evento correspondente. Não chama
   * preventDefault/stopPropagation em nenhum momento — a navegação nativa
   * do link (mailto:/https://) segue seu curso normalmente.
   * @param {MouseEvent} event
   */
  function handleContactLinkClick(event) {
    var target = event.target;
    // Sobe até encontrar o elemento com o atributo (cobre cliques em
    // ícone/texto internos ao link/botão, ex. <svg>/<span> do T2.3).
    var el = target && target.closest ? target.closest('[data-analytics-event]') : null;
    if (!el) {
      return;
    }
    var key = el.getAttribute('data-analytics-event');
    var eventName = EVENT_NAMES[key];
    if (!eventName) {
      return;
    }
    trackEvent(eventName);
    // Nenhum preventDefault/stopPropagation: navegação nativa do link segue normalmente.
  }

  function init() {
    // Seletor combinado: casa tanto com os links de rodapé existentes
    // (.footer-link, T2.3) quanto com quaisquer elementos futuros que só
    // tenham o atributo data-analytics-event (ex. botões da Home, T3.3).
    var selector = '.footer-link[data-analytics-event], [data-analytics-event]';
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener('click', handleContactLinkClick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
