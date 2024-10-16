import * as THREE from "three";

export class Tile {
	constructor(tileSize) {
		this.tile = new THREE.Group();
		this.size = tileSize;
		
    // Create tile
    const tileGeometry = new THREE.PlaneGeometry(this.size, this.size);
		const textureLoader = new THREE.TextureLoader();
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

}
