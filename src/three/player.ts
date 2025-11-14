import Matter from "matter-js";
import * as THREE from "three/webgpu";
import { loadGLTFModel } from "../utils/loadGLTFModel";
import { mapCoords } from "../matter/physics";
import { useStore } from "../store/store";

export class Player {
  private static _instance: Player;
  private instanceGroup: THREE.Group;
  private scene: THREE.Scene;
  private body: Matter.Body | null;
  private flames: THREE.Object3D[] = [];
  private isLastThrusting: boolean = false;

  public static getInstance(scene: THREE.Scene): Player {
    if (!Player._instance) {
      Player._instance = new Player(scene);
    }
    return Player._instance;
  }

  private constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.body = null;
    // const width = body.bounds.max.x - body.bounds.min.x;
    // const height = body.bounds.max.y - body.bounds.min.y;
    this.instanceGroup = new THREE.Group();
    loadGLTFModel(this.instanceGroup, "/models/ship/spaceship.glb", {
      name: "flame",
      arrayToFill: this.flames,
    });
    this.instanceGroup.scale.set(0.1, 0.1, 0.1);
    this.scene.add(this.instanceGroup);
  }

  public initialize(body: Matter.Body): void {
    this.body = body;
  }

  public getPosition(): THREE.Vector3 {
    return this.instanceGroup.position;
  }

  public update(time: number, deltatime: number): void {
    const body = this.body;
    if (!body) return;

    if (this.flames && this.flames.length > 0) {
      const isThrusting = useStore.getState().isThrusting;
      if (isThrusting !== this.isLastThrusting) {
        this.isLastThrusting = isThrusting;
        if (isThrusting) {
          this.flames.forEach((flame) => {
            flame.scale.set(0.3, 0.4, 0.3);
          });
        } else {
          this.flames.forEach((flame) => {
            flame.scale.set(0.3, 0.3, 0.3);
          });
        }
      }
    }

    const rotation = -body.angle + Math.PI / 2;
    const position = new THREE.Vector3(body.position.x, 0, body.position.y);
    const newPos = mapCoords(position, false);

    this.instanceGroup.rotation.set(0, rotation, 0);
    this.instanceGroup.position.set(newPos.x, newPos.y, newPos.z);
    console.log(this.instanceGroup.position);

    if (deltatime < 0) {
      console.log(time, deltatime);
    }
  }
}
