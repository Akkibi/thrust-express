import { useEffect, useState } from "react";
import type { LevelType } from "../levels";
import { useStore } from "../store/store";
import { cn } from "../utils/cn";
import { eventEmitter } from "../utils/eventEmitter";
import Button from "./button";

interface LevelItemTypes {
  level: LevelType;
  action: () => void;
}

const LevelItem = ({ level, action }: LevelItemTypes) => {
  const levelsDone = useStore((state) => state.levelsDone);
  const [bestPenality, setBestPenality] = useState(0);
  const [bestTime, setBestTime] = useState(0);

  useEffect(() => {
    console.log(levelsDone);
    const scores = levelsDone.filter(
      (currentLevel) => currentLevel.levelName === level.name,
    );

    if (scores.length <= 0) return;
    const best = scores.reduce((acc, current) => {
      if (acc.time < current.time) {
        return current;
      }
      return acc;
    });

    setBestPenality(100 - best.score);
    setBestTime(best.time);
  }, [levelsDone, level]);

  return (
    <div className=" w-full p-2 bg-slate-600 flex flex-none flex-col relative rounded-xl overflow-clip custom-light-border">
      <div
        className={cn(
          "min-h-fit bg-slate-800 pb-5 mb-5 relative rounded-lg rounded-b-2xl custom-inner-shadow overflow-clip",
          `bg-[url(${level.map})] bg-center bg-no-repeat bg-cover`,
        )}
      >
        <div className="absolute inset-0 z-0 bg-[url(/postal-icon.svg)] bg-cover opacity-5 bg-center bg-no-repeat"></div>
        <div className="flex flex-row justify-between h-full w-full p-5 z-10 relative">
          <p className=" text-xl font-black custom-text-border">{level.name}</p>
          <div className="self-center flex flex-col">
            {levelsDone.find(
              (currentLevel) => currentLevel.levelName === level.name,
            ) && (
              <>
                Best :
                <p className="text-sm opacity-50 font-bold">
                  Time : {Math.round(bestTime / 1000)}s
                  <br />
                  Penality : {bestPenality}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-0  h-10 w-full flex gap-4 px-4 z-10">
        <div className="h-10 w-10 bg-slate-950 rounded-full flex-none custom-light-border relative">
          {levelsDone.find(
            (currentLevel) => currentLevel.levelName === level.name,
          ) ? (
            <div className="absolute inset-1 bg-green-600 rounded-full"></div>
          ) : (
            <div className="absolute inset-1 bg-red-900 rounded-full"></div>
          )}
        </div>
        <div className="w-full"></div>
        <Button
          onClick={() => {
            eventEmitter.trigger("start-level", [level]);
            action();
          }}
          isDisabled={!level.map}
        >
          OPEN
        </Button>
      </div>
    </div>
  );
};

export default LevelItem;
