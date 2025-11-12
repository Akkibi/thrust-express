import * as THREE from "three/webgpu";
import { type PhysicsEngine } from "../matter/physics";
// import { loadGLTFModel } from "../utils/loadGLTFModel";
// import { PhysicsEngine } from "../matter/physics";

export class Environement {
  private static instance: Environement;
  private scene: THREE.Scene;
  private physicsEngine: PhysicsEngine;
  private instanceGroup: THREE.Group;
  private goal: THREE.Group;
  private environementBlocks: THREE.Mesh[];
  // private physicsEngine: PhysicsEngine;

  private constructor(scene: THREE.Scene, physicsEngine: PhysicsEngine) {
    this.scene = scene;
    this.physicsEngine = physicsEngine;
    this.instanceGroup = new THREE.Group();
    this.scene.add(this.instanceGroup);
    this.goal = new THREE.Group();
    this.environementBlocks = [];
  }

  public initialize(map: HTMLImageElement): void {
    // generate map out of the map image pixels

    this.environementBlocks.forEach((block) =>
      this.instanceGroup.remove(block),
    );

    const mapCanvas = document.createElement("canvas");
    mapCanvas.width = map.width;
    mapCanvas.height = map.height;
    const mapContext = mapCanvas.getContext("2d");
    mapContext?.drawImage(map, 0, 0);
    const mapData = mapContext?.getImageData(0, 0, map.width, map.height);
    const mapPixels = mapData?.data;
    if (!mapPixels) return;
    console.log(map.width, map.height);
    for (let i = 0; i < mapPixels.length; i += 4) {
      const x = (i / 4) % map.width;
      const y = Math.floor(i / 4 / map.width);
      if (mapPixels[i + 2] > 0) {
        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
        );
        cube.position.set(x, 0, y);
        this.physicsEngine.addObject(cube.position, cube.scale, 0, false);
        this.environementBlocks.push(cube);
        this.instanceGroup.add(cube);
      }
      if (mapPixels[i] > 0) {
        this.physicsEngine.setPlayer(new THREE.Vector3(x, 0, y));
      }
      if (mapPixels[i + 1] > 0) {
        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial({ color: 0xffff00 }),
        );
        cube.position.set(x, 0, y);
        this.environementBlocks.push(cube);
        this.instanceGroup.add(cube);

        this.physicsEngine.setGoal(new THREE.Vector3(x, 0, y));
      }
    }
  }

  public getGoalPosition(): THREE.Vector3 {
    return this.goal.position;
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
