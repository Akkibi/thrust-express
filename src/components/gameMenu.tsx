import levels from "../levels";
import { useStore } from "../store/store";
import { cn } from "../utils/cn";
import { eventEmitter } from "../utils/eventEmitter";
import Button from "./button";
import Interactions from "./interactions";

interface GameMenuTypes {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const GameMenu = ({ isOpen, setIsOpen }: GameMenuTypes) => {
  const levelsDone = useStore((state) => state.levelsDone);

  if (!isOpen) return <></>;
  return (
    <div
      className={`absolute z-50 inset-0 bg-slate-800 flex flex-col items-center justify-center p-3`}
    >
      <Interactions />
      <div className="w-full px-5 py-2 mb-3 bg-slate-950 rounded-3xl custom-light-border-inset flex flex-row relative">
        <p className="w-full text-xl font-black custom-text-border">LEVELS</p>
        <div className="bg-[url(/logo.png)] bg-contain bg-center bg-no-repeat h-10 w-30 absolute right-0 top-1/2 -translate-y-1/2"></div>
      </div>
      <div className="flex flex-col gap-2 w-full h-full p-3 bg-slate-950 rounded-3xl overflow-y-scroll custom-light-border-inset">
        {levels.map((level, index) => (
          <div
            className=" w-full p-2 bg-slate-600 flex flex-none flex-col relative rounded-xl overflow-clip custom-light-border"
            key={index}
          >
            <div
              className={cn(
                "min-h-fit bg-slate-800 pb-5 mb-5 relative rounded-lg rounded-b-2xl custom-inner-shadow overflow-clip",
                `bg-[url(${level.map})] bg-center bg-no-repeat bg-cover`,
              )}
            >
              <div className="absolute inset-0 z-0 bg-[url(/postal-icon.svg)] bg-cover opacity-5 bg-center bg-no-repeat"></div>
              <div className="flex flex-row justify-between h-full w-full p-5 z-10 relative">
                <p className=" text-xl font-black custom-text-border">
                  {level.name}
                </p>
                <p className="text-sm self-center">Money 500$</p>
              </div>
            </div>
            <div className="absolute bottom-2 left-0  h-10 w-full flex gap-4 px-4 z-10">
              <div className="h-10 w-10 bg-slate-950 rounded-full flex-none custom-light-border relative">
                {levelsDone.find((name) => name === level.name) ? (
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
        ))}
      </div>
    </div>
  );
};

export default GameMenu;
