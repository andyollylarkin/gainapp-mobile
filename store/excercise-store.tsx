import { SetItemProps } from "@/components/build-components/composite/set-item";
import { WorkoutOverviewResponse } from "@/logic/api/ex-description";
import { WorkoutByWeekdayResponse } from "@/logic/api/exercises-by-weekday";
import { DayEnum } from "@/types";
import { safeStateStorage } from "@/utils/safe-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type StoredProps = SetItemProps & { trayId: string };

export type PendingSyncActionType =
  | "addExerciseSet"
  | "updateExerciseSetParams"
  | "completeExerciseSet"
  | "deleteExerciseSet";

export interface PendingSyncAction {
  id: string;
  createdAt: number;
  type: PendingSyncActionType;
  payload: Record<string, unknown>;
}

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function patchWorkoutsByTray(
  source: Partial<Record<DayEnum, WorkoutByWeekdayResponse>>,
  workoutDayExerciseId: string,
  mutateTray: (
    tray: WorkoutByWeekdayResponse["trays"][number],
  ) => WorkoutByWeekdayResponse["trays"][number],
): Partial<Record<DayEnum, WorkoutByWeekdayResponse>> {
  const next: Partial<Record<DayEnum, WorkoutByWeekdayResponse>> = {
    ...source,
  };

  (Object.keys(source) as DayEnum[]).forEach((day) => {
    const workout = source[day];
    if (!workout) return;

    let changed = false;
    const trays = workout.trays.map((tray) => {
      const matched =
        tray.id === workoutDayExerciseId ||
        tray.workoutDayExerciseId === workoutDayExerciseId;

      if (!matched) {
        return tray;
      }

      changed = true;
      return mutateTray(tray);
    });

    if (changed) {
      next[day] = {
        ...workout,
        trays,
      };
    }
  });

  return next;
}

function patchWorkoutsDeleteSet(
  source: Partial<Record<DayEnum, WorkoutByWeekdayResponse>>,
  setId: string,
): Partial<Record<DayEnum, WorkoutByWeekdayResponse>> {
  const next: Partial<Record<DayEnum, WorkoutByWeekdayResponse>> = {
    ...source,
  };

  (Object.keys(source) as DayEnum[]).forEach((day) => {
    const workout = source[day];
    if (!workout) return;

    let changed = false;
    const trays = workout.trays.map((tray) => {
      const filteredSets = tray.sets.filter((set) => set.id !== setId);
      if (filteredSets.length === tray.sets.length) {
        return tray;
      }

      changed = true;
      const normalizedSets = filteredSets.map((set, index) => ({
        ...set,
        setNumber: index + 1,
      }));

      return {
        ...tray,
        sets: normalizedSets,
      };
    });

    if (changed) {
      next[day] = {
        ...workout,
        trays,
      };
    }
  });

  return next;
}

interface ExcerciseStore {
  excercises: Omit<StoredProps, "activeIndex">[];
  trayActiveIndex: Record<string, number>;
  workoutOverviewByDay: Partial<Record<DayEnum, WorkoutOverviewResponse>>;
  workoutByWeekdayByDay: Partial<Record<DayEnum, WorkoutByWeekdayResponse>>;
  pendingSyncActions: PendingSyncAction[];
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
  setWorkoutOverviewForDay: (
    day: DayEnum,
    overview: WorkoutOverviewResponse,
  ) => void;
  getWorkoutOverviewForDay: (day: DayEnum) => WorkoutOverviewResponse | null;
  setWorkoutByWeekdayForDay: (
    day: DayEnum,
    workout: WorkoutByWeekdayResponse,
  ) => void;
  getWorkoutByWeekdayForDay: (day: DayEnum) => WorkoutByWeekdayResponse | null;
  enqueueSyncAction: (
    type: PendingSyncActionType,
    payload: Record<string, unknown>,
  ) => void;
  queueAddExerciseSet: (payload: Record<string, unknown>) => void;
  queueUpdateExerciseSetParams: (payload: Record<string, unknown>) => void;
  queueCompleteExerciseSet: (payload: Record<string, unknown>) => void;
  queueDeleteExerciseSet: (payload: { id: string }) => void;
  removePendingSyncAction: (id: string) => void;
  clearPendingSyncActions: () => void;
}

