/* analytics.js — aviso de consentimento + Google Analytics 4 + eventos personalizados.
   O GA só é carregado DEPOIS que o visitante clica em "Aceitar".
   A escolha fica no localStorage ("analytics_consent") e vale por 12 meses;
   pode ser alterada a qualquer momento pelo botão "Preferências" do rodapé.

   Usado em todas as páginas públicas do site principal (pt, en, es) e de /ferramentas/.

   Parâmetros enviados em todos os eventos (gtag 'set'):
     site_section   "site" ou "ferramentas"
     content_group  "Site principal" ou "Ferramentas" (agrupamento de conteúdo nativo do GA4)
     page_language  idioma da página (atributo lang do <html>): pt-BR, en, es
     tool_name      só em /ferramentas/: nome da pasta (ex.: assinatura, plate) ou lista, sobre, aviso

   Eventos personalizados (só com consentimento):
     pdf_download   clique em link para .pdf (inclui botão do meio do mouse) ou "Exportar PDF"
                    de uma ferramenta. Parâmetros: file_name, file_extension, link_url,
                    link_text, link_domain, outbound, pdf_type (curriculo | interno |
                    externo | gerado_ferramenta), link_location (região da página).
     tool_action    clique em elemento com data-track="<ação>" nas Ferramentas, ou
                    "form_used" (1x por página, ao alterar um campo; sem os valores).
                    Parâmetros: tool_name, tool_action.

   Para medir outro elemento sem mexer neste arquivo, acrescente data-track="nome_da_acao".
   Para uma ação gerada por código: window.siteAnalytics.track('evento', { ... }). */
