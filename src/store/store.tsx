import { create } from "zustand";
import type { LevelType } from "../levels";

export interface LevelScoreType {
  levelName: string;
  time: number;
  health: number;
}

type Store = {
  isEndTitle: boolean;
  setIsEndTitle: (isEndTitle: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  isPaused: boolean;
  isThrusting: boolean;
  setIsThrusting: (isThrusting: boolean) => void;
  health: number;
  setHealth: (health: number) => void;
  levelsDone: LevelScoreType[];
  addLevelScore: (newLevelScore: LevelScoreType) => void;
  currentTimePassed: number;
  isLevelSelectorOpen: boolean;
  setIsLevelSelectorOpen: (isLevelSelectorOpen: boolean) => void;
  thrustSpeed: number;
  lastLevel: LevelType | null;
  lastLevelScore: LevelScoreType | null;
};

export const useStore = create<Store>((set) => ({
  isThrusting: false,
  setIsThrusting: (isThrusting: boolean) => set({ isThrusting }),
  isPaused: true,
  isEndTitle: false,
  setIsEndTitle: (isEndTitle: boolean) => set({ isEndTitle }),
  isMenuOpen: true,
  setIsMenuOpen: (isMenuOpen: boolean) => set({ isMenuOpen }),
  isLevelSelectorOpen: false,
  setIsLevelSelectorOpen: (isLevelSelectorOpen: boolean) =>
    set({ isLevelSelectorOpen }),
  health: 100,
  setHealth: (health: number) => set({ health }),
  score: 0,
  levelsDone: [],
  addLevelScore: (newLevelScore: LevelScoreType) =>
    set((state) => ({
      levelsDone: [...state.levelsDone, newLevelScore], // Create a new array
    })),
  currentTimePassed: 0,
  thrustSpeed: 0,
  lastLevel: null,
  lastLevelScore: null,
}));
