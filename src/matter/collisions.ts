import Matter, { Engine, Body } from "matter-js";

export class CollisionWatcher {
  private static instance: CollisionWatcher;
  private character: Body;
  private currentCollisions: Set<Body>; // Use a Set for efficient add/remove and uniqueness

  private constructor(character: Body, engine: Engine) {
    this.character = character;
    this.currentCollisions = new Set();

    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (bodyA === this.character) {
          this.currentCollisions.add(bodyB);
        } else if (bodyB === this.character) {
          this.currentCollisions.add(bodyA);
        }
      });
    });

    Matter.Events.on(engine, "collisionEnd", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (bodyA === this.character) {
          this.currentCollisions.delete(bodyB);
        } else if (bodyB === this.character) {
          this.currentCollisions.delete(bodyA);
        }
      });
    });

    // You might also use 'collisionActive' if you need to know what's *currently* touching
    // But for jump detection, collisionStart/End is often sufficient to know if you're grounded.
  }

  static getInstance(character: Body, engine: Engine): CollisionWatcher {
    if (!CollisionWatcher.instance) {
      CollisionWatcher.instance = new CollisionWatcher(character, engine);
    }
    return CollisionWatcher.instance;
  }

  // With this event-driven approach, you don't need addBodies or updateCollisions
  // as all bodies in the engine are automatically considered for collisions.

  public getCollisions(): Body[] {
    return Array.from(this.currentCollisions);
  }
}

// Usage:
// const collisionWatcher = CollisionWatcher.getInstance(playerBody, engine);
// if (collisionWatcher.getCollisions().length > 0) {
//   // Character is touching something, can jump
// }
