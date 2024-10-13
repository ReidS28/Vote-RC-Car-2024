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
scene.background = new THREE.Color(0x1e7496); // Set background color to light blue

// Camera setup
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000); // Adjusted near/far planes
//camera.position.set(30, 30, 30);
camera.position.set(0, 60, 0);
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

// Initialize the GLTFLoader
const loader = new GLTFLoader();

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

    // Log the camera position to the console
    //console.log(`Camera Position: X: ${camera.position.x}, Y: ${camera.position.y}, Z: ${camera.position.z}`);
}

animate();

//-----------------------------------------------------------------------------------------
//
//   *** main code ***
//
//-----------------------------------------------------------------------------------------

// Add AxesHelper to the main scene (size 5, adjust as needed)
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Car setup
const playerCar = Car();
scene.add(playerCar);

function Car() {
    const car = new THREE.Group();  // Create a group to hold the car model

    // Load the .glb file
    loader.load(
        'assets/car_body.glb',
        function (gltf) {
            // Set the rotation and scale of the loaded model
            gltf.scene.position.z = 7;

            gltf.scene.rotation.x = Math.PI / 2;
            gltf.scene.rotation.y = Math.PI / 2;
            
            const scaleFactor = 5; // Adjust this value as needed
            gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
            
            // Add the loaded model to the car group
            car.add(gltf.scene);
            
            console.log("Car model loaded successfully.");
        },
        function (xhr) {
            // Called while loading is in progress
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            // Called when there's an error
            console.error('An error occurred while loading the car model:', error);
        }
    );

    // Wheels
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const wheelGeometry = new THREE.CylinderGeometry(4.4, 4.4, 6, 20);
    
    for (let i = 0; i < 4; i++) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(i < 2 ? -15.4 : 19, i % 2 === 0 ? -11 : 11, i < 2 ? 4.4 : 4);
        car.add(wheel);
    }

    return car;  // Return the car group which will eventually contain the model
};
