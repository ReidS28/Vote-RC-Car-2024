import * as THREE from "three";
import { Car } from "./car.js";
import { createCamera } from "./camera.js";
import { Tile } from "./tile.js";
import "./style.css";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x71bce1);

const camera = createCamera();
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(100, -300, 400);
scene.add(dirLight);

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

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const playerCar = new Car(manager);
scene.add(playerCar.createCar());

playerCar.setupControls();
const clock = new THREE.Clock();

const tiles = [];
const walls = [];
const tileSize = 40;
const numberOfTiles = 50;

for (let i = 0; i < numberOfTiles; i++) {
  const tile = new Tile(tileSize);
  tile.getTileGroup().position.set(i * tileSize, 0, 0);
  scene.add(tile.getTileGroup());
  tiles.push(tile);

  tile.tile.children.forEach((child) => {
    if (child.name === "leftWall" || child.name === "rightWall") {
      walls.push(child);
      console.log(`Added ${child.name} at ${child.position}`);
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  playerCar.updateCarMovement();

  if (playerCar.car) {
    camera.position
      .copy(playerCar.car.position)
      .add(new THREE.Vector3(-20, 0, 16));
    camera.lookAt(playerCar.car.position);
  }

  playerCar.checkCollisionWithWalls(walls);

  renderer.render(scene, camera);
}

animate();
