import * as THREE from "three";

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  lifetime: number;
  maxLifetime: number;
}

export class ParticleSystemManager {
  private static instance: ParticleSystemManager;
  private scene: THREE.Scene;
  private particles: Particle[] = [];
  private textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
  private defaultMaterial: THREE.MeshBasicMaterial;

  private constructor(scene: THREE.Scene) {
    this.scene = scene;
    // Create a default material for particles if no image is provided, or if there's an issue loading.
    this.defaultMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
  }

  public static getInstance(scene: THREE.Scene): ParticleSystemManager {
    if (!ParticleSystemManager.instance) {
      ParticleSystemManager.instance = new ParticleSystemManager(scene);
    }
    return ParticleSystemManager.instance;
  }

  /**
   * Adds a new particle to the system.
   * @param img The URL of the image to use for the particle's texture.
   * @param position The initial position of the particle.
   * @param velocity The initial velocity of the particle.
   * @param duration The lifespan of the particle in seconds.
   */
  public addParticle(
    img: string,
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    duration: number,
  ): void {
    const geometry = new THREE.PlaneGeometry(0.5, 0.5); // Smaller default size for particles

    this.textureLoader.load(
      img,
      (texture) => {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.5, // Helps with rendering transparent textures
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        this.scene.add(mesh);
        this.particles.push({
          mesh: mesh,
          velocity: velocity,
          lifetime: duration,
          maxLifetime: duration,
        });
      },
      undefined, // onProgress callback (optional)
      (error) => {
        console.error("An error occurred loading the particle texture:", error);
        // Fallback to default material if image fails to load
        const mesh = new THREE.Mesh(geometry, this.defaultMaterial);
        mesh.position.copy(position);
        this.scene.add(mesh);
        this.particles.push({
          mesh: mesh,
          velocity: velocity,
          lifetime: duration,
          maxLifetime: duration,
        });
      },
    );
  }

  /**
   * Removes all particles from the system and the scene.
   */
  public reset(): void {
    for (const particle of this.particles) {
      this.scene.remove(particle.mesh);
      particle.mesh.geometry.dispose();
      (particle.mesh.material as THREE.Material).dispose(); // Dispose of material
    }
    this.particles = [];
    console.log("All particles reset.");
  }

  /**
   * Updates the position and lifetime of all active particles.
   * @param deltaTime The time elapsed since the last update in seconds.
   */
  public update(deltaTime: number): void {
    const particlesToRemove: number[] = [];

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      // Update position
      particle.mesh.position.x += particle.velocity.x * deltaTime;
      particle.mesh.position.y += particle.velocity.y * deltaTime;
      particle.mesh.position.z += particle.velocity.z * deltaTime;

      // Update lifetime
      particle.lifetime -= deltaTime;

      // Fade out particle as it approaches end of life
      if (particle.lifetime <= 1) {
        // Start fading in the last second
        const material = particle.mesh.material as THREE.MeshBasicMaterial;
        if (material.transparent) {
          material.opacity = Math.max(0, particle.lifetime / 1); // Fade from 1 to 0 over 1 second
        }
      }

      if (particle.lifetime <= 0) {
        particlesToRemove.push(i);
      }
    }

    // Remove expired particles (iterate backwards to avoid index issues)
    for (let i = particlesToRemove.length - 1; i >= 0; i--) {
      const index = particlesToRemove[i];
      const particle = this.particles[index];
      this.scene.remove(particle.mesh);
      particle.mesh.geometry.dispose();
      (particle.mesh.material as THREE.Material).dispose();
      this.particles.splice(index, 1);
    }
  }
}
