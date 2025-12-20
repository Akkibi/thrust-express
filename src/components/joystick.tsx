import { useEffect, useRef, useState, type ReactNode } from "react";
import { JoystickHandler } from "../utils/joystickHandler";
import { cn } from "../utils/cn";
import { useStore } from "../store/store";

const JoyStick = (): ReactNode => {
  const isCutscene = useStore((state) => state.isCutscene);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const joystickContainerRef = useRef<HTMLDivElement>(null);
  const joystickZoneRef = useRef<HTMLDivElement>(null);
  const joyStickKnobRef = useRef<HTMLDivElement>(null);
  const joystickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const joyStickContainer = joystickContainerRef.current;
    const joystickZone = joystickZoneRef.current;
    const joyStickKnob = joyStickKnobRef.current;
    const joyStick = joystickRef.current;
    if (!joyStickContainer || !joyStickKnob || !joyStick || !joystickZone)
      return;

    const joystickHandler = JoystickHandler.getInstance();

    const findTouch = (e: TouchEvent): Touch | null => {
      let currentTouch = null;
      const touches = [...e.touches];
      touches.forEach((touch) => {
        // console.log(touch.target, joystickZone);
        if (
          // touch.clientX < window.innerWidth * 0.5 &&
          touch.target === joystickZone
        ) {
          currentTouch = touch;
        }
      });
      return currentTouch;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = findTouch(e);
      if (!touch) return;
      setIsTouchActive(true);
      console.log("joystick start");
      const x = touch.clientX - joyStick.offsetLeft;
      const y = touch.clientY - joyStick.offsetTop;
      joystickHandler.setInitPos([x, y]);
      joyStick.style.transform = `translate(${x}px, ${y}px)`;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setIsTouchActive(false);
      console.log("joystick end");
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchActive) return;
      const touch = findTouch(e);
      if (!touch) return;

      joystickHandler.setCurrentPos([touch.clientX, touch.clientY]);
      const { width, height } = joyStick.getBoundingClientRect();

      const delta = joystickHandler.getDelta();
      const angle = joystickHandler.getAngle();
      const deltaLength = Math.sqrt(delta[0] ** 2 + delta[1] ** 2);
      const joystickRadius = (width + height) * 0.25;

      const x =
        Math.min(joystickRadius, Math.max(-joystickRadius, deltaLength)) *
          Math.cos(angle) +
        width * 0.5;
      const y =
        Math.min(joystickRadius, Math.max(-joystickRadius, deltaLength)) *
          Math.sin(angle) +
        +height * 0.5;

      joyStickKnob.style.transform = `translate(${x}px, ${y}px)`;
      // console.log(x, y);
    };

    joystickZone.addEventListener("touchstart", handleTouchStart);
    joystickZone.addEventListener("touchmove", handleTouchMove);
    joystickZone.addEventListener("touchend", handleTouchEnd);
    joystickZone.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      joystickZone.removeEventListener("touchstart", handleTouchStart);
      joystickZone.removeEventListener("touchmove", handleTouchMove);
      joystickZone.removeEventListener("touchend", handleTouchEnd);
      joystickZone.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isTouchActive]);

  return (
    <>
      <div
        ref={joystickZoneRef}
        className={cn(`absolute top-0 bottom-0 left-0 w-1/2 select-none`)}
      ></div>
      <div
        className={cn(
          "absolute inset-0 select-none pointer-events-none",
          isCutscene ? "opacity-50" : "opacity-100",
        )}
        ref={joystickContainerRef}
      >
        <div
          className="absolute w-40 h-40 -translate-x-1/2 -translate-y-1/2 bg-slate-800 rounded-full border-4 border-slate-700 select-none pointer-events-none"
          ref={joystickRef}
          style={{ opacity: isTouchActive ? 0.5 : 0.05 }}
        >
          <div
            className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 bg-slate-400 rounded-full border-4 border-slate-300"
            ref={joyStickKnobRef}
          ></div>
        </div>
      </div>
    </>
  );
};

export default JoyStick;
