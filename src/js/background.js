/* ============================================================
   BACKGROUND.JS — HIGH-FIDELITY ENGINE (Visibility Optimized)
   Batura Library | Shader Sync v10.0
   ============================================================ */

(function() {
    const canvas = document.getElementById('liquid-bg-canvas');
    if (!canvas) return;

    // Оптимизированный забор токенов
    const getToken = (name) => {
        const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return val || "#000000"; // Fallback к черному
    };

    // Синхронизируем темы с новыми SCSS токенами
    const themeColors = [
        [new THREE.Color(getToken('--p-blue-deep')),   new THREE.Color(getToken('--p-blue-solid'))],
        [new THREE.Color(getToken('--p-purple-deep')), new THREE.Color(getToken('--p-purple-solid'))],
        [new THREE.Color(getToken('--p-green-deep')),  new THREE.Color(getToken('--p-green-solid'))],
        [new THREE.Color(getToken('--p-red-deep')),    new THREE.Color(getToken('--p-red-solid'))]
    ];

    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true, 
        alpha: false // Нам не нужна прозрачность самого канваса, если ClearColor черный
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Оптимизация для Retina
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 1); 
    
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    let targetC1 = themeColors[0][0].clone();
    let targetC2 = themeColors[0][1].clone();

    // Shader Source (Твой оригинальный Dithering и Snoise сохранены)
    const fragmentShader = `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform vec2 u_res;
        uniform vec3 u_color1;
        uniform vec3 u_color2;

        float random(vec2 co) { return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324, 0.366025, -0.577350, 0.024390);
            vec2 i = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            vec3 p = mod( (( (vec3(i.y + vec3(0.0, i1.y, 1.0))*34.0)+1.0)*vec3(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0) )*34.0+1.0, 289.0);
            vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
            m = m*m; m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.792842 - 0.853734 * (a0*a0 + h*h);
            vec3 g;
            g.x = a0.x * x0.x + h.x * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_res.xy;
            float ratio = u_res.x / u_res.y;
            vec2 centeredUV = (uv - 0.5) * vec2(ratio, 1.0);
            vec2 mouseUV = (u_mouse - 0.5) * vec2(ratio, 1.0);
            
            float dist = distance(centeredUV, mouseUV);
            float mask = smoothstep(1.5, 0.0, dist); 
            
            float n = snoise(centeredUV * 0.7 - u_time * 0.015);
            n += snoise(centeredUV * 1.3 + u_time * 0.025) * 0.2;
            
            float colorFlow = clamp(0.4 + n * 0.3, 0.0, 1.0);
            vec3 color = mix(u_color1, u_color2, colorFlow);
            
            float intensity = pow(mask, 1.8) * (n * 0.3 + 0.7) * 1.2;
            vec3 finalColor = color * (intensity + 0.008);
            
            // Grain (Dithering)
            finalColor += random(uv) / 180.0;
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    const uniforms = {
        u_time: { value: 0 },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_color1: { value: themeColors[0][0].clone() },
        u_color2: { value: themeColors[0][1].clone() }
    };

    const material = new THREE.ShaderMaterial({ uniforms, fragmentShader });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let tMouse = new THREE.Vector2(0.5, 0.5), cMouse = new THREE.Vector2(0.5, 0.5);
    window.addEventListener('mousemove', e => {
        tMouse.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    });

    window.updateBgTheme = (index) => {
        if (themeColors[index]) {
            targetC1.copy(themeColors[index][0]);
            targetC2.copy(themeColors[index][1]);
        }
    };

    function resize() {
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h);
        uniforms.u_res.value.set(w, h);
    }
    window.addEventListener('resize', resize);
    resize();

    function animate(t) {
        if (document.hidden) {
            requestAnimationFrame(animate);
            return;
        }

        const dx = tMouse.x - cMouse.x, dy = tMouse.y - cMouse.y;
        cMouse.x += dx * 0.04; 
        cMouse.y += dy * 0.04;
        
        uniforms.u_mouse.value.copy(cMouse);
        uniforms.u_time.value = t * 0.001;
        
        // Плавный переход между темами
        uniforms.u_color1.value.lerp(targetC1, 0.04);
        uniforms.u_color2.value.lerp(targetC2, 0.04);
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();