import levels from "../levels";
import { useStore } from "../store/store";
import { eventEmitter } from "../utils/eventEmitter";
import Button from "./button";
import { findBestValues } from "../utils/findBestLevel";
import { useEffect, useRef, useState } from "react";
import { userDataStore } from "../store/userDataStore";
import type { ILevelScore } from "../types/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FlipNumbers from "react-flip-numbers";

interface EndTitleTypes {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setLevelSelectorOpen: (isOpen: boolean) => void;
}

const EndTitle = ({
  isOpen,
  setIsOpen,
  setLevelSelectorOpen,
}: EndTitleTypes) => {
  const lastLevelScore = useStore((state) => state.lastLevelScore);
  const lastLevel = useStore((state) => state.lastLevel);
  const [bestValues, setBestValues] = useState<ILevelScore | null>(null);
  const levelsDone = userDataStore((state) => state.levelsDone);

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionTopRef = useRef<HTMLDivElement>(null);
  const sectionBottomRef = useRef<HTMLDivElement>(null);

  const star1ref = useRef<HTMLDivElement>(null);
  const star2ref = useRef<HTMLDivElement>(null);
  const star3ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastLevel) {
      const best = findBestValues(levelsDone, lastLevel.name);

      setBestValues(best);
    }
  }, [lastLevel, levelsDone]);

  useGSAP(
    () => {
      const sectionTop = sectionTopRef.current;
      const sectionBottom = sectionBottomRef.current;
      const container = containerRef.current;

      const star1 = star1ref.current;
      const star2 = star2ref.current;
      const star3 = star3ref.current;
      if (!sectionTop || !sectionBottom || !container) return;

      gsap.set(star1, { opacity: 0 });
      gsap.set(star2, { opacity: 0 });
      gsap.set(star3, { opacity: 0 });

      const tl = gsap.timeline();
      tl.fromTo(
        container,
        {
          opacity: 0,
          scale: 2,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
        },
      )
        .fromTo(
          sectionTop,
          {
            y: "-100%",
            opacity: 0,
          },
          {
            y: "0%",
            opacity: 1,
            duration: 1,
            delay: 0.25,
            ease: "expo.out",
          },
          "<",
        )
        .fromTo(
          sectionBottom,
          {
            y: "100%",
            opacity: 0,
          },
          {
            y: "0%",
            opacity: 1,
            duration: 1,
            delay: 0.5,
            ease: "expo.out",
          },
          "<",
        )
        .set(
          star1,
          {
            opacity: 1,
            delay: 0.75,
          },
          "<",
        )
        .set(
          star2,
          {
            opacity: 1,
            delay: 0.25,
          },
          ">",
        )
        .set(
          star3,
          {
            opacity: 1,
            delay: 0.25,
          },
          ">",
        );
    },
    {
      scope: containerRef,
      dependencies: [sectionBottomRef, sectionTopRef, isOpen],
    },
  );

  if (!isOpen) return <></>;
  return (
    <div
      className="absolute z-50 inset-0 flex bg-black/20 flex-col items-center justify-center"
      ref={containerRef}
    >
      <div className=" bg-slate-950 select-none pointer-events-none absolute top-0 h-[30vh] opacity-50 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain"></div>
      <div className=" bg-slate-950 select-none pointer-events-none absolute bottom-0 h-[30vh] opacity-50 right-0 left-0 mask-[url(/border-pattern.png)] mask-repeat-x mask-luminance mask-contain rotate-180"></div>
      <div className="flex flex-col items-center justify-center w-full h-full py-20">
        <div
          className="flex flex-col py-4 gap-3 w-full items-center justify-center relative"
          ref={sectionTopRef}
        >
          <div
            className="absolute inset-0 z-0 opacity-75 -scale-y-100"
            style={{
              backgroundSize: "100% 100%",

              backgroundImage: "url(/end-bg.svg)",
            }}
          ></div>

          {lastLevelScore ? (
            <>
              <div className="text-base font-bold text-yellow-500 relative">
                Package Delivered !
              </div>
            </>
          ) : (
            <>
              <div className="text-xl font-bold text-white relative">
                Game Over
              </div>
            </>
          )}
          <div
            className="w-full h-30 bg-contain bg-no-repeat bg-center relative"
            style={{
              backgroundImage: "url(/stars/nostars.svg)",
            }}
          >
            {lastLevelScore && (
              <>
                <div
                  className="inset-0 absolute bg-contain bg-no-repeat bg-center w-full h-full"
                  style={{
                    backgroundImage: "url(/stars/1star.svg)",
                  }}
                  ref={star1ref}
                ></div>
                {lastLevelScore.health > 40 && (
                  <div
                    className="inset-0 absolute bg-contain bg-no-repeat bg-center"
                    style={{
                      backgroundImage: "url(/stars/2stars.svg)",
                    }}
                    ref={star2ref}
                  ></div>
                )}
                {lastLevelScore.health === 100 && (
                  <div
                    className="inset-0 absolute bg-contain bg-no-repeat bg-center"
                    style={{
                      backgroundImage: "url(/stars/3stars.svg)",
                    }}
                    ref={star3ref}
                  ></div>
                )}
              </>
            )}
          </div>
          {lastLevelScore ? (
            <>
              <div className="flex flex-row items-end text-yellow-500 relative">
                <FlipNumbers
                  height={70}
                  width={50}
                  color="#f0b100"
                  delay={0}
                  duration={2}
                  nonNumberClassName="font-black custom-text-border text-5xl"
                  numberClassName="font-black custom-text-border text-5xl"
                  background="transparent"
                  play
                  perspective={1000}
                  numbers={(lastLevelScore.time / 1000).toFixed(2).toString()}
                />
                <p className="text-xl custom-text-border">s</p>
              </div>
              {bestValues && bestValues.time >= lastLevelScore.time ? (
                <>
                  <div className=" w-fit px-5 py-2 font-black bg-linear-to-t from-yellow-900 to-yellow-700 text-yellow-300 border-4 border-solid rounded-lg border-yellow-300 rotate-3 relative shadow-xl">
                    BEST TIME
                  </div>
                </>
              ) : (
                <p className="relative">
                  <span className="text-xs font-bold">Best : </span>
                  <span className="text-yellow-500 font-black custom-text-border text-xs">
                    {(bestValues ? bestValues.time / 1000 : 0).toFixed(2)}s
                  </span>
                </p>
              )}
            </>
          ) : (
            <p className="text-xs font-bold text-slate-400 relative">
              Still waiting for my package to arrive ..
            </p>
          )}
        </div>
        <div className="h-full w-full"></div>
        <div
          className="flex flex-col justify-center items-center relative w-full"
          ref={sectionBottomRef}
        >
          <div
            className="absolute inset-0 z-0 opacity-75"
            style={{
              backgroundSize: "100% 100%",

              backgroundImage: "url(/end-bg.svg)",
            }}
          ></div>
          <div className="flex flex-row flex-wrap gap-4 mb-5 relative">
            <Button
              onClick={() => {
                setLevelSelectorOpen(true);
                setIsOpen(false);
              }}
              isDisabled={false}
            >
              Back
            </Button>
            {levels[(lastLevel ? levels.indexOf(lastLevel) : 0) + 1] &&
            lastLevelScore ? (
              <Button
                onClick={() => {
                  eventEmitter.trigger("next-level", []);
                  setIsOpen(false);
                }}
                isDisabled={false}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={() => {
                  eventEmitter.trigger("start", [lastLevel]);
                  setIsOpen(false);
                }}
                isDisabled={false}
              >
                Restart
              </Button>
            )}
          </div>
          {lastLevelScore && (
            <button
              className="relative p-5 cursor-pointer custom-text-border hover:scale-105 active:scale-90 transition-transform duration-300 ease-out active:text-yellow-600 font-mono"
              type="button"
              onClick={() => {
                eventEmitter.trigger("start", [lastLevel]);
                setIsOpen(false);
              }}
            >
              Restart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EndTitle;
