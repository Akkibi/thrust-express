import { eventEmitter } from "../utils/eventEmitter";
import Button from "./button";
import Interactions from "./interactions";

interface GameMenuTypes {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setLevelSelectorOpen: (isOpen: boolean) => void;
}

const GameMenu = ({
  isOpen,
  setIsOpen,
  setLevelSelectorOpen,
}: GameMenuTypes) => {
  if (!isOpen) return <></>;

  return (
    <div className="absolute inset-0 bg-linear-to-b from-slate-700 to-slate-950 flex flex-col justify-center items-center gap-10 z-40">
      <video
        className="absolute w-full h-full object-cover inset-0 z-0"
        autoPlay
        loop
        muted
        playsInline
        src="/video-menu.webm"
      ></video>
      <div className="bg-[url(/logo.png)] bg-contain bg-center bg-no-repeat w-full max-w-96 aspect-video relative"></div>
      <div className="h-full"></div>
      <div className="flex flex-row gap-5 pb-[10vh] justify-center items-center">
        <Button
          onClick={() => {
            setLevelSelectorOpen(true);
            setIsOpen(false);
          }}
        >
          Select level
        </Button>
        <Button
          onClick={() => {
            eventEmitter.trigger("start");
            setIsOpen(false);
          }}
        >
          Endless mode
        </Button>
      </div>
      <Interactions />
    </div>
  );
};

export default GameMenu;
