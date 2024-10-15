import * as THREE from "three";

export function maintainTles() {}

export function createTile() {
  const tileGeometry = new THREE.PlaneGeometry(40, 40);
  const tileMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
  const tile = new THREE.Mesh(tileGeometry, tileMaterial);

  return tile;
}
