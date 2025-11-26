import type { ReactNode } from "react";
import Button from "./button";
import { useStore } from "../store/store";

interface IPauseMenu {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setLevelSelectorOpen: (isOpen: boolean) => void;
}

const PauseMenu = ({
  isOpen,
  setIsOpen,
  setLevelSelectorOpen,
}: IPauseMenu): ReactNode => {
  const setIsPaused = useStore((state) => state.setIsPaused);

  if (!isOpen) return <></>;
  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-center items-center">
      <div className=" bg-slate-950 select-none pointer-events-none absolute top-0 h-[30vh] opacity-75 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain"></div>
      <div className=" bg-slate-950 select-none pointer-events-none absolute bottom-0 h-[30vh] opacity-75 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain rotate-180"></div>
      <h2 className=" text-4xl scale-200 absolute top-20 font-bold poppins">
        Pause
      </h2>
      <button
        type="button"
        className="w-30 h-30 relative border-4 border-white rounded-xl"
        onClick={() => {
          setIsPaused(false);
          setIsOpen(false);
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full scale-50"
          fill="#ffffff"
          viewBox="0 0 1920 1920"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M175 .024V1920l1570.845-959.927z" fillRule="evenodd"></path>
        </svg>
      </button>
      <Button
        className="absolute bottom-20"
        onClick={() => {
          setLevelSelectorOpen(true);
          setIsOpen(false);
        }}
      >
        Exit
      </Button>
    </div>
  );
};

export default PauseMenu;
