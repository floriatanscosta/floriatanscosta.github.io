/* Nome da ferramenta (/ferramentas/nome-da-ferramenta/)
   Descreva em uma ou duas linhas o que o script calcula ou gera.
   © 2026 Floriatan Santos Costa. Todos os direitos reservados. Ver LICENSE. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var form = $('appForm');
  if (!form) return;

  // Escapa texto digitado pelo usuário antes de inseri-lo no HTML (evita injeção de código)
  function escaparHTML(texto) {
    return String(texto)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function atualizar() {
    $('saida').innerHTML = escaparHTML($('entrada').value.trim());
  }

  form.addEventListener('input', atualizar);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  atualizar();
})();
