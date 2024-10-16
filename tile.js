import * as THREE from "three";

export class Tile {
  constructor(tileSize) {
    this.tile = new THREE.Group();
    this.size = tileSize;
    this.createTile();
  }

  maintainTiles() {
    // Add any necessary maintenance logic here
  }

  createTile() {
    // Create the geometry for the tile
    const tileGeometry = new THREE.PlaneGeometry(this.size, this.size);

    // Load the texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("assets/road.png"); // Replace with your texture path

    // Create a material using the loaded texture
    const tileMaterial = new THREE.MeshBasicMaterial({ map: texture });

    // Create the tile mesh
    const plane = new THREE.Mesh(tileGeometry, tileMaterial);

    plane.rotation.z = Math.PI / 2;

    // Add the plane to the tile group
    this.tile.add(plane);

    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

    const wallGeometry = new THREE.BoxGeometry(40, 7, 20);
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);

    leftWall.position.y = 16.2;
    leftWall.position.z = 10;

    rightWall.position.y = -16.2;
    rightWall.position.z = 10;

    this.tile.add(leftWall); // Add the wall to the tile
    this.tile.add(rightWall); // Add the wall to the tile
  }

  // Method to return the group
  getTileGroup() {
    return this.tile; // Return the group containing the tile(s)
  }
}
