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
    const texture = textureLoader.load('assets/road.jpg'); // Replace with your texture path

    // Create a material using the loaded texture
    const tileMaterial = new THREE.MeshBasicMaterial({ map: texture });

    // Create the tile mesh
    const plane = new THREE.Mesh(tileGeometry, tileMaterial);

    plane.rotation.z = Math.PI / 2;

    // Add the plane to the tile group
    this.tile.add(plane);
  }

  // Method to return the group
  getTileGroup() {
    return this.tile; // Return the group containing the tile(s)
  }
}
