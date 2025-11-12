import { useStore } from "../store/store";

export class Cheats {
  private static instance: Cheats;
  private isEnabled: boolean;

  private constructor() {
    this.isEnabled = true;
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "$") {
      if (this.isEnabled) {
        this.disable();
      } else {
        this.enable();
      }
    } else if (this.isEnabled) {
      if (event.key === "p") {
        useStore.setState({ isPaused: !useStore.getState().isPaused });
      }
      if (event.key === "g") {
        console.log("Game Over");
        useStore.setState({ isEndTitle: true });
      }
    }
  }

  public static getInstance(): Cheats {
    if (!Cheats.instance) {
      Cheats.instance = new Cheats();
    }
    return Cheats.instance;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public isActive(): boolean {
    return this.isEnabled;
  }
}
