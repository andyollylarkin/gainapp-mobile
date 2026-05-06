import { create } from "zustand";

interface ExcerciseTimerStore {
  readonly currentRest: number;
  updateCurrentRest: (newRest: number) => void;
}

export const useExcerciseTimerStore = create<ExcerciseTimerStore>(
  (set, get) => ({
    currentRest: 0,
    updateCurrentRest: (newRest: number) => {
      if (get().currentRest === newRest) {
        return;
      }

      set({ currentRest: newRest });
    },
  }),
);
