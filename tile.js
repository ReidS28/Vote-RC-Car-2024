import * as THREE from "three";

export class Tile {
  constructor() {
    this.tile = this.createTile();
    this.car = new THREE.Group();
  }
  maintainTiles() {
    // Add any necessary maintenance logic here
  }
  createTile() {
    const tileGeometry = new THREE.PlaneGeometry(40, 40);
    const tileMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const tile = new THREE.Mesh(tileGeometry, tileMaterial);
    return tile;
  }
}
