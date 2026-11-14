/* Custom Plate Design XML Generator (/ferramentas/custom-plate/)
   Generates the HPDDPlate XML for the Tecan Uno Dispenser, draws a
   to-scale preview of the droplet grid on the glass slide and exports
   both, with the settings, to PDF (through the browser print dialog).
   © 2026 Floriatan Santos Costa. Todos os direitos reservados. Ver LICENSE. */
(function () {
  'use strict';

  /* ---------- limits and drawing constants ---------- */
  var MAX_TOTAL_DROPLETS = 1536;   // absolute limit
  var MAX_ROWS_SPAN_MM = 41;       // usable physical span (rows)
  var MAX_COLS_SPAN_MM = 24.5;     // usable physical span (cols)
  var SCALE = 6;                   // 1 mm = 6 px in the preview
  var SLIDE_WIDTH_MM = 30;         // background SVG size
  var SLIDE_HEIGHT_MM = 80;
  // Glass area drawn in slide.svg (26 x 76 mm slide; the frosted label starts at 58 mm)
  var GLASS = { left: 2, right: 28, top: 2, bottom: 58 };
  // Where A1 Offset X/Y = (0, 0) falls on the preview. Calibrated so the default
  // offsets (X -1.35, Y 8) put A1 at 4 mm x 15 mm, centering the default 20 x 12 grid.
  var ORIGIN_X_MM = 5.35;
  var ORIGIN_Y_MM = 7;
  var DROP_SIZES = { small: 2, medium: 4, large: 6 };
  var NUMERIC_FIELDS = ['rows', 'cols', 'rowpitch', 'colpitch', 'a1offsetx', 'a1offsety', 'defaultassayvolume', 'horizontaloffset'];

  var $ = function (id) { return document.getElementById(id); };
  var form = $('plateForm');
  if (!form) return;

  var inputs = form.querySelectorAll('input, select');
  var xmlOutput = $('xmlOutput');
  var dropletGrid = $('dropletGrid');
  var glassSlide = $('glassSlide');
  var gridWarning = $('gridWarning');
  var gridNotice = $('gridNotice');
  var gridInfo = $('gridInfo');
  var idText = $('idText');
  var displayTotal = $('displayTotalDroplets');
  var modal = $('customModal');
  var hasError = false;

  /* ---------- helpers ---------- */

  // Escapes values written into the XML (prevents broken/injected markup)
  function escapeXml(unsafe) {
    return String(unsafe).replace(/[<>&'"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c];
    });
  }

  // Safe file name: keeps letters, numbers, dot, dash and underscore
  function safeFileName(name) {
    var clean = String(name).trim().replace(/[^\w.\-]+/g, '_').replace(/^_+|_+$/g, '');
    return clean || 'HPDDPlate';
  }

  // Formats millimetres for the preview text (up to 2 decimals, no trailing zeros)
  function mm(value) {
    return String(Math.round(value * 100) / 100);
  }

  function showWarning(message) {
    hasError = true;
    gridWarning.textContent = message;
    gridWarning.hidden = false;
    gridNotice.hidden = true;
    gridInfo.textContent = '';
    dropletGrid.replaceChildren();
    xmlOutput.value = '<!-- Fix configuration errors to generate XML -->';
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
  window.closeModal = closeModal; // compatibility with old onclick attributes

  /* ---------- main update ---------- */

  function updateApp() {
    // Invalid or empty field: do not keep an outdated XML on screen
    if (!form.checkValidity()) {
      var bad = form.querySelector(':invalid');
      var label = bad && form.querySelector('label[for="' + bad.id + '"]');
      var name = label ? label.textContent.replace('ⓘ', '').trim() : 'a field';
      showWarning('Warning: invalid value in "' + name + '". ' + (bad && bad.validationMessage ? bad.validationMessage : ''));
      return;
    }

    var plateId = $('plateId').value.trim();
    if (!plateId) {
      showWarning('Warning: "ID / Name" cannot be empty.');
      return;
    }

    // Numbers are written in plain form ("2.0" -> "2", "1e1" -> "10") so the instrument reads them
    var data = {};
    inputs.forEach(function (input) {
      var value = input.value.trim();
      if (NUMERIC_FIELDS.indexOf(input.id) !== -1) value = String(Number(value));
      data[input.id] = escapeXml(value);
    });

    var rows = Number(data.rows);
    var cols = Number(data.cols);
    var rowPitch = Number(data.rowpitch);
    var colPitch = Number(data.colpitch);
    var offsetX = Number(data.a1offsetx);
    var offsetY = Number(data.a1offsety);
    var totalDroplets = rows * cols;

    idText.textContent = plateId;
    displayTotal.textContent = totalDroplets;

    // Safety limits: absolute droplet count first, then physical span for the chosen pitch
    var maxRowsAllowed = Math.floor(MAX_ROWS_SPAN_MM / rowPitch) + 1;
    var maxColsAllowed = Math.floor(MAX_COLS_SPAN_MM / colPitch) + 1;
    if (totalDroplets > MAX_TOTAL_DROPLETS) {
      showWarning('Warning: Absolute limit exceeded. Max total droplets is ' + MAX_TOTAL_DROPLETS + ' (Current: ' + totalDroplets + ').');
      return;
    }
    if (rows > maxRowsAllowed) {
      showWarning('Warning: Physical limit exceeded. For a Row pitch of ' + rowPitch + ' mm, maximum allowed rows is ' + maxRowsAllowed + ' (Max span: ' + MAX_ROWS_SPAN_MM + ' mm).');
      return;
    }
    if (cols > maxColsAllowed) {
      showWarning('Warning: Physical limit exceeded. For a Col pitch of ' + colPitch + ' mm, maximum allowed cols is ' + maxColsAllowed + ' (Max span: ' + MAX_COLS_SPAN_MM + ' mm).');
      return;
    }
    hasError = false;
    gridWarning.hidden = true;

    /* XML */
    xmlOutput.value =
      '<?xml version="1.0" encoding="utf-8"?>\n' +
      '<HPDDPlate>\n' +
      '  <id>' + data.plateId + '</id>\n' +
      '  <name>' + data.plateId + '</name>\n' +
      '  <rows>' + data.rows + '</rows>\n' +
      '  <cols>' + data.cols + '</cols>\n' +
      '  <rowpitch>' + data.rowpitch + '</rowpitch>\n' +
      '  <colpitch>' + data.colpitch + '</colpitch>\n' +
      '  <a1offsetx>' + data.a1offsetx + '</a1offsetx>\n' +
      '  <a1offsety>' + data.a1offsety + '</a1offsety>\n' +
      '  <defaultassayvolume>' + data.defaultassayvolume + '</defaultassayvolume>\n' +
      '  <shaketype>' + data.shaketype + '</shaketype>\n' +
      '  <shakedefault>' + data.shakedefault + '</shakedefault>\n' +
      '  <moveaccel>' + data.moveaccel + '</moveaccel>\n' +
      '  <customa1>' + data.customa1 + '</customa1>\n' +
      '  <nozzlemask>' + data.nozzlemask + '</nozzlemask>\n' +
      '  <horizontaloffset>' + data.horizontaloffset + '</horizontaloffset>\n' +
      '</HPDDPlate>';

    /* Preview (to scale): A1 Offset X/Y move the whole grid on the slide */
    var rowPitchPx = rowPitch * SCALE;
    var colPitchPx = colPitch * SCALE;
    var a1X = ORIGIN_X_MM + offsetX;            // center of A1 on the slide image (mm)
    var a1Y = ORIGIN_Y_MM + offsetY;
    var spanX = (cols - 1) * colPitch;          // distance between the first and last centers
    var spanY = (rows - 1) * rowPitch;
    glassSlide.style.width = (SLIDE_WIDTH_MM * SCALE) + 'px';
    glassSlide.style.height = (SLIDE_HEIGHT_MM * SCALE) + 'px';
    // Aligned by the center of the first cell
    dropletGrid.style.left = (a1X * SCALE - colPitchPx / 2) + 'px';
    dropletGrid.style.top = (a1Y * SCALE - rowPitchPx / 2) + 'px';
    dropletGrid.style.gridTemplateRows = 'repeat(' + rows + ', ' + rowPitchPx + 'px)';
    dropletGrid.style.gridTemplateColumns = 'repeat(' + cols + ', ' + colPitchPx + 'px)';

    gridInfo.textContent = 'A1 at X ' + mm(a1X) + ' mm, Y ' + mm(a1Y) + ' mm on the slide · grid span ' +
      mm(spanX) + ' x ' + mm(spanY) + ' mm (center to center).';

    // Not an error (the XML is still valid), but the droplets would miss the glass
    var outside = a1X < GLASS.left || a1X + spanX > GLASS.right || a1Y < GLASS.top || a1Y + spanY > GLASS.bottom;
    gridNotice.textContent = outside
      ? 'Notice: part of the grid falls outside the glass slide. Check A1 Offset X/Y, the pitch and the number of rows/cols.'
      : '';
    gridNotice.hidden = !outside;

    // The droplet never grows beyond its cell (small pitches)
    var dropSizePx = Math.max(1, Math.min(DROP_SIZES[$('dropletsize').value] || DROP_SIZES.medium, colPitchPx - 1, rowPitchPx - 1));
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < totalDroplets; i++) {
      var cell = document.createElement('div');
      cell.className = 'droplet-cell';
      cell.style.width = colPitchPx + 'px';
      cell.style.height = rowPitchPx + 'px';
      var drop = document.createElement('div');
      drop.className = i === 0 ? 'droplet droplet--a1' : 'droplet';
      drop.style.width = dropSizePx + 'px';
      drop.style.height = dropSizePx + 'px';
      cell.appendChild(drop);
      fragment.appendChild(cell);
    }
    dropletGrid.replaceChildren(fragment);
  }

  /* ---------- copy & download ---------- */

  function copyFallback() {
    xmlOutput.focus();
    xmlOutput.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    window.getSelection().removeAllRanges();
    return ok;
  }

  $('copyBtn').addEventListener('click', function () {
    if (hasError) {
      showModal('Error', 'Please resolve the matrix configuration limits before copying.');
      return;
    }
    var done = function () { showModal('Success', 'XML code has been copied with success!'); };
    var fail = function (err) {
      if (err) console.error(err);
      showModal('Error', 'Failed to copy text. Check your browser permissions.');
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(xmlOutput.value).then(done, function (err) {
        if (copyFallback()) done(); else fail(err);
      });
    } else if (copyFallback()) {
      done();
    } else {
      fail();
    }
  });

  $('downloadBtn').addEventListener('click', function () {
    // Prevents downloading an invalid file
    if (hasError) {
      showModal('Error', 'Please resolve the matrix configuration limits before downloading.');
      return;
    }
    var blob = new Blob([xmlOutput.value], { type: 'application/xml' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = safeFileName($('plateId').value) + '.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });

  // "input" also fires for <select> in current browsers; "change" would redraw twice
  /* ---------- export PDF ---------- */

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text) e.textContent = text;
    return e;
  }

  // Field label without the tooltip icon
  function labelOf(input) {
    var label = form.querySelector('label[for="' + input.id + '"]');
    if (!label) return input.id;
    var copy = label.cloneNode(true);
    copy.querySelectorAll('.custom-tooltip').forEach(function (t) { t.remove(); });
    return copy.textContent.trim();
  }

  // Builds an A4 sheet with the slide preview, the settings and the XML, then opens
  // the print dialog ("Save as PDF"). No external library: nothing leaves the browser.
  function exportPdf() {
    if (hasError) {
      showModal('Error', 'Please resolve the matrix configuration limits before exporting.');
      return;
    }
    var old = document.getElementById('print-sheet');
    if (old) old.remove();

    var plateId = $('plateId').value.trim();
    var sheet = el('div', 'print-sheet print-sheet--plate');
    sheet.id = 'print-sheet';
    sheet.setAttribute('lang', 'en');

    var head = el('div', 'print-sheet__head');
    head.appendChild(el('p', 'print-sheet__eyebrow', 'Custom Plate Design · Tecan Uno Dispenser'));
    head.appendChild(el('h1', 'print-sheet__title', plateId));
    head.appendChild(el('p', 'print-sheet__sub', displayTotal.textContent + ' droplets · ' + $('rows').value + ' rows x ' + $('cols').value + ' cols'));
    sheet.appendChild(head);

    var grid = el('div', 'print-sheet__plate');
    // Preview: copy of the slide drawn on screen (same scale, 1 mm = 6 px)
    var fig = el('div', 'print-sheet__slide');
    fig.appendChild(el('h2', 'print-sheet__h2', 'Plate preview'));
    var slide = glassSlide.cloneNode(true);
    slide.removeAttribute('id');
    slide.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
    fig.appendChild(slide);
    fig.appendChild(el('p', 'print-sheet__note', gridInfo.textContent));
    if (!gridNotice.hidden) fig.appendChild(el('p', 'print-sheet__warn', gridNotice.textContent));
    fig.appendChild(el('p', 'print-sheet__note', 'Highlighted droplet: A1. Scale of the preview: 1 mm = 6 px on screen.'));
    grid.appendChild(fig);

    // Settings: every field, with the XML element it fills
    var settings = el('div', 'print-sheet__settings');
    settings.appendChild(el('h2', 'print-sheet__h2', 'Settings'));
    var table = el('table', 'print-sheet__table');
    var thead = el('thead');
    var hr = el('tr');
    ['Parameter', 'Value', 'XML element'].forEach(function (t) { hr.appendChild(el('th', '', t)); });
    thead.appendChild(hr);
    table.appendChild(thead);
    var tbody = el('tbody');
    inputs.forEach(function (input) {
      var tr = el('tr');
      var value = input.tagName === 'SELECT' ? input.options[input.selectedIndex].text : input.value.trim();
      tr.appendChild(el('td', '', labelOf(input)));
      tr.appendChild(el('td', '', value));
      var xmlName = input.id === 'plateId' ? '<id>, <name>' : (input.id === 'dropletsize' ? 'preview only' : '<' + input.id + '>');
      tr.appendChild(el('td', 'print-sheet__mono', xmlName));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    settings.appendChild(table);
    // XML under the settings, so everything fits on one A4 page
    settings.appendChild(el('h2', 'print-sheet__h2', 'XML (' + safeFileName(plateId) + '.xml)'));
    settings.appendChild(el('pre', 'print-sheet__code', xmlOutput.value));
    grid.appendChild(settings);
    sheet.appendChild(grid);

    var today = new Date().toLocaleDateString('en-GB');
    sheet.appendChild(el('p', 'print-sheet__foot',
      'Generated on ' + today + ' at floriatan.com.br/ferramentas/custom-plate/. Always check the plate in the instrument software before dispensing.'));
    document.body.appendChild(sheet);

    // The page title becomes the suggested PDF file name
    var originalTitle = document.title;
    document.title = 'Custom Plate - ' + safeFileName(plateId);
    document.body.classList.add('print-plate');
    var cleanup = function () {
      document.body.classList.remove('print-plate');
      document.title = originalTitle;
      sheet.remove();
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
  }

  $('pdfBtn').addEventListener('click', exportPdf);

  inputs.forEach(function (input) { input.addEventListener('input', updateApp); });
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  // Initial render with the default values
  updateApp();
})();
