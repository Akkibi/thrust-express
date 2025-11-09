import { eventEmitter } from "../utils/eventEmitter";

interface TouchData {
  touch: Touch;
  element: HTMLElement;
  startX: number;
  startY: number;
}

interface Delta {
  dx: number;
  dy: number;
}

export class TouchManager {
  private static instance: TouchManager;
  private elements: HTMLElement[] = [];
  private activeTouches: Map<number, TouchData> = new Map();
  private deltaValues: Map<number, Delta> = new Map();

  private constructor() {
    if (TouchManager.instance) {
      return TouchManager.instance;
    }
    TouchManager.instance = this;
  }

  /**
   * Initializes the TouchManager with elements and an event emitter.
   * @param {HTMLElement[]} elements - An array of DOM elements to track touch events on.
   * @param {EventEmitter} eventEmitter - An object with .on and .trigger methods (e.g., a custom event emitter).
   */
  public init(elements: HTMLElement[]): void {
    if (
      !Array.isArray(elements) ||
      !elements.every((e) => e instanceof HTMLElement)
    ) {
      console.error(
        "TouchManager: 'elements' must be an array of HTMLElements.",
      );
      return;
    }
    if (
      !eventEmitter ||
      typeof eventEmitter.on !== "function" ||
      typeof eventEmitter.trigger !== "function"
    ) {
      console.error(
        "TouchManager: 'eventEmitter' must have .on and .trigger methods.",
      );
      return;
    }

    this.destroy(); // Clean up any previous listeners
    this.elements = elements;
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.elements.forEach((element) => {
      element.addEventListener("touchstart", this.handleTouchStart, {
        passive: false,
      });
      element.addEventListener("touchmove", this.handleTouchMove, {
        passive: false,
      });
      element.addEventListener("touchend", this.handleTouchEnd, {
        passive: false,
      });
      element.addEventListener("touchcancel", this.handleTouchCancel, {
        passive: false,
      });
    });
  }

  private removeEventListeners(): void {
    this.elements.forEach((element) => {
      element.removeEventListener("touchstart", this.handleTouchStart);
      element.removeEventListener("touchmove", this.handleTouchMove);
      element.removeEventListener("touchend", this.handleTouchEnd);
      element.removeEventListener("touchcancel", this.handleTouchCancel);
    });
  }

  private handleTouchStart = (event: TouchEvent): void => {
    event.preventDefault(); // Prevent default browser actions like scrolling

    Array.from(event.changedTouches).forEach((touch) => {
      const elementTouched = this.findTouchedElement(
        touch.target as HTMLElement,
      );
      if (elementTouched) {
        this.activeTouches.set(touch.identifier, {
          touch,
          element: elementTouched,
          startX: touch.clientX,
          startY: touch.clientY,
        });
        this.deltaValues.set(touch.identifier, { dx: 0, dy: 0 });
        eventEmitter.trigger("touchStart", [
          elementTouched,
          { dx: 0, dy: 0 },
          event,
        ]);
      }
    });
  };

  private handleTouchMove = (event: TouchEvent): void => {
    event.preventDefault(); // Prevent default browser actions like scrolling

    Array.from(event.changedTouches).forEach((touch) => {
      if (this.activeTouches.has(touch.identifier)) {
        const touchData = this.activeTouches.get(touch.identifier)!;
        const dx = touch.clientX - touchData.startX;
        const dy = touch.clientY - touchData.startY;
        this.deltaValues.set(touch.identifier, { dx, dy });
        eventEmitter.trigger("touchMove", [
          touchData.element,
          { dx, dy },
          event,
        ]);
      }
    });
  };

  private handleTouchEnd = (event: TouchEvent): void => {
    event.preventDefault(); // Prevent default browser actions like scrolling

    Array.from(event.changedTouches).forEach((touch) => {
      if (this.activeTouches.has(touch.identifier)) {
        const touchData = this.activeTouches.get(touch.identifier)!;
        const delta = this.deltaValues.get(touch.identifier)!;
        eventEmitter.trigger("touchEnd", [touchData.element, delta, event]);
        this.activeTouches.delete(touch.identifier);
        this.deltaValues.delete(touch.identifier);
      }
    });
  };

  private handleTouchCancel = (event: TouchEvent): void => {
    event.preventDefault(); // Prevent default browser actions like scrolling

    Array.from(event.changedTouches).forEach((touch) => {
      if (this.activeTouches.has(touch.identifier)) {
        const touchData = this.activeTouches.get(touch.identifier)!;
        const delta = this.deltaValues.get(touch.identifier)!;
        eventEmitter.trigger("touchCancel", [touchData.element, delta, event]);
        this.activeTouches.delete(touch.identifier);
        this.deltaValues.delete(touch.identifier);
      }
    });
  };

  /**
   * Helper to find which of the managed elements the touch started on.
   * This allows for touches to move off the original element but still be tracked.
   * @param {EventTarget} target - The original target of the touch event.
   * @returns {HTMLElement|null} The managed element that was touched, or null if not found.
   */
  private findTouchedElement(target: HTMLElement | null): HTMLElement | null {
    let currentElement: HTMLElement | null = target;
    while (currentElement) {
      if (this.elements.includes(currentElement)) {
        return currentElement;
      }
      currentElement = currentElement.parentElement;
    }
    return null;
  }

  /**
   * Destroys the instance by removing all event listeners and clearing internal state.
   * Useful for re-initializing or cleaning up.
   */
  public destroy(): void {
    this.removeEventListeners();
    this.elements = [];
    this.activeTouches.clear();
    this.deltaValues.clear();
  }

  /**
   * Gets the singleton instance of TouchManager.
   * @returns {TouchManager} The singleton instance.
   */
  public static getInstance(): TouchManager {
    if (!TouchManager.instance) {
      TouchManager.instance = new TouchManager();
    }
    return TouchManager.instance;
  }
}
