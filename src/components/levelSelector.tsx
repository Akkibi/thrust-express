import { useRef } from "react";
import levels from "../levels";
import Interactions from "./interactions";
import LevelItem from "./levelItem";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface LevelSelectorTypes {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}

const LevelSelector = ({
  isOpen,
  setIsOpen,
  setIsMenuOpen,
}: LevelSelectorTypes) => {
  const levelsListElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const levelsListElements = levelsListElementsRef.current;
    if (levelsListElements.length <= 0 || !isOpen) return;
    console.log("levelsListElements", levelsListElements);
    const tl = gsap.timeline();
    tl.fromTo(
      levelsListElements,
      {
        opacity: 0,
        rotateX: -80,
        scale: 0.8,
      },
      {
        scale: 1,
        rotateX: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out",
        stagger: 0.1,
      },
    );
    tl.play();

    return () => {
      tl.kill();
    };
  }, [isOpen]);

  if (!isOpen) return <></>;
  return (
    <div className="bg-slate-800 absolute z-50 inset-0 flex flex-col items-center justify-center overflow-hidden p-3">
      <div className="w-full px-5 py-2 mb-3 bg-slate-950 rounded-3xl custom-light-border-inset flex flex-row relative">
        <p className="w-full text-xl font-black custom-text-border text-center">
          LEVELS
        </p>
        <div className="bg-[url(/logo.webp)] bg-contain bg-center bg-no-repeat h-10 w-20 absolute right-0 top-1/2 -translate-y-1/2"></div>
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen(true);
            setIsOpen(false);
          }}
          className="absolute top-1/2 left-1 -translate-y-1/2 h-10 w-10"
        >
          <svg
            fill="white"
            className="absolute top-1/2 -translate-y-1/2 h-5 w-5 left-1/2 -translate-x-1/2"
            viewBox="0 0 42 42"
          >
            <polygon
              fillRule="evenodd"
              points="27.066,1 7,21.068 26.568,40.637 31.502,35.704 16.865,21.068 32,5.933 "
            ></polygon>
          </svg>
        </button>
      </div>
      <div className="flex flex-col w-full h-full p-3 bg-slate-950 rounded-3xl overflow-y-scroll custom-light-border-inset perspective-midrange">
        {levels.map((level, index) => (
          <div
            key={index}
            className="h-fit w-full relative origin-top pb-2"
            ref={(el) => {
              levelsListElementsRef.current[index] = el;
            }}
          >
            <LevelItem level={level} action={() => setIsOpen(false)} />
          </div>
        ))}
      </div>
      <Interactions />
    </div>
  );
};

export default LevelSelector;
