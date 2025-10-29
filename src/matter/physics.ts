import Matter from "matter-js";
import { Visualizer } from "./visualizer";
import * as THREE from "three/webgpu";
import { lerp } from "three/src/math/MathUtils.js";

export const mapCoords = (
  position: THREE.Vector3,
  tToM: boolean,
): THREE.Vector3 => {
  const x = tToM ? (position.x + 1) * 1000 : position.x * 0.001 - 1;
  const y = tToM ? (position.y + 1) * 1000 : position.y * 0.001 - 1;
  const z = tToM ? (position.z + 1) * 1000 : position.z * 0.001 - 1;

  return new THREE.Vector3(x, y, z);
};

export interface vec2 {
  x: number;
  y: number;
}

const FORCE_SCALE = 0.1;

export class PhysicsEngine {
  private static _instance: PhysicsEngine;
  public engine: Matter.Engine;
  private player: Matter.Body;
  private visualizer: Visualizer;
  public playerRotation: number;
  public targetRotation: number;
  public isThrusting: boolean = false;

  private constructor() {
    this.targetRotation = 0;
    this.playerRotation = 0;
    this.engine = Matter.Engine.create();
    this.engine.gravity.scale = 0;
    // to be removed
    this.player = Matter.Bodies.circle(500, 500, 100, {
      restitution: 0,
      friction: 0.05,
    });
    this.restart();
    this.visualizer = Visualizer.getInstance(this.engine);
  }

  static getInstance(): PhysicsEngine {
    if (!this._instance) this._instance = new PhysicsEngine();
    return this._instance;
  }

  public restart() {
    // remove all bodies
    Matter.World.clear(this.engine.world, false);
    this.player = Matter.Bodies.circle(500, 500, 100, {
      restitution: 0,
      friction: 0.05,
    });

    Matter.World.add(this.engine.world, this.player);

    this.player.inertia = Infinity;

    Matter.World.add(this.engine.world, this.player);
  }

  public getPlayer = (): Matter.Body => this.player;

  public addObject(
    position: THREE.Vector3,
    size: THREE.Vector3,
    rotation?: number,
    moving: boolean = false,
  ): Matter.Body {
    const newCoord = mapCoords(position, true);

    // console.log(newCoord, {x: 40, y: 40});
    const object = Matter.Bodies.rectangle(
      newCoord.x,
      newCoord.y,
      size.x * 100,
      size.y * 100,
      { isStatic: !moving },
    );
    if (rotation) Matter.Body.rotate(object, rotation);

    Matter.World.add(this.engine.world, object);

    return object;
  }

  public addCircle(
    position: THREE.Vector3,
    radius: number,
    moving: boolean = false,
  ): Matter.Body {
    const newCoord = mapCoords(position, true);
    const scaledRadius = radius * 100;

    const circle = Matter.Bodies.circle(newCoord.x, newCoord.y, scaledRadius, {
      isStatic: !moving,
    });

    Matter.World.add(this.engine.world, circle);

    return circle;
  }

  public removeObject(object: Matter.Body): void {
    Matter.World.remove(this.engine.world, object);
  }

  public update(deltaTime: number): void {
    Matter.Engine.update(this.engine, deltaTime);
    this.visualizer.update();

    // const bodyVelocity = this.player.velocity;
    // Matter.Body.setVelocity(this.player, {
    //   x: bodyVelocity.x + this.playerThrust.x,
    //   y: bodyVelocity.y + this.playerThrust.y,
    // });

    this.playerRotation = lerp(this.playerRotation, this.targetRotation, 0.1);
    Matter.Body.setAngle(this.player, this.targetRotation);

    if (this.isThrusting) {
      const forceX = Math.cos(this.playerRotation);
      const forceY = Math.sin(this.playerRotation);

      Matter.Body.applyForce(this.player, this.player.position, {
        x: forceX * FORCE_SCALE,
        y: forceY * FORCE_SCALE,
      });
    }

    // console.log(this.isThrusting);
  }
}
