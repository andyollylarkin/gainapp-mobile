import { SetItemProps } from "@/components/build-components/composite/set-item";
import { addExerciseSet } from "@/logic/api/add-exercise-set";
import { deleteExerciseSet } from "@/logic/api/delete-exercise-set";
import { WorkoutOverviewResponse } from "@/logic/api/ex-description";
import { WorkoutByWeekdayResponse } from "@/logic/api/exercises-by-weekday";
import { completeExerciseSet } from "@/logic/api/update-exercise-set";
import { DayEnum } from "@/types";
import { safeStateStorage } from "@/utils/safe-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  createSyncMiddleware,
  PendingSyncAction,
  PendingSyncActionType,
} from "./sync-middleware";

type StoredProps = SetItemProps & { trayId: string };

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function createPendingAction(
  type: PendingSyncActionType,
  payload: Record<string, unknown>,
): PendingSyncAction {
  return {
    id: `${Date.now()}-${Math.random()}`,
    createdAt: Date.now(),
    type,
    payload,
  };
}

function isTemporarySetId(setId: string): boolean {
  return setId.startsWith("exercise-");
}

function removeActionsRelatedToSetId(
  actions: PendingSyncAction[],
  setId: string,
): PendingSyncAction[] {
  return actions.filter((action) => {
    const actionSetId = parseString(action.payload.id);
    const sourceSetId = parseString(
      (action.payload.metrics as { sourceSetId?: unknown } | undefined)
        ?.sourceSetId,
    );

    return actionSetId !== setId && sourceSetId !== setId;
  });
}

function shouldDropDeleteSyncAction(
  actions: PendingSyncAction[],
  setId: string,
): boolean {
  const hasPendingAddWithSameId = actions.some(
    (action) =>
      action.type === "addExerciseSet" &&
      parseString(action.payload.id) === setId,
  );

  return hasPendingAddWithSameId || isTemporarySetId(setId);
}

