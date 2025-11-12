import levels from "../levels";
import { eventEmitter } from "../utils/eventEmitter";
import Button from "./button";

interface GameMenuTypes {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const GameMenu = ({ isOpen, setIsOpen }: GameMenuTypes) => {
  if (!isOpen) return <></>;
  return (
    <div
      className={`absolute z-50 inset-0 bg-stone-700 flex flex-col items-center justify-center p-3`}
    >
      <div className="w-full px-5 py-2 mb-3 bg-stone-950 rounded-3xl custom-light-border-inset flex flex-row relative">
        <p className="w-full text-xl font-black custom-text-border">LEVELS</p>
        <div className="bg-[url(/logo.png)] bg-contain bg-center bg-no-repeat h-10 w-30 absolute right-0 top-1/2 -translate-y-1/2"></div>
      </div>
      <div className="flex flex-col gap-2 w-full h-full p-3 bg-stone-950 rounded-3xl overflow-y-scroll custom-light-border-inset">
        {levels.map((level, index) => (
          <div
            className=" w-full p-2 bg-stone-600 flex flex-none flex-col relative rounded-xl overflow-clip custom-light-border"
            key={index}
          >
            <div className="min-h-fit bg-stone-800 pb-5 mb-5 relative rounded-lg rounded-b-2xl custom-inner-shadow">
              <div className="flex flex-row justify-between h-full w-full p-5">
                <p className=" text-xl font-black custom-text-border">
                  {level.name}
                </p>
                <p className="text-sm self-center">Money 500$</p>
              </div>
              <div className="absolute top-full left-0 -translate-y-1/2 h-10 w-full flex gap-4 px-4">
                <div className="h-10 w-10 bg-stone-950 rounded-full flex-none custom-light-border relative">
                  {level.isDone ? (
                    <div className="absolute inset-1 bg-green-600 rounded-full"></div>
                  ) : (
                    <div className="absolute inset-1 bg-red-900 rounded-full"></div>
                  )}
                </div>
                <div className="w-full"></div>
                <Button
                  onClick={() => {
                    eventEmitter.trigger("start-level", [level]);
                    setIsOpen(false);
                  }}
                  isDisabled={!level.map}
                >
                  OPEN
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameMenu;
