import { useEffect, useRef, type ReactNode } from "react";

import { SceneManager } from "./scene.ts";
import JoyStick from "../components/joystick.tsx";
import BoostButton from "../components/boostButton.tsx";

const ThreeManager = (): ReactNode => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneManager = useRef<SceneManager>(null);

  useEffect(() => {
    if (sceneManager.current) return; // already initd

    const canvas = canvasRef.current;
    if (!canvas) return;

    sceneManager.current = new SceneManager(canvas);
  }, []);

  return (
    <>
      <div ref={canvasRef} id="threeContainer"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-[url(/corner.svg)] bg-cover"></div>
      <div className="absolute top-0 left-0 w-20 h-20 bg-[url(/corner.svg)] bg-cover rotate-90"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-[url(/corner.svg)] bg-cover rotate-180"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-[url(/corner.svg)] bg-cover -rotate-90"></div>
      <JoyStick />
      <BoostButton />
    </>
  );
};

export default ThreeManager;
