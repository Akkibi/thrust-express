import { create } from "zustand";
import type { LevelType } from "../levels";

export interface LevelScoreType {
  levelName: string;
  time: number;
  health: number;
}

const LOCALSTORAGE_NAME = "thrust-express";

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

const getInitialState = () => {
  try {
    const persistedState = localStorage.getItem(LOCALSTORAGE_NAME);
    if (persistedState) {
      return JSON.parse(persistedState);
    }
  } catch (e) {
    console.error("Failed to load state from localStorage", e);
  }
  return {
    levelsDone: [],
  }; // Default initial state if nothing in localStorage
};

export const useStore = create<Store>((set) => ({
  ...getInitialState(),
  isThrusting: false,
  isPaused: true,
  isEndTitle: false,
  isMenuOpen: true,
  isLevelSelectorOpen: false,
  score: 0,
  health: 100,
  currentTimePassed: 0,
  thrustSpeed: 0,
  lastLevel: null,
  lastLevelScore: null,
  setIsThrusting: (isThrusting: boolean) => set({ isThrusting }),
  setIsEndTitle: (isEndTitle: boolean) => set({ isEndTitle }),
  setIsMenuOpen: (isMenuOpen: boolean) => set({ isMenuOpen }),
  setIsLevelSelectorOpen: (isLevelSelectorOpen: boolean) =>
    set({ isLevelSelectorOpen }),
  setHealth: (health: number) => set({ health }),
  addLevelScore: (newLevelScore: LevelScoreType) =>
    set((state) => ({
      levelsDone: [...state.levelsDone, newLevelScore], // Create a new array
    })),
}));

useStore.subscribe((state) => {
  try {
    const stateToSave = { levelsDone: state.levelsDone };

    localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(stateToSave));
  } catch (e) {
    console.error("Failed to save state to localStorage", e);
  }
});
