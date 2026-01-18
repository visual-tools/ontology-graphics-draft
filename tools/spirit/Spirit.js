
import * as THREE from 'three';
import { GUI } from 'https://unpkg.com/dat.gui@0.7.9/build/dat.gui.module.js';

// --------------------------------------------------------------------------------
// SHADERS
// --------------------------------------------------------------------------------

// src/glsl/helpers/simplexNoiseDerivatives4.glsl
const shader_snoise4 = `
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
float permute(float x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float taylorInvSqrt(float r) { return 1.79284291400159 - 0.85373472095314 * r; }

vec4 grad4(float j, vec4 ip) {
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;
    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
    return p;
}

#define F4 0.309016994374947451

vec4 simplexNoiseDerivatives (vec4 v) {
    const vec4  C = vec4( 0.138196601125011,0.276393202250021,0.414589803375032,-0.447213595499958);
    vec4 i  = floor(v + dot(v, vec4(F4)) );
    vec4 x0 = v -   i + dot(i, C.xxxx);
    vec4 i0;
    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;
    i = mod289(i);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));
    vec3 values0 = vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2));
    vec2 values1 = vec2(dot(p3, x3), dot(p4, x4));
    vec3 m0 = max(0.5 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.5 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);
    vec3 temp0 = -6.0 * m0 * m0 * values0;
    vec2 temp1 = -6.0 * m1 * m1 * values1;
    vec3 mmm0 = m0 * m0 * m0;
    vec2 mmm1 = m1 * m1 * m1;
    float dx = temp0[0] * x0.x + temp0[1] * x1.x + temp0[2] * x2.x + temp1[0] * x3.x + temp1[1] * x4.x + mmm0[0] * p0.x + mmm0[1] * p1.x + mmm0[2] * p2.x + mmm1[0] * p3.x + mmm1[1] * p4.x;
    float dy = temp0[0] * x0.y + temp0[1] * x1.y + temp0[2] * x2.y + temp1[0] * x3.y + temp1[1] * x4.y + mmm0[0] * p0.y + mmm0[1] * p1.y + mmm0[2] * p2.y + mmm1[0] * p3.y + mmm1[1] * p4.y;
    float dz = temp0[0] * x0.z + temp0[1] * x1.z + temp0[2] * x2.z + temp1[0] * x3.z + temp1[1] * x4.z + mmm0[0] * p0.z + mmm0[1] * p1.z + mmm0[2] * p2.z + mmm1[0] * p3.z + mmm1[1] * p4.z;
    float dw = temp0[0] * x0.w + temp0[1] * x1.w + temp0[2] * x2.w + temp1[0] * x3.w + temp1[1] * x4.w + mmm0[0] * p0.w + mmm0[1] * p1.w + mmm0[2] * p2.w + mmm1[0] * p3.w + mmm1[1] * p4.w;
    return vec4(dx, dy, dz, dw) * 49.0;
}
`;

// src/glsl/helpers/curl4.glsl
const shader_curl4 = `
${shader_snoise4}
vec3 curl( in vec3 p, in float noiseTime, in float persistence ) {
    vec4 xNoisePotentialDerivatives = vec4(0.0);
    vec4 yNoisePotentialDerivatives = vec4(0.0);
    vec4 zNoisePotentialDerivatives = vec4(0.0);
    for (int i = 0; i < 3; ++i) {
        float twoPowI = pow(2.0, float(i));
        float scale = 0.5 * twoPowI * pow(persistence, float(i));
        xNoisePotentialDerivatives += simplexNoiseDerivatives(vec4(p * twoPowI, noiseTime)) * scale;
        yNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p + vec3(123.4, 129845.6, -1239.1)) * twoPowI, noiseTime)) * scale;
        zNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((p + vec3(-9519.0, 9051.0, -123.0)) * twoPowI, noiseTime)) * scale;
    }
    return vec3(
        zNoisePotentialDerivatives[1] - yNoisePotentialDerivatives[2],
        xNoisePotentialDerivatives[2] - zNoisePotentialDerivatives[0],
        yNoisePotentialDerivatives[0] - xNoisePotentialDerivatives[1]
    );
}
`;

