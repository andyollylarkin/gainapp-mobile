import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OnboardingStore {
  answers: Record<number, Record<string, unknown>>;
  setSlideAnswers: (slideIndex: number, answers: Record<string, unknown>) => void;
  getSlideAnswers: (slideIndex: number) => Record<string, unknown>;
  clearAnswers: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      answers: {},
      setSlideAnswers: (slideIndex, answers) =>
        set((state) => ({
          answers: { ...state.answers, [slideIndex]: answers },
        })),
      getSlideAnswers: (slideIndex) => get().answers[slideIndex] ?? {},
      clearAnswers: () => set({ answers: {} }),
    }),
    {
      name: "onboarding-answers",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
