import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class Tile {
	constructor(tileSize, manager) {
    this.loader = new GLTFLoader(manager);
		const textureLoader = new THREE.TextureLoader(manager);
    
		this.tile = new THREE.Group();
		this.size = tileSize;
		
    // Create tile
    const tileGeometry = new THREE.PlaneGeometry(this.size, this.size);
		const texture = textureLoader.load("assets/road.png");
		const tileMaterial = new THREE.MeshBasicMaterial({ map: texture });
		const plane = new THREE.Mesh(tileGeometry, tileMaterial);
		plane.rotation.z = Math.PI / 2;
		this.tile.add(plane);

		const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
		const wallGeometry = new THREE.BoxGeometry(40, 7, 20);
		const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
		const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
		leftWall.position.y = 16.2;
		leftWall.position.z = 10;
		rightWall.position.y = -16.2;
		rightWall.position.z = 10;
		leftWall.name = "leftWall";
		rightWall.name = "rightWall";
		this.tile.add(leftWall);
		this.tile.add(rightWall);
	}

  createBarier(x, y){
    this.loader.load(
			"assets/road_barrier.glb",
			(gltf) => {
				gltf.scene.position.z = 1.4;
				gltf.scene.rotation.x = Math.PI / 2;
				gltf.scene.rotation.y = Math.PI / -2;
				const scaleFactor = 28;
				gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
				// Add the loaded model to the car group
				this.car.add(gltf.scene);
				console.log("Car model loaded successfully.");
			},
			(xhr) => {},
			(error) => {
				console.error("An error occurred while loading the car model:", error);
			});
  }

}
