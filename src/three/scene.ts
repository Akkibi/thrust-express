import * as THREE from "three/webgpu";
import gsap from "gsap";
import { CameraManager } from "./cameraManager";
import { Environement } from "./environement";
import Stats from "stats.js";
import { PhysicsEngine } from "../matter/physics";
import { Player } from "./player";
import { globals, useStore } from "../store/store";
import { JoystickHandler } from "../utils/joystickHandler";
import { CollisionWatcher } from "../matter/collisions";
import { Cheats } from "../utils/cheats";
import { eventEmitter } from "../utils/eventEmitter";
import levels, { type LevelType } from "../levels";

export class SceneManager {
  private cheats: Cheats;
  private static instance: SceneManager;
  public canvas: HTMLDivElement | null;
  private scene: THREE.Scene;
  private joystickHandler: JoystickHandler;
  private renderer: THREE.WebGPURenderer;
  private camera: CameraManager;
  public env: Environement;
  private stats: Stats;
  private player: Player;
  private physicsEngine: PhysicsEngine;
  private collisionWatcher: CollisionWatcher;

  private constructor(canvas: HTMLDivElement) {
    // stats
    this.stats = new Stats();
    this.cheats = Cheats.getInstance();
    this.cheats.enable();
    // document.body.appendChild(this.stats.dom);
    document.getElementById("threeContainer")?.appendChild(this.stats.dom);
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.zIndex = "1";

    this.joystickHandler = JoystickHandler.getInstance();

    this.physicsEngine = PhysicsEngine.getInstance();
    this.scene = new THREE.Scene();

    this.player = Player.getInstance(this.scene);
    this.collisionWatcher = CollisionWatcher.getInstance(
      this.physicsEngine.engine,
    );

    this.canvas = canvas;
    this.renderer = new THREE.WebGPURenderer();
    this.renderer.init();
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera = CameraManager.getInstance(this.scene);
    this.env = Environement.getInstance(this.scene, this.physicsEngine);
    // ambian light
    const ambientLight = new THREE.AmbientLight(0x9090c0);
    this.scene.add(ambientLight);
    // sun light
    const sun = new THREE.DirectionalLight(0xffffff, 0.5);
    sun.position.set(1, 2, -1);
    this.scene.add(sun);

    gsap.ticker.add((time, deltatime) => this.animate(time, deltatime));
    window.addEventListener("resize", this.resize.bind(this));
    if (canvas) {
      this.init(canvas);
    }

    this.renderer.toneMapping = THREE.NoToneMapping;
    this.scene.environment = null;
    // this.scene.background = new THREE.Color(0x16161d);
    this.scene.background = new THREE.Color(0x000000);

    eventEmitter.on("start", this.restart.bind(this));
    eventEmitter.on("next-level", this.nextLevel.bind(this));
  }

  private nextLevel() {
    const currentLevel = useStore.getState().lastLevel;
    if (!currentLevel) return;
    const currentLevelIndex = levels.indexOf(currentLevel);
    this.restart(levels[currentLevelIndex + 1]);
  }
  public static getInstance(canvas: HTMLDivElement): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager(canvas);
    }
    return SceneManager.instance;
  }

  private resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const camera = this.camera.getCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  private init(canvas: HTMLDivElement) {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000);
    canvas.appendChild(this.renderer.domElement);
  }

  public restart = (level?: LevelType) => {
    const currentLevel = level;
    this.physicsEngine.restart();
    eventEmitter.trigger("loading", [true]);
    if (!currentLevel || !currentLevel.map) {
      this.loadEndless();
    } else {
      useStore.setState({ lastLevel: currentLevel });
      this.loadLevel(currentLevel);
    }
  };

  private loadEndless = () => {
    this.env.unloadLevels();
    this.env.loadEndless();
  };

  private loadLevel = (level: LevelType) => {
    if (!level.map) return;
    this.env.unloadEndless();
    this.env.loadConfig(level.map).then(() => {
      useStore.setState({
        isEndTitle: false,
        isMenuOpen: false,
        isPaused: false,
        health: 100,
      });
      globals.currentTime = 0;
      this.env.loadLevel(level);
      const player = this.physicsEngine.getPlayer();
      const goal = this.physicsEngine.getGoal();
      if (!player || !goal) return;
      this.collisionWatcher.initialize(player, goal);
      this.player.initialize(player);
      this.camera.initialize(player);
      eventEmitter.trigger("loading", [false]);
    });
  };

  private animate(time: number, deltatime: number) {
    this.stats.begin();
    if (useStore.getState().isPaused) return;
    this.renderer.render(this.scene, this.camera.getCamera());

    this.physicsEngine.targetRotation = this.joystickHandler.getAngle();

    this.physicsEngine.update(deltatime);

    this.player.update(time, deltatime);
    this.camera.update(deltatime);

    globals.currentTime += deltatime;
    this.stats.end();
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }
}