function getSyncActionDedupKey(
  type: PendingSyncActionType,
  payload: Record<string, unknown>,
): string | null {
  if (type === "addExerciseSet") {
    const id = parseString(payload.id);
    return id ? `${type}:${id}` : null;
  }

  if (type === "deleteExerciseSet") {
    const id = parseString(payload.id);
    return id ? `${type}:${id}` : null;
  }

  if (type === "updateExerciseSetParams") {
    const workoutDayExerciseId = parseString(payload.workoutDayExerciseId);
    const setNumber = parseNumber(payload.setNumber, -1);
    if (!workoutDayExerciseId || setNumber < 0) return null;
    return `${type}:${workoutDayExerciseId}:${setNumber}`;
  }

  if (type === "completeExerciseSet") {
    const workoutDayExerciseId = parseString(payload.workoutDayExerciseId);
    const sourceSetId = parseString(
      (payload.metrics as { sourceSetId?: unknown } | undefined)?.sourceSetId,
    );
    const setNumber = parseNumber(payload.setNumber, -1);

    if (workoutDayExerciseId && sourceSetId) {
      return `${type}:${workoutDayExerciseId}:${sourceSetId}`;
    }
    if (workoutDayExerciseId && setNumber >= 0) {
      return `${type}:${workoutDayExerciseId}:${setNumber}`;
    }
  }

  return null;
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
      if (!matched) return tray;
      changed = true;
      return mutateTray(tray);
    });
    if (changed) next[day] = { ...workout, trays };
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
      const filteredSets = tray.sets.filter((s) => s.id !== setId);
      if (filteredSets.length === tray.sets.length) return tray;
      changed = true;
      return {
        ...tray,
        sets: filteredSets.map((s, index) => ({ ...s, setNumber: index + 1 })),
      };
    });
    if (changed) next[day] = { ...workout, trays };
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
  createSyncMiddleware({
    addExerciseSet: async (payload) => {
      return addExerciseSet(payload as any);
    },
    updateExerciseSetParams: async (payload) => {
      await completeExerciseSet(payload as any);
    },
    completeExerciseSet: async (payload) => {
      await completeExerciseSet(payload as any);
    },
    deleteExerciseSet: async (payload) => {
      const setId = typeof payload.id === "string" ? payload.id : "";
      if (!setId) {
        throw new Error("Invalid payload for deleteExerciseSet");
      }

      await deleteExerciseSet(setId);
    },
  })(
    persist(
      (set, get) => ({
        excercises: [],
        trayActiveIndex: {},
        workoutOverviewByDay: {},
        workoutByWeekdayByDay: {},
        pendingSyncActions: [],

        addExcercise: (excercise, trayId) =>
          set((state) => ({
            excercises: state.excercises.some(
              (item) => item.id === excercise.id && item.trayId === trayId,
            )
              ? state.excercises
              : [...state.excercises, { ...excercise, trayId }],
          })),

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

        getActiveIndex: (id) => get().trayActiveIndex[id] || 0,

        getTotalExcercises: (trayId) =>
          get().excercises.filter((val) => val.trayId === trayId).length,

        getCompletedExcercises: (trayId) =>
          get().excercises.filter(
            (val) => val.trayId === trayId && val.initialState === "done",
          ).length,

        setWorkoutOverviewForDay: (day, overview) =>
          set((state) => ({
            workoutOverviewByDay: {
              ...state.workoutOverviewByDay,
              [day]: overview,
            },
          })),

        getWorkoutOverviewForDay: (day) =>
          get().workoutOverviewByDay[day] ?? null,

        setWorkoutByWeekdayForDay: (day, workout) =>
          set((state) => ({
            workoutByWeekdayByDay: {
              ...state.workoutByWeekdayByDay,
              [day]: workout,
            },
          })),

        getWorkoutByWeekdayForDay: (day) =>
          get().workoutByWeekdayByDay[day] ?? null,

        enqueueSyncAction: (type, payload) =>
          set((state) => ({
            pendingSyncActions: (() => {
              const dedupKey = getSyncActionDedupKey(type, payload);
              const nextAction = createPendingAction(type, payload);

              if (!dedupKey) {
                return [...state.pendingSyncActions, nextAction];
              }

              const withKeys = state.pendingSyncActions.map((action) => ({
                action,
                key: getSyncActionDedupKey(action.type, action.payload),
              }));

              // Keep only one latest pending update per set to avoid queue spam.
              if (type === "updateExerciseSetParams") {
                const filtered = withKeys
                  .filter(({ key }) => key !== dedupKey)
                  .map(({ action }) => action);
                return [...filtered, nextAction];
              }

              const alreadyExists = withKeys.some(
                ({ key }) => key === dedupKey,
              );
              return alreadyExists
                ? state.pendingSyncActions
                : [...state.pendingSyncActions, nextAction];
            })(),
          })),

        queueAddExerciseSet: (payload) => {
          get().enqueueSyncAction("addExerciseSet", payload);
          const workoutDayExerciseId = parseString(
            payload.workoutDayExerciseId,
          );
          const id = parseString(payload.id, `local-set-${Date.now()}`);
          const parameter1 = parseNumber(payload.parameter1);
          const parameter2 = parseNumber(payload.parameter2);
          set((state) => ({
            workoutByWeekdayByDay: patchWorkoutsByTray(
              state.workoutByWeekdayByDay,
              workoutDayExerciseId,
              (tray) => {
                if (tray.sets.some((set) => set.id === id)) {
                  return tray;
                }

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
          const workoutDayExerciseId = parseString(
            payload.workoutDayExerciseId,
          );
          const setNumber = parseNumber(payload.setNumber);
          const parameter1 = parseNumber(payload.parameter1);
          const parameter2 = parseNumber(payload.parameter2);
          set((state) => ({
            workoutByWeekdayByDay: patchWorkoutsByTray(
              state.workoutByWeekdayByDay,
              workoutDayExerciseId,
              (tray) => ({
                ...tray,
                sets: tray.sets.map((s) =>
                  s.setNumber === setNumber
                    ? { ...s, parameter1, parameter2 }
                    : s,
                ),
              }),
            ),
          }));
        },

        queueCompleteExerciseSet: (payload) => {
          get().enqueueSyncAction("completeExerciseSet", payload);
          const workoutDayExerciseId = parseString(
            payload.workoutDayExerciseId,
          );
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
                sets: tray.sets.map((s) => {
                  const bySetNumber = s.setNumber === setNumber;
                  const bySetId = sourceSetId !== "" && s.id === sourceSetId;
                  return bySetNumber || bySetId ? { ...s, completed: true } : s;
                }),
              }),
            ),
          }));
        },

        queueDeleteExerciseSet: (payload) => {
          set((state) => ({
            pendingSyncActions: (() => {
              const setId = payload.id;
              if (shouldDropDeleteSyncAction(state.pendingSyncActions, setId)) {
                return removeActionsRelatedToSetId(
                  state.pendingSyncActions,
                  setId,
                );
              }

              return [
                ...state.pendingSyncActions,
                createPendingAction("deleteExerciseSet", payload),
              ];
            })(),
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

        clearPendingSyncActions: () => set({ pendingSyncActions: [] }),
      }),
      {
        name: "excercise-store-v0",
        storage: createJSONStorage(() => safeStateStorage),
        partialize: (state: ExcerciseStore) => ({
          excercises: state.excercises,
          trayActiveIndex: state.trayActiveIndex,
          workoutOverviewByDay: state.workoutOverviewByDay,
          workoutByWeekdayByDay: state.workoutByWeekdayByDay,
          pendingSyncActions: state.pendingSyncActions,
        }),
      },
    ),
  ),
);
