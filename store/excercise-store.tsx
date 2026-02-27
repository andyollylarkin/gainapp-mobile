import { SetItemProps } from "@/components/build-components/composite/set-item";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { create } from "zustand";

type StoredProps = SetItemProps & { activeIndex: string };

interface ExcerciseStore {
  excercises: Omit<StoredProps, "activeIndex">[];
  trayActiveIndex: Record<string, number>;
  addExcercise: (excercise: Omit<StoredProps, "activeIndex">) => void;
  updateExcercise: (id: string, updatedExcercise: Partial<StoredProps>) => void;
  removeExcercise: (id: string) => void;
  setActiveIndex: (id: string, activeIndex: string) => void;
  setTrayActiveIndex: (id: string, activeIndex: number) => void;
  getActiveIndex: (id: string) => number;
}

export const useExcerciseStore = create<ExcerciseStore>((set, get) => ({
  excercises: [],
  trayActiveIndex: {},
  addExcercise: (excercise) =>
    set((state) => {
      console.log("Adding excercise:", excercise);
      return { excercises: [...state.excercises, excercise] };
    }),
  updateExcercise: (id, updatedExcercise) =>
    set((state) => ({
      excercises: state.excercises.map((excercise) =>
        excercise.id === id ? { ...excercise, ...updatedExcercise } : excercise,
      ),
    })),
  removeExcercise: (id) =>
    set((state) => ({
      excercises: state.excercises.filter((excercise) => excercise.id !== id),
    })),
  setActiveIndex: (id, activeIndex) =>
    set((state) => ({
      excercises: state.excercises.map((excercise) =>
        excercise.id === id ? { ...excercise, activeIndex } : excercise,
      ),
    })),
  setTrayActiveIndex: (id, activeIndex) =>
    set((state) => ({
      trayActiveIndex: { ...state.trayActiveIndex, [id]: activeIndex },
    })),
  getActiveIndex: (id: string) => {
    return get().trayActiveIndex[id] || 0;
  },
}));
