import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class Car {
  constructor() {
    // Car-related variables
    const loader = new GLTFLoader();
    let car;
    const keys = {
      left: false,
      right: false,
    };

    const maxTurnSpeed = 0.03;
    const maxTurnAngle = Math.PI / 4;
    const turnSensitivity = 0.006;
    //let speed = 0;
    let speed = 0.4;
    let turnSpeed = 0;

    createCar();
  }

  // Function to create the car
  createCar() {
    car = new THREE.Group(); // Create a group to hold the car model

    loader.load(
      "assets/rc_car.glb",
      function (gltf) {
        gltf.scene.position.z = 1.4;
        gltf.scene.rotation.x = Math.PI / 2;
        gltf.scene.rotation.y = Math.PI / -2;

        const scaleFactor = 30;
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Add the loaded model to the car group
        car.add(gltf.scene);
        console.log("Car model loaded successfully.");
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error("An error occurred while loading the car model:", error);
      }
    );

    return car; // Return the car group
  }

  // Function to set up controls
  setupControls() {
    // Listen for key presses
    window.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "ArrowLeft":
        case "KeyA":
          keys.left = true;
          break;
        case "ArrowRight":
        case "KeyD":
          keys.right = true;
          break;
      }
    });

    // Listen for key releases
    window.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          keys.forward = false;
          break;
        case "ArrowDown":
        case "KeyS":
          keys.backward = false;
          break;
        case "ArrowLeft":
        case "KeyA":
          keys.left = false;
          break;
        case "ArrowRight":
        case "KeyD":
          keys.right = false;
          break;
      }
    });
  }

  // Function to update car movement
  updateCarMovement() {
    if (!car) return; // Wait for the car to load

    car.position.y += Math.sin(car.rotation.z) * speed;
    car.position.x += Math.cos(car.rotation.z) * speed;

    if (keys.left || keys.right) {
      if (keys.left) {
        turnSpeed += turnSensitivity;
      }
      if (keys.right) {
        turnSpeed -= turnSensitivity;
      }
    } else {
      turnSpeed *= 0.9;
      car.rotation.z *= 0.96;
    }

    turnSpeed = Math.max(-maxTurnSpeed, Math.min(turnSpeed, maxTurnSpeed));
    car.rotation.z += turnSpeed;
    car.rotation.x = turnSpeed * -1.6;
    car.rotation.z = Math.max(
      -maxTurnAngle,
      Math.min(car.rotation.z, maxTurnAngle)
    );
  }
}
