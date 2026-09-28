const canvas = document.getElementById('shutter-bg');
const gl = canvas.getContext('webgl');

// Redimensionamento
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resize);
resize();

let mouseX = 0.5, mouseY = 0.5;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = 1.0 - (e.clientY / window.innerHeight);
});

const vsSource = `
    attribute vec2 position;
    void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fsSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;

    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        st.x *= aspect;
        vec2 mouse = vec2(u_mouse.x * aspect, u_mouse.y);

        // Spotlight
        float dist = distance(st, mouse);
        float spotlight = smoothstep(0.5, 0.0, dist);

        // Inclinação e cálculo das persianas
        float angle = 0.4;
        vec2 tiltedSt = vec2(st.x * cos(angle) - st.y * sin(angle), st.x * sin(angle) + st.y * cos(angle));
        
        float blindsCount = 35.0;
        float lift = spotlight * 0.2; 
        float blindPattern = fract(tiltedSt.y * blindsCount + lift);
        float slatEdge = smoothstep(0.0, 0.1, blindPattern) * smoothstep(1.0, 0.8, blindPattern);
        float shadow = smoothstep(0.0, 0.5, blindPattern) * 0.5 + 0.5;
        // Gradiente
        vec3 color1 = vec3(0.40, 0.44, 0.89); // #666fe4
        vec3 color2 = vec3(0.82, 0.24, 0.53); // #d13c86
        vec3 color3 = vec3(0.06, 0.35, 0.51); // #0f5883
        vec3 grad = mix(color1, color2, st.y);
        grad = mix(grad, color3, sin(st.x * 2.0));
        // Cor base escura
        vec3 darkBg = vec3(0.08, 0.09, 0.12);
        vec3 finalColor = mix(darkBg, grad * slatEdge * shadow, spotlight * 1.2);
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

const program = gl.createProgram();
gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
gl.linkProgram(program);
gl.useProgram(program);

const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const u_resolution = gl.getUniformLocation(program, "u_resolution");
const u_mouse = gl.getUniformLocation(program, "u_mouse");
const u_time = gl.getUniformLocation(program, "u_time");

function render(time) {
    gl.uniform2f(u_resolution, canvas.width, canvas.height);
    gl.uniform2f(u_mouse, mouseX, mouseY);
    gl.uniform1f(u_time, time * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);