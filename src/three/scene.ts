import * as THREE from "three/webgpu";
import { mul, pass, uniform, uv, vec2, vec4 } from "three/tsl";
import gsap from "gsap";
import { CameraManager } from "./cameraManager";
import { Environement } from "./environement";
import Stats from "stats.js";
import { PhysicsEngine } from "../matter/physicsEngine";
import { Player } from "./player";
import { globals, useStore } from "../store/store";
import { JoystickHandler } from "../utils/joystickHandler";
import { CollisionWatcher } from "../matter/CollisionWatcher";
import { Cheats } from "../utils/cheats";
import { eventEmitter } from "../utils/eventEmitter";
import levels, { type LevelType } from "../levels";
import { ParticleSystemManager } from "./particlesSystemManager";
import { ArrowTarget } from "./arrowTarget";

export class SceneManager {
  private cheats: Cheats;
  private static instance: SceneManager;
  public canvas: HTMLDivElement | null;
  private joystickHandler: JoystickHandler;
  private renderer: THREE.WebGPURenderer;
  private camera: CameraManager;
  public env: Environement;
  private stats: Stats;
  private player: Player;
  private physicsEngine: PhysicsEngine;
  private collisionWatcher: CollisionWatcher;
  private particleSystemManager: ParticleSystemManager;
  private postProcessing: THREE.PostProcessing;
  private colorShift: THREE.UniformNode<number>;
  private arrowTarget: ArrowTarget;
  private scenes: { [key: string]: THREE.Scene };
  private currentScene: string;

  public constructor(canvas: HTMLDivElement) {
    SceneManager.instance = this;
    // stats
    this.stats = new Stats();
    this.cheats = Cheats.getInstance();
    this.cheats.enable();
    // document.body.appendChild(this.stats.dom);
    document.getElementById("threeContainer")?.appendChild(this.stats.dom);
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.zIndex = "1";
    this.stats.dom.style.top = "100px";

    this.joystickHandler = JoystickHandler.getInstance();
    this.physicsEngine = PhysicsEngine.getInstance();
    this.scenes = {};
    this.scenes.main = new THREE.Scene();
    this.scenes.menu = new THREE.Scene();

    this.currentScene = "main";

    this.arrowTarget = new ArrowTarget();
    this.player = Player.getInstance();
    this.collisionWatcher = CollisionWatcher.getInstance(
      this.physicsEngine.engine,
    );

    this.particleSystemManager = ParticleSystemManager.getInstance();
    this.particleSystemManager.setScene(this.scenes.main);
    this.particleSystemManager.setTexture("/point.png");

    this.canvas = canvas;
    this.scenes.main.environment = null;
    this.scenes.main.background = new THREE.Color(0x000000);
    this.camera = CameraManager.getInstance();
    // this.scene.background = new THREE.Color(0x16161d);

    this.camera.setScene(this.scenes.main);
    this.env = Environement.getInstance(this.scenes.main, this.physicsEngine);

    window.addEventListener("resize", this.resize.bind(this));

    this.renderer = new THREE.WebGPURenderer({ antialias: false });

    this.renderer.setPixelRatio(window.devicePixelRatio * 0.5);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000);

    this.renderer.init();

    this.renderer.shadowMap.enabled = false;
    this.renderer.toneMapping = THREE.NoToneMapping;
    canvas.appendChild(this.renderer.domElement);

    // --- Post Processing ---
    this.postProcessing = new THREE.PostProcessing(this.renderer);

    const scenePass = pass(this.scenes.main, this.camera.getCamera());
    const scenePassTexture = scenePass.getTextureNode();

    this.colorShift = uniform(1);
    const screenUV = uv();

    const shiftedRedUV = screenUV.add(
      vec2(
        0.0,
        screenUV.x
          .add(1.05)
          .sin()
          .mul(mul(this.colorShift, 0.15))
          .sub(mul(this.colorShift, 0.15)),
      ),
    );

    const shiftedGreenUV = screenUV.add(
      vec2(
        0.0,
        screenUV.x
          .add(1.05)
          .sin()
          .mul(mul(this.colorShift, 0.1))
          .sub(mul(this.colorShift, 0.1)),
      ),
    );

    const shiftedBlueUV = screenUV.add(
      vec2(
        0.0,
        screenUV.x
          .add(1.05)
          .sin()
          .mul(mul(this.colorShift, 0.05))
          .sub(mul(this.colorShift, 0.05)),
      ),
    );
    const shiftRed = scenePassTexture.sample(shiftedRedUV);
    const shiftGreen = scenePassTexture.sample(shiftedGreenUV);
    const shiftBlue = scenePassTexture.sample(shiftedBlueUV);

    const originalColor = scenePassTexture.sample(screenUV);

    const finalColor = vec4(
      shiftRed.r,
      shiftGreen.g,
      shiftBlue.b,
      originalColor.a,
    );

    this.postProcessing.outputNode = finalColor;

    eventEmitter.on("start", this.restart.bind(this));
    eventEmitter.on("next-level", this.nextLevel.bind(this));
    eventEmitter.on(
      "update-chromatic-aberration",
      this.updateChromaticAberration.bind(this),
    );
    gsap.ticker.add((time, deltatime) => this.animate(time, deltatime));
  }

  public setScene = (name: string) => {
    this.currentScene = name;
  };

  private updateChromaticAberration(value: number) {
    this.colorShift.value = value;
  }

  public static getInstance(): SceneManager {
    return SceneManager.instance;
  }

  private nextLevel() {
    const currentLevel = useStore.getState().lastLevel;
    if (!currentLevel) return;
    const currentLevelIndex = levels.indexOf(currentLevel);
    this.restart(levels[currentLevelIndex + 1]);
  }

  private resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const camera = this.camera.getCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  public restart = (level?: LevelType) => {
    gsap.globalTimeline.clear();
    const currentLevel = level;
    this.physicsEngine.restart();
    this.particleSystemManager.removeAll();
    eventEmitter.trigger("loading", [true]);
    requestAnimationFrame(() => {
      if (!currentLevel || !currentLevel.map) {
        this.loadEndless();
      } else {
        useStore.setState({ lastLevel: currentLevel });
        this.loadLevel(currentLevel);
      }
    });
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
      this.collisionWatcher.init(player, goal);
      this.player.init(player);
      this.camera.setPlayer(player);
      this.camera.goToStart();
      this.player.goToStart();
      this.joystickHandler.setJoyStickAngle(-Math.PI / 2);
      eventEmitter.trigger("loading", [false]);
    });
  };

  private animate(time: number, deltatime: number) {
    this.stats.begin();
    if (useStore.getState().isPaused) return;
    if (!useStore.getState().isCutscene) {
      globals.currentTime += deltatime;
      this.physicsEngine.targetRotation = this.joystickHandler.getAngle();

      this.physicsEngine.update(deltatime);

      this.player.update(time, deltatime);
      this.arrowTarget.update();
      this.camera.update(deltatime);

      this.collisionWatcher.update();
    }

    this.particleSystemManager.update(deltatime);

    if (useStore.getState().isPostProcessingOn) {
      this.postProcessing.render();
    } else {
      this.renderer.render(
        this.scenes[this.currentScene],
        this.camera.getCamera(),
      );
    }
    this.stats.end();
  }

  public getScene(name?: string): THREE.Scene {
    if (!name) return this.scenes[this.currentScene];
    return this.scenes[name] ?? this.scenes.main;
  }
}
