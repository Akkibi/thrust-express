import * as THREE from "three/webgpu";
import { type PhysicsEngine } from "../matter/physicsEngine";
import type { IMapData } from "../types/types";
import { InstanceObjectManager } from "./InstanceObjectManager";
import type { LevelType } from "../levels";
import { StartEnd } from "./startEnd";

const WALLS_WIDTH = 20;
const WALLS_HEIGHT = 10;

export class Environement {
  private static instance: Environement;
  private scene: THREE.Scene;
  private physicsEngine: PhysicsEngine;
  private instanceGroup: THREE.Group;
  private goal: THREE.Group;
  private environementBlocks: THREE.Mesh[];
  private mapData: IMapData | null;
  private objectManager: InstanceObjectManager | null;
  private terrainManager: InstanceObjectManager | null;
  private startEnd: StartEnd;
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
    this.startEnd = StartEnd.getInstance();
    this.startEnd.init(this.scene);
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
    console.log("mapData", this.mapData);
    this.mapData.optimizedWalls.forEach((wall) => {
      const cubeIndex = objectManager.get();
      if (cubeIndex == null) return;
      const position = new THREE.Vector3(
        wall.position.x,
        0.25 - WALLS_HEIGHT * 0.5,
        wall.position.y,
      );
      const scale = new THREE.Vector3(
        wall.scale?.x,
        WALLS_HEIGHT,
        wall.scale?.y,
      );
      objectManager.updatePosition(cubeIndex, position);
      objectManager.updateScale(cubeIndex, scale);
      const color = new THREE.Color(...level.color);
      objectManager.updateColor(cubeIndex, color);
      this.physicsEngine.addObject(position, scale, 0, false);
    });
    // generate outer walls
    const width = this.mapData.size.x;
    const height = this.mapData.size.y;

    // topwall
    const topWall = objectManager.get();
    if (topWall) {
      const position = new THREE.Vector3(
        width * 0.5 - 0.5,
        0.25 - WALLS_HEIGHT * 0.5,
        -WALLS_WIDTH * 0.5 - 0.5,
      );
      const scale = new THREE.Vector3(
        width + WALLS_WIDTH * 2,
        WALLS_HEIGHT,
        WALLS_WIDTH,
      );
      objectManager.updatePosition(topWall, position);
      objectManager.updateScale(topWall, scale);
      const color = new THREE.Color(...level.color);
      objectManager.updateColor(topWall, color);
      this.physicsEngine.addObject(position, scale, 0, false);
    }
    // bottomwall
    const bottomWall = objectManager.get();
    if (bottomWall) {
      const position = new THREE.Vector3(
        width * 0.5 - 0.5,
        0.25 - WALLS_HEIGHT * 0.5,
        height + WALLS_WIDTH * 0.5 - 0.5,
      );
      const scale = new THREE.Vector3(
        width + WALLS_WIDTH * 2,
        WALLS_HEIGHT,
        WALLS_WIDTH,
      );
      objectManager.updatePosition(bottomWall, position);
      objectManager.updateScale(bottomWall, scale);
      const color = new THREE.Color(...level.color);
      objectManager.updateColor(bottomWall, color);
      this.physicsEngine.addObject(position, scale, 0, false);
    }
    // leftWall
    const leftWall = objectManager.get();
    if (leftWall) {
      const position = new THREE.Vector3(
        -WALLS_WIDTH * 0.5 - 0.5,
        0.25 - WALLS_HEIGHT * 0.5,
        height * 0.5 - 0.5,
      );
      const scale = new THREE.Vector3(WALLS_WIDTH, WALLS_HEIGHT, height);
      objectManager.updatePosition(leftWall, position);
      objectManager.updateScale(leftWall, scale);
      const color = new THREE.Color(...level.color);
      objectManager.updateColor(leftWall, color);
      this.physicsEngine.addObject(position, scale, 0, false);
    }
    // rightWall
    const rightWall = objectManager.get();
    if (rightWall) {
      const position = new THREE.Vector3(
        width + WALLS_WIDTH * 0.5 - 0.5,
        0.25 - WALLS_HEIGHT * 0.5,
        height * 0.5 - 0.5,
      );
      const scale = new THREE.Vector3(WALLS_WIDTH, WALLS_HEIGHT, height);
      objectManager.updatePosition(rightWall, position);
      objectManager.updateScale(rightWall, scale);
      const color = new THREE.Color(...level.color);
      objectManager.updateColor(rightWall, color);
      this.physicsEngine.addObject(position, scale, 0, false);
    }
    // generate goal
    const goalPosition = this.mapData.goal.position;
    const position = new THREE.Vector3(goalPosition.x, 0, goalPosition.y);
    this.physicsEngine.setGoal(position);
    this.startEnd.setEnd(goalPosition);

    // generatePlayer
    const playerPosition = this.mapData.player.position;
    this.physicsEngine.setPlayer(
      new THREE.Vector3(playerPosition.x, 0, playerPosition.y),
    );
    this.startEnd.setStart(playerPosition);
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
