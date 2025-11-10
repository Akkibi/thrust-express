export class JoystickHandler {
  private static instance: JoystickHandler;
  private initPos: number[] = [0, 0];
  private currentPos: number[] = [0, 0];
  private deltaPos: number[] = [0, 0];
  private joyStickAngle: number;

  public getDelta() {
    return this.deltaPos;
  }

  public getAngle() {
    return this.joyStickAngle;
  }

  public getstartPos() {
    return this.getstartPos;
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new JoystickHandler();
    }
    return this.instance;
  }

  public setJoyStickAngle(angle: number) {
    this.joyStickAngle = angle;
  }

  private constructor() {
    this.joyStickAngle = -Math.PI / 2;
  }

  public setInitPos = (pos: number[]) => {
    this.initPos = pos;
  };

  public setCurrentPos = (pos: number[]) => {
    this.currentPos = pos;

    const x = this.currentPos[0] - this.initPos[0];
    const y = this.currentPos[1] - this.initPos[1];
    this.joyStickAngle = Math.atan2(y, x);
    this.deltaPos = [x, y];
  };
}


class KeyRotationManager {
  private static instance: KeyRotationManager;
  private joyStickHandler: JoystickHandler;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new KeyRotationManager();
    }
    return this.instance;
  }

  private constructor() {
    this.joyStickHandler = JoystickHandler.getInstance();

   window.addEventListener("keydown", (e) => {
      if (e.key === "z" || e.key === "ArrowUp") {
        this.joyStickHandler.setJoyStickAngle(- Math.PI / 2);
      } else  if (e.key === "s" || e.key === "ArrowDown") {
        this.joyStickHandler.setJoyStickAngle(Math.PI / 2);
      } else if (e.key === "q" || e.key === "ArrowLeft") {
        this.joyStickHandler.setJoyStickAngle(Math.PI);
      } else if (e.key === "d" || e.key === "ArrowRight") {
        this.joyStickHandler.setJoyStickAngle(0);
      }
    });
  }
}


KeyRotationManager.getInstance();
