import * as THREE from "three/webgpu";
import { uv, attribute } from "three/tsl";
import {
  float,
  mix,
  positionLocal,
  sin,
  step,
  texture,
} from "three/src/nodes/TSL.js";

export class InstanceObjectManager {
  private static _instance: InstanceObjectManager;
  public static getInstance(): InstanceObjectManager {
    if (!InstanceObjectManager._instance) {
      InstanceObjectManager._instance = new InstanceObjectManager();
    }
    return InstanceObjectManager._instance;
  }

  public mesh: THREE.InstancedMesh;
  private readonly maxCount = 100;
  private freeIndices: number[] = [];
  private inUse: Set<number> = new Set();
  private dummy = new THREE.Object3D();

  // To store per-instance colors and texture scales
  private instanceColors: Float32Array;
  private instanceTextureScales: Float32Array;

  private constructor() {
    const textureLoader = new THREE.TextureLoader();
    const loadedTexture = textureLoader.load("models/textures/walls.png");
    loadedTexture.wrapS = THREE.RepeatWrapping;
    loadedTexture.wrapT = THREE.RepeatWrapping;
    loadedTexture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Define the instanceTextureScale attribute
    const instanceTextureScaleAttribute = attribute(
      "instanceTextureScale",
      "vec2",
    );

    // Your existing nodes
    const scaledUV = uv().mul(instanceTextureScaleAttribute);
    const mapNode = texture(loadedTexture, scaledUV);

    // Define gradient colors
    const bottomColor = float(0x000000); // black at the bottom

    // Gradient factor from UV
    const linearGradient = positionLocal.y.mul(0.1).add(1);
    const sinGradient = sin(positionLocal.y.mul(0.15)).add(1);
    // 0 at bottom, 1 at top

    // add condition to make t white from 0 to 0.1
    const whiteMask = sinGradient.mul(
      step(linearGradient, 0.9).oneMinus().mul(0.5).add(0.5),
    );

    // Create vertical gradient
    const gradient = mix(bottomColor, mapNode, whiteMask);

    // Combine texture color with gradient
    // const finalColor = mapNode.mul(gradient);

    // Material
    const material = new THREE.MeshBasicNodeMaterial();
    material.colorNode = gradient;

    this.mesh = new THREE.InstancedMesh(geometry, material, this.maxCount);
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.frustumCulled = false;
    this.mesh.position.set(0, 0, 0);
    // this.mesh.count = 0;
    // this.mesh.visible = false;
    this.dummy.visible = false;

    // Create instanceColor attribute
    this.instanceColors = new Float32Array(this.maxCount * 3);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(
      this.instanceColors,
      3,
    );

    // Create instanceTextureScale attribute
    this.instanceTextureScales = new Float32Array(this.maxCount * 2); // x and y for scale
    this.mesh.geometry.setAttribute(
      "instanceTextureScale",
      new THREE.InstancedBufferAttribute(this.instanceTextureScales, 2),
    );

    for (let i = 0; i < this.maxCount; i++) {
      this.freeIndices.push(i);
      this.dummy.position.set(0, 10, 0);
      this.dummy.rotation.set(0, 0, 0);
      this.dummy.scale.set(0, 0, 0);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);

      // Default color white
      this.setInstanceColor(i, new THREE.Color(1, 1, 1));
      // Default texture scale
      this.setInstanceTextureScale(i, new THREE.Vector2(1, 1));
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor.needsUpdate = true;
    this.mesh.geometry.attributes.instanceTextureScale.needsUpdate = true;
  }

  private setInstanceColor(index: number, color: THREE.Color) {
    this.instanceColors[index * 3] = color.r;
    this.instanceColors[index * 3 + 1] = color.g;
    this.instanceColors[index * 3 + 2] = color.b;
    this.mesh.instanceColor!.needsUpdate = true;
  }

  private setInstanceTextureScale(index: number, scale: THREE.Vector2) {
    this.instanceTextureScales[index * 2] = scale.x;
    this.instanceTextureScales[index * 2 + 1] = scale.y;
    this.mesh.geometry.attributes.instanceTextureScale.needsUpdate = true;
  }

  public get(): number | null {
    if (this.freeIndices.length === 0) return null;
    const index = this.freeIndices.pop() as number;
    this.inUse.add(index);
    return index;
  }

  public updatePosition = (index: number, position: THREE.Vector3): void => {
    if (!this.inUse.has(index)) return;

    this.dummy.position.copy(position);

    this.updateMatrix(index);
  };

  public updateScale = (index: number, scale: THREE.Vector3) => {
    if (!this.inUse.has(index)) return;

    this.dummy.scale.set(scale.x, scale.y, scale.z);

    const textureScaleX = scale.x * 0.25;
    const textureScaleY = scale.z * 0.25;

    this.setInstanceTextureScale(
      index,
      new THREE.Vector2(textureScaleX, textureScaleY),
    );

    this.updateMatrix(index);
  };

  public updateColor = (index: number, color: THREE.Color) => {
    if (!this.inUse.has(index)) return;
    this.setInstanceColor(index, color);
    // this.updateMatrix(index);
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

  public release(index: number): void {
    if (!this.inUse.has(index)) return;

    this.inUse.delete(index);
    this.freeIndices.push(index);

    this.dummy.position.set(0, 10, 0);
    this.dummy.rotation.set(0, 0, 0);
    this.dummy.scale.set(0, 0, 0);
    this.dummy.updateMatrix();
    this.mesh.setMatrixAt(index, this.dummy.matrix);
    this.setInstanceColor(index, new THREE.Color(1, 1, 1)); // reset color
    this.setInstanceTextureScale(index, new THREE.Vector2(1, 1)); // reset texture scale
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  public releaseAll(): void {
    if (this.inUse.size === 0) return;
    for (const index of this.inUse) {
      this.release(index);
    }
  }

  public getMesh(): THREE.InstancedMesh {
    return this.mesh;
  }
}
