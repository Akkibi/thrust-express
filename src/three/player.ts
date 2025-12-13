import Matter from "matter-js";
import * as THREE from "three/webgpu";
import { find3dElements, loadGLTFModel } from "../utils/loadGLTFModel";
import { mapCoords } from "../matter/physicsEngine";
import { globals, useStore } from "../store/store";
import { StartEnd } from "./startEnd";
import gsap from "gsap";
import { ParticleSystemManager } from "./particlesSystemManager";
import { lerp } from "three/src/math/MathUtils.js";
import { SceneManager } from "./scene";

const DEFAULT_FLAMES_SCALE = new THREE.Vector3(0.3, 0.4, 0.3);
const DEFAULT_SCALE = new THREE.Vector3(0.1, 0.1, 0.1);

export class Player {
  private static _instance: Player;
  private instanceGroup: THREE.Group;
  private body: Matter.Body | null;
  private flames: THREE.Object3D[] = [];
  private package: THREE.Object3D[] = [];
  private packagesDefaultPosition: THREE.Vector3[] = [];

  public static getInstance(): Player {
    if (!Player._instance) {
      Player._instance = new Player();
    }
    return Player._instance;
  }

  private constructor() {
    this.body = null;
    // const width = body.bounds.max.x - body.bounds.min.x;
    // const height = body.bounds.max.y - body.bounds.min.y;
    this.instanceGroup = new THREE.Group();

    loadGLTFModel(this.instanceGroup, "/models/ship/spaceship.glb").then(
      (model) => {
        const elemsArray = find3dElements("flame", model);
        this.flames.push(...elemsArray);
        this.flames.forEach((flame) => {
          flame.visible = false;
        });

        const parcels = find3dElements("package", model);
        parcels.forEach((parcel) => {
          this.packagesDefaultPosition.push(parcel.position.clone());
        });
        this.package.push(...parcels);
      },
    );

    this.instanceGroup.scale.copy(DEFAULT_SCALE);
    SceneManager.getInstance().scene.add(this.instanceGroup);
  }

  public init(body: Matter.Body): void {
    this.body = body;
    this.update(0, 0);
    this.instanceGroup.rotation.z = 0;
  }

  public getPosition(): THREE.Vector3 {
    return this.instanceGroup.position;
  }

  public goToGoal() {
    const goalPosition = StartEnd.getInstance().getEnd();
    const tl = gsap.timeline({
      onComplete: () => {
        tl.kill();
      },
    });

    tl.to(this.instanceGroup.position, {
      x: goalPosition.x,
      z: goalPosition.y,
      ease: "expo.out",
      duration: 1,
    })
      .to(
        this.instanceGroup.rotation,
        {
          z: 0,
          ease: "expo.out",
          duration: 1,
        },
        "<",
      )
      .to(
        [...this.package.map((p) => p.position)],
        {
          y: -40,
          ease: "expo.in",
          duration: 1,
        },
        "0.5",
      );
  }

  public goToStart() {
    console.log(this.package, this.packagesDefaultPosition);
    this.package.forEach((parcel, index) => {
      parcel.position.copy(this.packagesDefaultPosition[index]);
    });
    this.instanceGroup.scale.copy(DEFAULT_SCALE);
    const startPosition = StartEnd.getInstance().getStart();
    gsap.fromTo(
      this.instanceGroup.position,
      {
        x: startPosition.x,
        y: 10,
        z: startPosition.y + 1,
      },
      {
        x: startPosition.x,
        y: 0,
        z: startPosition.y,
        ease: "expo.out",
        duration: 1,
        overwrite: true,
      },
    );
  }

  public explode() {
    this.instanceGroup.scale.multiplyScalar(0);

    const position = this.getPosition();

    for (let i = 0; i < 75; i++) {
      this.generateExplodeParticle(position);
    }
    requestAnimationFrame(() => {
      for (let i = 0; i < 75; i++) {
        this.generateExplodeParticle(position);
      }
    });
  }

  private generateExplodeParticle(position: THREE.Vector3) {
    const randomVelocity = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5,
    );

    const expoRandomVelocity = new THREE.Vector3(
      Math.abs(randomVelocity.x) * randomVelocity.x,
      Math.abs(randomVelocity.y) * randomVelocity.y,
      Math.abs(randomVelocity.z) * randomVelocity.z,
    ).multiplyScalar(0.04);

