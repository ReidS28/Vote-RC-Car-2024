import * as THREE from "three";

export function createCamera() {
	// Camera setup
	const aspectRatio = window.innerWidth / window.innerHeight;
	const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
	camera.position.set(30, 30, 30);
	camera.up.set(0, 0, 1);
	camera.lookAt(0, 0, 0);

	// Resize handler
	window.addEventListener("resize", () => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	});

	return camera; // Return the created camera
}
