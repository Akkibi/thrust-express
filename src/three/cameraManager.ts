import * as THREE from "three/webgpu";

export class CameraManager {
  private static instance: CameraManager;
  private camera: THREE.PerspectiveCamera;
  private cameraGroup: THREE.Group;

  private constructor(scene: THREE.Scene) {
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.cameraGroup = new THREE.Group();
    this.cameraGroup.position.set(0, 2, -7);
    scene.add(this.cameraGroup);
    this.camera.position.set(0, 0, 0);
    this.camera.rotation.set(Math.PI, 0, Math.PI);
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

  // public update(time: number, deltatime: number): void {
  //   this.camera.position.y = Math.sin(time * 0.001 * deltatime) * 0.1;
  // }
}
