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

  if (!isOpen) return <></>;
  return (
    <div className="absolute z-50 inset-0 bg-black/50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col p-2 gap-3 bg-slate-700 rounded-2xl custom-light-border mb-50">
          <div className="flex flex-col p-3 gap-3 bg-slate-900 custom-inner-shadow rounded-xl items-center justify-center">
            <div className="text-2xl font-bold text-white">Game Over</div>
            <div className="text-5xl font-bold text-white custom-text-border">
              {playerHealth > 0 ? "You Win" : "You Lost"}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Button
            onClick={() => {
              setMenuOpen(true);
              setIsOpen(false);
            }}
            isDisabled={false}
          >
            Back to menu
          </Button>
          <Button
            onClick={() => {
              eventEmitter.trigger("start-level", []);
              setIsOpen(false);
            }}
            isDisabled={false}
          >
            Restart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EndTitle;
