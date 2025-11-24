import Matter, { Engine, Body, Pair } from "matter-js";
import { globals, useStore } from "../store/store";
import { userDataStore } from "../store/userDataStore";
import { CameraManager } from "../three/cameraManager";
import { Player } from "../three/player";
import { ParticleSystemManager } from "../three/particlesSystemManager";
import * as THREE from "three/webgpu";
import { mapCoords } from "./physicsEngine";

const triggerEndLevel = () => {
  const last = useStore.getState().lastLevel;

  if (last == null) return;

  const currentTime = globals.currentTime;
  const health = useStore.getState().health;

  if (useStore.getState().health > 0) {
    userDataStore.getState().addLevelScore({
      levelName: last.name,
      time: currentTime,
      health: health,
    });
    useStore.setState({
      lastLevelScore: {
        levelName: last.name,
        time: currentTime,
        health: health,
      },
    });
    CameraManager.getInstance().goToGoal();
    Player.getInstance().goToGoal();
  } else {
    useStore.setState({
      lastLevelScore: null,
      isPaused: true,
    });
  }

  useStore.setState({
    isEndTitle: true,
  });
  // eventEmitter.trigger("goalReached", [currentTime, health]);
};

export class CollisionWatcher {
  private static instance: CollisionWatcher;
  private player: Body | null;
  private currentCollisions: Set<Pair>;
  private goal: Body | null;

  private constructor(engine: Engine) {
    this.player = null;
    this.goal = null;
    this.currentCollisions = new Set();

    Matter.Events.on(engine, "collisionStart", this.collisionStart.bind(this));
    Matter.Events.on(engine, "collisionEnd", this.collisionEnd.bind(this));
  }

  private collisionStart(event: Matter.IEventCollision<Matter.Engine>) {
    if (!this.player || !this.goal)
      throw new Error("CollisionWatcher.player or goal is null");
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;
      // console.log(bodyA, bodyB);
      const isGoal = bodyA === this.goal || bodyB === this.goal;
      const isPlayer = bodyA === this.player || bodyB === this.player;

      if (!isPlayer) return;

      // pair.contacts.forEach((contact) => {
      //   const vertex = contact.vertex;
      //   const player = this.player;
      //   if (!vertex || !player) return;
      //   const threePosition = mapCoords(
      //     new THREE.Vector3(contact.vertex.x, 0, contact.vertex.y),
      //     false,
      //   );
      //   const playerPosition = mapCoords(
      //     new THREE.Vector3(player.position.x, 0, player.position.y),
      //     false,
      //   );
      //   const diff = threePosition.clone().sub(playerPosition);
      //   console.log("diff", diff);

      //   ParticleSystemManager.getInstance().addParticle(
      //     "/point.png",
      //     threePosition,
      //     diff.multiplyScalar(-0.01),
      //     1000,
      //   );
      // });

      if (!isGoal) {
        console.log("Collision to wall");
        useStore.setState({ health: useStore.getState().health - 20 });
        this.currentCollisions.add(pair);
        if (useStore.getState().health <= 0) {
          triggerEndLevel();
        }
      }
      if (isGoal) {
        triggerEndLevel();
      }
    });
  }

  private collisionEnd(event: Matter.IEventCollision<Matter.Engine>) {
    if (!this.player) throw new Error("CollisionWatcher.player is null");
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;
      if (bodyA === this.player || bodyB === this.player) {
        this.currentCollisions.delete(pair);
      }
    });
  }

  public init(player: Body, goal: Body): void {
    console.log("init", player, goal);
    this.player = player;
    this.goal = goal;
  }

  static getInstance(engine: Engine): CollisionWatcher {
    if (!CollisionWatcher.instance) {
      CollisionWatcher.instance = new CollisionWatcher(engine);
    }
    return CollisionWatcher.instance;
  }

  public getCollisions(): Pair[] {
    return Array.from(this.currentCollisions);
  }

  public update(): void {
    if (this.currentCollisions.size <= 0) return;
    this.currentCollisions.forEach((pair) => {
      pair.contacts.forEach((contact) => {
        const vertex = contact.vertex;
        const player = this.player;
        if (!vertex || !player) return;
        const threePosition = mapCoords(
          new THREE.Vector3(contact.vertex.x, 0, contact.vertex.y),
          false,
        );
        const playerPosition = mapCoords(
          new THREE.Vector3(player.position.x, 0, player.position.y),
          false,
        );
        const diff = threePosition.clone().sub(playerPosition);
        // console.log("diff", diff);

        ParticleSystemManager.getInstance().addParticle(
          threePosition,
          diff.multiplyScalar(-0.01),
          10000,
        );
        console.log("create new particle");
      });
    });
  }
}
