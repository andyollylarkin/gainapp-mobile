import { Day, DayEnum } from "@/types";
import { create } from "zustand";

interface DayStore {
  selectedDay: Day | null;
  setSelectedDay: (day: Day) => void;
  selectedDayEnum: DayEnum | null;
  setSelectedDayEnum: (day: DayEnum) => void;
}

export const useDayStore = create<DayStore>()((set) => ({
  selectedDay: null,
  setSelectedDay: (day) => set({ selectedDay: day }),
  selectedDayEnum: null,
  setSelectedDayEnum: (day) => set({ selectedDayEnum: day }),
}));
