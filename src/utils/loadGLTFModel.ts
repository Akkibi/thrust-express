import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three/webgpu";

export async function loadGLTFModel(
  group: THREE.Group,
  url: string,
  positionCorrection?: THREE.Vector3,
): Promise<THREE.Group> {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene.children;
        if (model[0] && positionCorrection != null) {
          model.forEach((m) => m.position.add(positionCorrection));
        }
        group.add(...model);
        resolve(group);
      },
      undefined,
      (error) => reject(error),
    );
  });
}
