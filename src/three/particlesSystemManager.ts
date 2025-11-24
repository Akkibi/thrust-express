import * as THREE from "three";

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  lifetime: number;
  maxLifetime: number;
  index: number;
}

export class ParticleSystemManager {
  private static instance: ParticleSystemManager;
  private scene: THREE.Scene | null;
  private particles: Particle[] = [];
  private textureLoader: THREE.TextureLoader = new THREE.TextureLoader();

  // Points system components
  private particleGeometry: THREE.BufferGeometry;
  private particleMaterial: THREE.PointsMaterial;
  private particleSystem: THREE.Points;
  private positions: Float32Array;
  private colors: Float32Array;
  private sizes: Float32Array;
  private maxParticles: number = 10000;

  private constructor() {
    this.scene = null;

    // Initialize particle geometry with buffer attributes
    this.particleGeometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.maxParticles * 3);
    this.colors = new Float32Array(this.maxParticles * 3);
    this.sizes = new Float32Array(this.maxParticles);

    this.particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3),
    );
    this.particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(this.colors, 3),
    );
    this.particleGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(this.sizes, 1),
    );

    // Create particle material
    this.particleMaterial = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    // Create the particle system
    this.particleSystem = new THREE.Points(
      this.particleGeometry,
      this.particleMaterial,
    );
    this.particleSystem.position.set(0, 0, 0);
  }

  public setScene(scene: THREE.Scene) {
    if (this.scene && this.particleSystem) {
      this.scene.remove(this.particleSystem);
    }
    this.scene = scene;
    if (scene) {
      scene.add(this.particleSystem);
    }
  }

  public static getInstance(): ParticleSystemManager {
    if (!ParticleSystemManager.instance) {
      ParticleSystemManager.instance = new ParticleSystemManager();
    }
    return ParticleSystemManager.instance;
  }

  /**
   * Loads a texture for the particle system
   * @param img The URL of the image to use for the particle's texture
   */
  public setTexture(img: string): void {
    this.textureLoader.load(
      img,
      (texture) => {
        this.particleMaterial.map = texture;
        this.particleMaterial.needsUpdate = true;
      },
      undefined,
      (error) => {
        console.error("Error loading particle texture:", error);
      },
    );
  }

  /**
   * Adds a new particle to the system
   * @param position The initial position of the particle
   * @param velocity The initial velocity of the particle
   * @param duration The lifespan of the particle in seconds
   * @param color Optional color for the particle (default: white)
   * @param size Optional size for the particle (default: 0.5)
   */
  public addParticle(
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    duration: number,
    color: THREE.Color = new THREE.Color(0xffffff),
    size: number = 0.5,
  ): void {
    if (!this.scene) return;
    if (this.particles.length >= this.maxParticles) {
      console.warn("Max particles reached");
      return;
    }

    const index = this.particles.length;

    // Set position
    this.positions[index * 3] = position.x;
    this.positions[index * 3 + 1] = position.y;
    this.positions[index * 3 + 2] = position.z;

    // Set color
    this.colors[index * 3] = color.r;
    this.colors[index * 3 + 1] = color.g;
    this.colors[index * 3 + 2] = color.b;

    // Set size
    this.sizes[index] = size;

    // Add to particle array
    this.particles.push({
      position: position.clone(),
      velocity: velocity.clone(),
      lifetime: duration,
      maxLifetime: duration,
      index: index,
    });

    // Update geometry
    this.particleGeometry.attributes.position.needsUpdate = true;
    this.particleGeometry.attributes.color.needsUpdate = true;
    this.particleGeometry.attributes.size.needsUpdate = true;
    this.particleGeometry.setDrawRange(0, this.particles.length);
  }

  /**
   * Emits multiple particles at once (useful for bursts)
   * @param count Number of particles to emit
   * @param position Center position for the emission
   * @param velocityRange Range for random velocity components
   * @param duration Particle lifespan
   * @param color Particle color
   * @param size Particle size
   */
  public emitBurst(
    count: number,
    position: THREE.Vector3,
    velocityRange: {
      x: [number, number];
      y: [number, number];
      z: [number, number];
    },
    duration: number,
    color: THREE.Color = new THREE.Color(0xffffff),
    size: number = 0.5,
  ): void {
    for (let i = 0; i < count; i++) {
      const velocity = new THREE.Vector3(
        Math.random() * (velocityRange.x[1] - velocityRange.x[0]) +
          velocityRange.x[0],
        Math.random() * (velocityRange.y[1] - velocityRange.y[0]) +
          velocityRange.y[0],
        Math.random() * (velocityRange.z[1] - velocityRange.z[0]) +
          velocityRange.z[0],
      );
      this.addParticle(position, velocity, duration, color, size);
    }
  }

  /**
   * Removes all particles from the system
   */
  public reset(): void {
    this.particles = [];
    this.particleGeometry.setDrawRange(0, 0);
    console.log("All particles reset.");
  }

  /**
   * Updates the position and lifetime of all active particles
   * @param deltaTime The time elapsed since the last update in seconds
   */
  public update(deltaTime: number): void {
    if (!this.scene || this.particles.length === 0) return;

    let writeIndex = 0;

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      // Update position
      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;
      particle.position.z += particle.velocity.z * deltaTime;

      // Update lifetime
      particle.lifetime -= deltaTime;

      // If particle is still alive, update its buffer data
      if (particle.lifetime > 0) {
        // Write to buffer at writeIndex
        this.positions[writeIndex * 3] = particle.position.x;
        this.positions[writeIndex * 3 + 1] = particle.position.y;
        this.positions[writeIndex * 3 + 2] = particle.position.z;

        // Fade out particle as it approaches end of life
        const lifetimeRatio = particle.lifetime / particle.maxLifetime;
        const fadeStart = 0.3; // Start fading at 30% of lifetime

        if (lifetimeRatio < fadeStart) {
          const alpha = lifetimeRatio / fadeStart;
          this.colors[writeIndex * 3] *= alpha;
          this.colors[writeIndex * 3 + 1] *= alpha;
          this.colors[writeIndex * 3 + 2] *= alpha;
          this.sizes[writeIndex] = this.sizes[i] * alpha;
        } else {
          this.colors[writeIndex * 3] = this.colors[i * 3];
          this.colors[writeIndex * 3 + 1] = this.colors[i * 3 + 1];
          this.colors[writeIndex * 3 + 2] = this.colors[i * 3 + 2];
          this.sizes[writeIndex] = this.sizes[i];
        }

        // Keep particle in array at writeIndex
        if (writeIndex !== i) {
          this.particles[writeIndex] = particle;
          this.particles[writeIndex].index = writeIndex;
        }

        writeIndex++;
      }
    }

    // Remove dead particles
    this.particles.length = writeIndex;

    // Update geometry
    this.particleGeometry.attributes.position.needsUpdate = true;
    this.particleGeometry.attributes.color.needsUpdate = true;
    this.particleGeometry.attributes.size.needsUpdate = true;
    this.particleGeometry.setDrawRange(0, this.particles.length);
  }

  /**
   * Disposes of all resources
   */
  public dispose(): void {
    if (this.scene && this.particleSystem) {
      this.scene.remove(this.particleSystem);
    }
    this.particleGeometry.dispose();
    this.particleMaterial.dispose();
    if (this.particleMaterial.map) {
      this.particleMaterial.map.dispose();
    }
  }
}
