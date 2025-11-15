import Matter, { Engine, Body } from "matter-js";
import { eventEmitter } from "../utils/eventEmitter";
import { useStore } from "../store/store";
import { lastLevel } from "../levels";

const triggerEndScreen = () => {
  console.log("ResetGame");
  eventEmitter.trigger("goalReached", [
    useStore.getState().health,
    useStore.getState().currentTimePassed,
  ]);
  useStore.setState({ isPaused: true, isEndTitle: true });
  const last = lastLevel.level;
  if (useStore.getState().health <= 0 || last == null) return;
  useStore.getState().levelsDone.push({
    levelName: last.name,
    time: useStore.getState().currentTimePassed,
    score: useStore.getState().score,
  });
};

export class CollisionWatcher {
  private static instance: CollisionWatcher;
  private player: Body | null;
  private currentCollisions: Set<Body>;
  private goal: Body | null;

  private constructor(engine: Engine) {
    this.player = null;
    this.goal = null;
    this.currentCollisions = new Set();

    Matter.Events.on(engine, "collisionStart", this.collisionStart.bind(this));
    Matter.Events.on(engine, "collisionEnd", this.collisionEnd.bind(this));
  }

  private collisionStart(event: Matter.IEventCollision<Matter.Engine>) {
    if (!this.player || !this.goal) return;
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;
      // console.log(bodyA, bodyB);

      const isGoal = bodyA === this.goal || bodyB === this.goal;
      const isPlayer = bodyA === this.player || bodyB === this.player;

      if (isPlayer && !isGoal) {
        console.log("Collision to wall");
        useStore.setState({ health: useStore.getState().health - 20 });
        if (useStore.getState().health <= 0) {
          triggerEndScreen();
        }
      }

      if (isGoal && isPlayer) {
        triggerEndScreen();
      } else if (bodyA === this.player) {
        this.currentCollisions.add(bodyB);
      } else if (bodyB === this.player) {
        this.currentCollisions.add(bodyA);
      }
    });
  }

  private collisionEnd(event: Matter.IEventCollision<Matter.Engine>) {
    if (!this.player) return;
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;
      if (bodyA === this.player) {
        this.currentCollisions.delete(bodyB);
      } else if (bodyB === this.player) {
        this.currentCollisions.delete(bodyA);
      }
    });
  }

  public initialize(player: Body, goal: Body): void {
    console.log("initialize", player, goal);
    this.player = player;
    this.goal = goal;
  }

  static getInstance(engine: Engine): CollisionWatcher {
    if (!CollisionWatcher.instance) {
      CollisionWatcher.instance = new CollisionWatcher(engine);
    }
    return CollisionWatcher.instance;
  }

  public getCollisions(): Body[] {
    return Array.from(this.currentCollisions);
  }
}
