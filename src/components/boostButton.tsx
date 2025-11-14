import { useEffect, useRef, type ReactNode } from "react";
import { useStore } from "../store/store";

const BoostButton = (): ReactNode => {
  const thrustButtonRef = useRef<HTMLDivElement>(null);

  const setIsThrusting = useStore((s) => s.setIsThrusting);
  const isThrusting = useStore((s) => s.isThrusting);

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
    <div className="absolute bottom-0 right-0 w-30 h-30 bg-slate-700 rounded-tl-4xl custom-light-border">
      <div className="absolute bottom-0 right-0 w-28 h-28 bg-slate-900 rounded-tl-3xl custom-inner-shadow">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-700 rounded-full border-4 border-black custom-light-border"
          style={{
            opacity: isThrusting ? 0.5 : 1,
          }}
          ref={thrustButtonRef}
        >
          <p className="text-white font-black text-center w-full absolute top-1/2 -translate-y-1/2 -tracking-widest select-none">
            BOOST
          </p>
        </div>
      </div>
    </div>
  );
};

export default BoostButton;
