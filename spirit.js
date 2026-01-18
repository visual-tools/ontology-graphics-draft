
import * as THREE from 'three';

// Vertex Shader
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Fragment Shader (Smoke/Fluid effect)
const fragmentShader = `
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec2 iMouse;
    varying vec2 vUv;

    // Simplex noise function
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    void main() {
        vec2 uv = vUv;
        
        // Fluid distortion based on time
        float t = iTime * 0.2;
        
        // Layered noise for smoke texture
        float n1 = snoise(uv * 3.0 + vec2(t * 0.5, t * 1.0));
        float n2 = snoise(uv * 6.0 - vec2(t * 0.2, t * 0.8));
        float n3 = snoise(uv * 12.0 + vec2(t * 0.1, t * 0.3));
        
        float finalNoise = n1 * 0.5 + n2 * 0.25 + n3 * 0.125;
        
        // Distort UVs slightly with mouse interaction? (Simple version: just time)
        
        // Color mapping
        vec3 colorBg = vec3(0.02, 0.02, 0.06); // Dark blue/black
        vec3 colorSpirit = vec3(0.0, 0.95, 1.0); // Cyan/Teal
        vec3 colorSmoke = vec3(0.6, 0.2, 0.8); // Purple hint
        
        // Mask: Make it look like a wisp in the center-ish or based on noise intensity
        float alpha = smoothstep(0.2, 0.8, finalNoise + 0.5);
        
        // Mix colors
        vec3 col = mix(colorBg, colorSpirit, alpha * 0.6);
        col = mix(col, colorSmoke, n2 * 0.5);
        
        // Vignette / fade edges
        float d = distance(uv, vec2(0.5));
        col *= smoothstep(0.8, 0.2, d);

        // Alpha fade
        float opacity = smoothstep(0.8, 0.2, d) * (0.1 + alpha * 0.4);

        gl_FragColor = vec4(col, opacity);
    }
`;

export class SpiritEffect {
    constructor(elementId) {
        this.container = document.body; // Append to body to overlay

        // Create canvas overlay
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.pointerEvents = 'none'; // Click through
        this.renderer.domElement.style.zIndex = '9999';
        this.renderer.domElement.style.opacity = '0'; // Hidden by default
        this.renderer.domElement.style.transition = 'opacity 1s ease';
        this.renderer.domElement.id = 'spirit-canvas';
        this.container.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const geometry = new THREE.PlaneGeometry(2, 2);
        this.uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            iMouse: { value: new THREE.Vector2(0, 0) }
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);

        this.clock = new THREE.Clock();
        this.active = false;

        this.animate = this.animate.bind(this);
        this.animate();

        window.addEventListener('resize', this.onResize.bind(this));
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate);
        if (this.active) {
            this.uniforms.iTime.value = this.clock.getElapsedTime();
            this.renderer.render(this.scene, this.camera);
        }
    }

    show() {
        this.active = true;
        this.renderer.domElement.style.opacity = '1';
    }

    hide() {
        this.renderer.domElement.style.opacity = '0';
        // Keep active true briefly for fade out, but strict optimization:
        setTimeout(() => { if (this.renderer.domElement.style.opacity === '0') this.active = false; }, 1000);
    }
}

// Auto-initialize when imported if configured? 
// Or let the consumer instantiate it.
