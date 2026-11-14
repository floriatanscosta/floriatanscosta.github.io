/* Calculadora de fluidodinâmica para ICP-MS (/ferramentas/fluidodinamica/)
   Volume interno, velocidade linear, tempo de residência e número de Reynolds
   de uma câmara de nebulização cilíndrica.
   © 2026 Floriatan Santos Costa. Todos os direitos reservados. Ver LICENSE. */
(function () {
  'use strict';

  // Propriedades físicas dos gases a 25 °C e 1 atm (densidade em kg/m³, viscosidade em Pa·s)
  var GAS = {
    argon: { density: 1.66, viscosity: 2.26e-5 },
    helium: { density: 0.166, viscosity: 1.96e-5 },
    nitrogen: { density: 1.16, viscosity: 1.78e-5 }
  };
  var RE_LAMINAR = 2000;   // abaixo: laminar
  var RE_TURBULENT = 4000; // acima: turbulento

  var $ = function (id) { return document.getElementById(id); };
  var form = $('calcForm');
  if (!form) return;

  // Lê um número com valor mínimo (evita NaN, negativos e divisão por zero)
  function num(id, min, fallback) {
    var v = parseFloat($(id).value);
    return Math.max(min, isFinite(v) ? v : fallback);
  }

  function calculateDynamics() {
    var gas = GAS[$('gasType').value] || GAS.argon;
    var qNeb = num('nebFlow', 0, 0);
    var qAux = num('auxFlow', 0, 0);
    var dia = num('chamberDia', 0.1, 1);   // mm (mínimo 0,1 para não dividir por zero)
    var len = num('chamberLen', 0, 0);     // mm

    // Geometria
    var radiusCm = dia / 2 / 10;
    var lengthCm = len / 10;
    var volumeMl = Math.PI * radiusCm * radiusCm * lengthCm;          // cm³ = mL

    // Vazões
    var qTotalLmin = qNeb + qAux;
    var qTotalCm3s = (qTotalLmin * 1000) / 60;                         // cm³/s
    var qTotalM3s = qTotalLmin / 60000;                                // m³/s
    var diaM = dia / 1000;
    var areaM2 = Math.PI * Math.pow(diaM / 2, 2);

    var velocity = qTotalM3s / areaM2;                                 // m/s
    var residenceMs = qTotalCm3s > 0 ? (volumeMl / qTotalCm3s) * 1000 : 0;
    var reynolds = (gas.density * velocity * diaM) / gas.viscosity;  // Re = ρ·v·D/μ

    $('resVolume').textContent = volumeMl.toFixed(2) + ' mL';
    $('resVelocity').textContent = velocity.toFixed(3) + ' m/s';
    $('resTime').textContent = Math.round(residenceMs) + ' ms';
    $('resReynolds').textContent = Math.round(reynolds);

    // Regime de fluxo
    var badge = $('flowStatus');
    badge.className = 'status-badge';
    if (reynolds < RE_LAMINAR) {
      badge.textContent = 'Fluxo laminar seguro';
      badge.classList.add('laminar');
    } else if (reynolds <= RE_TURBULENT) {
      badge.textContent = 'Zona de transição (risco)';
      badge.classList.add('transicao');
    } else {
      badge.textContent = 'Fluxo turbulento (perda de amostra)';
      badge.classList.add('turbulento');
    }
  }

  // "input" também dispara em <select>; "change" recalcularia duas vezes
  form.addEventListener('input', calculateDynamics);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  calculateDynamics();
})();
