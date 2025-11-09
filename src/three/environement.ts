import * as THREE from "three/webgpu";
import type { PhysicsEngine } from "../matter/physics";
// import { loadGLTFModel } from "../utils/loadGLTFModel";
// import { PhysicsEngine } from "../matter/physics";

export class Environement {
  private static instance: Environement;
  private scene: THREE.Scene;
  private physicsEngine: PhysicsEngine;
  private instanceGroup: THREE.Group;
  // private physicsEngine: PhysicsEngine;

  private constructor(scene: THREE.Scene, physicsEngine: PhysicsEngine) {
    this.scene = scene;
    this.physicsEngine = physicsEngine;
    this.instanceGroup = new THREE.Group();
    this.scene.add(this.instanceGroup);
    // this.physicsEngine = PhysicsEngine.getInstance();
    // loadGLTFModel(this.instanceGroup, "/assets/bounds/bounds.glb");

    for (let i = 0; i < 10; i++) {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      );
      cube.position.set(i * 2, 0, 2);
      this.physicsEngine.addObject(cube.position, cube.scale, 0, false);
      this.instanceGroup.add(cube);
    }

    // create walls
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    );
    cube.scale.set(1, 1, 10);
    cube.position.set(0, 0, 5);
    this.physicsEngine.addObject(cube.position, cube.scale, 0, false);
    this.instanceGroup.add(cube);

    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    );
    cube2.scale.set(1, 1, 10);
    cube2.position.set(10, 0, 5);
    this.physicsEngine.addObject(cube2.position, cube2.scale, 0, false);
    this.instanceGroup.add(cube2);

    const cube3 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    );
    cube3.scale.set(10, 1, 1);
    cube3.position.set(5, 0, 0);
    this.physicsEngine.addObject(cube3.position, cube3.scale, 0, false);
    this.instanceGroup.add(cube3);

    const cube4 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    );
    cube4.scale.set(10, 1, 1);
    cube4.position.set(5, 0, 10);
    this.physicsEngine.addObject(cube4.position, cube4.scale, 0, false);
    this.instanceGroup.add(cube4);

  }

  public static getInstance(
    scene: THREE.Scene,
    physicsEngine: PhysicsEngine,
  ): Environement {
    if (!Environement.instance) {
      Environement.instance = new Environement(scene, physicsEngine);
    }
    return Environement.instance;
  }
}
