import * as THREE from "three/webgpu";
import { mapCoords } from "../matter/physics";

const cameraDefaultPosion = new THREE.Vector3(0, 4, 7);

export class CameraManager {
  private static instance: CameraManager;
  private camera: THREE.PerspectiveCamera;
  private cameraGroup: THREE.Group;
  private player: Matter.Body;

  private constructor(scene: THREE.Scene, player: Matter.Body) {
    this.player = player;
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.cameraGroup = new THREE.Group();
    this.cameraGroup.position.set(0, 0, 0);
    scene.add(this.cameraGroup);
    this.camera.position.copy(cameraDefaultPosion);
    this.cameraGroup.add(this.camera);
    this.camera.lookAt(0, 0, 0);

    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  public static getInstance(
    scene: THREE.Scene,
    player: Matter.Body,
  ): CameraManager {
    if (!CameraManager.instance) {
      CameraManager.instance = new CameraManager(scene, player);
    }
    return CameraManager.instance;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public update(time: number, deltatime: number): void {
    const position = new THREE.Vector3(
      this.player.position.x,
      0,
      this.player.position.y,
    );
    const newPos = mapCoords(position, false);

    this.cameraGroup.position.lerp(newPos, 0.01 * deltatime);
    this.camera.position.y = cameraDefaultPosion.y + Math.sin(time * 0.1) * 0.1;
  }
}
