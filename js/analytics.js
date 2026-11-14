/* analytics.js — aviso de consentimento + Google Analytics 4.
   O GA só é carregado DEPOIS que o visitante clica em "Aceitar".
   A escolha fica no localStorage ("analytics_consent") e vale por 12 meses;
   pode ser alterada a qualquer momento pelo botão "Preferências de cookies" do rodapé. */
(function () {
  'use strict';
  var KEY = 'analytics_consent';
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 12 meses
  var banner = document.getElementById('consent');
  var GA_ID = banner ? banner.getAttribute('data-ga-id') : 'G-0NDPRCLMYV';
  var loaded = false;
  var returnFocus = null;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  // Padrão: tudo negado. Publicidade e personalização nunca são ativadas.
  gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
  });

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
    if (loaded) return;
    loaded = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
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
