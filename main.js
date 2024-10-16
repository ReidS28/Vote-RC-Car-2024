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

const clock = new THREE.Clock();

let manager = new THREE.LoadingManager();
manager.onLoad = function () {
	console.log("All items loaded.");
	animate();
};

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const playerCar = new Car(manager);
scene.add(playerCar.car);

const tiles = [];
const tileSize = 40;
const numberOfTiles = 20;
let farthestTileX = numberOfTiles * tileSize;

// Create initial tiles
for (let i = 0; i < numberOfTiles; i++) {
	const tile = new Tile(tileSize);
	tile.tile.position.set(i * tileSize, 0, 0);
	scene.add(tile.tile);
	tiles.push(tile);
}

function animate() {
	requestAnimationFrame(animate);

	const delta = clock.getDelta();

	playerCar.updateCarMovement(delta);

	if (playerCar.car) {
		camera.position
			.copy(playerCar.car.position)
			.add(new THREE.Vector3(-16, 0, 16));
        //    .add(new THREE.Vector3(-50, 0, 30));
		camera.position.y *= 0.6;
		camera.lookAt(
			playerCar.car.position.clone().add(new THREE.Vector3(10, 0, 0))
		);

		checkForNewTiles();
		removeOldTiles();
	}

	renderer.render(scene, camera);
}

function checkForNewTiles() {
	if (playerCar.car.position.x > farthestTileX - numberOfTiles * tileSize) {
		const tile = new Tile(tileSize);
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

animate();