// src/glsl/quad.vert
const shader_quad_vert = `
attribute vec3 position;
varying vec2 vUv;
void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4( position, 1.0 );
}
`;

// src/glsl/through.frag
const shader_through_frag = `
uniform vec2 resolution;
uniform sampler2D texture;
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = texture2D( texture, uv );
}
`;

// src/glsl/position.frag
const shader_position_frag = `
uniform vec2 resolution;
uniform sampler2D texturePosition;
uniform sampler2D textureDefaultPosition;
uniform float time;
uniform float speed;
uniform float dieSpeed;
uniform float radius;
uniform float curlSize;
uniform float attraction;
uniform float initAnimation;
uniform vec3 mouse3d;

${shader_curl4}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    vec4 positionInfo = texture2D( texturePosition, uv );
    
    if (dot(positionInfo, positionInfo) == 0.0 || isnan(positionInfo.x)) {
        positionInfo = texture2D( textureDefaultPosition, uv );
    }

    vec3 position = mix(vec3(0.0, -200.0, 0.0), positionInfo.xyz, smoothstep(0.0, 0.3, initAnimation));
    float life = positionInfo.a - dieSpeed;
    
    // Animate follow position: 0 -> -200 -> mouse
    vec3 followPosition = mix(vec3(0.0, -(1.0 - initAnimation) * 200.0, 0.0), mouse3d, smoothstep(0.2, 0.7, initAnimation));

    if(life < 0.0) {
        positionInfo = texture2D( textureDefaultPosition, uv );
        position = positionInfo.xyz * (1.0 + sin(time * 15.0) * 0.2 + (1.0 - initAnimation)) * 0.4 * radius;
        position += followPosition;
        life = 0.5 + fract(positionInfo.w * 21.4131 + time);
    } else {
        vec3 delta = followPosition - position;
        position += delta * (0.005 + life * 0.01) * attraction * (1.0 - smoothstep(50.0, 350.0, length(delta))) * speed;
        position += curl(position * curlSize, time, 0.1 + (1.0 - life) * 0.1) * speed;
    }
    gl_FragColor = vec4(position, life);
}
`;

// src/glsl/particles.vert
const shader_particles_vert = `
uniform sampler2D texturePosition;
attribute vec2 isoUV; 
varying float vLife;

void main() {
    vec4 positionInfo = texture2D( texturePosition, isoUV );
    vLife = positionInfo.w;
    
    vec3 pos = positionInfo.xyz;
    
    vec4 mvPosition = viewMatrix * modelMatrix * vec4( pos, 1.0 );
    
    float dist = length(mvPosition.xyz);
    float size = 1200.0 / max(dist, 1.0); 
    
    gl_PointSize = clamp(size * smoothstep(0.0, 0.2, vLife), 0.0, 60.0);
    gl_Position = projectionMatrix * mvPosition;
}
`;

// src/glsl/particles.frag
const shader_particles_frag = `
varying float vLife;
uniform vec3 color1;
uniform vec3 color2;

void main() {
    if (vLife <= 0.01) discard;

    vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
    if (dot(circCoord, circCoord) > 1.0) discard;
    
    float alpha = 1.0 - dot(circCoord, circCoord);
    alpha = pow(alpha, 2.0);

    vec3 outgoingLight = mix(color2, color1, smoothstep(0.0, 0.7, vLife));
    
    gl_FragColor = vec4( outgoingLight, alpha * 0.8 );
}
`;


// --------------------------------------------------------------------------------
// CONFIG & CLASSES
// --------------------------------------------------------------------------------

const SETTINGS = {
    amount: '65k',
    simulatorTextureWidth: 256,
    simulatorTextureHeight: 256,
    dieSpeed: 0.015,
    radius: 0.6,
    curlSize: 0.02,
    attraction: 1.0,
    color1: '#00f2ff', // Cyan
    color2: '#7b00ff', // Purple
    bgColor: '#050510',
    speed: 1.0
};

