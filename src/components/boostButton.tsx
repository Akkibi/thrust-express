import { useEffect, useRef, type ReactNode } from "react";
import { useStore } from "../store/store";

const BoostButton = (): ReactNode => {
  const thrustButtonRef = useRef<HTMLDivElement>(null);

  const setIsThrusting = useStore((s) => s.setIsThrusting);
  const isThrusting = useStore((s) => s.isThrusting);
  const thrustSpeed = useStore((s) => s.thrustSpeed);

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
    <div className="absolute bottom-0 right-0 w-30 h-40 bg-slate-700 rounded-tl-4xl custom-light-border">
      <div className="absolute bottom-0 right-0 w-28 h-38 bg-slate-900 rounded-tl-3xl custom-inner-shadow">
        <div className="absolute left-1/2 top-2 -translate-x-1/2 w-22 h-22 bg-slate-950 rounded-full custom-inner-shadow">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-900 rounded-full"
            style={{
              opacity: isThrusting ? 0.5 : 1,
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 w-20 h-20 bg-red-700 rounded-full custom-light-border"
              style={{
                transform: `translateY(${isThrusting ? "-50%" : "-55%"})`,
              }}
              ref={thrustButtonRef}
            >
              <p className="text-white font-black text-center w-full absolute top-1/2 -translate-y-1/2 -tracking-widest select-none">
                BOOST
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-2 right-2 h-10 bg-slate-950 rounded-t-md overflow-hidden custom-light-border">
          <div
            className="absolute inset-0 origin-left bg-red-900"
            style={{
              transform: `scaleX(${Math.log2(Math.max(thrustSpeed * 0.1, 0.001))})`,
            }}
          ></div>
          <div
            className="absolute inset-0 origin-left bg-red-700 z-10"
            style={{ transform: `scaleX(${thrustSpeed * 0.01})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BoostButton;
