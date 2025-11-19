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
  isPaused: boolean;
  isThrusting: boolean;
  health: number;
  isLevelSelectorOpen: boolean;
  lastLevel: LevelType | null;
  lastLevelScore: LevelScoreType | null;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  setIsThrusting: (isThrusting: boolean) => void;
  setHealth: (health: number) => void;
  setIsLevelSelectorOpen: (isLevelSelectorOpen: boolean) => void;
};

type LocalStorageState = {
  levelsDone: LevelScoreType[];
  addLevelScore: (newLevelScore: LevelScoreType) => void;
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
  console.log("no state found");
  return {
    levelsDone: [],
  }; // Default initial state if nothing in localStorage
};

export const globals = {
  currentTime: 0,
  thrustSpeed: 0,
};

export const localStorageStore = create<LocalStorageState>((set) => ({
  ...getInitialState(),
  addLevelScore: (newLevelScore: LevelScoreType) =>
    set((state) => ({
      levelsDone: [...state.levelsDone, newLevelScore], // Create a new array
    })),
}));

console.log(localStorageStore.getState());

export const useStore = create<Store>((set) => ({
  isThrusting: false,
  isPaused: true,
  isEndTitle: false,
  isMenuOpen: true,
  isLevelSelectorOpen: false,
  score: 0,
  health: 100,
  lastLevel: null,
  lastLevelScore: null,
  setIsThrusting: (isThrusting: boolean) => set({ isThrusting }),
  setIsEndTitle: (isEndTitle: boolean) => set({ isEndTitle }),
  setIsMenuOpen: (isMenuOpen: boolean) => set({ isMenuOpen }),
  setIsLevelSelectorOpen: (isLevelSelectorOpen: boolean) =>
    set({ isLevelSelectorOpen }),
  setHealth: (health: number) => set({ health }),
}));

localStorageStore.subscribe((state) => {
  try {
    const stateToSave = { levelsDone: state.levelsDone };
    console.log("update store");

    localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(stateToSave));
  } catch (e) {
    console.error("Failed to save state to localStorage", e);
  }
});

// localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify({ levelsDone: [] }));
