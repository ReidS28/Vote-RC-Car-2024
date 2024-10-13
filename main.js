import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './style.css'

//-----------------------------------------------------------------------------------------
//
//   *** setup ***
//
//-----------------------------------------------------------------------------------------

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000); // Adjusted near/far planes
camera.position.set(5, 5, 5);
camera.up.set(0, 0, 1);  // Z-axis as up
camera.lookAt(0, 0, 0);

// Light setup
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(100, -300, 400);
scene.add(dirLight);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);  // Set background color to black
document.body.appendChild(renderer.domElement);

// orbit controll setup
const controls = new OrbitControls(camera, renderer.domElement);

// Resize handler
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update the orbit controls for smooth movement
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

animate();  // Start the animation loop

//-----------------------------------------------------------------------------------------
//
//   *** main code ***
//
//-----------------------------------------------------------------------------------------

// Add AxesHelper to the main scene (size 5, adjust as needed)
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Initialize the GLTFLoader
const loader = new GLTFLoader();

// Load the .glb file
loader.load(
    'public/assets/5-66.glb', // Path to the .glb file
    function (gltf) {
        // Add the loaded model to the scene
        scene.add(gltf.scene);

        // Optional: Position the model
        gltf.scene.position.set(-5, 3, 0);

        gltf.scene.rotation.x = Math.PI / 2;
    },
    function (xhr) {
        // Called while loading is in progress
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        // Called when there's an error
        console.error('An error occurred while loading the model:', error);
    }
);

// Car setup
const playerCar = Car();
//scene.add(playerCar);

// Car object creation function
function Car() {
    const car = new THREE.Group();

    // Back Wheel
    const backWheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
    backWheel.position.z = 6;
    backWheel.position.x = -18;
    car.add(backWheel);

    // Front Wheel
    const frontWheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
    frontWheel.position.z = 6;
    frontWheel.position.x = 18;
    car.add(frontWheel);

    return car;
}
