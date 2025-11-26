import { useEffect, useRef, useState, type ReactNode } from "react";
import { globals, useStore } from "../store/store";
import { cn } from "../utils/cn";

const BoostButton = (): ReactNode => {
  const thrustButtonRef = useRef<HTMLDivElement>(null);

  const setIsThrusting = useStore((s) => s.setIsThrusting);
  const isThrusting = useStore((s) => s.isThrusting);
  const [thrustSpeed, setThrustSpeed] = useState(0);
  const isCutscene = useStore((s) => s.isCutscene);

  useEffect(() => {
    const interval = setInterval(() => {
      setThrustSpeed(globals.thrustSpeed);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const thrustButton = thrustButtonRef.current;
    if (!thrustButton) return;

    const handleTouchStart = () => {
      setIsThrusting(true);
    };

    const handleTouchEnd = () => {
      setIsThrusting(false);
    };

    thrustButton.addEventListener("touchstart", handleTouchStart);
    thrustButton.addEventListener("touchend", handleTouchEnd);
    thrustButton.addEventListener("touchcancel", handleTouchEnd);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "t" || e.key === "T") {
        setIsThrusting(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "t" || e.key === "T") {
        setIsThrusting(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      thrustButton.removeEventListener("touchstart", handleTouchStart);
      thrustButton.removeEventListener("touchend", handleTouchEnd);
      thrustButton.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [thrustButtonRef, setIsThrusting]);

  return (
    <div
      className="absolute bottom-0 right-0 w-30 h-40 pointer-events-auto block"
      ref={thrustButtonRef}
    >
      <div
        className={cn(
          "absolute inset-0 bg-slate-700 rounded-tl-full custom-light-border",
          isCutscene ? "opacity-50" : "opacity-100",
        )}
      >
        <div className="absolute bottom-0 right-0 w-28 h-38 bg-slate-900 rounded-tl-full custom-inner-shadow">
          <div className="absolute left-1/2 top-2 -translate-x-1/2 w-22 h-22 bg-slate-950 rounded-full custom-inner-shadow">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-900 rounded-full"
              style={{
                opacity: isThrusting ? 0.5 : 1,
              }}
            >
              <button
                className="absolute left-1/2 top-1/2 -translate-x-1/2 w-20 h-20 bg-red-700 rounded-full custom-light-border"
                style={{
                  transform: `translateY(${isThrusting ? "-50%" : "-55%"})`,
                }}
              >
                <p className="text-white font-black text-center w-full absolute top-1/2 -translate-y-1/2 -tracking-widest select-none custom-text-border italic opacity-50">
                  BOOST
                </p>
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-2 right-2 h-10 bg-slate-950 rounded-t-md overflow-hidden custom-light-border">
            <div
              className="absolute inset-0 origin-left bg-red-900 duration-200 ease-out"
              style={{
                transform: `scaleX(${Math.log2(Math.max(thrustSpeed * 0.1, 0.001))})`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostButton;
