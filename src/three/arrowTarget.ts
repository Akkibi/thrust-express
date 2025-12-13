import * as THREE from "three/webgpu";
import { mapCoords, PhysicsEngine } from "../matter/physicsEngine";
import { SceneManager } from "./scene";
import { loadGLTFModel } from "../utils/loadGLTFModel";

export class ArrowTarget {
  private meshGroup: THREE.Group;
  constructor() {
    this.meshGroup = new THREE.Group();

    // const arrow = new THREE.ArrowHelper(
    //   new THREE.Vector3(0, 0, 1),
    //   new THREE.Vector3(0, 0, 0),
    //   100,
    //   0x00ff00,
    // );
    // arrow.position.set(0, 0, 0);
    // this.meshGroup.add(arrow);

    loadGLTFModel(this.meshGroup, "/models/arrow/arrow.glb").then((model) => {
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log(child);
          child.rotation.y = Math.PI;
          child.position.y = 0.45;
          child.material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            wireframe: false,
            side: THREE.DoubleSide,
            opacity: 0.05,
            transparent: true,
          });
        }
      });
    });

    this.meshGroup.scale.multiplyScalar(2);

    SceneManager.getInstance().scene.add(this.meshGroup);
  }

  update() {
    const goalPos = PhysicsEngine.getInstance().getGoal()?.position;
    const playerPos = PhysicsEngine.getInstance().getPlayer()?.position;
    if (!goalPos || !playerPos) return;

    const vecGoalPos = new THREE.Vector3(goalPos.x, 0, goalPos.y);
    const vecPlayerPos = new THREE.Vector3(playerPos.x, 0, playerPos.y);

    const threeGoalPos = mapCoords(vecGoalPos, false);
    const threePlayerPos = mapCoords(vecPlayerPos, false);

    this.meshGroup.position.copy(threePlayerPos);
    this.meshGroup.lookAt(threeGoalPos);
  }
}
