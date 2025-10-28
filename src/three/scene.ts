import * as THREE from "three/webgpu";
import gsap from "gsap";
import { CameraManager } from "./cameraManager";
import { Environement } from "./environement";
import Stats from "stats.js";
import { PhysicsEngine } from "../matter/physics";
import { Player } from "./player";
import { useStore } from "../store/store";
// import { FallingManager } from "./fallingManager";

export class SceneManager {
  private static instance: SceneManager;
  public canvas: HTMLDivElement | null;
  private scene: THREE.Scene;

  private renderer: THREE.WebGPURenderer;
  private camera: CameraManager;
  public env: Environement;
  private stats: Stats;
  private player: Player;
  private physicsEngine: PhysicsEngine;
  // private fallingManager: FallingManager;

  private constructor(canvas: HTMLDivElement | null) {
    // stats
    this.physicsEngine = PhysicsEngine.getInstance();
    this.stats = new Stats();
    // document.body.appendChild(this.stats.dom);
    this.scene = new THREE.Scene();
    this.player = Player.getInstance(
      this.scene,
      this.physicsEngine.getPlayer(),
      this.physicsEngine.engine,
    );
    // this.scene.background = new THREE.Color(0x111121);
    this.canvas = canvas;
    // this.water = Water.getInstance(this.scene);
    this.renderer = new THREE.WebGPURenderer();
    this.renderer.init();
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera = CameraManager.getInstance(this.scene);
    this.env = Environement.getInstance(this.scene);
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
    this.scene.background = new THREE.Color(0x111121);
  }

  public static getInstance(canvas: HTMLDivElement | null): SceneManager {
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

  public restart = () => {
    useStore.setState({ isGameOver: false });
    this.physicsEngine.restart();
  };

  private animate(time: number, deltatime: number) {
    this.stats.begin();
    this.renderer.render(this.scene, this.camera.getCamera());
    // this.camera.update(time, deltatime);
    if (useStore.getState().isPaused && time > 0.2) return;
    this.physicsEngine.update(deltatime);

    this.player.update(time, deltatime);

    this.stats.end();
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }
}
