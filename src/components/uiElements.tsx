import { useEffect, useState } from "react";
import { globals, useStore } from "../store/store";
import EndTitle from "./endTitle";
import GameMenu from "./gameMenu";
import LevelSelector from "./levelSelector";
import LoadingScreen from "./loadingScreen";

const UiElements = () => {
  const isEndTitleOpen = useStore((state) => state.isEndTitle);
  const setEndTitleOpen = useStore((state) => state.setIsEndTitle);
  const isMenuOpen = useStore((state) => state.isMenuOpen);
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

  return (
    <>
      <div
        className="absolute inset-0 bg-red-600 select-none pointer-events-none"
        style={{
          mask: "url(/health-bounds.png) luminance",
          maskSize: "100% 100%",
          opacity: 1 - playerHealth / 100,
        }}
      ></div>
      <div className="absolute top-5 left-5 h-5 w-14 bg-[url(/logo.webp)] bg-cover bg-center bg-no-repeat"></div>
      <div className="w-[75vw]  md:w-[50vw] rounded-b-lg h-5 bg-slate-900 top-0 absolute left-1/2 -translate-x-1/2">
        <div className="absolute inset-1 bg-yellow-950 rounded-full overflow-clip">
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
        </div>
      </div>
      <div className="absolute top-2 right-3 text-white font-black custom-text-border font-mono z-10">
        {(timePassed / 1000).toFixed(2)}s
      </div>
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
