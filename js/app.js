/* app.js — interações comuns a todas as páginas (menu, tema, idioma, aviso de idioma, rodapé). */
(function () {
  'use strict';
  var root = document.documentElement;

  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignora */ } }
  function isDark() { return root.getAttribute('data-theme') === 'dark'; }

  /* ---------- Tema: claro, escuro ou seguir o sistema ---------- */
  // O modo inicial é aplicado por theme-init.js (no <head>, antes da renderização).
  var systemDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function getMode() { var m = root.getAttribute('data-theme-mode'); return m === 'light' || m === 'dark' ? m : 'system'; }
  function applyTheme() {
    var mode = getMode();
    var dark = mode === 'dark' || (mode === 'system' && !!systemDark && systemDark.matches);
    if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    syncThemeButtons();
  }
  function setThemeMode(mode) {
    if (mode !== 'light' && mode !== 'dark') mode = 'system';
    root.setAttribute('data-theme-mode', mode);
    if (mode === 'system') { try { localStorage.removeItem('theme'); } catch (e) { /* ignora */ } }
    else store('theme', mode);
    applyTheme();
  }
  function syncThemeButtons() {
    var mode = getMode();
    document.querySelectorAll('[data-theme-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-theme-set') === mode ? 'true' : 'false');
    });
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', isDark() ? 'true' : 'false');
    });
    // Botão das páginas antigas (sem data-theme-toggle)
    var legacy = document.querySelector('#theme-toggle:not([data-theme-toggle])');
    if (legacy) {
      legacy.innerHTML = '<img src="/assets/icons/' + (isDark() ? 'claro' : 'escuro') + '.svg" alt="" width="20" height="20">';
      legacy.setAttribute('aria-label', isDark() ? 'Ativar modo claro' : 'Ativar modo escuro');
    }
  }
  // Botão único (usado nas Ferramentas /web/ e em páginas antigas): alterna entre claro e escuro
  function toggleTheme() { setThemeMode(isDark() ? 'light' : 'dark'); }
  // No modo "seguir o sistema", acompanha a mudança do sistema operacional com a página aberta
  if (systemDark) {
    var onSystemChange = function () { if (getMode() === 'system') applyTheme(); };
    if (systemDark.addEventListener) systemDark.addEventListener('change', onSystemChange);
    else if (systemDark.addListener) systemDark.addListener(onSystemChange);
  }

  /* ---------- Aviso de idioma ---------- */
  // Se o idioma do navegador (ou o escolhido antes no seletor) for outro e esta página existir
  // nesse idioma, mostra um aviso discreto com o link. Nunca redireciona automaticamente.
  var NOTICE = {
    pt: { text: 'Esta página também está disponível em português.', go: 'Ver em português', close: 'Fechar aviso' },
    en: { text: 'This page is also available in English.', go: 'View in English', close: 'Dismiss' },
    es: { text: 'Esta página también está disponible en español.', go: 'Ver en español', close: 'Cerrar aviso' }
  };
  function langOf(tag) { tag = String(tag || '').toLowerCase().split('-')[0]; return NOTICE[tag] ? tag : null; }
  function languageNotice() {
    var current = langOf(root.lang);
    if (!current) return;
    var wanted = null;
    try { wanted = langOf(localStorage.getItem('preferred_lang')); } catch (e) { /* ignora */ }
    if (!wanted) {
      var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
      for (var i = 0; i < list.length && !wanted; i++) wanted = langOf(list[i]);
    }
    if (!wanted || wanted === current) return;
    try { if (localStorage.getItem('lang_notice_closed') === wanted) return; } catch (e) { /* ignora */ }
    var alt = null;
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function (l) {
      if (langOf(l.getAttribute('hreflang')) === wanted && l.getAttribute('hreflang') !== 'x-default') alt = l.getAttribute('href');
    });
    if (!alt) return;
    try { alt = new URL(alt, window.location.href); alt = alt.pathname + window.location.hash; } catch (e) { /* mantém */ }

    var msg = NOTICE[wanted];
    var box = document.createElement('div');
    box.className = 'lang-notice';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', msg.text);
    box.lang = wanted;
    var p = document.createElement('p');
    p.textContent = msg.text + ' ';
    var a = document.createElement('a');
    a.href = alt;
    a.hreflang = wanted;
    a.textContent = msg.go;
    a.addEventListener('click', function () { store('preferred_lang', wanted); });
    p.appendChild(a);
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'lang-notice__close';
    close.setAttribute('aria-label', msg.close);
    close.innerHTML = '<svg class="icon" aria-hidden="true" focusable="false"><use href="/assets/icons/sprite.svg#close"></use></svg>';
    close.addEventListener('click', function () {
      store('lang_notice_closed', wanted);
      box.remove();
    });
    box.appendChild(p);
    box.appendChild(close);
    var main = document.getElementById('main');
    if (main) main.parentNode.insertBefore(box, main); else document.body.insertBefore(box, document.body.firstChild);
  }

  /* ---------- Menu móvel ---------- */
  function setMenu(open) {
    var btn = document.querySelector('[data-menu-toggle]');
    var nav = document.getElementById('site-nav') || document.getElementById('navMenu');
    if (!nav) return;
    nav.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function toggleMenu() {
    var nav = document.getElementById('site-nav') || document.getElementById('navMenu');
    if (nav) setMenu(!nav.classList.contains('active'));
  }

  /* ---------- Idioma (páginas antigas usam switchLanguage) ---------- */
  function switchLanguage(lang) {
    store('preferred_lang', lang);
    var path = window.location.pathname.replace(/^\/(en|es)(\/|$)/, '/');
    var target = lang === 'pt' ? path : '/' + lang + (path === '/' ? '/' : path);
    window.location.href = target;
  }

  /* ---------- Impressão ---------- */
  // Abre os quadros expansíveis (details.accordion) para imprimir o conteúdo e os fecha depois.
  // Complementa o CSS de impressão em navegadores que ainda não suportam ::details-content.
  var openedForPrint = [];
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('details.accordion:not([open])').forEach(function (d) { d.open = true; openedForPrint.push(d); });
  });
  window.addEventListener('afterprint', function () {
    openedForPrint.forEach(function (d) { d.open = false; });
    openedForPrint = [];
  });

  // Exporta para compatibilidade com atributos onclick das páginas de desenvolvimento
  window.toggleTheme = toggleTheme;
  window.setThemeMode = setThemeMode;
  window.toggleMenu = toggleMenu;
  window.switchLanguage = switchLanguage;

  /* ---------- E-mails protegidos contra robôs ---------- */
  // O HTML traz o endereço codificado (invertido + Base64) em data-email, sem "@" nem "mailto:".
  // Aqui ele é decodificado e vira um link normal; data-email-text também troca o texto exibido.
  function revealEmails() {
    document.querySelectorAll('[data-email]').forEach(function (el) {
      var address;
      try { address = window.atob(el.getAttribute('data-email')).split('').reverse().join(''); } catch (e) { return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address)) return;
      el.setAttribute('href', 'mailto:' + address);
      if (el.hasAttribute('data-email-text')) el.textContent = address;
      el.hidden = false;
      el.removeAttribute('data-email');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme();
    revealEmails();
    languageNotice();

    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.addEventListener('click', toggleTheme);
    });
    var themeMenu = document.querySelector('.theme-menu');
    document.querySelectorAll('[data-theme-set]').forEach(function (b) {
      b.addEventListener('click', function () {
        setThemeMode(b.getAttribute('data-theme-set'));
        if (themeMenu) { themeMenu.open = false; themeMenu.querySelector('summary').focus(); }
      });
    });
    if (themeMenu) {
      document.addEventListener('click', function (e) {
        if (themeMenu.open && !themeMenu.contains(e.target)) themeMenu.open = false;
      });
    }

    var menuBtn = document.querySelector('[data-menu-toggle]');
    if (menuBtn) {
      menuBtn.addEventListener('click', toggleMenu);
      document.querySelectorAll('#site-nav a').forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
      });
    }

    var langMenu = document.querySelector('.lang-menu:not(.theme-menu)');
    if (langMenu) {
      langMenu.querySelectorAll('a[data-lang]').forEach(function (a) {
        a.addEventListener('click', function () { store('preferred_lang', a.getAttribute('data-lang')); });
      });
      document.addEventListener('click', function (e) {
        if (langMenu.open && !langMenu.contains(e.target)) langMenu.open = false;
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (langMenu && langMenu.open) { langMenu.open = false; langMenu.querySelector('summary').focus(); }
      if (themeMenu && themeMenu.open) { themeMenu.open = false; themeMenu.querySelector('summary').focus(); }
      var nav = document.getElementById('site-nav');
      if (nav && nav.classList.contains('active')) { setMenu(false); if (menuBtn) menuBtn.focus(); }
    });

    // Fecha o menu móvel ao voltar para a largura de desktop
    if (window.matchMedia) {
      var mq = window.matchMedia('(min-width: 961px)');
      var onChange = function (ev) { if (ev.matches) setMenu(false); };
      if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
    }

    document.querySelectorAll('[data-year], #year').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    // Efeito de revelação usado nas páginas de exemplo (.reveal / .img-reveal-box)
    var hidden = document.querySelectorAll('.reveal, .img-reveal-box');
    if (hidden.length) {
      if (!('IntersectionObserver' in window)) {
        hidden.forEach(function (el) { el.classList.add('active'); });
      } else {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { en.target.classList.add('active'); obs.unobserve(en.target); }
          });
        }, { threshold: 0.2 });
        hidden.forEach(function (el) { obs.observe(el); });
      }
    }
  });
})();
