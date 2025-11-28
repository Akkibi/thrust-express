import { useState, type ReactNode } from "react";
import Button from "./button";
import { removeUserData, userDataStore } from "../store/userDataStore";
import { cn } from "../utils/cn";
import { useStore } from "../store/store";

interface ISettingsType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface DocumentElement {
  requestFullscreen: () => void;
  webkitRequestFullscreen: () => void;
  mozRequestFullscreen: () => void;
}

interface Document {
  webkitFullscreenElement: Element | null;
}

const SettingsMenu = ({ isOpen, setIsOpen }: ISettingsType): ReactNode => {
  const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);
  const levelsDone = userDataStore((state) => state.levelsDone);
  const resetLevelsDone = userDataStore((state) => state.removeLevelScore);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const isPostProcessingOn = useStore((state) => state.isPostProcessingOn);
  const setIsPostProcessingOn = useStore(
    (state) => state.setIsPostProcessingOn,
  );
  const [volume, setVolume] = useState(50); // 0–100
  const isFullscreen = useStore((state) => state.isFullscreen);
  const setIsFullscreen = useStore((state) => state.setIsFullscreen);

  if (!isOpen) return <></>;

  return (
    <section className="absolute inset-0 z-40 bg-slate-950/80 flex flex-col justify-center">
      <div className=" bg-black select-none pointer-events-none absolute top-0 h-[30vh] opacity-75 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain"></div>
      <div className=" bg-black select-none pointer-events-none absolute bottom-0 h-[30vh] opacity-75 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain rotate-180"></div>
      <div className="relative w-full h-fit flex flex-col">
        <div
          className="mx-5 p-1 bg-transparent relative"
          style={{ backgroundSize: "100% 100%" }}
        >
          <div className="w-20 h-20 bg-slate-600 absolute top-0 left-0 rounded-sm"></div>
          <div className="w-20 h-20 bg-slate-600 absolute bottom-0 left-0 rounded-sm"></div>
          <div className="w-20 h-20 bg-slate-600 absolute bottom-0 right-0 rounded-sm"></div>
          <div className="w-20 h-20 bg-slate-600 absolute top-0 right-0 rounded-sm"></div>
          <div className="p-1 bg-slate-800">
            <div className="bg-radial from-slate-900 to-slate-950 flex flex-col items-center gap-5 py-10 pt-4 relative z-10">
              <div className="p-2 px-4 custom-text-border text-2xl flex flex-col items-center justify-between gap-2">
                {levelsDone.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetPopupOpen(true);
                    }}
                    className="p-1 px-2 w-fit text-red-800 border border-red-700 bg-red-900/20 text-xs font-light rounded-full font-mono!"
                  >
                    Reset scores
                  </button>
                )}
                <p className="w-fit poppins">SETTINGS</p>
                <div className="w-40 h-0.5 bg-slate-700"></div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="mx-auto w-fit text-center text-slate-400">
                  Post-processing
                </p>
                <div
                  className="flex flex-row gap-1 justify-center"
                  onClick={() => {
                    setIsPostProcessingOn(!isPostProcessingOn);
                  }}
                >
                  <BooleanSelection isOn={isPostProcessingOn}>
                    On
                  </BooleanSelection>
                  <BooleanSelection isOn={!isPostProcessingOn}>
                    Off
                  </BooleanSelection>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <p className="mx-auto w-fit text-center text-slate-400">
                  Sound
                </p>
                <div
                  className="flex flex-row gap-1 justify-center"
                  onClick={() => {
                    setIsSoundOn(!isSoundOn);
                  }}
                >
                  <BooleanSelection isOn={isSoundOn}>On</BooleanSelection>
                  <BooleanSelection isOn={!isSoundOn}>Off</BooleanSelection>
                </div>
                <div
                  className={cn(
                    "flex flex-row gap-2 justify-center px-4 w-full",
                    isSoundOn ? "opacity-100" : "opacity-50",
                  )}
                >
                  <button
                    className="w-fit h-fit p-1 px-3 bg-slate-800 border-2 border-slate-700 rounded-md"
                    onClick={() => {
                      setVolume(Math.max(volume - 1, 0));
                    }}
                  >
                    <p className="text-slate-400 text-2xl">-</p>
                  </button>
                  <div className="w-full relative">
                    <div className="absolute w-full h-2 bg-slate-800 top-1/2 -translate-y-1/2 rounded-xs select-none pointer-events-none"></div>
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-2/3 bg-slate-300 rounded-sm"
                      style={{
                        left: `${volume}%`,
                      }}
                    ></div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      disabled={!isSoundOn}
                      className="w-full h-full range-track range-thumb"
                    />
                  </div>
                  <button
                    className="w-fit h-fit p-1 px-3 bg-slate-800 border-2 border-slate-700 rounded-md"
                    onClick={() => {
                      setVolume(Math.min(volume + 1, 100));
                    }}
                  >
                    <p className="text-slate-400 text-2xl">+</p>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="mx-auto w-fit text-center text-slate-400">
                  Fullscreen
                </p>
                <div
                  className="flex flex-row gap-1 justify-center"
                  onClick={() => {
                    // request fullscreen
                    setIsFullscreen(!isFullscreen);
                    const doc = document as globalThis.Document & Document;
                    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
                      document.exitFullscreen();
                      return;
                    }
                    const el = doc.documentElement as HTMLElement &
                      DocumentElement;
                    if (el.requestFullscreen) {
                      el.requestFullscreen();
                    } else if (el.webkitRequestFullscreen) {
                      el.webkitRequestFullscreen();
                    } else if (el.mozRequestFullscreen) {
                      el.mozRequestFullscreen();
                    }
                  }}
                >
                  <BooleanSelection isOn={isFullscreen}>On</BooleanSelection>
                  <BooleanSelection isOn={!isFullscreen}>Off</BooleanSelection>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 px-5 flex flex-row items-center w-full relative z-10 justify-around">
        <Button
          className=""
          onClick={() => {
            setIsOpen(false);
          }}
        >
          back
        </Button>
        <a
          className="text-yellow-400 visited:text-yellow-700 text-xs h-10 relative"
          href="https://github.com/Akkibi/thrust-express"
        >
          <p className="h-10 leading-10">Visit GitHub repo</p>
        </a>
      </div>
      {isResetPopupOpen && (
        <div className="absolute inset-0 bg-black/50 z-50">
          <div className="absolute inset-0 bg-red-950/50">
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-[url(/corner.svg)] bg-cover"></div>
            <div className="absolute top-0 left-0 w-20 h-20 bg-[url(/corner.svg)] bg-cover rotate-90"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-[url(/corner.svg)] bg-cover rotate-180"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-[url(/corner.svg)] bg-cover -rotate-90"></div>
            <div className=" bg-black select-none pointer-events-none absolute top-0 h-[30vh] opacity-75 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain"></div>
            <div className=" bg-black select-none pointer-events-none absolute bottom-0 h-[30vh] opacity-75 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain rotate-180"></div>
            <div className="absolute inset-0 bg-[url(/warning.svg)] bg-center bg-no-repeat bg-contain">
              <p className="poppins text-2xl custom-text-border absolute top-1/2 w-full -translate-y-1/2 text-center">
                {">> ARE YOU SHURE <<"}
              </p>
            </div>
            <div className=" w-full absolute bottom-20 h-fit flex justify-around items-center">
              <Button onClick={() => setIsResetPopupOpen(false)}>
                {"Cancel"}
              </Button>
              <Button
                onClick={() => {
                  removeUserData();
                  resetLevelsDone();
                  setIsResetPopupOpen(false);
                }}
              >
                {"Reset"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SettingsMenu;

const BooleanSelection = ({
  isOn,
  children,
}: {
  isOn: boolean;
  children: ReactNode;
}) => {
  if (isOn) {
    return (
      <button className="w-fit h-fit p-2 px-3 bg-yellow-950 border-2 border-yellow-700 rounded-md">
        <p>{children}</p>
      </button>
    );
  } else {
    return (
      <button className="w-fit h-fit p-2 px-3 bg-slate-800 border-2 border-slate-700 rounded-md">
        <p>{children}</p>
      </button>
    );
  }
};