export const useExcerciseStore = create<ExcerciseStore>()(
  persist(
    (set, get) => ({
      excercises: [],
      trayActiveIndex: {},
      workoutOverviewByDay: {},
      workoutByWeekdayByDay: {},
      pendingSyncActions: [],
      addExcercise: (excercise, trayId) =>
        set((state) => {
          return {
            excercises: [...state.excercises, { ...excercise, trayId }],
          };
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
      setWorkoutOverviewForDay: (day, overview) =>
        set((state) => ({
          workoutOverviewByDay: {
            ...state.workoutOverviewByDay,
            [day]: overview,
          },
        })),
      getWorkoutOverviewForDay: (day) => {
        return get().workoutOverviewByDay[day] ?? null;
      },
      setWorkoutByWeekdayForDay: (day, workout) =>
        set((state) => ({
          workoutByWeekdayByDay: {
            ...state.workoutByWeekdayByDay,
            [day]: workout,
          },
        })),
      getWorkoutByWeekdayForDay: (day) => {
        return get().workoutByWeekdayByDay[day] ?? null;
      },
      enqueueSyncAction: (type, payload) =>
        set((state) => ({
          pendingSyncActions: [
            ...state.pendingSyncActions,
            {
              id: `${Date.now()}-${Math.random()}`,
              createdAt: Date.now(),
              type,
              payload,
            },
          ],
        })),
      queueAddExerciseSet: (payload) => {
        get().enqueueSyncAction("addExerciseSet", payload);

        const workoutDayExerciseId = parseString(payload.workoutDayExerciseId);
        const id = parseString(payload.id, `local-set-${Date.now()}`);
        const parameter1 = parseNumber(payload.parameter1);
        const parameter2 = parseNumber(payload.parameter2);

        set((state) => ({
          workoutByWeekdayByDay: patchWorkoutsByTray(
            state.workoutByWeekdayByDay,
            workoutDayExerciseId,
            (tray) => {
              const nextSetNumber = tray.sets.length + 1;
              const lastHistory = tray.sets[tray.sets.length - 1]?.history;

              return {
                ...tray,
                sets: [
                  ...tray.sets,
                  {
                    id,
                    setNumber: nextSetNumber,
                    parameter1,
                    parameter2,
                    completed: false,
                    history: lastHistory ?? {
                      firstText: 0,
                      secondText: 0,
                      delimiter: "x",
                    },
                  },
                ],
              };
            },
          ),
        }));
      },
      queueUpdateExerciseSetParams: (payload) => {
        get().enqueueSyncAction("updateExerciseSetParams", payload);

        const workoutDayExerciseId = parseString(payload.workoutDayExerciseId);
        const setNumber = parseNumber(payload.setNumber);
        const parameter1 = parseNumber(payload.parameter1);
        const parameter2 = parseNumber(payload.parameter2);

        set((state) => ({
          workoutByWeekdayByDay: patchWorkoutsByTray(
            state.workoutByWeekdayByDay,
            workoutDayExerciseId,
            (tray) => ({
              ...tray,
              sets: tray.sets.map((set) =>
                set.setNumber === setNumber
                  ? { ...set, parameter1, parameter2 }
                  : set,
              ),
            }),
          ),
        }));
      },
      queueCompleteExerciseSet: (payload) => {
        get().enqueueSyncAction("completeExerciseSet", payload);

        const workoutDayExerciseId = parseString(payload.workoutDayExerciseId);
        const setNumber = parseNumber(payload.setNumber);
        const sourceSetId = parseString(
          (payload.metrics as { sourceSetId?: unknown } | undefined)
            ?.sourceSetId,
        );

        set((state) => ({
          workoutByWeekdayByDay: patchWorkoutsByTray(
            state.workoutByWeekdayByDay,
            workoutDayExerciseId,
            (tray) => ({
              ...tray,
              sets: tray.sets.map((set) => {
                const bySetNumber = set.setNumber === setNumber;
                const bySetId = sourceSetId !== "" && set.id === sourceSetId;
                return bySetNumber || bySetId
                  ? { ...set, completed: true }
                  : set;
              }),
            }),
          ),
        }));
      },
      queueDeleteExerciseSet: (payload) => {
        get().enqueueSyncAction("deleteExerciseSet", payload);

        set((state) => ({
          workoutByWeekdayByDay: patchWorkoutsDeleteSet(
            state.workoutByWeekdayByDay,
            payload.id,
          ),
        }));
      },
      removePendingSyncAction: (id) =>
        set((state) => ({
          pendingSyncActions: state.pendingSyncActions.filter(
            (action) => action.id !== id,
          ),
        })),
      clearPendingSyncActions: () =>
        set({
          pendingSyncActions: [],
        }),
    }),
    {
      name: "excercise-store-v1",
      storage: createJSONStorage(() => safeStateStorage),
      partialize: (state) => ({
        excercises: state.excercises,
        trayActiveIndex: state.trayActiveIndex,
        workoutOverviewByDay: state.workoutOverviewByDay,
        workoutByWeekdayByDay: state.workoutByWeekdayByDay,
        pendingSyncActions: state.pendingSyncActions,
      }),
    },
  ),
);
