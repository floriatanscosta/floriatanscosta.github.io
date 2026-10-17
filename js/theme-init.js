/* Aplica o tema antes da renderização para evitar o "piscar" de cor */
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) t = 'dark';
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  } catch (e) { /* armazenamento indisponível: mantém o tema claro */ }
})();
