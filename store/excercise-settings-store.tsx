import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SettingsStore = {
  restTime: number;
  increment: number;
  setRestTime: (v: number) => void;
  setIncrement: (v: number) => void;
  incrementRestTime: (v: number) => void;
  incrementIncrement: (v: number) => void;
  decrementRestTime: (v: number) => void;
  decrementIncrement: (v: number) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      restTime: 90,
      increment: 1,
      setRestTime: (v) => set({ restTime: v }),
      setIncrement: (v) => set({ increment: v }),
      incrementIncrement: (v) =>
        set((state) => ({ increment: state.increment + v })),
      incrementRestTime: (v) =>
        set((state) => ({ restTime: state.restTime + v })),
      decrementRestTime: (v) =>
        set((state) => ({ restTime: state.restTime - v })),
      decrementIncrement: (v) =>
        set((state) => ({ increment: state.increment - v })),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function useExerciseSettings() {
  const restTime = useSettingsStore((state) => state.restTime);
  const increment = useSettingsStore((state) => state.increment);
  const setRestTime = useSettingsStore((state) => state.setRestTime);
  const setIncrement = useSettingsStore((state) => state.setIncrement);
  const incrementRestTime = useSettingsStore(
    (state) => state.incrementRestTime,
  );
  const incrementIncrement = useSettingsStore(
    (state) => state.incrementIncrement,
  );
  const decrementRestTime = useSettingsStore(
    (state) => state.decrementRestTime,
  );
  const decrementIncrement = useSettingsStore(
    (state) => state.decrementIncrement,
  );

  return {
    restTime,
    increment,
    setRestTime,
    setIncrement,
    incrementRestTime,
    incrementIncrement,
    decrementRestTime,
    decrementIncrement,
  };
}
