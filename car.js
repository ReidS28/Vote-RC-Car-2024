import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class Car {
	constructor(manager) {
		// Car-related variables
		this.loader = new GLTFLoader(manager);
		this.car = new THREE.Group();
		this.keys = {
			left: false,
			right: false,
		};
		this.maxTurnSpeed = 3;
		this.maxTurnAngle = Math.PI / 4;
		this.turnSensitivity = 0.6;
		this.speed = 40;
		this.turnSpeed = 0;

		this.timer = 0;
	}

	createCar() {
		this.loader.load(
			"assets/rc_car.glb",
			(gltf) => {
				gltf.scene.position.z = 1.4;
				gltf.scene.rotation.x = Math.PI / 2;
				gltf.scene.rotation.y = Math.PI / -2;
				const scaleFactor = 30;
				gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
				this.car.add(gltf.scene);
			},
			(xhr) => {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
			},
			(error) => {
				console.error("An error occurred while loading the car model:", error);
			}
		);

		return this.car; // Return the car group
	}

	setupControls() {
		// Listen for key presses
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

		// Listen for key releases
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
    
        // Move the car forward based on its rotation
        this.car.position.y += Math.sin(this.car.rotation.z) * this.speed * delta;
        this.car.position.x += Math.cos(this.car.rotation.z) * this.speed * delta;
    
        // Handle turning logic
        if (this.keys.left || this.keys.right) {
            if (this.keys.left) {
                this.turnSpeed += this.turnSensitivity;
            }
            if (this.keys.right) {
                this.turnSpeed -= this.turnSensitivity;
            }
        } else {
            // Slowly reduce turning speed if no key is pressed
            this.turnSpeed *= 0.9;
            this.car.rotation.z *= 0.98;
        }

        this.turnSpeed = Math.max(-this.maxTurnSpeed, Math.min(this.turnSpeed, this.maxTurnSpeed));

        this.car.rotation.z += this.turnSpeed * delta;

        this.car.rotation.x = this.turnSpeed * .01;
    
        this.car.rotation.z = Math.max(-this.maxTurnAngle, Math.min(this.car.rotation.z, this.maxTurnAngle));
    
        this.timer += delta;
        if (this.timer >= 10) { // 1 = 1 second
            this.speedUp();
            this.timer = 0;
        }
    }
    
	speedUp() {
		this.speed += 10;
		console.log("speed up:" + this.speed);
	}
}
