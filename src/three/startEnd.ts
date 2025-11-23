import * as THREE from "three/webgpu";
import type { Vec2 } from "../types/types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class StartEnd {
  private static instance: StartEnd;
  public start: THREE.Vector2;
  public end: THREE.Vector2;
  private startModel: THREE.Group;
  private endModel: THREE.Group;
  private loader: GLTFLoader;

  private constructor() {
    StartEnd.instance = this;
    this.start = new THREE.Vector2(0, 0);
    this.end = new THREE.Vector2(0, 0);
    this.loader = new GLTFLoader();
    // loadStartModel
    this.startModel = new THREE.Group();
    this.loadStartModel();

    // loadEndModel
    this.endModel = new THREE.Group();
    this.loadEndModel();
    console.log("StartEnd loaded");
  }

  private loadStartModel() {
    // load /models/start/start.glb
    this.loader.load(
      "/models/start/start.glb",
      (gltf) => {
        const models = gltf.scene.children;
        models.forEach((child) => {
          this.startModel.add(child);
        });
      },
      undefined,
      (error) => {
        console.error(error);
      },
    );
  }

  private loadEndModel() {
    // load /models/end/end.glb
    this.loader.load(
      "/models/end/end.glb",
      (gltf) => {
        const models = [...gltf.scene.children];
        models.forEach((child) => {
          this.endModel.add(child);
        });
      },
      undefined,
      (error) => {
        console.error(error);
      },
    );
  }

  public init(scene: THREE.Scene) {
    scene.add(this.startModel);
    scene.add(this.endModel);
  }

  public static getInstance() {
    if (!StartEnd.instance) {
      StartEnd.instance = new StartEnd();
    }
    return StartEnd.instance;
  }

  public setStart(start: Vec2) {
    this.start.copy(start);
    this.startModel.position.set(start.x, 0, start.y);
  }

  public setEnd(end: Vec2) {
    this.end.copy(end);
    this.endModel.position.set(end.x, 0, end.y);
  }

  public getStart() {
    return this.start;
  }

  public getEnd() {
    return this.end;
  }

  public getStartModel() {
    return this.startModel;
  }

  public getEndModel() {
    return this.endModel;
  }
}
