import Matter, { Engine } from "matter-js";
import * as THREE from "three/webgpu";
import { CollisionWatcher } from "../matter/collisions";
import { loadGLTFModel } from "../utils/loadGLTFModel";
import { mapCoords } from "../matter/physics";

export class Player {
  private static _instance: Player;
  private instanceGroup: THREE.Group;
  private scene: THREE.Scene;
  private engine: Engine;
  private body: Matter.Body;
  public collisionWatcher: CollisionWatcher;

  public static getInstance(
    scene: THREE.Scene,
    body: Matter.Body,
    engine: Engine,
  ): Player {
    if (!Player._instance) {
      Player._instance = new Player(scene, body, engine);
    }
    return Player._instance;
  }

  private constructor(scene: THREE.Scene, body: Matter.Body, engine: Engine) {
    this.engine = engine;
    this.scene = scene;
    this.body = body;
    this.collisionWatcher = CollisionWatcher.getInstance(body, this.engine);
    // const width = body.bounds.max.x - body.bounds.min.x;
    // const height = body.bounds.max.y - body.bounds.min.y;
    this.instanceGroup = new THREE.Group();

    loadGLTFModel(this.instanceGroup, "/models/ship/spaceship.glb");
    this.instanceGroup.scale.set(0.1, 0.1, 0.1);
    this.scene.add(this.instanceGroup);
  }

  public getPosition(): THREE.Vector3 {
    return this.instanceGroup.position;
  }

  public update(time: number, deltatime: number): void {
    const body = this.body;

    const rotation = -body.angle + Math.PI / 2;
    const position = new THREE.Vector3(body.position.x, 0, body.position.y);
    const newPos = mapCoords(position, false);

    this.instanceGroup.rotation.set(0, rotation, 0);
    this.instanceGroup.position.set(newPos.x, newPos.y, newPos.z);

    if (deltatime < 0) {
      console.log(time, deltatime);
    }
  }
}
