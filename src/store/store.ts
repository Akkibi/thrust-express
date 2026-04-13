import { create } from "zustand";
import type { LevelType } from "../levels";
import type { ILevelScore } from "../types/types";

type Store = {
  score: number;
  isEndTitle: boolean;
  setIsEndTitle: (isEndTitle: boolean) => void;
  isMenuOpen: boolean;
  isPaused: boolean;
  isCutscene: boolean;
  isThrusting: boolean;
  health: number;
  isLevelSelectorOpen: boolean;
  lastLevel: LevelType | null;
  lastLevelScore: ILevelScore | null;
  isPostProcessingOn: boolean;
  selectedShipModel: string;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  setIsThrusting: (isThrusting: boolean) => void;
  setHealth: (health: number) => void;
  setIsLevelSelectorOpen: (isLevelSelectorOpen: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setIsPostProcessingOn: (isPostProcessingOn: boolean) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setSelectedShipModel: (model: string) => void;
  isFullscreen: boolean;
};

export const globals = {
  currentTime: 0,
  thrustSpeed: 0,
};

export const useStore = create<Store>((set) => ({
  isThrusting: false,
  isPostProcessingOn: true,
  isPaused: true,
  isCutscene: true,
  isEndTitle: false,
  isMenuOpen: true,
  isLevelSelectorOpen: false,
  score: 0,
  health: 100,
  lastLevel: null,
  lastLevelScore: null,
  isFullscreen: false,
  selectedShipModel:
    localStorage.getItem("selectedShipModel") ?? "spaceship.glb",
  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),
  setIsPostProcessingOn: (isPostProcessingOn: boolean) =>
    set({ isPostProcessingOn }),
  setIsPaused: (isPaused: boolean) => set({ isPaused }),
  setIsThrusting: (isThrusting: boolean) => set({ isThrusting }),
  setIsEndTitle: (isEndTitle: boolean) => set({ isEndTitle }),
  setIsMenuOpen: (isMenuOpen: boolean) => set({ isMenuOpen }),
  setIsLevelSelectorOpen: (isLevelSelectorOpen: boolean) =>
    set({ isLevelSelectorOpen }),
  setHealth: (health: number) => set({ health }),
  setSelectedShipModel: (selectedShipModel: string) => {
    localStorage.setItem("selectedShipModel", selectedShipModel);
    set({ selectedShipModel });
  },
}));