const TEXTURE_WIDTH = SETTINGS.simulatorTextureWidth;
const TEXTURE_HEIGHT = SETTINGS.simulatorTextureHeight;
const AMOUNT = TEXTURE_WIDTH * TEXTURE_HEIGHT;

class Simulator {
    constructor(renderer) {
        this.renderer = renderer;
        this.renderer.autoClear = false;

        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        this.camera.position.z = 1;

        const rawShaderPrefix = 'precision highp float;\n';

        this.copyShader = new THREE.RawShaderMaterial({
            uniforms: {
                resolution: { value: new THREE.Vector2(TEXTURE_WIDTH, TEXTURE_HEIGHT) },
                texture: { value: null }
            },
            vertexShader: rawShaderPrefix + shader_quad_vert,
            fragmentShader: rawShaderPrefix + shader_through_frag
        });

        this.positionShader = new THREE.RawShaderMaterial({
            uniforms: {
                resolution: { value: new THREE.Vector2(TEXTURE_WIDTH, TEXTURE_HEIGHT) },
                texturePosition: { value: null },
                textureDefaultPosition: { value: null },
                mouse3d: { value: new THREE.Vector3() },
                speed: { value: SETTINGS.speed },
                dieSpeed: { value: SETTINGS.dieSpeed },
                radius: { value: SETTINGS.radius },
                curlSize: { value: SETTINGS.curlSize },
                attraction: { value: SETTINGS.attraction },
                time: { value: 0 },
                initAnimation: { value: 0 } // Starts at 0, animates to 1
            },
            vertexShader: rawShaderPrefix + shader_quad_vert,
            fragmentShader: rawShaderPrefix + shader_position_frag,
            blending: THREE.NoBlending,
            depthWrite: false,
            depthTest: false
        });

        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.copyShader);
        this.scene.add(this.mesh);

        // Fallback for types
        const type = (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) ? THREE.HalfFloatType : THREE.FloatType;

        this.positionRenderTarget = new THREE.WebGLRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: type,
            depthBuffer: false,
            stencilBuffer: false
        });

        this.positionRenderTarget2 = this.positionRenderTarget.clone();

        const TextureDefaultPosition = this.createPositionTexture(type);
        this.copyTexture(TextureDefaultPosition, this.positionRenderTarget);
        this.copyTexture(this.positionRenderTarget, this.positionRenderTarget2);

        this.positionShader.uniforms.textureDefaultPosition.value = TextureDefaultPosition;
    }

    createPositionTexture(type) {
        const data = new Float32Array(AMOUNT * 4);
        for (let i = 0; i < AMOUNT; i++) {
            const i4 = i * 4;
            const r = (0.5 + Math.random() * 0.5) * 50;
            const phi = (Math.random() - 0.5) * Math.PI;
            const theta = Math.random() * Math.PI * 2;

            data[i4 + 0] = r * Math.cos(theta) * Math.cos(phi);
            data[i4 + 1] = r * Math.sin(phi);
            data[i4 + 2] = r * Math.sin(theta) * Math.cos(phi);
            data[i4 + 3] = Math.random();
        }
        const texture = new THREE.DataTexture(data, TEXTURE_WIDTH, TEXTURE_HEIGHT, THREE.RGBAFormat, type);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.needsUpdate = true;
        return texture;
    }

    copyTexture(input, output) {
        this.mesh.material = this.copyShader;
        this.copyShader.uniforms.texture.value = input;
        this.renderer.setRenderTarget(output);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
    }

    update(dt, time, mouse3d) {
        const tmp = this.positionRenderTarget;
        this.positionRenderTarget = this.positionRenderTarget2;
        this.positionRenderTarget2 = tmp;

        this.mesh.material = this.positionShader;
        this.positionShader.uniforms.texturePosition.value = this.positionRenderTarget2.texture;
        this.positionShader.uniforms.time.value += dt;
        if (mouse3d) this.positionShader.uniforms.mouse3d.value.copy(mouse3d);

        // Update settings from interactive GUI
        this.positionShader.uniforms.speed.value = SETTINGS.speed;
        this.positionShader.uniforms.dieSpeed.value = SETTINGS.dieSpeed;
        this.positionShader.uniforms.radius.value = SETTINGS.radius;
        this.positionShader.uniforms.curlSize.value = SETTINGS.curlSize;
        this.positionShader.uniforms.attraction.value = SETTINGS.attraction;

        // Intro animation
        if (this.positionShader.uniforms.initAnimation.value < 1) {
            this.positionShader.uniforms.initAnimation.value += dt * 0.5;
        }

        this.renderer.setRenderTarget(this.positionRenderTarget);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
    }
}

