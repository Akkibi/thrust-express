import { useEffect, useState } from "react";
import type { LevelType } from "../levels";
import { localStorageStore, type LevelScoreType } from "../store/store";
import { cn } from "../utils/cn";
import { eventEmitter } from "../utils/eventEmitter";
import Button from "./button";
import { findBestValues } from "../utils/findBestLevel";

export interface LevelItemTypes {
  level: LevelType;
  action: () => void;
}

const LevelItem = ({ level, action }: LevelItemTypes) => {
  const levelsDone = localStorageStore((state) => state.levelsDone);
  const [bestValues, setBestValues] = useState<LevelScoreType | null>(null);

  useEffect(() => {
    const best = findBestValues(levelsDone, level.name);
    setBestValues(best);
  }, [levelsDone, level]);

  return (
    <div className=" w-full p-2 bg-slate-600 flex flex-none flex-col relative rounded-xl overflow-clip custom-light-border">
      <div
        className={cn(
          "min-h-fit h-40 bg-slate-800 pb-5 mb-5 relative rounded-lg rounded-b-2xl custom-inner-shadow overflow-clip",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 scale-95 z-0 opacity-50 bg-center bg-no-repeat bg-contain mix-blend-plus-lighter",
          )}
          style={{
            backgroundImage: `url(/mapImages/${level.image})`,
            imageRendering: "pixelated",
          }}
        ></div>
        <div className="absolute inset-0 z-0 bg-[url(https://st5.depositphotos.com/35515900/63359/i/450/depositphotos_633598666-stock-photo-led-screen-texture-dots-background.jpg)] bg-cover opacity-50 bg-center bg-no-repeat mix-blend-multiply"></div>
        <div className="flex flex-row justify-between h-full w-full p-2 z-10 relative">
          <p className=" text-xl font-black custom-text-border py-2 px-4">
            {level.name}
          </p>
          {bestValues && (
            <div className="flex flex-col text-left p-2 bg-slate-950 border-2 border-black rounded-sm h-fit">
              <p className="text-xs opacity-50">Best :</p>
              <p className="text-sm font-bold">
                {(bestValues.time / 1000).toFixed(2)}s
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-2 left-0  h-10 w-full flex gap-2 px-4 z-10">
        <div className="h-10 w-10 bg-slate-950 rounded-full flex-none custom-light-border relative">
          {bestValues ? (
            <div className="absolute inset-1 bg-green-500 rounded-full custom-inner-shadow"></div>
          ) : (
            <div className="absolute inset-1 bg-red-950 rounded-full custom-inner-shadow"></div>
          )}
        </div>
        <div className="w-18 h-10 relative flex-none bg-slate-950 rounded-full custom-light-border">
          {(bestValues?.health ?? 0 > 0) ? (
            <div className="absolute top-1/2 -translate-y-1/2 h-8 left-1 w-8 bg-[url(/icons/full-star.svg)] bg-center scale-75 bg-contain bg-no-repeat"></div>
          ) : (
            <div className="absolute top-1/2 -translate-y-1/2 h-8 left-1 w-8 bg-[url(/icons/no-star.svg)] bg-center scale-75 bg-contain bg-no-repeat"></div>
          )}
          {(bestValues?.health ?? 0 > 50) ? (
            <div className="absolute top-1/2 -translate-y-1/2 h-8 left-5 w-8 bg-[url(/icons/full-star.svg)] bg-center scale-75 bg-contain bg-no-repeat"></div>
          ) : (
            <div className="absolute top-1/2 -translate-y-1/2 h-8 left-5 w-8 bg-[url(/icons/no-star.svg)] bg-center scale-75 bg-contain bg-no-repeat"></div>
          )}
          {(bestValues?.health ?? 0) == 100 ? (
            <div className="absolute top-1/2 -translate-y-1/2 h-8 left-9 w-8 bg-[url(/icons/full-star.svg)] bg-center scale-75 bg-contain bg-no-repeat"></div>
          ) : (
            <div className="absolute top-1/2 -translate-y-1/2 h-8 left-9 w-8 bg-[url(/icons/no-star.svg)] bg-center scale-75 bg-contain bg-no-repeat"></div>
          )}
        </div>
        <div className="w-full"></div>
        <Button
          size="sm"
          onClick={() => {
            eventEmitter.trigger("start", [level]);
            action();
          }}
          isDisabled={!level.map}
        >
          GO
        </Button>
      </div>
    </div>
  );
};

export default LevelItem;
