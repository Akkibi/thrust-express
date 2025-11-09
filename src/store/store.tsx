import { create } from "zustand";

type Store = {
  isGameOver: boolean;
  isPaused: boolean;
  isThrusting: boolean;
  setIsThrusting: (isThrusting: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  isThrusting: false,
  setIsThrusting: (isThrusting: boolean) => set({ isThrusting }),
  isPaused: false,
  isGameOver: false,
  setIsGameOver: (isGameOver: boolean) => set({ isGameOver }),
}));
