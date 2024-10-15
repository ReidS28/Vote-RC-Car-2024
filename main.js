import * as THREE from "three";
import { Car } from "./car.js";
import { createCamera } from "./camera.js";
import { Tile } from "./tile.js";
import "./style.css";

//-----------------------------------------------------------------------------------------
//
//   *** setup ***
//
//-----------------------------------------------------------------------------------------

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x71bce1);

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

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

let manager = new THREE.LoadingManager();
manager.onLoad = function () {
  console.log("All items loaded.");
  animate();
};

//-----------------------------------------------------------------------------------------
//
//   *** main code ***
//
//-----------------------------------------------------------------------------------------

// Add AxesHelper to the main scene
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Car setup
const playerCar = new Car(manager);
scene.add(playerCar.createCar()); // Add the car to the scene

// Setup controls for the car
playerCar.setupControls();

// Tile setup
const tiles = [];
const tileSize = 40;
const numberOfTiles = 5;

for (let i = 0; i < numberOfTiles; i++) {
  const tile = new Tile();
  tile.tile.position.set(i * tileSize, 0, 0); // Access tile's position
  scene.add(tile.tile); // Add tile to the scene
  tiles.push(tile.tile); // Store the tile in the tiles array
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  playerCar.updateCarMovement();

  camera.position
    .copy(playerCar.car.position)
    .add(new THREE.Vector3(-20, 0, 16));
  camera.lookAt(playerCar.car.position);

  // Render the scene
  renderer.render(scene, camera);
}

//-----------------------------------------------------------------------------------------
//
//   *** Functions ***
//
//-----------------------------------------------------------------------------------------
