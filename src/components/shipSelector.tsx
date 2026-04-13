import { useEffect, useRef, useState } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Group,
  Box3,
  Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import { useStore } from "../store/store";

const SHIPS = [
  { file: "spaceship.glb", name: "Classic" },
  { file: "spaceship2.glb", name: "Stealth" },
  { file: "spaceship3.glb", name: "Fighter" },
  { file: "spaceship4.glb", name: "Cruiser" },
  { file: "spaceship5.glb", name: "Titan" },
];

const SHIP_SPACING = 5;

const getScale = (dist: number) =>
  dist === 0 ? 0.576 : Math.max(0.176, 0.416 - Math.abs(dist) * 0.096);

const ShipSelector = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shipGroupsRef = useRef<Group[]>([]);
  const animFrameRef = useRef<number>(0);

  const { selectedShipModel, setSelectedShipModel } = useStore();

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const idx = SHIPS.findIndex((s) => s.file === selectedShipModel);
    return idx >= 0 ? idx : 0;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    shipGroupsRef.current = [];

    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.parentElement?.clientWidth || 600;
    const h = rect.height || canvas.parentElement?.clientHeight || 400;

    const scene = new Scene();

    const camera = new PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 1.5, 9);
    camera.lookAt(0, 0.5, 0);

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    // false = don't override the CSS width/height (preserves w-full)
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    scene.add(new AmbientLight(0xffffff, 0.7));
    const keyLight = new DirectionalLight(0x88aaff, 3.5);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);
    const rimLight = new DirectionalLight(0xffaa44, 2);
    rimLight.position.set(-3, -1, -3);
    scene.add(rimLight);

    // Load all ship models
    const loader = new GLTFLoader();
    const initIdx = selectedIndex;

    SHIPS.forEach((ship, i) => {
      const group = new Group();
      const dist = i - initIdx;
      group.position.set(dist * SHIP_SPACING, 0, -Math.abs(dist) * 0.8);
      group.scale.setScalar(getScale(dist));
      scene.add(group);
      shipGroupsRef.current.push(group);

      loader.load(`/models/ship/${ship.file}`, (gltf) => {
        // Center BEFORE adding to the group so the bounding box is in local space
        const box = new Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new Vector3());
        gltf.scene.position.sub(center);
        group.add(gltf.scene);
      });
    });

    let time = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      time += 0.008;
      shipGroupsRef.current.forEach((g) => {
        g.rotation.y = time;
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w2 = canvas.offsetWidth;
      const h2 = canvas.offsetHeight;
      if (!w2 || !h2) return;
      renderer.setSize(w2, h2, false);
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      shipGroupsRef.current = [];
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToIndex = (newIndex: number) => {
    if (newIndex === selectedIndex) return;

    setSelectedIndex(newIndex);
    setSelectedShipModel(SHIPS[newIndex].file);

    shipGroupsRef.current.forEach((group, i) => {
      const dist = i - newIndex;
      gsap.to(group.position, {
        x: dist * SHIP_SPACING,
        z: -Math.abs(dist) * 0.8,
        duration: 0.4,
        ease: "power2.out",
      });
      const s = getScale(dist);
      gsap.to(group.scale, {
        x: s,
        y: s,
        z: s,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  };

  const navigate = (direction: -1 | 1) => {
    goToIndex(
      Math.max(0, Math.min(SHIPS.length - 1, selectedIndex + direction)),
    );
  };

  return (
    <div className="w-full max-w-full h-full flex-col items-center gap-2 py-4 relative flex justify-between">
      <p className="text-slate-400 text-xs uppercase tracking-widest">
        Select Ship
      </p>
      <div className="absolute w-full inset-0 flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: "block" }}
        />

        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={selectedIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 custom-light-border flex items-center justify-center disabled:opacity-25 hover:scale-110 active:scale-90 transition-transform duration-200"
        >
          <svg fill="white" className="w-4 h-4" viewBox="0 0 42 42">
            <polygon
              fillRule="evenodd"
              points="27.066,1 7,21.068 26.568,40.637 31.502,35.704 16.865,21.068 32,5.933"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => navigate(1)}
          disabled={selectedIndex === SHIPS.length - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 custom-light-border flex items-center justify-center disabled:opacity-25 hover:scale-110 active:scale-90 transition-transform duration-200"
        >
          <svg fill="white" className="w-4 h-4 rotate-180" viewBox="0 0 42 42">
            <polygon
              fillRule="evenodd"
              points="27.066,1 7,21.068 26.568,40.637 31.502,35.704 16.865,21.068 32,5.933"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-2 relative z-10 w-full justify-center items-center">
        <p className="text-white font-black uppercase text-lg tracking-wider custom-text-border">
          {SHIPS[selectedIndex].name}
        </p>

        <div className="flex gap-2">
          {SHIPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === selectedIndex ? "bg-yellow-500" : "bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShipSelector;
