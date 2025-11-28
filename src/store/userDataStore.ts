import { create } from "zustand";
import type { ILevelScore } from "../types/types";

const LOCALSTORAGE_NAME = "thrust-express";

type LocalStorageState = {
  levelsDone: ILevelScore[];
  addLevelScore: (newLevelScore: ILevelScore) => void;
  removeLevelScore: () => void;
};

const getInitialState = () => {
  try {
    const persistedState = localStorage.getItem(LOCALSTORAGE_NAME);
    if (persistedState && persistedState.search("levelsDone") !== -1) {
      return JSON.parse(persistedState);
    }
    console.error("Failed to load state from localStorage - data corrupted");
  } catch (e) {
    console.error("Failed to load state from localStorage", e);
  }
  return {
    levelsDone: [],
  }; // Default initial state if nothing in localStorage
};

export const userDataStore = create<LocalStorageState>((set) => ({
  ...getInitialState(),
  addLevelScore: (newLevelScore: ILevelScore) =>
    set((state) => ({
      levelsDone: [...state.levelsDone, newLevelScore], // Create a new array
    })),
  removeLevelScore: () =>
    set(() => ({
      levelsDone: [],
    })),
}));

userDataStore.subscribe((state) => {
  try {
    const stateToSave = { levelsDone: state.levelsDone };
    console.log("update store");

    localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(stateToSave));
  } catch (e) {
    console.error("Failed to save state to localStorage", e);
  }
});

export const removeUserData = () => {
  localStorage.removeItem(LOCALSTORAGE_NAME);
};

// removeUserData();