    const randomValue1 = Math.random();
    const randomValue2 = Math.random();
    const randomColor = new THREE.Color(
      randomValue1,
      (randomValue1 + randomValue2) / 2,
      randomValue2,
    );
    const randomScale = new THREE.Vector2(
      Math.random() * 0.5 + 0.5,
      Math.random() * 0.5 + 0.5,
    ).multiplyScalar(0.1);

    ParticleSystemManager.getInstance().addParticle(
      position,
      expoRandomVelocity,
      1000 * Math.random(),
      randomScale,
      Math.random(),
      randomColor,
    );
  }

  // private hideFlames = () => {
  //   if (this.flames && this.flames.length > 0) {
  //     this.flames.forEach((flame) => {
  //       flame.scale.multiplyScalar(0);
  //     });
  //   }
  // };

  // private showFlames = () => {
  //   if (this.flames && this.flames.length > 0) {
  //     this.flames.forEach((flame) => {
  //       flame.scale.copy(DEFAULT_FLAMES_SCALE);
  //     });
  //   }
  // };

  public update(time: number, deltatime: number): void {
    const body = this.body;
    if (!body) return;

    const rotation = -body.angle + Math.PI / 2;
    const position = new THREE.Vector3(body.position.x, 0, body.position.y);
    const newPos = mapCoords(position, false);

    // if (this.flames && this.flames.length > 0) {
    //   const isThrusting = useStore.getState().isThrusting;
    //   if (isThrusting !== this.isLastThrusting) {
    //     this.isLastThrusting = isThrusting;
    //     if (isThrusting) {
    //       this.flames.forEach((flame) => {
    //         flame.scale.copy(DEFAULT_FLAMES_SCALE);
    //       });
    //     } else {
    //       this.flames.forEach((flame) => {
    //         flame.scale.copy(
    //           DEFAULT_FLAMES_SCALE.clone().add(new THREE.Vector3(0, 0.1, 0)),
    //         );
    //       });
    //     }
    //   }
    // }

    const angleVector = new THREE.Vector3(
      Math.sin(rotation),
      0,
      Math.cos(rotation),
    );

    // hurt wiggle
    const hurtAmount = (100 - useStore.getState().health) * 0.1;
    const wiggle = Math.sin(time * hurtAmount * 2) * hurtAmount * 0.2;
    const smoothedWiggle = lerp(
      this.instanceGroup.rotation.z,
      wiggle,
      0.01 * deltatime,
    );

    this.flames.forEach((flame) => {
      flame.scale.copy(DEFAULT_FLAMES_SCALE);
      const worldPos = new THREE.Vector3(0, 0, 0);
      flame.getWorldPosition(worldPos);

      // gradualy change color when hurt to gray
      const color = new THREE.Color(0.2, 0.6, 1);
      const hurtColor = new THREE.Color(0.5, 0.25, 0.0);

      color.lerp(hurtColor, hurtAmount * 0.1);

      const color2 = new THREE.Color(0.1, 0.02, 0.5);
      const hurtColor2 = new THREE.Color(0.5, 0.5, 0.5);

      color2.lerp(hurtColor2, hurtAmount * 0.1);

      const particleSpeed = angleVector
        .clone()
        .multiplyScalar(globals.thrustSpeed)
        .multiplyScalar(-0.0001)
        .multiplyScalar(1 + hurtAmount * Math.random() * 0.1);

      ParticleSystemManager.getInstance().addParticle(
        worldPos.add(angleVector.clone().multiplyScalar(-0.1)),
        particleSpeed,
        3000,
        new THREE.Vector2(
          0.01 * globals.thrustSpeed,
          0.03 * globals.thrustSpeed,
        ),
        rotation,
        color,
        0.2,
        color2,
      );
      // ParticleSystemManager.getInstance().addParticle(
      //   worldPos.add(angleVector.clone().multiplyScalar(-0.01)),
      //   angleVector.clone().multiplyScalar(-0.0001),
      //   3000,
      //   new THREE.Vector2(
      //     0.015 * globals.thrustSpeed,
      //     0.03 * globals.thrustSpeed,
      //   ),
      //   rotation,
      // );
    });

    this.instanceGroup.rotation.set(0, rotation, smoothedWiggle);
    this.instanceGroup.position.lerp(newPos, 0.8);
  }
}
