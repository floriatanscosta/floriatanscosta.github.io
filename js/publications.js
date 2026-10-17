/* Filtro de publicações (texto livre, sem distinção de acentos/maiúsculas). */
(function () {
  'use strict';
  var input = document.querySelector('[data-pub-filter]');
  if (!input) return;
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-pub-year] [data-pub-item]'));
  var years = document.querySelectorAll('[data-pub-year]');
  var count = document.querySelector('[data-pub-count]');
  var empty = document.querySelector('[data-pub-empty]');
  var tpl = count ? count.getAttribute('data-tpl') : '';
  var norm = function (s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var index = items.map(function (li) {
    var year = li.closest('[data-pub-year]').querySelector('h3').textContent;
    return norm(li.textContent + ' ' + year);
  });

  function apply() {
    var terms = norm(input.value.trim()).split(/\s+/).filter(Boolean);
    var shown = 0;
    items.forEach(function (li, i) {
      var ok = terms.every(function (t) { return index[i].indexOf(t) !== -1; });
      li.hidden = !ok;
      if (ok) shown++;
    });
    years.forEach(function (sec) {
      sec.hidden = !sec.querySelector('[data-pub-item]:not([hidden])');
    });
    if (count) count.textContent = tpl.replace('{n}', shown).replace('{t}', items.length);
    if (empty) empty.hidden = shown !== 0;
  }

  var timer;
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(apply, 120); });
  var q = new URLSearchParams(window.location.search).get('q');
  if (q) { input.value = q; apply(); }
})();
