
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// Scene Setup
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);
scene.fog = new THREE.FogExp2(0x050510, 0.035);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 15, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
scene.add(dirLight);

const pointLight = new THREE.PointLight(0x00ff9d, 0.8, 50);
pointLight.position.set(-5, 5, -5);
scene.add(pointLight);

// --- ADVANCED DATA MODEL ---
const layers = [
    {
        name: "Governance & Strategy",
        id: "gov",
        color: 0x4ECDC4,
        y: 8,
        items: [
            { id: "board", label: "Board Oversight", efficiency: 0.9, status: "stable", x: -4, z: -2 },
            { id: "regs", label: "Compliance", efficiency: 1.0, status: "stable", x: 0, z: -2 },
            { id: "mission", label: "Mission Lock", efficiency: 0.95, status: "stable", x: 4, z: -2 },
            { id: "funds", label: "Fund Allocation", efficiency: 0.8, status: "warning", x: 0, z: 2 } // Warning: Needs attention
        ]
    },
    {
        name: "Operational Processes",
        id: "ops",
        color: 0xFFE66D,
        y: 0,
        items: [
            { id: "plant", label: "Permaculture", efficiency: 0.85, status: "stable", x: -5, z: -3 },
            { id: "harvest", label: "Ethical Harvest", efficiency: 0.7, status: "warning", x: -2, z: 0 }, // Labor shortage?
            { id: "dist", label: "Distribution", efficiency: 0.9, status: "stable", x: 2, z: 0 },
            { id: "sales", label: "Market interface", efficiency: 0.8, status: "stable", x: 5, z: 3 }
        ]
    },
    {
        name: "Infrastructure & Hard Assets",
        id: "inf",
        color: 0xFF6B6B,
        y: -8,
        items: [
            { id: "water", label: "Water Capture", efficiency: 0.95, status: "stable", x: -6, z: -4 },
            { id: "power", label: "Solar Array", efficiency: 0.6, status: "critical", x: -2, z: -4 }, // Low efficiency
            { id: "soil", label: "Soil Health", efficiency: 0.9, status: "stable", x: -4, z: 2 },
            { id: "roads", label: "Access Ways", efficiency: 1.0, status: "stable", x: 4, z: 4 }
        ]
    }
];

// Pipes / Connections
const connections = [
    // Downwards flow
    { from: "funds", to: "plant", type: "resource" },
    { from: "regs", to: "harvest", type: "control" },
    { from: "water", to: "plant", type: "resource" },
    { from: "soil", to: "plant", type: "resource" },
    { from: "power", to: "dist", type: "energy" },

    // Horizontal
    { from: "plant", to: "harvest", type: "process" },
    { from: "harvest", to: "dist", type: "process" },
    { from: "dist", to: "sales", type: "process" }
];

// --- RENDERING ---

const layerGroup = new THREE.Group();
scene.add(layerGroup);

// Store item positions for connections
const itemPositions = {};