(function () {
  'use strict';
  var KEY = 'analytics_consent';
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 12 meses
  var DEFAULT_ID = 'G-0NDPRCLMYV';
  var banner = document.getElementById('consent');
  var GA_ID = (banner && banner.getAttribute('data-ga-id')) || DEFAULT_ID;
  var loaded = false;   // gtag.js já foi pedido
  var granted = false;  // consentimento vigente nesta página
  var returnFocus = null;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  // Padrão: tudo negado. Publicidade e personalização nunca são ativadas.
  gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
  });

  /* ---------- Contexto da página ---------- */
  var path = location.pathname;
  var isTools = /^\/ferramentas(\/|$)/.test(path);
  function toolName() {
    var m = path.match(/^\/ferramentas\/([^\/.]+)/);
    if (!m) return 'lista';
    return m[1].replace(/\.html$/, '');
  }
  var context = {
    site_section: isTools ? 'ferramentas' : 'site',
    content_group: isTools ? 'Ferramentas' : 'Site principal',
    page_language: document.documentElement.getAttribute('lang') || 'pt-BR'
  };
  if (isTools) context.tool_name = toolName();

  /* ---------- Consentimento ---------- */
  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && (v.value === 'granted' || v.value === 'denied') && Date.now() - v.date < MAX_AGE) return v.value;
    } catch (e) { /* sem armazenamento ou valor inválido */ }
    return null;
  }
  function save(value) {
    try { localStorage.setItem(KEY, JSON.stringify({ value: value, date: Date.now() })); } catch (e) { /* ignora */ }
  }

  function loadGA() {
    granted = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    if (loaded) return;
    loaded = true;
    gtag('js', new Date());
    gtag('set', context);
    gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  function clearGACookies() {
    var host = location.hostname, parts = host.split('.');
    var domains = ['', host, '.' + host];
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'), '.' + parts.slice(-3).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid' || name === '_gat') {
        domains.forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  /* ---------- Envio de eventos ---------- */
  // Sem consentimento nada é enfileirado: o evento é descartado.
  function track(name, params) {
    if (!granted) return;
    gtag('event', name, params || {});
  }
  window.siteAnalytics = { track: track };

  function clean(text, max) {
    return (text || '').replace(/\s+/g, ' ').trim().slice(0, max || 100);
  }
  // Região da página onde o link foi clicado (ex.: header, footer, hero, h-privacidade).
  function locationOf(el) {
    if (el.closest('.site-header')) return 'header';
    if (el.closest('.site-footer')) return 'footer';
    var parent = el.parentElement;
    var sec = parent && parent.closest('section[id], section[aria-labelledby], article[id], [id]:not(main)');
    if (sec) return sec.id || sec.getAttribute('aria-labelledby');
    return el.closest('main') ? 'main' : 'outro';
  }

  var PDF_RE = /\.pdf$/i;
  function pdfLink(a) {
    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return null; }
    if (!/^https?:$/.test(url.protocol) || !PDF_RE.test(url.pathname)) return null;
    return url;
  }

  function onPdfClick(a, url) {
    var outbound = url.hostname !== location.hostname;
    var type = outbound ? 'externo' : (url.pathname.indexOf('/assets/cv/') === 0 ? 'curriculo' : 'interno');
    track('pdf_download', {
      file_name: decodeURIComponent(url.pathname.split('/').pop()),
      file_extension: 'pdf',
      link_url: url.href,
      link_text: clean(a.textContent || a.getAttribute('title') || a.getAttribute('aria-label')),
      link_domain: url.hostname,
      outbound: outbound,
      pdf_type: type,
      link_location: locationOf(a)
    });
  }

  function onTrackClick(el) {
    var action = clean(el.getAttribute('data-track'), 40);
    if (!action) return;
    var tool = context.tool_name || 'site';
    track('tool_action', { tool_name: tool, tool_action: action, link_text: clean(el.textContent) });
    // "Exportar PDF" das ferramentas gera um PDF pelo diálogo de impressão: conta também como download.
    if (action === 'export_pdf') {
      track('pdf_download', {
        file_name: tool + '.pdf',
        file_extension: 'pdf',
        link_text: clean(el.textContent),
        outbound: false,
        pdf_type: 'gerado_ferramenta',
        link_location: locationOf(el)
      });
    }
  }

  function onClick(e) {
    if (!granted || !e.target || !e.target.closest) return;
    // Botão principal ou do meio (abrir em nova aba); ignora o direito.
    if (e.type === 'auxclick' && e.button !== 1) return;
    var tracked = e.target.closest('[data-track]');
    if (tracked) { onTrackClick(tracked); return; }
    var a = e.target.closest('a[href]');
    if (!a) return;
    var url = pdfLink(a);
    if (url) onPdfClick(a, url);
  }
  // Fase de captura: o evento é registrado mesmo que outro script interrompa a propagação.
  document.addEventListener('click', onClick, true);
  document.addEventListener('auxclick', onClick, true);

  // Nas Ferramentas: uma única vez por página, quando o visitante altera algum campo do formulário.
  // Só o fato de usar a ferramenta é registrado; os valores digitados nunca são enviados.
  if (isTools) {
    var formUsed = false;
    document.addEventListener('change', function (e) {
      if (formUsed || !granted || !e.target || !e.target.closest || !e.target.closest('main form')) return;
      formUsed = true;
      track('tool_action', { tool_name: context.tool_name, tool_action: 'form_used' });
    }, true);
  }

  /* ---------- Aviso de consentimento ---------- */
  function show(fromButton) {
    if (!banner) return;
    banner.hidden = false;
    document.body.classList.add('has-consent');
    if (fromButton) {
      returnFocus = fromButton;
      var first = banner.querySelector('[data-consent]');
      if (first) first.focus();
    }
  }
  function hide() {
    if (!banner) return;
    banner.hidden = true;
    document.body.classList.remove('has-consent');
    if (returnFocus) { returnFocus.focus(); returnFocus = null; }
  }

  function choose(value) {
    save(value);
    if (value === 'granted') {
      loadGA();
    } else {
      granted = false;
      gtag('consent', 'update', { analytics_storage: 'denied' });
      clearGACookies();
    }
    hide();
  }

  var current = read();
  if (current === 'granted') loadGA();

  function init() {
    banner = document.getElementById('consent');
    if (!banner) return;
    banner.querySelectorAll('[data-consent]').forEach(function (b) {
      b.addEventListener('click', function () { choose(b.getAttribute('data-consent')); });
    });
    document.querySelectorAll('[data-consent-open]').forEach(function (b) {
      b.addEventListener('click', function () { show(b); });
    });
    if (!current) show(null);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
