/* Aplica o tema antes da renderização para evitar o "piscar" de cor.
   Modos: "light" (claro), "dark" (escuro) ou "system" (segue o sistema operacional).
   A escolha fica no localStorage ("theme"); sem escolha salva, o modo é "system".
   <html data-theme-mode="..."> guarda o modo; <html data-theme="dark"> liga as cores escuras. */
(function () {
  var root = document.documentElement;
  var mode = 'system';
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') mode = saved;
  } catch (e) { /* armazenamento indisponível: segue o sistema */ }
  var dark = mode === 'dark' ||
    (mode === 'system' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.setAttribute('data-theme-mode', mode);
  if (dark) root.setAttribute('data-theme', 'dark');
})();
