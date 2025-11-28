import { useRef, useState } from "react";
import { eventEmitter } from "../utils/eventEmitter";
import Button from "./button";
import { useGSAP } from "@gsap/react";
import SettingsMenu from "./settingsMenu";

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
  const container = useRef<HTMLDivElement>(null);
  const sectionTopRef = useRef<HTMLDivElement>(null);
  const sectionBottomRef = useRef<HTMLDivElement>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useGSAP(() => {}, {
    scope: container,
    dependencies: [isOpen, sectionTopRef, sectionTopRef],
  });

  if (!isOpen) return <></>;

  return (
    <div className="absolute inset-0 bg-linear-to-b from-slate-700 to-slate-950 flex flex-col justify-center items-center gap-10 z-30">
      <video
        className="absolute w-full h-full object-cover inset-0 z-0"
        autoPlay
        loop
        muted
        playsInline
        src="/video-menu.webm"
      ></video>
      <div className=" bg-black select-none pointer-events-none absolute top-0 h-[30vh] opacity-75 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain"></div>
      <div className=" bg-black select-none pointer-events-none absolute bottom-0 h-[30vh] opacity-75 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain rotate-180"></div>
      <a
        href="https://github.com/Akkibi"
        className="text-slate-500 visited:text-slate-700 absolute bottom-2 underline text-xs font-thin left-1/2 -translate-x-1/2 w-fit"
      >
        Created by Akira Valade
      </a>
      <div
        className="bg-[url(/logo.webp)] bg-contain bg-center bg-no-repeat w-full max-w-96 aspect-video relative"
        ref={sectionTopRef}
        style={{
          filter: "drop-shadow(4px 4px 0px #cf8500)",
        }}
      ></div>
      <div className="h-full relative">
        {/*<svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="h-50 w-50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 6H13V5L11 3H5L3 5V11L5 13H6V16H0V0H16V6Z"
            fill="#0000FF"
          />
          <path d="M16 16H10V13H11L13 11V10H16V16Z" fill="#0000FF" />
        </svg>*/}
      </div>
      <div
        className="flex flex-row flex-wrap gap-3 md:gap-10 pb-[10vh] justify-center items-center"
        ref={sectionBottomRef}
      >
        <Button
          onClick={() => {
            setLevelSelectorOpen(true);
            setIsOpen(false);
          }}
        >
          Select level
        </Button>
        <Button
          isDisabled
          onClick={() => {
            eventEmitter.trigger("start");
            setIsOpen(false);
          }}
        >
          Endless mode
        </Button>
      </div>
      <div
        className="absolute top-1 left-1 w-12 h-12 rounded-full bg-slate-700 custom-light-border pointer-events-auto"
        onClick={() => {
          setIsSettingsOpen(true);
        }}
      >
        <div className="absolute inset-1 bg-slate-900 rounded-full custom-light-border-inset">
          <svg
            className="absolute inset-2"
            viewBox="0 -8 72 72"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M56.74,20.89l-1-2.31c3.33-7.53,3.11-7.75,2.46-8.41L54,6l-.42-.35h-.49c-.26,0-1,0-7.51,2.93l-2.38-1C40.09,0,39.77,0,38.87,0h-6c-.9,0-1.25,0-4.1,7.66l-2.37,1C22,6.78,19.45,5.84,18.75,5.84l-.56,0-4.58,4.49c-.7.65-.94.88,2.58,8.3l-1,2.3c-7.79,3-7.79,3.3-7.79,4.23v5.89c0,.92,0,1.25,7.82,4l1,2.29c-3.33,7.53-3.11,7.76-2.46,8.41L18,50l.42.37h.5c.25,0,1,0,7.5-3l2.38,1C31.9,56,32.21,56,33.12,56h6c.92,0,1.25,0,4.11-7.66l2.39-1c4.37,1.85,6.93,2.79,7.61,2.79l.57,0,4.62-4.52c.66-.66.89-.89-2.62-8.28l1-2.3c7.81-3,7.81-3.33,7.81-4.23V24.93C64.57,24,64.57,23.68,56.74,20.89ZM36,37.8A9.8,9.8,0,1,1,46,28,9.91,9.91,0,0,1,36,37.8Z"></path>
          </svg>
        </div>
      </div>

      <SettingsMenu isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
    </div>
  );
};

export default GameMenu;
