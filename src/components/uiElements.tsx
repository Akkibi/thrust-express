import { useEffect, useRef, useState } from "react";
import { globals, useStore } from "../store/store";
import EndTitle from "./endTitle";
import GameMenu from "./gameMenu";
import LevelSelector from "./levelSelector";
import LoadingScreen from "./loadingScreen";
import PauseMenu from "./pauseMenu";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const UiElements = () => {
  const healthBoundsRef = useRef<HTMLDivElement>(null);
  const isEndTitleOpen = useStore((state) => state.isEndTitle);
  const setEndTitleOpen = useStore((state) => state.setIsEndTitle);
  const [isPauseMenuOpen, setPauseMenuOpen] = useState(false);
  const isMenuOpen = useStore((state) => state.isMenuOpen);
  const setIsPaused = useStore((state) => state.setIsPaused);
  const setIsMenuOpen = useStore((state) => state.setIsMenuOpen);
  const isLevelSelectorOpen = useStore((state) => state.isLevelSelectorOpen);
  const setLevelSelectorOpen = useStore(
    (state) => state.setIsLevelSelectorOpen,
  );
  const playerHealth = useStore((state) => state.health);
  const [timePassed, setTimePassed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimePassed(globals.currentTime);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    const healthBounds = healthBoundsRef.current;
    if (!healthBounds) return;

    const tl = gsap
      .timeline({
        defaults: {
          duration: 0.5,
          ease: "expo.in",
        },
        onComplete: () => {
          tl.kill();
        },
      })
      .fromTo(
        healthBounds,
        { scale: 1 },
        { duration: 1, overwrite: true, scale: 2, ease: "expo.in" },
      )
      .play();

    healthBounds.style.opacity = `${1.2 - playerHealth / 100}`;
  }, [playerHealth, healthBoundsRef]);

  return (
    <>
      {/*<div
        className="absolute inset-0 bg-red-600 select-none pointer-events-none"
        style={{
          mask: "url(/health-bounds.png) luminance",
          maskSize: "100% 100%",
          opacity: 1 - playerHealth / 100,
        }}
      ></div>*/}
      <div
        className="bg-[url(/hit-bounds.png)] absolute inset-0 pointer-events-none mix-blend-lighten bg-cover bg-center bg-no-repeat"
        ref={healthBoundsRef}
      ></div>
      <div className="w-[75vw]  md:w-[50vw] rounded-b-xl h-8 bg-slate-700 top-0 absolute left-1/2 -translate-x-1/2 ">
        <div className="absolute left-2 top-0 right-2 bottom-2 bg-slate-900 custom-light-border-inset rounded-b-md flex flex-row gap-1 p-1 pl-0">
          <div className="w-10 bg-[url(/health-icon.svg)] bg-contain bg-center bg-no-repeat scale-150 relative"></div>
          <div className="flex-1 bg-red-950 rounded-r-2xl rounded-l-sm overflow-clip relative">
            <div
              className="absolute inset-0 bg-white transition-all duration-200 ease-in"
              style={{
                width: `${playerHealth}%`,
              }}
            ></div>
            <div
              className="absolute inset-0 bg-yellow-500"
              style={{
                width: `${playerHealth}%`,
              }}
            >
              <div className="bg-[url(/strikes.png)] absolute inset-0 opacity-20"></div>
            </div>
            <p className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-black font-black">
              HP
            </p>
          </div>
        </div>
      </div>
      <div
        className="absolute top-1 left-1 w-12 h-12 rounded-full bg-slate-700 custom-light-border pointer-events-auto"
        onClick={() => {
          setIsPaused(true);
          setPauseMenuOpen(true);
        }}
      >
        <div className="absolute inset-1 bg-slate-900 rounded-full custom-light-border-inset">
          <svg
            className="absolute inset-2"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 1H2V15H7V1Z" fill="#ffffff"></path>
            <path d="M14 1H9V15H14V1Z" fill="#ffffff"></path>
          </svg>
        </div>
      </div>
      <div className="absolute top-5 right-3 text-white font-black custom-text-border font-mono z-10 text-2xl">
        {(timePassed / 1000).toFixed(2)}s
      </div>
      <PauseMenu
        isOpen={isPauseMenuOpen}
        setIsOpen={setPauseMenuOpen}
        setLevelSelectorOpen={setLevelSelectorOpen}
      />
      <LevelSelector
        isOpen={isLevelSelectorOpen}
        setIsOpen={setLevelSelectorOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <EndTitle
        isOpen={isEndTitleOpen}
        setIsOpen={setEndTitleOpen}
        setLevelSelectorOpen={setLevelSelectorOpen}
      />
      <GameMenu
        isOpen={isMenuOpen}
        setIsOpen={setEndTitleOpen}
        setLevelSelectorOpen={setLevelSelectorOpen}
      />
      <LoadingScreen />
    </>
  );
};

export default UiElements;
