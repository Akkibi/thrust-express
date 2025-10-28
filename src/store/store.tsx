import { create } from "zustand";

type Store = {
  isGameOver: boolean;
  isPaused: boolean;
};

export const useStore = create<Store>((set) => ({
  isPaused: false,
  isGameOver: false,
  setIsGameOver: (isGameOver: boolean) => set({ isGameOver }),
}));
