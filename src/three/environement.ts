import * as THREE from "three/webgpu";
import { type PhysicsEngine } from "../matter/physics";
import type { MapDataType } from "../types/types";
import { InstanceObjectManager } from "./instancesManager";
import type { LevelType } from "../levels";
// import { loadGLTFModel } from "../utils/loadGLTFModel";
// import { PhysicsEngine } from "../matter/physics";

export class Environement {
  private static instance: Environement;
  private scene: THREE.Scene;
  private physicsEngine: PhysicsEngine;
  private instanceGroup: THREE.Group;
  private goal: THREE.Group;
  private environementBlocks: THREE.Mesh[];
  private mapData: MapDataType | null;
  private objectManager: InstanceObjectManager | null;
  private terrainManager: InstanceObjectManager | null;
  // private physicsEngine: PhysicsEngine;

  private constructor(scene: THREE.Scene, physicsEngine: PhysicsEngine) {
    this.scene = scene;
    this.mapData = null;
    this.objectManager = null;
    this.terrainManager = null;
    this.physicsEngine = physicsEngine;
    this.instanceGroup = new THREE.Group();
    this.scene.add(this.instanceGroup);
    this.goal = new THREE.Group();
    this.environementBlocks = [];
  }

  public unloadLevels = () => {
    const objectManager = this.objectManager;
    if (!objectManager) return;
    objectManager.releaseAll();
    this.scene.remove(objectManager.getMesh());
    this.objectManager = null;
  };

  public unloadEndless = () => {
    const terrainManager = this.terrainManager;
    if (!terrainManager) return;
    terrainManager.releaseAll();
    this.scene.remove(terrainManager.getMesh());
    this.terrainManager = null;
  };

  public async loadConfig(mapData: string) {
    const response = await fetch(mapData);
    if (!response.ok) throw new Error("Failed to load JSON");
    this.mapData = await response.json();
  }

  public loadLevel(level: LevelType): void {
    if (this.objectManager == null) {
      this.objectManager = InstanceObjectManager.getInstance();
      this.scene.add(this.objectManager.getMesh());
    }
    const objectManager = this.objectManager;
    if (!objectManager) return;
    objectManager.releaseAll();
    // generate map out of the map image pixels

    this.environementBlocks.forEach((block) =>
      this.instanceGroup.remove(block),
    );

    if (!this.mapData) return;
    console.log("walls", this.mapData.optimizedWalls.length);
    this.mapData.optimizedWalls.forEach((wall) => {
      const cubeIndex = objectManager.get();
      if (cubeIndex) {
        const position = new THREE.Vector3(
          wall.position.x,
          -2.5,
          wall.position.y,
        );
        const scale = new THREE.Vector3(wall.scale?.x, 6, wall.scale?.y);
        objectManager.updatePosition(cubeIndex, position);
        objectManager.updateScale(cubeIndex, scale);
        const color = new THREE.Color(...level.color);
        objectManager.updateColor(cubeIndex, color);
        this.physicsEngine.addObject(position, scale, 0, false);
      }
    });
    // generate goal
    const goalPosition = this.mapData.goal.position;
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    );
    cube.position.set(goalPosition.x, 0, goalPosition.y);
    this.environementBlocks.push(cube);
    this.instanceGroup.add(cube);
    this.physicsEngine.setGoal(cube.position);

    // generatePlayer
    const playerPosition = this.mapData.player.position;
    this.physicsEngine.setPlayer(
      new THREE.Vector3(playerPosition.x, 0, playerPosition.y),
    );
  }

  public loadEndless = () => {
    console.log("loadEndless");
  };

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
