"use client";

import { useEffect, useRef } from 'react';

export default function AuroraBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        if (!canvas) return;

        // Sync the WebGL drawing-buffer size with the CSS-driven layout size.
        function syncSize() {
            const w = canvas.clientWidth || 1280;
            const h = canvas.clientHeight || 720;
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
        }

        let resizeObserver: ResizeObserver;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(syncSize);
            resizeObserver.observe(canvas);
        }
        syncSize();

        const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;
        if (!gl) return;

        const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

        const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;
    
    // Smooth moving noise
    float t = u_time * 0.15;
    vec2 p1 = uv * 3.0 + vec2(sin(t), cos(t)) * 0.5;
    vec2 p2 = uv * 5.0 - vec2(cos(t * 0.8), sin(t * 1.2)) * 0.3;
    
    float n = noise(floor(p1)) * 0.5 + noise(floor(p2)) * 0.5;
    
    // Wave motion
    float wave = sin(uv.x * 2.0 + u_time * 0.5) * 0.1;
    wave += sin(uv.y * 1.5 - u_time * 0.3) * 0.1;
    
    // Aurora colors (Cyan, Blue, Violet)
    vec3 color1 = vec3(0.0, 0.94, 1.0); // Cyan
    vec3 color2 = vec3(0.1, 0.2, 0.9);  // Blue
    vec3 color3 = vec3(0.6, 0.0, 1.0);  // Violet
    
    float intensity = smoothstep(0.3, 0.7, uv.y + wave + n * 0.2);
    vec3 aurora = mix(color2, color1, intensity);
    aurora = mix(aurora, color3, sin(uv.x * 3.0 + u_time) * 0.5 + 0.5);
    
    // Vignette and Depth
    float dist = length(uv - 0.5);
    float vignette = 1.0 - smoothstep(0.4, 1.2, dist);
    
    // Interaction
    float mDist = length(uv - mouse);
    float glow = smoothstep(0.2, 0.0, mDist) * 0.3;
    
    vec3 finalColor = aurora * intensity * 0.4 + glow * color1;
    finalColor *= vignette;
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

        function cs(type: number, src: string) {
            const s = gl.createShader(type);
            if (!s) return null;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        }

        const prog = gl.createProgram();
        if (!prog) return;
        
        const vertexShader = cs(gl.VERTEX_SHADER, vs);
        const fragmentShader = cs(gl.FRAGMENT_SHADER, fs);
        if (vertexShader) gl.attachShader(prog, vertexShader);
        if (fragmentShader) gl.attachShader(prog, fragmentShader);
        
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

        const pos = gl.getAttribLocation(prog, 'a_position');
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(prog, 'u_time');
        const uRes = gl.getUniformLocation(prog, 'u_resolution');
        const uMouse = gl.getUniformLocation(prog, 'u_mouse');

        let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            if (rect.width && rect.height) {
                const nx = (event.clientX - rect.left) / rect.width;
                const ny = 1.0 - (event.clientY - rect.top) / rect.height;
                mouse.x = nx * canvas.width;
                mouse.y = ny * canvas.height;
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        let animationFrameId: number;

        function render(t: number) {
            if (typeof ResizeObserver === 'undefined') syncSize();
            gl.viewport(0, 0, canvas.width, canvas.height);
            if (uTime) gl.uniform1f(uTime, t * 0.001);
            if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
            if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationFrameId = requestAnimationFrame(render);
        }
        
        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none" style={{ display: 'block' }}>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}