const loader = new FontLoader();
loader.load('https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    layers.forEach((layerData) => {
        // Transparent Glass Platform
        const geometry = new THREE.BoxGeometry(18, 0.4, 14);
        const material = new THREE.MeshPhysicalMaterial({
            color: layerData.color,
            transparent: true,
            opacity: 0.1,
            metalness: 0,
            roughness: 0,
            transmission: 0.5,
            side: THREE.DoubleSide
        });
        const platform = new THREE.Mesh(geometry, material);
        platform.position.y = layerData.y;
        layerGroup.add(platform);

        // Platform Grid
        const grid = new THREE.GridHelper(18, 18, layerData.color, 0x222222);
        grid.position.y = layerData.y + 0.21;
        grid.scale.z = 14 / 18;
        layerGroup.add(grid);

        // Layer Label
        const textGeo = new TextGeometry(layerData.name.toUpperCase(), {
            font: font,
            size: 0.6,
            height: 0.05,
        });
        const textMat = new THREE.MeshBasicMaterial({ color: layerData.color });
        const textMesh = new THREE.Mesh(textGeo, textMat);
        textMesh.position.set(-8.5, layerData.y + 0.5, -6);
        layerGroup.add(textMesh);

        // Render Items
        layerData.items.forEach((item) => {
            // Efficiency affects height
            const height = 1 + (item.efficiency * 2);
            const itemGeo = new THREE.BoxGeometry(2, height, 2);

            // Color based on status
            let itemColor = layerData.color;
            let emissive = 0x000000;
            if (item.status === 'warning') { itemColor = 0xffaa00; emissive = 0x332200; }
            if (item.status === 'critical') { itemColor = 0xff0000; emissive = 0x330000; }

            const itemMat = new THREE.MeshStandardMaterial({
                color: itemColor,
                emissive: emissive,
                metalness: 0.7,
                roughness: 0.2
            });
            const itemMesh = new THREE.Mesh(itemGeo, itemMat);

            // Position: sit on top of platform
            const posY = layerData.y + (height / 2) + 0.2;
            itemMesh.position.set(item.x, posY, item.z);
            layerGroup.add(itemMesh);

            // Store global position for pipes
            itemPositions[item.id] = new THREE.Vector3(item.x, posY, item.z);

            // Label
            const labelGeo = new TextGeometry(item.label, {
                font: font,
                size: 0.25,
                height: 0.02,
            });
            const labelMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const labelMesh = new THREE.Mesh(labelGeo, labelMat);
            labelMesh.position.set(item.x - 0.9, posY + height / 2 + 0.5, item.z + 1.1);
            layerGroup.add(labelMesh);

            // Efficiency Bar (Holo) above
            const effGeo = new THREE.PlaneGeometry(1.8, 0.1);
            const effMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const effBar = new THREE.Mesh(effGeo, effMat);
            effBar.position.set(item.x, posY + height / 2 + 0.2, item.z + 1.01);
            effBar.scale.x = item.efficiency;
            effBar.position.x -= (1.8 * (1 - item.efficiency)) / 2; // Align left
            layerGroup.add(effBar);
        });
    });

    // Render Connections (Pipes)
    connections.forEach(conn => {
        const start = itemPositions[conn.from];
        const end = itemPositions[conn.to];

        if (start && end) {
            const path = new THREE.CatmullRomCurve3([
                start,
                new THREE.Vector3(start.x, (start.y + end.y) / 2, start.z), // Control point 1
                new THREE.Vector3(end.x, (start.y + end.y) / 2, end.z),     // Control point 2
                end
            ]);

            const tubeGeo = new THREE.TubeGeometry(path, 20, 0.05, 8, false);
            let pipeColor = 0x888888;
            if (conn.type === 'resource') pipeColor = 0x00ffff;
            if (conn.type === 'energy') pipeColor = 0xffff00;

            const tubeMat = new THREE.MeshBasicMaterial({
                color: pipeColor,
                transparent: true,
                opacity: 0.4,
                wireframe: false
            });
            const tube = new THREE.Mesh(tubeGeo, tubeMat);
            layerGroup.add(tube);

            // Animated Particle on Pipe
            // (Simulated by creating small meshes that will move in animate loop)
            const particleGeo = new THREE.SphereGeometry(0.15, 8, 8);
            const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const particle = new THREE.Mesh(particleGeo, particleMat);

            // Attach metadata for animation
            particle.userData = { path: path, progress: Math.random() };
            particles.push(particle);
            layerGroup.add(particle);
        }
    });
});

const particles = [];

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();
    const delta = clock.getDelta();

    // Rotate slowly
    layerGroup.rotation.y = Math.sin(time * 0.1) * 0.05;

    // Animate Particles
    particles.forEach(p => {
        p.userData.progress += 0.005;
        if (p.userData.progress > 1) p.userData.progress = 0;

        const point = p.userData.path.getPoint(p.userData.progress);
        p.position.copy(point);
    });

    controls.update();
    renderer.render(scene, camera);
}

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
