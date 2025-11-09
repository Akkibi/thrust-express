import { useEffect, useRef, type ReactNode } from "react";

import { SceneManager } from "./scene.ts";
import Interactions from "../components/interactions.tsx";

const ThreeManager = (): ReactNode => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneManager = useRef<SceneManager>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sceneManager.current = SceneManager.getInstance(canvas);
  }, []);

  return (
    <>
      <div ref={canvasRef} id="threeContainer"></div>
      <Interactions />
    </>
  );
};

export default ThreeManager;
