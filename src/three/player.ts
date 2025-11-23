import Matter from "matter-js";
import * as THREE from "three/webgpu";
import { loadGLTFModel } from "../utils/loadGLTFModel";
import { mapCoords } from "../matter/physicsEngine";
import { useStore } from "../store/store";
import { StartEnd } from "./startEnd";
import gsap from "gsap";

const DEFAULT_FLAMES_SCALE = new THREE.Vector3(0.3, 0.4, 0.3);

export class Player {
  private static _instance: Player;
  private instanceGroup: THREE.Group;
  private scene: THREE.Scene | null;
  private body: Matter.Body | null;
  private flames: THREE.Object3D[] = [];
  private isLastThrusting: boolean = false;

  public static getInstance(): Player {
    if (!Player._instance) {
      Player._instance = new Player();
    }
    return Player._instance;
  }

  public setScene(scene: THREE.Scene) {
    this.scene = scene;
    this.scene.add(this.instanceGroup);
  }

  private constructor() {
    this.body = null;
    this.scene = null;
    // const width = body.bounds.max.x - body.bounds.min.x;
    // const height = body.bounds.max.y - body.bounds.min.y;
    this.instanceGroup = new THREE.Group();
    loadGLTFModel(this.instanceGroup, "/models/ship/spaceship.glb", {
      name: "flame",
      arrayToFill: this.flames,
    });
    this.instanceGroup.scale.set(0.1, 0.1, 0.1);
  }

  public init(body: Matter.Body): void {
    this.body = body;
    this.update(0, 0);
  }

  public getPosition(): THREE.Vector3 {
    return this.instanceGroup.position;
  }

  public goToGoal() {
    const goalPosition = StartEnd.getInstance().getEnd();
    gsap.to(this.instanceGroup.position, {
      x: goalPosition.x,
      z: goalPosition.y,
      ease: "expo.out",
      duration: 1,
      onComplete: this.hideFlames,
    });
  }

  public goToStart() {
    const startPosition = StartEnd.getInstance().getStart();
    gsap.fromTo(
      this.instanceGroup.position,
      {
        x: startPosition.x,
        y: 10,
        z: startPosition.y + 1,
      },
      {
        x: startPosition.x,
        y: 0,
        z: startPosition.y,
        ease: "expo.out",
        duration: 1,
        overwrite: true,
        onComplete: this.showFlames,
      },
    );
  }

  private hideFlames = () => {
    if (this.flames && this.flames.length > 0) {
      this.flames.forEach((flame) => {
        flame.scale.multiplyScalar(0);
      });
    }
  };

  private showFlames = () => {
    if (this.flames && this.flames.length > 0) {
      this.flames.forEach((flame) => {
        flame.scale.copy(DEFAULT_FLAMES_SCALE);
      });
    }
  };

  public update(time: number, deltatime: number): void {
    const body = this.body;
    if (!body) return;

    if (this.flames && this.flames.length > 0) {
      const isThrusting = useStore.getState().isThrusting;
      if (isThrusting !== this.isLastThrusting) {
        this.isLastThrusting = isThrusting;
        if (isThrusting) {
          this.flames.forEach((flame) => {
            flame.scale.copy(DEFAULT_FLAMES_SCALE);
          });
        } else {
          this.flames.forEach((flame) => {
            flame.scale.copy(
              DEFAULT_FLAMES_SCALE.clone().add(new THREE.Vector3(0, 0.1, 0)),
            );
          });
        }
      }
    }

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
