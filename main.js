import * as THREE from "three";
import { Car } from "./car.js";
import { createCamera } from "./camera.js";
import { Tile } from "./tile.js";
import "./style.css";

// ------------------------------------------------------------
// *** Scene Setup ***
// ------------------------------------------------------------
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
document.getElementById("app").appendChild(renderer.domElement);

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const clock = new THREE.Clock();

let manager = new THREE.LoadingManager();
manager.onLoad = function () {
  startAnimation(); // Start animation after loading
};

// ------------------------------------------------------------
// *** Main Program ***
// ------------------------------------------------------------

let score = 0;
let collisionTimer = 0;
let health = 11;

const playerCar = new Car(manager);
scene.add(playerCar.car);

const tiles = [];
const tileSize = 40;
const numberOfTiles = 20;
let farthestTileX = numberOfTiles * tileSize;

// Create initial tiles
for (let i = 0; i < 4; i++) {
  const tile = new Tile(tileSize, 0, manager);
  tile.tile.position.set(i * tileSize, 0, 0);
  scene.add(tile.tile);
  tiles.push(tile);
}
for (let i = 4; i < numberOfTiles; i++) {
  const tile = new Tile(tileSize, Math.floor(Math.random() * 11), manager);
  tile.tile.position.set(i * tileSize, 0, 0);
  scene.add(tile.tile);
  tiles.push(tile);
}

// Animation loop control
let isAnimating = false;

function startAnimation() {
  if (!isAnimating) {
    isAnimating = true; // Prevent multiple calls
    console.log("Animation Started");
    animate();
  }
}

function stopAnimation() {
  isAnimating = false; // Set flag to false to stop
}

function animate() {
  if (!isAnimating) return;

  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.6);

  playerCar.updateCarMovement(delta);

  checkCollisions();
  collisionTimer--;

  camera.position
    .copy(playerCar.car.position)
    .add(new THREE.Vector3(-16, 0, 16));
  camera.position.y *= 0.4;
  camera.lookAt(
    playerCar.car.position.clone().add(new THREE.Vector3(10, 0, 0))
  );

  checkForNewTiles();
  removeOldTiles();

  score = Math.floor(playerCar.speed - 30);

  renderer.render(scene, camera);
  updateHTML();
}

function checkForNewTiles() {
  if (playerCar.car.position.x > farthestTileX - numberOfTiles * tileSize) {
    const tile = new Tile(tileSize, Math.floor(Math.random() * 11), manager);
    tile.tile.position.set(farthestTileX, 0, 0);
    scene.add(tile.tile);
    tiles.push(tile);

    farthestTileX += tileSize;
  }
}

function removeOldTiles() {
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    if (tile.tile.position.x < playerCar.car.position.x - 1 * tileSize) {
      scene.remove(tile.tile);
      tiles.splice(i, 1);
      i--;
    }
  }
}

function checkCollisions() {
  for (const tile of tiles) {
    if (tile.barriers) {
      for (const barrier of tile.barriers) {
        const barrierBoundingBox = new THREE.Box3().setFromObject(barrier);
        if (playerCar.boundingBox.intersectsBox(barrierBoundingBox)) {
          carCrash();
        }
      }
    }
  }
}

// ------------------------------------------------------------
// *** Functions ***
// ------------------------------------------------------------

function carCrash() {
  if (collisionTimer <= 0) {
    health--;
    collisionTimer = 20;
  }
  if (health <= 0) {
    stopAnimation();
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverMenu").style.display = "flex";
  }
}

function updateHTML() {
  document.getElementById("Score").innerText = Math.round(score);
  document.getElementById("Health").innerText = health;
}

document.getElementById("restartButton").addEventListener("click", () => {
  location.reload(); // Reloads the current page
});
