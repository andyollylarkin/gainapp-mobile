import {
  getWorkoutByWeekday,
  WorkoutByWeekdayResponse,
} from "@/logic/api/exercises-by-weekday";
import { useExcerciseStore } from "@/store/excercise-store";
import { Day, DayEnum } from "@/types";
import { useCallback, useEffect, useState } from "react";
import useApiReached from "./use-api-reached";

export function useWorkoutData(day: Day): {
  workout: WorkoutByWeekdayResponse | null;
  isLoading: boolean;
} {
  const dayKey = day.name as DayEnum;

  const workout = useExcerciseStore(
    useCallback((s) => s.workoutByWeekdayByDay[dayKey] ?? null, [dayKey]),
  );
  const mergeWorkoutFromApi = useExcerciseStore((s) => s.mergeWorkoutFromApi);
  const isApiReached = useApiReached();

  const [isLoading, setIsLoading] = useState(() => workout === null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!useExcerciseStore.persist.hasHydrated()) {
        await new Promise<void>((resolve) => {
          const unsub = useExcerciseStore.persist.onFinishHydration(() => {
            unsub();
            resolve();
          });
        });
      }
      if (!active) return;

      // Show local data immediately — no spinner if we already have something
      if (useExcerciseStore.getState().workoutByWeekdayByDay[dayKey]) {
        setIsLoading(false);
      }

      if (!isApiReached) {
        setIsLoading(false);
        return;
      }

      try {
        const fresh = await getWorkoutByWeekday(
          Day.fromString(dayKey as keyof typeof DayEnum),
        );
        if (!active) return;
        mergeWorkoutFromApi(dayKey, fresh);
      } catch {
        // API unavailable, local data remains
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [dayKey, isApiReached, mergeWorkoutFromApi]);

  return { workout, isLoading };
}
