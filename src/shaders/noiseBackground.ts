import {
  Mesh,
  SphereGeometry,
  MeshBasicNodeMaterial,
  BackSide,
} from "three/webgpu";
import {
  mx_worley_noise_float,
  positionLocal,
  vec3,
  float,
  uniform,
} from "three/tsl";

/**
 * Creates the animated Worley-noise sphere used as a background in the ship selector.
 * Returns the mesh and the X-offset uniform so the caller can drive the animation.
 */
export function createNoiseBackground(): {
  noiseSphere: Mesh;
  shaderOffsetX: ReturnType<typeof uniform>;
} {
  const sphereGeo = new SphereGeometry(1, 64, 64);
  const noiseMat = new MeshBasicNodeMaterial({ side: BackSide });

  // Texture Coordinate (Object) → Separate XYZ → abs(X) → 1 - abs(X)
  const oneMinusAbsX = float(1.0).sub(positionLocal.x.abs());

  // Mapping node: Scale=(0.5, 1, 1), Location=(10.5, 0, 0) — X offset animated over time
  const shaderOffsetX = uniform(10.5);
  const mappedPos = positionLocal
    .mul(vec3(0.5, 1.0, 1.0))
    .add(vec3(shaderOffsetX, float(0.0), float(0.0)));

  // Voronoi (Smooth F1, Scale=5.0) → Distance → smoothstep
  const voronoiDist = mx_worley_noise_float(mappedPos.mul(5.0), float(1.0));

  // (voronoiDist * 0.75 + 0.25) * (1 - abs(X)), clamped, inverted, smoothed
  const factor = voronoiDist
    .mul(4)
    .add(1.2)
    .mul(oneMinusAbsX.mul(0.5))
    .clamp(0.0, 1.0)
    .smoothstep(0.0, 1.0)
    .oneMinus();

  // Color Ramp (Linear):
  // pos=0.00 → #62748E (0.384, 0.455, 0.557)
  // pos=0.25 → #25365B (0.145, 0.212, 0.357)
  // pos=0.50 → #0F172B (0.059, 0.090, 0.169)
  // pos=0.75 → #020618 (0.008, 0.024, 0.094)
  // pos=1.00 → #000000 (0.000, 0.000, 0.000)
  const c0 = vec3(0.384, 0.455, 0.557);
  const c1 = vec3(0.145, 0.212, 0.357);
  const c2 = vec3(0.059, 0.09, 0.169);
  const c3 = vec3(0.008, 0.024, 0.094);
  const c4 = vec3(0.0, 0.0, 0.0);

  const t = float(1.0).sub(factor);

  const w0 = float(1.0).sub(t.mul(4.0).clamp(0.0, 1.0));
  const w1 = t
    .mul(4.0)
    .clamp(0.0, 1.0)
    .sub(t.sub(0.25).mul(4.0).clamp(0.0, 1.0));
  const w2 = t
    .sub(0.25)
    .mul(4.0)
    .clamp(0.0, 1.0)
    .sub(t.sub(0.5).mul(4.0).clamp(0.0, 1.0));
  const w3 = t
    .sub(0.5)
    .mul(4.0)
    .clamp(0.0, 1.0)
    .sub(t.sub(0.75).mul(4.0).clamp(0.0, 1.0));
  const w4 = t.sub(0.75).mul(4.0).clamp(0.0, 1.0);

  noiseMat.colorNode = c0
    .mul(w0)
    .add(c1.mul(w1))
    .add(c2.mul(w2))
    .add(c3.mul(w3))
    .add(c4.mul(w4));

  const noiseSphere = new Mesh(sphereGeo, noiseMat);
  noiseSphere.scale.set(90, 9, 9);
  noiseSphere.position.set(0, 0, 0);

  return { noiseSphere, shaderOffsetX };
}
