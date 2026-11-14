/* Página "Vida de cientista" (/vida)
   - barra de progresso da leitura e indicador lateral dos capítulos
   - revelação dos blocos ao rolar ([data-reveal])
   - parallax suave ([data-parallax="fator"])
   - inclinação 3D das imagens ao passar o mouse
   - apresentação automática quando um capítulo tem 2+ imagens (.v-slides)
   - galeria em movimento contínuo com botão de pausa e imagem ampliada
   Respeita "prefers-reduced-motion": sem parallax, inclinação nem movimento automático. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  root.classList.add('v-js');

  /* ---------- revelação ao rolar ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  // Pequeno atraso em cascata entre os blocos de texto de um mesmo capítulo
  document.querySelectorAll('.v-text').forEach(function (box) {
    box.querySelectorAll('[data-reveal]').forEach(function (el, i) { el.style.setProperty('--d', (0.08 * i + 0.1) + 's'); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        (e.target._vReveal || e.target).classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) {
      // As imagens começam recortadas (clip-path), o que impede o observador de "vê-las":
      // por isso observamos o capítulo inteiro e revelamos a imagem quando ele aparece
      if (el.classList.contains('v-media') && el.closest('.v-chapter')) {
        var ch = el.closest('.v-chapter');
        ch._vReveal = el;
        io.observe(ch);
      } else {
        io.observe(el);
      }
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- progresso, indicador lateral e parallax ---------- */
  var bar = document.querySelector('.v-progress span');
  var rail = document.querySelector('.v-rail');
  var railDots = rail ? rail.querySelectorAll('span') : [];
  var chapters = document.querySelectorAll('.v-chapter');
  var story = document.querySelector('.v-story');
  var parallax = document.querySelectorAll('[data-parallax]');
  var ticking = false;

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');

    // Capítulo atual: o último cujo topo já passou do meio da tela
    if (rail && story) {
      var r = story.getBoundingClientRect();
      rail.classList.toggle('is-visible', r.top < vh * 0.5 && r.bottom > vh * 0.5);
      var current = -1;
      chapters.forEach(function (c, i) { if (c.getBoundingClientRect().top < vh * 0.5) current = i; });
      railDots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }

    if (reduce.matches) return;
    parallax.forEach(function (el) {
      var box = el.getBoundingClientRect();
      if (box.bottom < -200 || box.top > vh + 200) return;
      var offset = (box.top + box.height / 2) - vh / 2;   // distância do centro da tela
      var factor = parseFloat(el.getAttribute('data-parallax')) || 0;
      el.style.setProperty('--py', (offset * factor).toFixed(1) + 'px');
    });
  }
  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  reduce.addEventListener && reduce.addEventListener('change', function () {
    if (reduce.matches) parallax.forEach(function (el) { el.style.removeProperty('--py'); });
    onScroll();
  });
  update();

  /* ---------- inclinação 3D das imagens ---------- */
  document.querySelectorAll('.v-media').forEach(function (media) {
    var slides = media.querySelector('.v-slides');
    if (!slides) return;
    media.addEventListener('pointermove', function (e) {
      if (reduce.matches || !finePointer.matches) return;
      var b = media.getBoundingClientRect();
      var x = (e.clientX - b.left) / b.width - 0.5;
      var y = (e.clientY - b.top) / b.height - 0.5;
      slides.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
      slides.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
    });
    media.addEventListener('pointerleave', function () {
      slides.style.setProperty('--ry', '0deg');
      slides.style.setProperty('--rx', '0deg');
    });
  });

  /* ---------- apresentação automática (2+ imagens no capítulo) ---------- */
  var SLIDE_MS = 5000;
  document.querySelectorAll('.v-slides').forEach(function (box, n) {
    var imgs = box.querySelectorAll('.v-slide');
    if (imgs.length < 2) return;
    box.classList.add('is-slideshow');
    var idx = 0, timer = null, paused = reduce.matches, visible = false;

    var controls = document.createElement('div');
    controls.className = 'v-controls';
    var dots = document.createElement('div');
    dots.className = 'v-controls__dots';
    var dotEls = [];
    imgs.forEach(function (img, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'v-dot';
      b.setAttribute('aria-label', 'Mostrar imagem ' + (i + 1) + ' de ' + imgs.length);
      b.addEventListener('click', function () { show(i); restart(); });
      dots.appendChild(b);
      dotEls.push(b);
    });
    var pause = document.createElement('button');
    pause.type = 'button';
    pause.className = 'v-pause';
    pause.addEventListener('click', function () { paused = !paused; label(); restart(); });
    controls.appendChild(dots);
    controls.appendChild(pause);
    box.parentNode.appendChild(controls);

    function label() {
      pause.textContent = paused ? 'Reproduzir' : 'Pausar';
      pause.setAttribute('aria-label', (paused ? 'Reproduzir' : 'Pausar') + ' a apresentação de imagens');
    }
    function show(i) {
      idx = (i + imgs.length) % imgs.length;
      imgs.forEach(function (img, k) {
        img.classList.toggle('is-current', k === idx);
        // Só a imagem visível é anunciada pelos leitores de tela
        if (k === idx) img.removeAttribute('aria-hidden'); else img.setAttribute('aria-hidden', 'true');
      });
      dotEls.forEach(function (d, k) { d.setAttribute('aria-current', k === idx ? 'true' : 'false'); });
    }
    function restart() {
      window.clearInterval(timer);
      timer = null;
      if (!paused && visible) timer = window.setInterval(function () { show(idx + 1); }, SLIDE_MS);
    }
    // Só anda quando o capítulo está na tela
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; restart(); }, { threshold: 0.3 }).observe(box);
    } else { visible = true; }
    box.addEventListener('mouseenter', function () { window.clearInterval(timer); timer = null; });
    box.addEventListener('mouseleave', restart);
    label();
    show(0);
    restart();
  });

  /* ---------- galeria em movimento contínuo ---------- */
  var marquee = document.querySelector('[data-marquee]');
  var toggle = document.querySelector('[data-marquee-toggle]');
  var track = marquee && marquee.querySelector('.v-marquee__track');
  var items = track ? Array.prototype.slice.call(track.children) : [];

  function setupMarquee() {
    if (!track || items.length < 2 || track.querySelector('[data-clone]')) return;
    // Cópia da lista para o movimento ser contínuo (escondida de leitores de tela e do teclado)
    items.forEach(function (li) {
      var c = li.cloneNode(true);
      c.setAttribute('data-clone', '');
      c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('button').forEach(function (b) { b.tabIndex = -1; });
      track.appendChild(c);
    });
    track.style.setProperty('--v-duration', Math.max(30, items.length * 9) + 's');
    marquee.classList.add('is-running');
    if (toggle) toggle.hidden = false;
  }
  function teardownMarquee() {
    if (!track) return;
    track.querySelectorAll('[data-clone]').forEach(function (c) { c.remove(); });
    marquee.classList.remove('is-running', 'is-paused');
    if (toggle) toggle.hidden = true;
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var p = marquee.classList.toggle('is-paused');
      toggle.setAttribute('aria-pressed', p ? 'true' : 'false');
      toggle.textContent = p ? 'Retomar galeria' : 'Pausar galeria';
    });
  }
  if (!reduce.matches) setupMarquee();
  reduce.addEventListener && reduce.addEventListener('change', function () { if (reduce.matches) teardownMarquee(); else setupMarquee(); });

  /* ---------- impressão: carrega antes as imagens que ainda não apareceram na tela ---------- */
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('main img[loading="lazy"]').forEach(function (img) { img.loading = 'eager'; });
  });

  /* ---------- imagem ampliada ---------- */
  var lb = document.querySelector('.v-lightbox');
  if (lb && typeof lb.showModal === 'function' && track) {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('figcaption');
    var current = 0;
    var opener = null;
    function originals() { return Array.prototype.slice.call(track.querySelectorAll('li:not([data-clone]) img')); }
    function open(i) {
      var list = originals();
      current = (i + list.length) % list.length;
      var src = list[current];
      lbImg.src = src.currentSrc || src.src;
      lbImg.alt = src.alt;
      lbImg.width = src.naturalWidth || src.width;
      lbImg.height = src.naturalHeight || src.height;
      lbCap.textContent = src.alt + ' (' + (current + 1) + ' de ' + list.length + ')';
      if (!lb.open) lb.showModal();
    }
    track.addEventListener('click', function (e) {
      var btn = e.target.closest('.v-thumb');
      if (!btn) return;
      var li = btn.closest('li');
      var all = Array.prototype.slice.call(track.children);
      var i = all.indexOf(li) % items.length;   // cópias apontam para a imagem original
      opener = li.hasAttribute('data-clone') ? items[i].querySelector('button') : btn;
      open(i);
    });
    lb.addEventListener('click', function (e) {
      var act = e.target.closest('[data-lb]');
      if (act) {
        var a = act.getAttribute('data-lb');
        if (a === 'close') lb.close(); else open(current + (a === 'next' ? 1 : -1));
      } else if (e.target === lb) {
        lb.close();   // clique fora da imagem
      }
    });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') open(current + 1);
      else if (e.key === 'ArrowLeft') open(current - 1);
    });
    lb.addEventListener('close', function () { if (opener) opener.focus(); });
  }
})();
