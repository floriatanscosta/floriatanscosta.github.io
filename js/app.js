/* app.js — interações comuns a todas as páginas (menu, tema, idioma, rodapé). */
(function () {
  'use strict';
  var root = document.documentElement;

  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignora */ } }
  function isDark() { return root.getAttribute('data-theme') === 'dark'; }

  /* ---------- Tema claro/escuro ---------- */
  function syncThemeButtons() {
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
  function toggleTheme() {
    if (isDark()) { root.removeAttribute('data-theme'); store('theme', 'light'); }
    else { root.setAttribute('data-theme', 'dark'); store('theme', 'dark'); }
    syncThemeButtons();
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
  window.toggleMenu = toggleMenu;
  window.switchLanguage = switchLanguage;

  document.addEventListener('DOMContentLoaded', function () {
    syncThemeButtons();

    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.addEventListener('click', toggleTheme);
    });

    var menuBtn = document.querySelector('[data-menu-toggle]');
    if (menuBtn) {
      menuBtn.addEventListener('click', toggleMenu);
      document.querySelectorAll('#site-nav a').forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
      });
    }

    var langMenu = document.querySelector('.lang-menu');
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
