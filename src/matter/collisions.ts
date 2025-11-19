import Matter, { Engine, Body } from "matter-js";
import { eventEmitter } from "../utils/eventEmitter";
import { useStore } from "../store/store";

const triggerEndLevel = () => {
  const last = useStore.getState().lastLevel;

  if (last == null) return;

  const currentTime = useStore.getState().currentTimePassed;
  const health = useStore.getState().health;

  if (useStore.getState().health > 0) {
    useStore.getState().addLevelScore({
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
  } else {
    useStore.setState({
      lastLevelScore: null,
    });
  }
  useStore.setState({
    isPaused: true,
    isEndTitle: true,
  });
  eventEmitter.trigger("goalReached", [currentTime, health]);
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
          triggerEndLevel();
        }
      }

      if (isGoal && isPlayer) {
        triggerEndLevel();
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
