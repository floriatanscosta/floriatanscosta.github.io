/* Gerador de assinatura de e-mail (/ferramentas/assinatura/)
   Monta a assinatura em HTML com estilos inline (compatível com clientes de e-mail)
   e a copia como texto formatado (ou como código HTML) para colar no Gmail, Outlook,
   Thunderbird etc. Também exporta uma página em PDF (pela impressão do navegador).
   © 2026 Floriatan Santos Costa. Todos os direitos reservados. Ver LICENSE. */
(function () {
  'use strict';

  // Versão da ferramenta (SemVer). Ao mudar: atualize também o ?v= do <script> em ferramentas/assinatura/index.html,
  // o "Histórico de versões" em ferramentas/assinatura/README.md e o CHANGELOG.md, e crie a tag assinatura-vX.Y.Z.
  var VERSAO = '2.1.0';

  // As imagens da assinatura precisam de URL absoluta para aparecer nos e-mails enviados.
  // Vêm direto do GitHub (raw.githubusercontent.com), que não depende do domínio do site.
  // As imagens ficam como LEGADO no repositório floriatanscosta/web (components/assinatura/assets/);
  // ferramentas/assinatura/assets/ guarda uma cópia. Não renomeie nem mova os arquivos de lá e mantenha
  // aquele repositório público. (components/gerador/, também lá, guarda as imagens das assinaturas até a 2.0.1.)
  var IMG_URL = 'https://raw.githubusercontent.com/floriatanscosta/web/main/components/assinatura/assets/';
  // Logos com fundo branco (legíveis também no modo escuro dos clientes de e-mail).
  // Os logo-N.png transparentes continuam no repositório: assinaturas antigas usam esses arquivos.
  var LOGOS = {
    'logo-ufpr.png': 'UFPR',
    'logo-ufpr-quimica.png': 'UFPR · Departamento de Química',
    'logo-ufpr-laesb.png': 'UFPR · LaESB',
    'logo-ufpr-zaragoza.png': 'UFPR · Universidad de Zaragoza'
  };
  var LOGO_PADRAO = 'logo-ufpr.png';
  // Nomes usados até a versão 2.0.1 (dados salvos no navegador)
  var LOGOS_ANTIGOS = {
    'logo-1-branco.png': 'logo-ufpr.png',
    'logo-2-branco.png': 'logo-ufpr-quimica.png',
    'logo-3-branco.png': 'logo-ufpr-laesb.png',
    'logo-4-branco.png': 'logo-ufpr-zaragoza.png'
  };
  var STORAGE_KEY = 'web.assinatura.v1';

  var $ = function (id) { return document.getElementById(id); };
  var form = $('assinaturaForm');
  var preview = $('preview-container');
  var copyBtn = $('copyBtn');
  var copyHtmlBtn = $('copyHtmlBtn');
  var pdfBtn = $('pdfBtn');
  var lembrar = $('lembrar-dados');
  var modal = $('customModal');
  if (!form || !preview) return;

  /* ---------- utilitários ---------- */

  // Escapa texto digitado pelo usuário antes de inseri-lo no HTML (evita injeção de código)
  function escaparHTML(texto) {
    return String(texto)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function valor(id) { var el = $(id); return el ? el.value.trim() : ''; }

  /* ---------- verificação dos links ---------- */
  // Cada função devolve { url: link normalizado } ou { erro: mensagem }. Campo vazio: { url: '' }.

  // Completa o protocolo e interpreta o endereço; null se não for um link http/https
  function lerURL(texto, protocolo) {
    var u = /^https?:\/\//i.test(texto) ? texto : protocolo + texto.replace(/^\/+/, '');
    try {
      var parsed = new URL(u);
      return (parsed.protocol === 'http:' || parsed.protocol === 'https:') ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  // Site: link http/https com domínio de verdade (ex.: exemplo.com.br)
  function verificarSite(texto) {
    if (!texto) return { url: '' };
    if (/\s/.test(texto)) return { erro: 'O link não pode ter espaços.' };
    // Outro protocolo (mailto:, javascript:, ftp: …); "site.com:8080" não conta
    if (/^[a-z][a-z0-9+.-]*:(?!\d)/i.test(texto) && !/^https?:\/\//i.test(texto)) {
      return { erro: 'Use um link que comece com https:// ou http://.' };
    }
    var u = lerURL(texto, 'https://');
    if (!u) return { erro: 'Isto não é um link válido. Exemplo: https://www.exemplo.com.br' };
    // Usuário/senha no link disfarçam o destino real (ex.: https://banco.com@outro.site)
    if (u.username || u.password) return { erro: 'O link não pode conter usuário ou senha (@).' };
    var partes = u.hostname.split('.');
    var tld = partes[partes.length - 1];
    var rotulosOk = partes.every(function (r) { return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(r); });
    if (partes.length < 2 || !rotulosOk || !/^(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/.test(tld)) {
      return { erro: 'O endereço precisa de um domínio válido. Exemplo: https://www.exemplo.com.br' };
    }
    return { url: u.href };
  }

  // Lattes: http://lattes.cnpq.br/ + 16 dígitos (ou só os 16 dígitos), ou o link
  // do buscatextual com o identificador K (ex.: visualizacv.do?id=K1234567A8)
  function verificarLattes(texto) {
    if (!texto) return { url: '' };
    var padrao = 'Use o formato http://lattes.cnpq.br/0000000000000000.';
    var id = texto.replace(/\s+/g, '');
    if (/^\d{16}$/.test(id)) return { url: 'http://lattes.cnpq.br/' + id };
    var u = lerURL(id, 'http://');
    if (!u) return { erro: padrao };
    var host = u.hostname.replace(/^www\./, '');
    if (host === 'lattes.cnpq.br') {
      var m = u.pathname.match(/^\/(\d{16})\/?$/);
      if (!m) return { erro: 'O identificador Lattes tem 16 dígitos. ' + padrao };
      return { url: 'http://lattes.cnpq.br/' + m[1] };
    }
    if (host === 'buscatextual.cnpq.br' && /^\/buscatextual\/visualizacv\.do$/i.test(u.pathname)) {
      var k = (u.searchParams.get('id') || '').toUpperCase();
      if (/^K\d{7}[A-Z]\d$/.test(k)) return { url: 'http://buscatextual.cnpq.br/buscatextual/visualizacv.do?id=' + k };
      return { erro: 'Identificador K inválido no link do buscatextual. ' + padrao };
    }
    return { erro: 'O link não é do Lattes. ' + padrao };
  }

  // Dígito verificador do ORCID (ISO 7064 MOD 11-2), calculado sobre os 15 primeiros dígitos
  function digitoOrcid(digitos) {
    var total = 0;
    for (var i = 0; i < digitos.length; i++) total = (total + Number(digitos[i])) * 2;
    var resultado = (12 - (total % 11)) % 11;
    return resultado === 10 ? 'X' : String(resultado);
  }

  // ORCID: https://orcid.org/0000-0000-0000-0000 (ou só o identificador), com dígito verificador
  function verificarOrcid(texto) {
    if (!texto) return { url: '' };
    var padrao = 'Use o formato https://orcid.org/0000-0000-0000-0000.';
    var id = texto.replace(/\s+/g, '');
    if (!/^\d{4}-?\d{4}-?\d{4}-?\d{3}[\dXx]$/.test(id)) {
      var u = lerURL(id, 'https://');
      if (!u) return { erro: padrao };
      if (u.hostname.replace(/^www\./, '') !== 'orcid.org') return { erro: 'O link não é do ORCID. ' + padrao };
      id = u.pathname.replace(/^\/+|\/+$/g, '');
      if (!/^\d{4}-?\d{4}-?\d{4}-?\d{3}[\dXx]$/.test(id)) return { erro: 'O identificador ORCID tem 16 caracteres. ' + padrao };
    }
    var limpo = id.replace(/-/g, '').toUpperCase();
    if (digitoOrcid(limpo.slice(0, 15)) !== limpo[15]) {
      return { erro: 'Identificador ORCID inválido: o dígito verificador não confere. Confira o número no seu perfil.' };
    }
    return { url: 'https://orcid.org/' + limpo.replace(/(.{4})(?!$)/g, '$1-') };
  }

  // E-mail: nome@dominio com domínio válido (mesma regra do site)
  function verificarEmail(texto) {
    if (!texto) return { url: '' };
    var m = texto.match(/^([^\s@]+)@([^\s@]+)$/);
    if (!m || /^mailto:/i.test(texto)) return { erro: 'Isto não é um e-mail válido. Exemplo: nome@ufpr.br' };
    if (!/^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+$/.test(m[1]) || /^\.|\.$|\.\./.test(m[1])) {
      return { erro: 'Isto não é um e-mail válido. Exemplo: nome@ufpr.br' };
    }
    if (verificarSite(m[2]).erro || /[\/?#:]/.test(m[2])) return { erro: 'O domínio do e-mail não é válido. Exemplo: nome@ufpr.br' };
    return { url: 'mailto:' + texto, texto: texto };
  }

  // Telefone: 8 a 15 dígitos, com "+" opcional no início; aceita espaços, hífens, pontos e parênteses
  function verificarTelefone(texto) {
    if (!texto) return { url: '' };
    if (!/^\+?[\d\s().-]+$/.test(texto)) return { erro: 'Use só números, espaços, hífens e parênteses. Exemplo: +55 41 3361-0000' };
    var digitos = texto.replace(/\D/g, '');
    if (digitos.length < 8 || digitos.length > 15) return { erro: 'O telefone deve ter de 8 a 15 dígitos. Exemplo: +55 41 3361-0000' };
    return { url: 'tel:' + (texto.charAt(0) === '+' ? '+' : '') + digitos, texto: texto };
  }

  // Campos verificados: devolvem { url } (e { texto } a exibir) ou { erro }
  var VERIFICADORES = {
    'input-email': verificarEmail,
    'input-telefone': verificarTelefone,
    'input-url-web': verificarSite,
    'input-url-lattes': verificarLattes,
    'input-url-orcid': verificarOrcid
  };
  // Campos que o usuário já deixou (o erro só aparece depois disso, para não incomodar durante a digitação)
  var tocados = {};

  function mostrarErro(id, mensagem) {
    var campo = $(id);
    var msg = $('erro-' + id.replace('input-', ''));
    campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
    if (msg) {
      msg.textContent = mensagem || '';
      msg.hidden = !mensagem;
    }
  }

  // Verifica os campos de contato e links; mostra o erro dos campos já visitados
  function verificarLinks() {
    var resultado = { erros: 0 };
    Object.keys(VERIFICADORES).forEach(function (id) {
      var r = VERIFICADORES[id](valor(id));
      if (r.erro) resultado.erros++;
      mostrarErro(id, r.erro && tocados[id] ? r.erro : '');
      resultado[id] = r.erro ? { url: '', texto: '' } : { url: r.url, texto: r.texto || '' };
    });
    // O nome é o único campo obrigatório
    var semNome = !valor('input-nome');
    if (semNome) resultado.erros++;
    mostrarErro('input-nome', semNome && tocados['input-nome'] ? 'Informe o nome que vai aparecer na assinatura.' : '');
    return resultado;
  }

  /* ---------- montagem da assinatura ---------- */

  // Lê o formulário e devolve os dados já verificados (texto sem escape; o escape é feito ao montar o HTML)
  function lerDados() {
    var logo = valor('select-logo');
    // Só aceita os logos conhecidos (o valor do <select> pode ser alterado no navegador)
    if (!Object.prototype.hasOwnProperty.call(LOGOS, logo)) logo = LOGO_PADRAO;
    var links = verificarLinks();
    return {
      logo: logo,
      nome: valor('input-nome'),
      cargo: valor('input-cargo'),
      lab1: valor('input-lab1'),
      inst1: valor('input-inst1'),
      lab2: valor('input-lab2'),
      inst2: valor('input-inst2'),
      email: links['input-email'],
      telefone: links['input-telefone'],
      web: links['input-url-web'].url,
      lattes: links['input-url-lattes'].url,
      orcid: links['input-url-orcid'].url,
      erros: links.erros
    };
  }

  function linha(texto, estilo) {
    return texto ? '<div style="' + estilo + '">' + escaparHTML(texto) + '</div>' : '';
  }

  function montarHTML(d) {
    var FORTE = 'font-size: 12px; color: #1f2937; font-weight: 600; margin-bottom: 1px;';
    var SUAVE = 'font-size: 12px; color: #6b7280; font-weight: 500;';
    var LINK = 'color: #3a4d74; text-decoration: none;';

    // Blocos depois do nome e do cargo, separados por 8 px
    var grupos = [];
    if (d.lab1 || d.inst1) grupos.push(linha(d.lab1, FORTE) + linha(d.inst1, SUAVE));
    if (d.lab2 || d.inst2) grupos.push(linha(d.lab2, FORTE) + linha(d.inst2, SUAVE));
    var contatos = [];
    if (d.email.url) contatos.push('<a href="' + escaparHTML(d.email.url) + '" style="' + LINK + '">' + escaparHTML(d.email.texto) + '</a>');
    if (d.telefone.url) contatos.push('<a href="' + escaparHTML(d.telefone.url) + '" style="' + LINK + '">' + escaparHTML(d.telefone.texto) + '</a>');
    if (contatos.length) grupos.push('<div style="font-size: 12px; color: #4b5563;">' + contatos.join(' &nbsp;·&nbsp; ') + '</div>');
    var corpo = grupos.map(function (g, i) {
      return '\n      <div style="margin-top: ' + (i ? 8 : 0) + 'px;">' + g + '</div>';
    }).join('');

    function icone(url, img, alt, title, ultima) {
      if (!url) return '';
      return '\n          <td style="' + (ultima ? '' : 'padding-right: 12px; ') + 'vertical-align: middle;">' +
        '<a href="' + escaparHTML(url) + '" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: block;">' +
        '<img src="' + IMG_URL + img + '" alt="' + alt + '" title="' + title + '" width="24" height="24" style="width: 24px; height: 24px; display: block; border: 0;">' +
        '</a></td>';
    }
    var ultimo = d.orcid ? 'orcid' : (d.lattes ? 'lattes' : 'web');
    var icones = (d.web || d.lattes || d.orcid) ?
      '\n      <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: ' + (grupos.length || d.cargo ? 14 : 8) + 'px;">\n        <tr>' +
      icone(d.web, 'icone-site.png', 'Site', 'Site', ultimo === 'web') +
      icone(d.lattes, 'icone-lattes.png', 'Lattes', 'Currículo Lattes', ultimo === 'lattes') +
      icone(d.orcid, 'icone-orcid.png', 'ORCID', 'ORCID iD', true) +
      '\n        </tr>\n      </table>' : '';

    return '<table cellpadding="0" cellspacing="0" style="font-family: \'Roboto\', Helvetica, Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.25; max-width: 650px; text-align: left; border-collapse: collapse;">' +
      '\n  <tr>' +
      // O logo já tem fundo branco próprio: continua legível no modo escuro
      '\n    <td style="vertical-align: middle; padding: 0 20px 0 0; width: 120px;">' +
      '\n      <img src="' + IMG_URL + d.logo + '" alt="' + escaparHTML(LOGOS[d.logo]) + '" width="120" style="width: 120px; height: auto; display: block; border: 0;">' +
      '\n    </td>' +
      '\n    <td style="vertical-align: top; width: 2px; background-color: #dfe5f1; padding: 0;"></td>' +
      '\n    <td style="vertical-align: middle; padding-left: 20px;">' +
      (d.nome ? '\n      <div style="font-size: 18px; font-weight: 800; color: #3a4d74; margin-bottom: 2px; letter-spacing: 0.5px;">' + escaparHTML(d.nome) + '</div>' : '') +
      (d.cargo ? '\n      <div style="font-size: 12px; font-weight: 600; color: #4b5563; margin-bottom: ' + (grupos.length ? 12 : 0) + 'px; letter-spacing: 0.5px;">' + escaparHTML(d.cargo) + '</div>' : '') +
      corpo + icones +
      '\n    </td>' +
      '\n  </tr>' +
      '\n</table>';
  }

  // Versão em texto simples (clientes sem HTML e colagem sem formatação): links por extenso
  function montarTexto(d) {
    var l = [d.nome, d.cargo, d.lab1, d.inst1, d.lab2, d.inst2].filter(Boolean);
    if (d.email.url) l.push('E-mail: ' + d.email.texto);
    if (d.telefone.url) l.push('Telefone: ' + d.telefone.texto);
    if (d.web) l.push('Site: ' + d.web);
    if (d.lattes) l.push('Lattes: ' + d.lattes);
    if (d.orcid) l.push('ORCID: ' + d.orcid);
    return l.join('\n');
  }

  var dados = null;
  function atualizarAssinatura() {
    dados = lerDados();
    preview.innerHTML = montarHTML(dados);
    salvarDados();
  }

  /* ---------- dados salvos no navegador (opcional) ---------- */

  var CAMPOS_SALVOS = ['select-logo', 'input-nome', 'input-cargo', 'input-lab1', 'input-inst1', 'input-lab2', 'input-inst2',
    'input-email', 'input-telefone', 'input-url-web', 'input-url-lattes', 'input-url-orcid'];

  // Só grava com a opção marcada; desmarcar apaga o que estava salvo
  function salvarDados() {
    if (!lembrar) return;
    try {
      if (lembrar.checked) {
        var obj = {};
        CAMPOS_SALVOS.forEach(function (id) { obj[id] = $(id).value; });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) { /* armazenamento bloqueado: segue sem salvar */ }
  }

  function carregarDados() {
    var obj = null;
    try { obj = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { obj = null; }
    if (!obj || typeof obj !== 'object') return;
    CAMPOS_SALVOS.forEach(function (id) {
      if (typeof obj[id] !== 'string') return;
      var v = obj[id];
      if (id === 'select-logo') {
        if (Object.prototype.hasOwnProperty.call(LOGOS_ANTIGOS, v)) v = LOGOS_ANTIGOS[v];
        // Logo desconhecido ou adulterado: mantém o padrão
        if (!Object.prototype.hasOwnProperty.call(LOGOS, v)) return;
      }
      $(id).value = v.slice(0, 500);
    });
    if (lembrar) lembrar.checked = true;
  }

  /* ---------- modal ---------- */

  var lastFocus = null;
  function showModal(title, message) {
    if (!modal) { window.alert(title + '\n' + message); return; }
    $('modalTitle').textContent = title;
    $('modalMessage').textContent = message;
    lastFocus = document.activeElement;
    modal.hidden = false;
    modal.classList.add('active');
    var ok = modal.querySelector('.btn');
    if (ok) ok.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    modal.querySelectorAll('[data-modal-close]').forEach(function (b) { b.addEventListener('click', closeModal); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  }

  /* ---------- copiar ---------- */

  // Método antigo (seleção + execCommand): funciona em mais clientes, inclusive fora de HTTPS
  function copiarPorSelecao(node) {
    var sel = window.getSelection();
    var range = document.createRange();
    range.selectNode(node);
    sel.removeAllRanges();
    sel.addRange(range);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    sel.removeAllRanges();
    return ok;
  }

  function sucesso(msg) {
    showModal('Sucesso!', msg || 'A assinatura foi copiada para a área de transferência. Agora é só colar (Ctrl+V) nas configurações do seu cliente de e-mail; veja "Como instalar" abaixo.');
  }
  function erro(err) {
    if (err) console.error('Erro ao copiar', err);
    showModal('Erro', 'Não foi possível copiar. Tente novamente!');
  }

  // Antes de copiar ou exportar: mostra todos os erros; com nome vazio ou dado inválido, para
  function prontoParaUsar() {
    Object.keys(VERIFICADORES).concat('input-nome').forEach(function (id) { tocados[id] = true; });
    atualizarAssinatura();
    if (dados.erros) {
      showModal('Confira os dados', 'Há campos a corrigir, destacados no formulário. Preencha o nome e corrija ou apague os campos com erro.');
      return false;
    }
    return true;
  }

  function copiarAssinatura() {
    if (!prontoParaUsar()) return;
    var tabela = preview.querySelector('table');
    if (!tabela) return;
    // Preferência: API moderna, copiando como HTML (formatação) + texto simples com os links
    if (navigator.clipboard && window.ClipboardItem && window.isSecureContext) {
      var item = new window.ClipboardItem({
        'text/html': new Blob([tabela.outerHTML], { type: 'text/html' }),
        'text/plain': new Blob([montarTexto(dados)], { type: 'text/plain' })
      });
      navigator.clipboard.write([item]).then(function () { sucesso(); }, function (err) {
        if (copiarPorSelecao(tabela)) sucesso(); else erro(err);
      });
    } else if (copiarPorSelecao(tabela)) {
      sucesso();
    } else {
      erro();
    }
  }

  // Copia o código HTML como texto (Thunderbird, Apple Mail e outros que aceitam colar HTML)
  function copiarHTML() {
    if (!prontoParaUsar()) return;
    var codigo = '<!-- Assinatura gerada em floriatan.com.br/ferramentas/assinatura/ (v' + VERSAO + ') -->\n' + montarHTML(dados);
    var ok = function () { sucesso('O código HTML da assinatura foi copiado. Cole-o no campo de assinatura em HTML do seu cliente de e-mail; veja "Como instalar" abaixo.'); };
    var fallback = function (err) {
      var t = document.createElement('textarea');
      t.value = codigo;
      t.setAttribute('readonly', '');
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      var feito = false;
      try { feito = document.execCommand('copy'); } catch (e) { feito = false; }
      document.body.removeChild(t);
      if (feito) ok(); else erro(err);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(codigo).then(ok, fallback);
    else fallback();
  }

  /* ---------- exportar em PDF ---------- */

  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto) e.textContent = texto;
    return e;
  }

  // Monta uma folha A4 só com a assinatura e os dados, e abre a impressão do navegador
  // ("Salvar como PDF"). Não usa biblioteca externa: nada sai do navegador.
  function exportarPDF() {
    if (!prontoParaUsar()) return;
    var antiga = document.getElementById('print-sheet');
    if (antiga) antiga.remove();

    var folha = el('div', 'print-sheet');
    folha.id = 'print-sheet';
    var topo = el('div', 'print-sheet__head');
    topo.appendChild(el('p', 'print-sheet__eyebrow', 'Assinatura de e-mail'));
    topo.appendChild(el('h1', 'print-sheet__title', dados.nome));
    if (dados.cargo) topo.appendChild(el('p', 'print-sheet__sub', dados.cargo));
    folha.appendChild(topo);

    folha.appendChild(el('h2', 'print-sheet__h2', 'Assinatura'));
    var caixa = el('div', 'print-sheet__box');
    caixa.innerHTML = montarHTML(dados);   // mesmo HTML da pré-visualização (já escapado)
    folha.appendChild(caixa);

    folha.appendChild(el('h2', 'print-sheet__h2', 'Dados'));
    var lista = el('dl', 'print-sheet__list');
    function item(rotulo, texto, href) {
      if (!texto) return;
      lista.appendChild(el('dt', '', rotulo));
      var dd = el('dd');
      if (href) {
        var a = el('a', '', texto);
        a.href = href;
        dd.appendChild(a);
      } else {
        dd.textContent = texto;
      }
      lista.appendChild(dd);
    }
    item('Nome', dados.nome);
    item('Cargo ou título', dados.cargo);
    item('Laboratório', dados.lab1);
    item('Instituição', dados.inst1);
    item('Laboratório', dados.lab2);
    item('Instituição', dados.inst2);
    item('E-mail', dados.email.texto, dados.email.url);
    item('Telefone', dados.telefone.texto, dados.telefone.url);
    item('Site', dados.web, dados.web);
    item('Currículo Lattes', dados.lattes, dados.lattes);
    item('ORCID', dados.orcid, dados.orcid);
    folha.appendChild(lista);

    var hoje = new Date().toLocaleDateString('pt-BR');
    folha.appendChild(el('p', 'print-sheet__foot',
      'Gerada em ' + hoje + ' em floriatan.com.br/ferramentas/assinatura/ (versão ' + VERSAO + '). Para usar no e-mail, abra a página, preencha os dados e use “Copiar assinatura”.'));
    document.body.appendChild(folha);

    // O título da página vira o nome sugerido do arquivo PDF
    var tituloOriginal = document.title;
    document.title = 'Assinatura de e-mail - ' + dados.nome;
    document.body.classList.add('print-signature');
    var limpar = function () {
      document.body.classList.remove('print-signature');
      document.title = tituloOriginal;
      folha.remove();
      window.removeEventListener('afterprint', limpar);
    };
    window.addEventListener('afterprint', limpar);
    window.print();
  }

  /* ---------- eventos ---------- */

  // "input" também dispara em <select>; "change" redesenharia duas vezes
  form.addEventListener('input', atualizarAssinatura);
  // Ao sair de um campo verificado, passa a mostrar o erro dele
  form.addEventListener('focusout', function (e) {
    if (VERIFICADORES[e.target.id] || e.target.id === 'input-nome') {
      tocados[e.target.id] = true;
      verificarLinks();
    }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  if (copyBtn) copyBtn.addEventListener('click', copiarAssinatura);
  if (copyHtmlBtn) copyHtmlBtn.addEventListener('click', copiarHTML);
  if (pdfBtn) pdfBtn.addEventListener('click', exportarPDF);

  // Compatibilidade com chamadas antigas (ex.: onclick="copiarAssinatura()")
  window.copiarAssinatura = copiarAssinatura;
  window.closeModal = closeModal;

  var versaoEl = $('versao-ferramenta');
  if (versaoEl) versaoEl.textContent = VERSAO;

  carregarDados();
  atualizarAssinatura();
})();
