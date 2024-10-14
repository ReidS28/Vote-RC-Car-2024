import * as THREE from 'three';
import { createCar, setupControls, updateCarMovement } from './car.js';
import { createCamera } from './camera.js'; // Import the createCamera function
import './style.css';

//-----------------------------------------------------------------------------------------
//
//   *** setup ***
//
//-----------------------------------------------------------------------------------------

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x71BCE1);

// Camera setup
const camera = createCamera(); // Create the camera

// Light setup
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(100, -300, 400);
scene.add(dirLight);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//-----------------------------------------------------------------------------------------
//
//   *** main code ***
//
//-----------------------------------------------------------------------------------------

// Add AxesHelper to the main scene
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Car setup
const playerCar = createCar(); // Create the car
scene.add(playerCar); // Add the car to the scene

// Setup controls for the car
setupControls();

// Tile setup
const tiles = [];
const tileSize = 40;
const numberOfTiles = 5;

for (let i = 0; i < numberOfTiles; i++) {
    const tile = createTile();
    tile.position.set(i * tileSize, 0, 0); // Place tiles in a row along the X-axis
    scene.add(tile);
    tiles.push(tile);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    updateCarMovement();

    camera.position.copy(playerCar.position).add(new THREE.Vector3(-20, 0, 16));
    camera.lookAt(playerCar.position);

    // Render the scene
    renderer.render(scene, camera);
}

animate();

//-----------------------------------------------------------------------------------------
//
//   *** Functions ***
//
//-----------------------------------------------------------------------------------------

function createTile() {
    const tileGeometry = new THREE.PlaneGeometry(40, 40);
    const tileMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const tile = new THREE.Mesh(tileGeometry, tileMaterial);

    return tile;
}
