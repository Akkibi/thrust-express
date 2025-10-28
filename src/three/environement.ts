import * as THREE from "three/webgpu";
// import { loadGLTFModel } from "../utils/loadGLTFModel";
// import { PhysicsEngine } from "../matter/physics";

export class Environement {
  private static instance: Environement;
  private scene: THREE.Scene;
  private instanceGroup: THREE.Group;
  // private physicsEngine: PhysicsEngine;

  private constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.instanceGroup = new THREE.Group();
    this.scene.add(this.instanceGroup);
    // this.physicsEngine = PhysicsEngine.getInstance();
    // loadGLTFModel(this.instanceGroup, "/assets/bounds/bounds.glb");
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    );
    cube.position.set(0, 0, 4);
    this.instanceGroup.add(cube);

    // this.physicsEngine.addObject(boxPosition, boxScale, 0, true);
  }

  public static getInstance(scene: THREE.Scene): Environement {
    if (!Environement.instance) {
      Environement.instance = new Environement(scene);
    }
    return Environement.instance;
  }
}
