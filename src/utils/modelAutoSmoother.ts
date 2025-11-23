import * as THREE from "three/webgpu";

/**
 * Applies smooth shading to a GLTF model, similar to Blender's "Shade Auto Smooth".
 * Vertices with face normals differing less than `angle` (in radians) will be smoothed together.
 *
 * @param gltf THREE.GLTF scene or mesh hierarchy
 * @param angle Maximum angle between normals (in radians) for smoothing
 */
export function smoothGLTF(gltf: THREE.Object3D, angle: number): void {
  gltf.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      let geometry = mesh.geometry as THREE.BufferGeometry;

      // Ensure normals and indices exist
      geometry.computeVertexNormals();
      if (!geometry.index) {
        geometry = geometry.toNonIndexed();
      }

      const posAttr = geometry.attributes.position;
      const index = geometry.index!;
      const normals = new Float32Array(posAttr.count * 3);

      // Compute per-face normals
      const vA = new THREE.Vector3();
      const vB = new THREE.Vector3();
      const vC = new THREE.Vector3();
      const cb = new THREE.Vector3();
      const ab = new THREE.Vector3();
      const faceNormal = new THREE.Vector3();

      const faceNormals: THREE.Vector3[] = [];
      for (let i = 0; i < index.count; i += 3) {
        const a = index.getX(i);
        const b = index.getX(i + 1);
        const c = index.getX(i + 2);

        vA.fromBufferAttribute(posAttr, a);
        vB.fromBufferAttribute(posAttr, b);
        vC.fromBufferAttribute(posAttr, c);

        cb.subVectors(vC, vB);
        ab.subVectors(vA, vB);
        faceNormal.crossVectors(cb, ab).normalize();

        faceNormals.push(faceNormal.clone());
      }

      // Map from vertex index to connected faces
      const vertexFaces: number[][] = Array(posAttr.count)
        .fill(null)
        .map(() => []);
      for (let f = 0; f < faceNormals.length; f++) {
        const a = index.getX(f * 3);
        const b = index.getX(f * 3 + 1);
        const c = index.getX(f * 3 + 2);
        vertexFaces[a].push(f);
        vertexFaces[b].push(f);
        vertexFaces[c].push(f);
      }

      // For each vertex, average normals of connected faces within angle threshold
      const normal = new THREE.Vector3();
      for (let f = 0; f < faceNormals.length; f++) {
        const a = index.getX(f * 3);
        const b = index.getX(f * 3 + 1);
        const c = index.getX(f * 3 + 2);
        const faceN = faceNormals[f];

        [a, b, c].forEach((vIdx) => {
          normal.set(0, 0, 0);
          vertexFaces[vIdx].forEach((fIdx) => {
            if (faceNormals[fIdx].angleTo(faceN) < angle) {
              normal.add(faceNormals[fIdx]);
            }
          });
          normal.normalize();

          normals[vIdx * 3] = normal.x;
          normals[vIdx * 3 + 1] = normal.y;
          normals[vIdx * 3 + 2] = normal.z;
        });
      }

      geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
      geometry.attributes.normal.needsUpdate = true;
    }
  });
}
