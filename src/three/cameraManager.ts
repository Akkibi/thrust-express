import * as THREE from "three/webgpu";
import { mapCoords } from "../matter/physicsEngine";
import { useStore } from "../store/store";
import gsap from "gsap";
import { StartEnd } from "./startEnd";
const cameraDefaultPosion = new THREE.Vector3(0, 14, 14);

export class CameraManager {
  private static instance: CameraManager;
  private camera: THREE.PerspectiveCamera;
  private cameraGroup: THREE.Group;
  private player: Matter.Body | null;
  private scene: THREE.Scene | null;

  private constructor() {
    this.scene = null;
    this.player = null;
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.cameraGroup = new THREE.Group();
    this.cameraGroup.position.set(0, 0, 0);
    this.camera.position.copy(cameraDefaultPosion);
    this.cameraGroup.add(this.camera);
    this.camera.lookAt(0, 0, 0);

    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  public static getInstance(): CameraManager {
    if (!CameraManager.instance) {
      CameraManager.instance = new CameraManager();
    }
    return CameraManager.instance;
  }

  public setScene = (scene: THREE.Scene) => {
    this.scene = scene;
    this.scene.add(this.cameraGroup);
  };

  public setPlayer(player: Matter.Body): void {
    this.player = player;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public goToStart(): void {
    this.update(0);
    useStore.setState({ isCutscene: true });
    const initial = cameraDefaultPosion.clone().multiplyScalar(1.5);
    gsap.fromTo(
      this.camera.position,
      {
        x: initial.x,
        y: initial.y,
        z: initial.z,
      },
      {
        duration: 1,
        ease: "expo.Out",
        x: cameraDefaultPosion.x,
        y: cameraDefaultPosion.y,
        z: cameraDefaultPosion.z,
        overwrite: true,
        onComplete: () => {
          useStore.setState({ isCutscene: false });
        },
      },
    );
  }

  public goToGoal(): void {
    useStore.setState({ isCutscene: true });

    const target = cameraDefaultPosion.clone().multiplyScalar(0.5);
    const goalPosition = StartEnd.getInstance().getEnd();
    const ajustedGoalPosition = goalPosition
      .clone()
      .add(new THREE.Vector2(0, -0.4));

    const tl = gsap.timeline({
      onComplete: () => useStore.setState({ isPaused: true }),
    });
    tl.to(this.cameraGroup.position, {
      x: ajustedGoalPosition.x,
      z: ajustedGoalPosition.y,
      ease: "expo.Out",
      duration: 3,
    }).fromTo(
      this.camera.position,
      {
        x: cameraDefaultPosion.x,
        y: cameraDefaultPosion.y,
        z: cameraDefaultPosion.z,
      },
      {
        overwrite: true,
        duration: 3,
        ease: "expo.Out",
        x: target.x,
        y: target.y,
        z: target.z,
      },
      "<",
    );
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
