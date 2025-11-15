import { create } from "zustand";

interface levelScore {
  levelName: string;
  time: number;
  score: number;
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
  score: number;
  globalScore: number;
  levelsDone: levelScore[];
  currentTimePassed: number;
};

export const useStore = create<Store>((set) => ({
  isThrusting: false,
  setIsThrusting: (isThrusting: boolean) => set({ isThrusting }),
  isPaused: true,
  isEndTitle: false,
  setIsEndTitle: (isEndTitle: boolean) => set({ isEndTitle }),
  isMenuOpen: true,
  setIsMenuOpen: (isMenuOpen: boolean) => set({ isMenuOpen }),
  health: 100,
  setHealth: (health: number) => set({ health }),
  score: 0,
  globalScore: 0,
  levelsDone: [],
  currentTimePassed: 0,
}));
