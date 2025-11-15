import levels, { lastLevel } from "../levels";
import { useStore } from "../store/store";
import { eventEmitter } from "../utils/eventEmitter";
import Button from "./button";

interface EndTitleTypes {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setMenuOpen: (isOpen: boolean) => void;
}

const EndTitle = ({ isOpen, setIsOpen, setMenuOpen }: EndTitleTypes) => {
  const playerHealth = useStore((state) => state.health);
  const currentTime = useStore((state) => state.currentTimePassed);
  if (!isOpen) return <></>;
  return (
    <div className="absolute z-50 inset-0 bg-black/50 flex flex-col items-center justify-center">
      <div className=" bg-black select-none pointer-events-none absolute top-0 h-30 opacity-50 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain"></div>
      <div className=" bg-black select-none pointer-events-none absolute bottom-0 h-30 opacity-50 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain rotate-180"></div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col p-2 gap-3 bg-slate-700 rounded-2xl custom-light-border mb-50 w-full max-w-96 mx-10">
          <div className="flex flex-col p-3 gap-3 bg-slate-900 custom-inner-shadow rounded-xl items-center justify-center">
            <div className="text-2xl font-bold text-white">Game Over</div>
            {playerHealth > 0 ? (
              <>
                <p className="text-5xl font-bold text-white custom-text-border">
                  You Win
                </p>
                <p>
                  <span className="text-xs">Time : </span>
                  <span className="text-yellow-500 font-black custom-text-border">
                    {Math.round(currentTime / 1000)}s
                  </span>
                </p>
                <p>
                  <span className="text-xs">Health : </span>
                  <span className="text-yellow-500 font-black custom-text-border">
                    {playerHealth}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-5xl font-bold text-white custom-text-border">
                You Lost
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center relative w-full">
          <div className="absolute inset-0 z-0 bg-[url(/end-bg.svg)] opacity-50 bg-cover bg-center bg-no-repeat "></div>
          <div className="flex flex-row gap-4 mb-5 relative">
            <Button
              onClick={() => {
                setMenuOpen(true);
                setIsOpen(false);
              }}
              isDisabled={false}
            >
              Back to menu
            </Button>
            {levels[
              (lastLevel.level ? levels.indexOf(lastLevel.level) : 0) + 1
            ] && (
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
              eventEmitter.trigger("start-level", []);
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
