import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three/webgpu";

export async function loadGLTFModel(
  group: THREE.Group,
  url: string,
): Promise<THREE.Group> {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene.children;
        group.add(...model);
        resolve(group);
      },
      undefined,
      (error) => reject(error),
    );
  });
}

// find 3d elements to put in array
export function find3dElements(
  name: string,
  group: THREE.Group | THREE.Scene,
): THREE.Object3D[] {
  const elements: THREE.Object3D[] = [];
  group.traverse((object) => {
    if (object.name.includes(name)) {
      elements.push(object);
    }
  });
  return elements;
}
