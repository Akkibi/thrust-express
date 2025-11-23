import Matter from "matter-js";
import { Visualizer } from "./visualizer";
import * as THREE from "three/webgpu";
import { lerp } from "three/src/math/MathUtils.js";
import { globals, useStore } from "../store/store";

const Diff_SCALE = 100;
const FORCE_SCALE = 0.000004 * Diff_SCALE;

export const mapCoords = (
  position: THREE.Vector3,
  tToM: boolean,
): THREE.Vector3 => {
  const scale = tToM ? Diff_SCALE : 1 / Diff_SCALE;

  const x = position.x * scale;
  const y = position.y * scale;
  const z = position.z * scale;

  return new THREE.Vector3(x, y, z);
};

export interface vec2 {
  x: number;
  y: number;
}

const FIXED_STEP_DELTA = 1 / 60;

export class PhysicsEngine {
  private static _instance: PhysicsEngine;
  public engine: Matter.Engine;
  private player: Matter.Body | null;
  private goal: Matter.Body | null;
  private visualizer: Visualizer;
  public playerRotation: number;
  public targetRotation: number;
  public isThrusting: boolean = false;
  private acc: number;

  private constructor() {
    this.acc = 0;
    this.targetRotation = Math.PI / 2;
    this.playerRotation = Math.PI / 2;
    this.engine = Matter.Engine.create();
    this.engine.gravity.scale = 0;
    // to be removed
    this.player = null;
    this.goal = null;
    this.restart();
    this.visualizer = Visualizer.getInstance(this.engine);
  }

  static getInstance(): PhysicsEngine {
    if (!this._instance) this._instance = new PhysicsEngine();
    return this._instance;
  }

  public setPlayer = (position: THREE.Vector3) => {
    const newposition = mapCoords(position, true);

    this.player = Matter.Bodies.rectangle(
      newposition.x,
      newposition.z,
      60,
      30,
      {
        restitution: 0,
        frictionAir: 0,
        friction: 0,
        label: "player",
      },
    );
    this.targetRotation = Math.PI;
    this.playerRotation = Math.PI;

    Matter.World.add(this.engine.world, this.player);
  };

  public setGoal = (position: THREE.Vector3) => {
    const newposition = mapCoords(position, true);
    this.goal = Matter.Bodies.rectangle(newposition.x, newposition.z, 80, 80, {
      isStatic: true,
      label: "goal",
    });

    Matter.World.add(this.engine.world, this.goal);
  };

  public restart() {
    // remove all bodies
    Matter.World.clear(this.engine.world, false);
    console.log("reset physics engine");
  }

  public getPlayer = (): Matter.Body | null => this.player;
  public getGoal = (): Matter.Body | null => this.goal;

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
      newCoord.z,
      size.x * Diff_SCALE,
      size.z * Diff_SCALE,
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

  private rotationSmoother(deltaTime: number) {
    let shortestTargetRotation = this.targetRotation;

    if (this.targetRotation - this.playerRotation > Math.PI) {
      shortestTargetRotation -= Math.PI * 2;
    } else if (this.targetRotation - this.playerRotation < -Math.PI) {
      shortestTargetRotation += Math.PI * 2;
    }

    this.playerRotation = lerp(
      this.playerRotation,
      shortestTargetRotation,
      0.01 * deltaTime,
    );
  }

  public update = (deltatime: number): void => {
    this.visualizer.update();
    this.acc += Math.min(deltatime, 100);
    while (this.acc >= FIXED_STEP_DELTA) {
      this.step(FIXED_STEP_DELTA);
      this.acc -= FIXED_STEP_DELTA;
    }
  };

  private step = (deltaTime: number): void => {
    if (!this.player) return;

    this.rotationSmoother(deltaTime);
    Matter.Body.setAngle(this.player, this.playerRotation);

    const isThrust = useStore.getState().isThrusting;

    const forceX = Math.cos(this.targetRotation);
    const forceY = Math.sin(this.targetRotation);
    const multiplyer = isThrust ? 3 : 1;
    Matter.Body.applyForce(this.player, this.player.position, {
      x: forceX * FORCE_SCALE * multiplyer,
      y: forceY * FORCE_SCALE * multiplyer,
    });

    globals.thrustSpeed = this.player.speed;
    Matter.Engine.update(this.engine, deltaTime);
  };
}
