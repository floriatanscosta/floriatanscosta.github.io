/* Página Design (/design): copia o código hexadecimal de uma cor da paleta.
   Os botões "Copiar" ficam ocultos no HTML e só aparecem quando este script roda. */
(function () {
  'use strict';
  var status = document.querySelector('.ds-status');
  var buttons = document.querySelectorAll('.ds-copy[data-copy]');
  if (!buttons.length) return;

  function announce(text) {
    if (!status) return;
    status.textContent = '';
    window.setTimeout(function () { status.textContent = text; }, 30);
  }

  // Alternativa para navegadores sem a API de área de transferência (ou fora de HTTPS)
  function copyFallback(text) {
    var t = document.createElement('textarea');
    t.value = text;
    t.setAttribute('readonly', '');
    t.className = 'visually-hidden';
    document.body.appendChild(t);
    t.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(t);
    return ok;
  }

  function done(btn, ok) {
    var hex = btn.getAttribute('data-copy');
    if (!ok) { announce(status ? status.getAttribute('data-failed') : ''); return; }
    announce((status ? status.getAttribute('data-copied') : '') + ' ' + hex);
    btn.classList.add('is-done');
    window.setTimeout(function () { btn.classList.remove('is-done'); }, 1600);
  }

  buttons.forEach(function (btn) {
    btn.hidden = false;
    btn.addEventListener('click', function () {
      var hex = btn.getAttribute('data-copy');
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(hex).then(function () { done(btn, true); }, function () { done(btn, copyFallback(hex)); });
      } else {
        done(btn, copyFallback(hex));
      }
    });
  });
})();
