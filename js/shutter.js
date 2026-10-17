/* shutter.js — fundo em WebGL (persianas iluminadas pelo cursor) da página Design.
   Desenha apenas quando o mouse se move ou a janela muda de tamanho. */
(function () {
  'use strict';
  var canvas = document.getElementById('shutter-bg');
  if (!canvas) return;
  var gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) { canvas.classList.add('no-webgl'); return; }

  var mouseX = 0.5, mouseY = 0.5, pending = false;
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  var vsSource = 'attribute vec2 position; void main(){ gl_Position = vec4(position, 0.0, 1.0); }';
  var fsSource = [
    'precision mediump float;',
    'uniform vec2 u_resolution; uniform vec2 u_mouse;',
    'void main(){',
    '  vec2 st = gl_FragCoord.xy / u_resolution.xy;',
    '  float aspect = u_resolution.x / u_resolution.y;',
    '  st.x *= aspect;',
    '  vec2 mouse = vec2(u_mouse.x * aspect, u_mouse.y);',
    '  float spotlight = smoothstep(0.5, 0.0, distance(st, mouse));',
    '  float angle = 0.4;',
    '  vec2 t = vec2(st.x * cos(angle) - st.y * sin(angle), st.x * sin(angle) + st.y * cos(angle));',
    '  float p = fract(t.y * 35.0 + spotlight * 0.2);',
    '  float edge = smoothstep(0.0, 0.1, p) * smoothstep(1.0, 0.8, p);',
    '  float shadow = smoothstep(0.0, 0.5, p) * 0.5 + 0.5;',
    '  vec3 c1 = vec3(0.40, 0.44, 0.89); vec3 c2 = vec3(0.82, 0.24, 0.53); vec3 c3 = vec3(0.06, 0.35, 0.51);',
    '  vec3 grad = mix(mix(c1, c2, st.y), c3, sin(st.x * 2.0));',
    '  vec3 darkBg = vec3(0.08, 0.09, 0.12);',
    '  gl_FragColor = vec4(mix(darkBg, grad * edge * shadow, spotlight * 1.2), 1.0);',
    '}'
  ].join('\n');

  function shader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }
  var program = gl.createProgram();
  gl.attachShader(program, shader(gl.VERTEX_SHADER, vsSource));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { canvas.classList.add('no-webgl'); return; }
  gl.useProgram(program);

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var pos = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  var uRes = gl.getUniformLocation(program, 'u_resolution');
  var uMouse = gl.getUniformLocation(program, 'u_mouse');

  function draw() {
    pending = false;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function request() { if (!pending) { pending = true; requestAnimationFrame(draw); } }
  function resize() {
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    request();
  }
  window.addEventListener('resize', resize);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    window.addEventListener('pointermove', function (e) {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - e.clientY / window.innerHeight;
      request();
    }, { passive: true });
  }
  resize();
})();
