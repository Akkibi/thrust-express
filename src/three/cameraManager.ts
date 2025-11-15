import * as THREE from "three/webgpu";
import { mapCoords } from "../matter/physics";

const cameraDefaultPosion = new THREE.Vector3(0, 14, 14);

export class CameraManager {
  private static instance: CameraManager;
  private camera: THREE.PerspectiveCamera;
  private cameraGroup: THREE.Group;
  private player: Matter.Body | null;

  private constructor(scene: THREE.Scene) {
    this.player = null;
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

  public static getInstance(scene: THREE.Scene): CameraManager {
    if (!CameraManager.instance) {
      CameraManager.instance = new CameraManager(scene);
    }
    return CameraManager.instance;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public initialize(player: Matter.Body): void {
    this.player = player;
  }

  public update(deltatime: number): void {
    if (!this.player) return;

    const position = new THREE.Vector3(
      this.player.position.x,
      0,
      this.player.position.y,
    );
    if (deltatime > 200) {
      console.log(deltatime);
    }
    const newPos = mapCoords(position, false);
    this.cameraGroup.position.copy(newPos);
    // this.camera.position.y = cameraDefaultPosion.y + Math.sin(time * 0.1) * 0.1;
    const targetCameraPosition = cameraDefaultPosion
      .clone()
      .multiplyScalar(1 + this.player.speed * 0.02);
    this.camera.position.lerp(targetCameraPosition, 0.1);
  }
}
