import { getWorkoutByWeekday, WorkoutByWeekdayResponse } from "@/logic/api/exercises-by-weekday";
import { useExcerciseStore } from "@/store/excercise-store";
import { Day, DayEnum } from "@/types";
import { useCallback, useEffect, useState } from "react";

export function useWorkoutData(day: Day): {
  workout: WorkoutByWeekdayResponse | null;
  isLoading: boolean;
} {
  const dayKey = day.name;
  const workout = useExcerciseStore(
    useCallback((s) => s.workoutByWeekdayByDay[dayKey] ?? null, [dayKey]),
  );
  const setWorkoutByWeekdayForDay = useExcerciseStore(
    (s) => s.setWorkoutByWeekdayForDay,
  );
  const [isLoading, setIsLoading] = useState(() => workout === null);

  useEffect(() => {
    let isActive = true;

    async function load() {
      if (!useExcerciseStore.persist.hasHydrated()) {
        await new Promise<void>((resolve) => {
          const unsub = useExcerciseStore.persist.onFinishHydration(() => {
            unsub();
            resolve();
          });
        });
      }

      if (!isActive) return;

      const cached = useExcerciseStore.getState().workoutByWeekdayByDay[dayKey];
      if (cached) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getWorkoutByWeekday(
          Day.fromString(dayKey as keyof typeof DayEnum),
        );
        if (!isActive) return;
        setWorkoutByWeekdayForDay(dayKey, response);
      } catch (e) {
        console.warn("Failed to load workout data", e);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    load();
    return () => {
      isActive = false;
    };
  }, [dayKey, setWorkoutByWeekdayForDay]);

  return { workout, isLoading };
}
