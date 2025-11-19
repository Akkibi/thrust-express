import levels from "../levels";
import {
  localStorageStore,
  useStore,
  type LevelScoreType,
} from "../store/store";
import { eventEmitter } from "../utils/eventEmitter";
import Button from "./button";
import { findBestValues } from "../utils/findBestLevel";
import { useEffect, useState } from "react";

interface EndTitleTypes {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setLevelSelectorOpen: (isOpen: boolean) => void;
}

const EndTitle = ({
  isOpen,
  setIsOpen,
  setLevelSelectorOpen,
}: EndTitleTypes) => {
  const lastLevelScore = useStore((state) => state.lastLevelScore);
  const lastLevel = useStore((state) => state.lastLevel);
  const [bestValues, setBestValues] = useState<LevelScoreType | null>(null);
  const levelsDone = localStorageStore((state) => state.levelsDone);

  useEffect(() => {
    if (lastLevel) {
      const best = findBestValues(levelsDone, lastLevel.name);
      setBestValues(best);
    }
  }, [lastLevel, levelsDone]);

  if (!isOpen) return <></>;
  return (
    <div className="absolute z-50 inset-0 bg-black/50 flex flex-col items-center justify-center">
      <div className=" bg-black select-none pointer-events-none absolute top-0 h-30 opacity-50 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain"></div>
      <div className=" bg-black select-none pointer-events-none absolute bottom-0 h-30 opacity-50 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain rotate-180"></div>
      <div className="flex flex-col items-center justify-center w-full h-full py-20">
        <div className="flex flex-col p-2 gap-3 bg-slate-900/20 w-full items-center justify-center">
          {lastLevelScore ? (
            <>
              <div className="text-base font-bold text-yellow-500">
                Package Delivered !
              </div>
            </>
          ) : (
            <>
              <div className="text-xl font-bold text-white">Game Over</div>
            </>
          )}
          <div
            className="w-full h-30 bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage: lastLevelScore
                ? lastLevelScore.health > 40
                  ? lastLevelScore.health === 100
                    ? "url(/stars/3stars.svg)"
                    : "url(/stars/2stars.svg)"
                  : "url(/stars/1star.svg)"
                : "url(/stars/nostars.svg)",
            }}
          ></div>
          {lastLevelScore?.health}
          {lastLevelScore ? (
            <>
              <p>
                <span className="text-yellow-500 font-black custom-text-border text-5xl">
                  {(lastLevelScore.time / 1000).toFixed(2)}
                  <span className="text-xl">s</span>
                </span>
              </p>
              {bestValues && bestValues.time >= lastLevelScore.time ? (
                <>
                  <div className=" w-fit px-5 py-2 font-black bg-linear-to-t from-yellow-900 to-yellow-700 text-yellow-300 border-4 border-solid rounded-lg border-yellow-300 rotate-3">
                    BEST TIME
                  </div>
                </>
              ) : (
                <p>
                  <span className="text-xs font-bold">Best : </span>
                  <span className="text-yellow-500 font-black custom-text-border text-xs">
                    {(bestValues ? bestValues.time / 1000 : 0).toFixed(2)}s
                  </span>
                </p>
              )}
            </>
          ) : (
            <p className="text-xs font-bold text-slate-400">
              Still waiting for my package to arrive ..
            </p>
          )}
        </div>
        <div className="h-full w-full"></div>
        <div className="flex flex-col justify-center items-center relative w-full">
          <div
            className="absolute inset-0 z-0 opacity-20"
            style={{
              backgroundSize: "100% 100%",

              backgroundImage: "url(/end-bg.svg)",
            }}
          ></div>
          <div className="flex flex-row flex-wrap gap-4 mb-5 relative">
            <Button
              onClick={() => {
                setLevelSelectorOpen(true);
                setIsOpen(false);
              }}
              isDisabled={false}
            >
              Back
            </Button>
            {levels[(lastLevel ? levels.indexOf(lastLevel) : 0) + 1] && (
              <Button
                onClick={() => {
                  eventEmitter.trigger("next-level", []);
                  setIsOpen(false);
                }}
                isDisabled={false}
              >
                Next level
              </Button>
            )}
          </div>
          <button
            className="relative p-5 cursor-pointer custom-text-border hover:scale-105 active:scale-90 transition-transform duration-300 ease-out active:text-yellow-600"
            type="button"
            onClick={() => {
              eventEmitter.trigger("start", [lastLevel]);
              setIsOpen(false);
            }}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndTitle;