class Particles {
    constructor(renderer, simulator) {
        this.renderer = renderer;
        this.simulator = simulator;
        this.container = new THREE.Object3D();

        const uvData = new Float32Array(AMOUNT * 2);
        const positionData = new Float32Array(AMOUNT * 3);

        for (let i = 0; i < AMOUNT; i++) {
            const i2 = i * 2;
            const i3 = i * 3;
            uvData[i2 + 0] = ((i % TEXTURE_WIDTH) + 0.5) / TEXTURE_WIDTH;
            uvData[i2 + 1] = (Math.floor(i / TEXTURE_WIDTH) + 0.5) / TEXTURE_HEIGHT;
            positionData[i3] = 0; positionData[i3 + 1] = 0; positionData[i3 + 2] = 0;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('isoUV', new THREE.BufferAttribute(uvData, 2));
        geometry.setAttribute('position', new THREE.BufferAttribute(positionData, 3));

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                texturePosition: { value: null },
                color1: { value: new THREE.Color(SETTINGS.color1) },
                color2: { value: new THREE.Color(SETTINGS.color2) }
            },
            vertexShader: shader_particles_vert,
            fragmentShader: shader_particles_frag,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Points(geometry, this.material);
        this.mesh.frustumCulled = false;
        this.container.add(this.mesh);
    }

    update() {
        this.material.uniforms.texturePosition.value = this.simulator.positionRenderTarget.texture;
        this.material.uniforms.color1.value.set(SETTINGS.color1);
        this.material.uniforms.color2.value.set(SETTINGS.color2);
    }
}

export class SpiritEffect {
    constructor(container) {
        this.container = container;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(SETTINGS.bgColor); // Use setting
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 3000);
        this.camera.position.set(0, 0, 450);

        this.simulator = new Simulator(this.renderer);
        this.particles = new Particles(this.renderer, this.simulator);
        this.scene.add(this.particles.container);

        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2(0, 0);
        this.mouse3d = new THREE.Vector3(0, 0, 0);
        this.raycaster = new THREE.Raycaster();
        this.textPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));

        this.initGUI();

        this.animate = this.animate.bind(this);
        this.animate();
    }

    initGUI() {
        const gui = new GUI();
        gui.domElement.style.userSelect = 'none';

        const folder = gui.addFolder('Simulator');
        folder.open();
        folder.add(SETTINGS, 'speed', 0, 5).name('Speed');
        folder.add(SETTINGS, 'dieSpeed', 0.001, 0.1).name('Die Speed');
        folder.add(SETTINGS, 'radius', 0.1, 4.0).name('Radius');
        folder.add(SETTINGS, 'curlSize', 0.001, 0.1).name('Curl Size');
        folder.add(SETTINGS, 'attraction', -2, 2).name('Attraction');

        const renderFolder = gui.addFolder('Rendering');
        renderFolder.open();
        renderFolder.addColor(SETTINGS, 'color1').name('Color Core');
        renderFolder.addColor(SETTINGS, 'color2').name('Color Fade');
        renderFolder.addColor(SETTINGS, 'bgColor').name('Background').onChange(v => {
            this.renderer.setClearColor(v);
        });
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / this.width) * 2 - 1;
        this.mouse.y = -(e.clientY / this.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const target = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(this.textPlane, target);
        if (target) {
            this.mouse3d.copy(target);
        }
    }

    animate() {
        requestAnimationFrame(this.animate);

        const dt = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        this.simulator.update(dt, time, this.mouse3d);
        this.particles.update();

        this.renderer.render(this.scene, this.camera);
    }
}
