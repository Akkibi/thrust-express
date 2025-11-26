import { useEffect, useRef, useState, type ReactNode } from "react";
import { JoystickHandler } from "../utils/joystickHandler";
import { cn } from "../utils/cn";
import { useStore } from "../store/store";

const JoyStick = (): ReactNode => {
  const isCutscene = useStore((state) => state.isCutscene);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const joystickContainerRef = useRef<HTMLDivElement>(null);
  const joyStickKnobRef = useRef<HTMLDivElement>(null);
  const joystickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const joyStickContainer = joystickContainerRef.current;
    const joyStickKnob = joyStickKnobRef.current;
    const joyStick = joystickRef.current;
    if (!joyStickContainer || !joyStickKnob || !joyStick) return;

    const joystickHandler = JoystickHandler.getInstance();

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch.clientX > window.innerWidth * 0.6) return;
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
      const touch = e.touches[0];
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

    joyStickContainer.addEventListener("touchstart", handleTouchStart);
    joyStickContainer.addEventListener("touchmove", handleTouchMove);
    joyStickContainer.addEventListener("touchend", handleTouchEnd);
    joyStickContainer.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      joyStickContainer.removeEventListener("touchstart", handleTouchStart);
      joyStickContainer.removeEventListener("touchmove", handleTouchMove);
      joyStickContainer.removeEventListener("touchend", handleTouchEnd);
      joyStickContainer.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isTouchActive]);

  return (
    <div
      className={cn("absolute inset-0", isCutscene ? "hidden" : "block")}
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
  );
};

export default JoyStick;
