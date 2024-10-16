import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class Car {
	constructor(manager) {
		this.loader = new GLTFLoader(manager); // Use the provided manager
		this.car = new THREE.Group();
		this.keys = {
			left: false,
			right: false,
		};
		this.maxTurnSpeed = 0.03;
		this.maxTurnAngle = Math.PI / 6;
		this.turnSensitivity = 0.006;
		this.speed = 30;
		this.turnSpeed = 0;
		this.timer = 0;

		this.boundingBox = new THREE.Box3();

		// Load Car
		this.loader.load(
			"assets/rc_car.glb",
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
			}
		);

		// Set up controls
		window.addEventListener("keydown", (event) => {
			switch (event.code) {
				case "ArrowLeft":
				case "KeyA":
					this.keys.left = true;
					break;
				case "ArrowRight":
				case "KeyD":
					this.keys.right = true;
					break;
			}
		});
		window.addEventListener("keyup", (event) => {
			switch (event.code) {
				case "ArrowUp":
				case "KeyW":
					this.keys.forward = false;
					break;
				case "ArrowDown":
				case "KeyS":
					this.keys.backward = false;
					break;
				case "ArrowLeft":
				case "KeyA":
					this.keys.left = false;
					break;
				case "ArrowRight":
				case "KeyD":
					this.keys.right = false;
					break;
			}
		});
	}

	updateCarMovement(delta) {
		if (!this.car) return; // Wait for the car to load

		this.car.position.y += Math.sin(this.car.rotation.z) * this.speed * delta;
		this.car.position.x += Math.cos(this.car.rotation.z) * this.speed * delta;

		if (this.keys.left || this.keys.right) {
			if (this.keys.left) {
				this.turnSpeed += this.turnSensitivity;
			}
			if (this.keys.right) {
				this.turnSpeed -= this.turnSensitivity;
			}
		} else {
			this.turnSpeed *= 0.9;
			this.car.rotation.z *= 0.96;
		}

		this.turnSpeed = Math.max(
			-this.maxTurnSpeed,
			Math.min(this.turnSpeed, this.maxTurnSpeed)
		);
		this.car.rotation.z += this.turnSpeed;
		this.car.rotation.x = this.turnSpeed * -1.6;
		this.car.rotation.z = Math.max(
			-this.maxTurnAngle,
			Math.min(this.car.rotation.z, this.maxTurnAngle)
		);

		this.checkCollisionWithWalls();

		this.timer += delta;
		if (this.timer >= 1) {
			// 1 = 1 second
			this.speed += 0.5;
			console.log("Speed Up: " + this.speed);
			this.timer = 0;
		}

		this.boundingBox.setFromObject(this.car);
	}

	checkCollisionWithWalls() {
		// left wall
		if (this.boundingBox.max.y > 12.7) {
            this.car.rotation.z = THREE.MathUtils.lerp(this.car.rotation.z, -Math.abs(this.car.rotation.z) - 0.04, 0.1)
            this.turnSpeed = -Math.abs(this.turnSpeed);
		}

        // right wall
		if (this.boundingBox.min.y < -12.7) {
            this.car.rotation.z = THREE.MathUtils.lerp(this.car.rotation.z, Math.abs(this.car.rotation.z) + 0.04, 0.1)
            this.turnSpeed =Math.abs(this.turnSpeed);
		}

	}
}
