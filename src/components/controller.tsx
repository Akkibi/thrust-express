import { useEffect, useRef } from "react";
import { eventEmitter } from "../utils/eventEmitter";
import type {
  PointerEndDataType,
  PointerMoveDataType,
  PointerStartData,
} from "../utils/touchHandler";
import { PhysicsEngine } from "../matter/physics";

const Controller = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HTMLDivElement>(null);
  const controllerKnobRef = useRef<HTMLDivElement>(null);
  const thrustButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const controller = controllerRef.current;
    const controllerKnob = controllerKnobRef.current;
    const thrustButton = thrustButtonRef.current;
    if (!container || !controller || !controllerKnob || !thrustButton) {
      return;
    }

    const physicsEngine = PhysicsEngine.getInstance();

    const handlePointerDown = () => {
      physicsEngine.isThrusting = true;
    };
    const handlePointerUp = () => {
      physicsEngine.isThrusting = false;
    };

    thrustButton.addEventListener("pointerdown", handlePointerDown);
    thrustButton.addEventListener("pointerup", handlePointerUp);

    const handleDown = (e: PointerStartData) => {
      controller.style.display = "block";
      controller.style.left = `${e.x}px`;
      controller.style.top = `${e.y}px`;
      const { width, height } = controller.getBoundingClientRect();
      const x = width * 0.5;
      const y = height * 0.5;
      controllerKnob.style.left = `${x}px`;
      controllerKnob.style.top = `${y}px`;
    };

    const handleUp = (e: PointerEndDataType) => {
      controller.style.display = "none";
    };

    const handleMove = (e: PointerMoveDataType) => {
      const { width, height } = controller.getBoundingClientRect();

      const clampedOffsetX = Math.min(
        Math.max(e.originX, -width * 0.5),
        width * 0.5,
      );
      const clampedOffsetY = Math.min(
        Math.max(e.originY, -height * 0.5),
        height * 0.5,
      );
      const x = clampedOffsetX + width * 0.5;
      const y = clampedOffsetY + height * 0.5;

      // calculate angle of rotation of originX and originY
      const angle = Math.atan2(e.originY, e.originX);
      physicsEngine.targetRotation = angle - Math.PI;

      controllerKnob.style.left = `${x}px`;
      controllerKnob.style.top = `${y}px`;
    };

    eventEmitter.on("PointerStart", (e: PointerStartData) => {
      console.log("start");
      handleDown(e);
    });

    eventEmitter.on("PointerMove", (e: PointerMoveDataType) => {
      handleMove(e);
    });

    eventEmitter.on("PointerEnd", (e: PointerEndDataType) => {
      handleUp(e);
    });

    console.log("controller mounted");
    return () => {
      controller.style.display = "none";
      thrustButton.removeEventListener("pointerdown", handlePointerDown);
      thrustButton.removeEventListener("pointerup", handlePointerUp);
    };
  }, [containerRef, controllerRef, controllerKnobRef]);

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      ref={containerRef}
    >
      <button
        type="button"
        ref={thrustButtonRef}
        className="pointer-events-auto absolute bottom-5 md:bottom-15 right-5 md:right-20 w-14 h-14 bg-gray-800 rounded-md"
      >
        <p className="text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-90">
          THRUST
        </p>
      </button>
      <div
        className="absolute w-30 h-30 bg-gray-600/20 -translate-x-1/2 -translate-y-1/2 rounded-full"
        ref={controllerRef}
      >
        <div
          className="absolute w-10 h-10 bg-gray-300/20 -translate-x-1/2 -translate-y-1/2 rounded-full"
          ref={controllerKnobRef}
        ></div>
      </div>
    </div>
  );
};

export default Controller;
