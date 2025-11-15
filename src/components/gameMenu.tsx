import levels from "../levels";
import Interactions from "./interactions";
import LevelItem from "./levelItem";

interface GameMenuTypes {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const GameMenu = ({ isOpen, setIsOpen }: GameMenuTypes) => {
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
          <LevelItem
            level={level}
            action={() => setIsOpen(false)}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default GameMenu;
