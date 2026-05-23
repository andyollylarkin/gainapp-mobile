import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NoteStore {
  exerciseNotes: Record<string, string>;
  setExerciseNotes: (exerciseId: string, note: string) => void;
  getExerciseNotes: (id: string) => string;
  exerciseSetNotes: Record<string, string>;
  setExerciseSetNotes: (setId: string, note: string) => void;
  getExerciseSetNotes: (id: string) => string;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      exerciseNotes: {},
      setExerciseNotes: (exerciseId, note) =>
        set((state) => ({
          exerciseNotes: { ...state.exerciseNotes, [exerciseId]: note },
        })),
      getExerciseNotes: (id) => get().exerciseNotes[id] ?? "",

      exerciseSetNotes: {},
      setExerciseSetNotes: (setId, note) =>
        set((state) => ({
          exerciseSetNotes: { ...state.exerciseSetNotes, [setId]: note },
        })),
      getExerciseSetNotes: (id) => get().exerciseSetNotes[id] ?? "",
    }),
    {
      name: "note-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
