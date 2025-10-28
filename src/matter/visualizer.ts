import Matter from "matter-js";

export class Visualizer {
  private static instance: Visualizer;
  private render: Matter.Render | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private visible = false;
  private engine: Matter.Engine;
  private width: number;
  private height: number;

  private constructor(
    engine: Matter.Engine,
    width = window.innerWidth,
    height = window.innerHeight,
  ) {
    this.engine = engine;
    this.width = width;
    this.height = height;
    this.setupCanvas();
    document.addEventListener("keydown", (event) => {
      if (event.key === "$") {
        this.toggle();
      }
    });
  }

  static getInstance(engine: Matter.Engine): Visualizer {
    if (!Visualizer.instance) {
      Visualizer.instance = new Visualizer(engine);
    }
    return Visualizer.instance;
  }

  private setupCanvas(): void {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "50%";
    this.canvas.style.left = "50%";
    this.canvas.style.border = "1px solid #888";
    this.canvas.style.display = "none";
    this.canvas.style.transform = "scale(0.25) translate(-50%, -50%)";
    document.body.appendChild(this.canvas);

    this.render = Matter.Render.create({
      engine: this.engine,
      canvas: this.canvas,
      options: {
        width: this.width,
        height: this.height,
        wireframes: true,
        background: "#000000",
      },
    });

    Matter.Render.run(this.render);
  }

  toggle(): void {
    if (!this.canvas) return;
    this.visible = !this.visible;
    this.canvas.style.display = this.visible ? "block" : "none";
  }

  update(): void {
    if (!this.visible || !this.render) return;

    // // Ensure bodies are still in world
    // const worldBodies = Matter.Composite.allBodies(this.engine.world);
    // this.bodies.forEach(b => {
    //   if (!worldBodies.includes(b)) {
    //     Matter.World.add(this.engine.world, b);
    //   }
    // });

    Matter.Render.world(this.render);
  }
}
