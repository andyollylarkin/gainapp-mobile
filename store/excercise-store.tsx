import { SetItemProps } from "@/components/build-components/composite/set-item";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { create } from "zustand";

type StoredProps = SetItemProps & { trayId: string };

interface ExcerciseStore {
  excercises: Omit<StoredProps, "activeIndex">[];
  trayActiveIndex: Record<string, number>;
  addExcercise: (
    excercise: Omit<StoredProps, "activeIndex">,
    trayId: string,
  ) => void;
  updateExcercise: (
    id: string,
    updatedExcercise: Partial<StoredProps>,
    trayId: string,
  ) => void;
  removeExcercise: (id: string, trayId: string) => void;
  setTrayActiveIndex: (id: string, activeIndex: number) => void;
  getActiveIndex: (id: string) => number;
  getTotalExcercises: (trayId: string) => number;
  getCompletedExcercises: (trayId: string) => number;
}

export const useExcerciseStore = create<ExcerciseStore>((set, get) => ({
  excercises: [],
  trayActiveIndex: {},
  addExcercise: (excercise, trayId) =>
    set((state) => {
      console.log("Adding excercise:", excercise);
      return { excercises: [...state.excercises, { ...excercise, trayId }] };
    }),
  updateExcercise: (id, updatedExcercise, trayId) =>
    set((state) => ({
      excercises: state.excercises.map((excercise) =>
        excercise.id === id && excercise.trayId === trayId
          ? { ...excercise, ...updatedExcercise }
          : excercise,
      ),
    })),
  removeExcercise: (id, trayId) =>
    set((state) => ({
      excercises: state.excercises.filter(
        (excercise) => excercise.id !== id || excercise.trayId !== trayId,
      ),
    })),
  setTrayActiveIndex: (id, activeIndex) =>
    set((state) => ({
      trayActiveIndex: { ...state.trayActiveIndex, [id]: activeIndex },
    })),
  getActiveIndex: (id: string) => {
    return get().trayActiveIndex[id] || 0;
  },
  getTotalExcercises: (trayId: string) => {
    return get().excercises.filter((val) => val.trayId === trayId).length;
  },
  getCompletedExcercises: (trayId: string) => {
    return get().excercises.filter(
      (val) => val.trayId === trayId && val.initialState === "done",
    ).length;
  },
}));
