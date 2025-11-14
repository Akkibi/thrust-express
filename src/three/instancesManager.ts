import * as THREE from "three/webgpu";

export class InstanceObjectManager {
  private static _instance: InstanceObjectManager;
  public static getInstance(): InstanceObjectManager {
    if (!InstanceObjectManager._instance) {
      InstanceObjectManager._instance = new InstanceObjectManager();
    }
    return InstanceObjectManager._instance;
  }

  public mesh: THREE.InstancedMesh;

  private readonly maxCount = 500;
  private freeIndices: number[] = [];
  private inUse: Set<number> = new Set();

  private dummy = new THREE.Object3D();

  private constructor() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("models/textures/walls.jpg");

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ map: texture });

    this.mesh = new THREE.InstancedMesh(geometry, material, this.maxCount);
    this.mesh.frustumCulled = false;

    // Initialize all instances as invisible / identity transforms
    for (let i = 0; i < this.maxCount; i++) {
      this.freeIndices.push(i);
      this.dummy.position.set(0, 0, 0);
      this.dummy.rotation.set(0, 0, 0);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
  }

  /** Acquire an instance index (returns null if exhausted). */
  public get(): number | null {
    if (this.freeIndices.length === 0) return null;
    const index = this.freeIndices.pop() as number;
    this.inUse.add(index);
    return index;
  }

  /** Update the transform of a specific instance. */
  public updatePosition = (index: number, position: THREE.Vector3): void => {
    if (!this.inUse.has(index)) return;
    this.dummy.position.copy(position);
    this.updateMatrix(index);
  };

  public updateScale = (index: number, scale: THREE.Vector3) => {
    if (!this.inUse.has(index)) return;
    this.dummy.scale.copy(scale);
    this.updateMatrix(index);
  };

  public updateRotation = (index: number, rotation: THREE.Euler) => {
    if (!this.inUse.has(index)) return;
    this.dummy.rotation.copy(rotation);
    this.updateMatrix(index);
  };

  private updateMatrix = (index: number) => {
    this.dummy.updateMatrix();
    this.mesh.setMatrixAt(index, this.dummy.matrix);
    this.mesh.instanceMatrix.needsUpdate = true;
  };

  /** Return an instance to the pool. */
  public release(index: number): void {
    if (!this.inUse.has(index)) return;

    this.inUse.delete(index);
    this.freeIndices.push(index);

    // Reset transform
    this.dummy.position.set(0, 0, 0);
    this.dummy.rotation.set(0, 0, 0);
    this.dummy.updateMatrix();
    this.mesh.setMatrixAt(index, this.dummy.matrix);
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  public releaseAll(): void {
    if (this.inUse.size === 0) return;
    for (const index of this.inUse) {
      this.release(index);
    }
  }

  /** Add the InstancedMesh to your scene. */
  public getMesh(): THREE.InstancedMesh {
    return this.mesh;
  }
}
