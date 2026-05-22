import { WorkoutOverviewResponse } from "@/logic/api/ex-description";
import {
  WorkoutByWeekdayResponse,
  WorkoutWeekdayTray,
} from "@/logic/api/exercises-by-weekday";
import { DayEnum } from "@/types";
import { safeStateStorage } from "@/utils/safe-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PendingSyncActionType =
  | "addExerciseSet"
  | "updateExerciseSetParams"
  | "completeExerciseSet"
  | "deleteExerciseSet"
  | "addExercise"
  | "addSuperset"
  | "deleteExercise";

export interface PendingSyncAction {
  id: string;
  createdAt: number;
  type: PendingSyncActionType;
  payload: Record<string, unknown>;
}

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
  workoutOverviewByDay: Partial<Record<DayEnum, WorkoutOverviewResponse>>;
  workoutByWeekdayByDay: Partial<Record<DayEnum, WorkoutByWeekdayResponse>>;
  pendingSyncActions: PendingSyncAction[];
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
  addExerciseTrayWithId: (
    day: DayEnum,
    exercises: {
      id: string | number;
      name: string;
      equipment: string;
    }[],
    trayIds: string[],
  ) => void;
  queueAddExercise: (
    day: DayEnum,
    exercise: {
      id: string | number;
      name: string;
      equipment: string;
      category?: string;
    },
  ) => void;
  queueAddSuperset: (
    day: DayEnum,
    exercises: {
      id: string | number;
      name: string;
      equipment: string;
      category?: string;
    }[],
  ) => void;
  queueDeleteExercise: (
    day: DayEnum,
    trayId: string,
    workoutDayExerciseId?: string,
  ) => void;
  replaceSetId: (
    tempId: string,
    serverId: string,
    currentActionId: string,
  ) => void;
  replaceTrayId: (
    tempId: string,
    trayId: string,
    workoutDayExerciseId?: string,
  ) => void;
}

export const useExcerciseStore = create<ExcerciseStore>()(
  persist(
    (set, get) => ({
      workoutOverviewByDay: {},
      workoutByWeekdayByDay: {},
      pendingSyncActions: [],

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
            if (!dedupKey) return [...state.pendingSyncActions, nextAction];
            const withKeys = state.pendingSyncActions.map((action) => ({
              action,
              key: getSyncActionDedupKey(action.type, action.payload),
            }));
            if (type === "updateExerciseSetParams") {
              const filtered = withKeys
                .filter(({ key }) => key !== dedupKey)
                .map(({ action }) => action);
              return [...filtered, nextAction];
            }
            const alreadyExists = withKeys.some(({ key }) => key === dedupKey);
            return alreadyExists
              ? state.pendingSyncActions
              : [...state.pendingSyncActions, nextAction];
          })(),
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
              if (tray.sets.some((s) => s.id === id)) return tray;
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

      addExerciseTrayWithId: (day, exercises, trayIds) => {
        const newTrays: WorkoutWeekdayTray[] = exercises.map((ex, idx) => {
          const trayId =
            trayIds[idx] ?? `tray-${Date.now()}-${Math.random()}-${ex.id}`;
          const warmupSetId = `exercise-${Date.now()}-${Math.random()}`;

          return {
            id: trayId,
            workoutDayExerciseId: trayId,
            title: {
              type: String(ex.equipment),
              title: String(ex.name),
            },
            description: {
              items: ["Set", "Previous", "kg", "Reps"] as [
                "Set",
                "Previous",
                "kg",
                "Reps",
              ],
            },
            history: {
              firstText: 0,
              secondText: 0,
              delimiter: "x",
            },
            sets: [
              {
                id: warmupSetId,
                setNumber: 1,
                parameter1: 0,
                parameter2: 0,
                completed: false,
                history: {
                  firstText: 0,
                  secondText: 0,
                  delimiter: "x",
                },
              },
            ],
          };
        });

        set((state) => {
          const existing = state.workoutByWeekdayByDay[day];
          const updatedWorkout: WorkoutByWeekdayResponse = existing
            ? {
                ...existing,
                trays: [...existing.trays, ...newTrays],
              }
            : {
                description: {
                  workoutName: "Workout",
                  excercisesCount: newTrays.length,
                  durationMinutes: 0,
                },
                isRestDay: false,
                trays: newTrays,
              };

          return {
            workoutByWeekdayByDay: {
              ...state.workoutByWeekdayByDay,
              [day]: updatedWorkout,
            },
          };
        });
      },

      queueAddExercise: (day, exercise) => {
        const tempTrayId = `tray-${Date.now()}-${Math.random()}-${exercise.id}`;
        get().enqueueSyncAction("addExercise", {
          day,
          exerciseId: exercise.id,
          name: exercise.name,
          equipment: exercise.equipment,
          category: exercise.category,
          trayId: tempTrayId,
        });
        get().addExerciseTrayWithId(day, [exercise], [tempTrayId]);
      },

      queueAddSuperset: (day, exercises) => {
        const tempTrayIds = exercises.map(
          (ex) => `tray-${Date.now()}-${Math.random()}-${ex.id}`,
        );
        get().enqueueSyncAction("addSuperset", {
          day,
          exercises: exercises.map((ex, idx) => ({
            exerciseId: ex.id,
            name: ex.name,
            equipment: ex.equipment,
            category: ex.category,
            trayId: tempTrayIds[idx],
          })),
        });
        get().addExerciseTrayWithId(day, exercises, tempTrayIds);
      },

      queueDeleteExercise: (day, trayId, workoutDayExerciseId) => {
        const resolvedWorkoutDayExerciseId =
          workoutDayExerciseId ||
          get()
            .getWorkoutByWeekdayForDay(day)
            ?.trays.find((t) => t.id === trayId)?.workoutDayExerciseId ||
          trayId;

        get().enqueueSyncAction("deleteExercise", {
          day,
          trayId: resolvedWorkoutDayExerciseId,
        });
        set((state) => {
          const workout = state.workoutByWeekdayByDay[day];
          if (!workout) return state;

          return {
            workoutByWeekdayByDay: {
              ...state.workoutByWeekdayByDay,
              [day]: {
                ...workout,
                trays: workout.trays.filter((t) => t.id !== trayId),
              },
            },
          };
        });
      },

      replaceSetId: (tempId, serverId, currentActionId) =>
        set((state) => ({
          workoutByWeekdayByDay: Object.fromEntries(
            Object.entries(state.workoutByWeekdayByDay).map(
              ([day, workout]) => [
                day,
                workout
                  ? {
                      ...workout,
                      trays: workout.trays.map((tray) => ({
                        ...tray,
                        sets: tray.sets.map((s) =>
                          s.id === tempId ? { ...s, id: serverId } : s,
                        ),
                      })),
                    }
                  : workout,
              ],
            ),
          ),
          pendingSyncActions: state.pendingSyncActions.map((action) =>
            action.id === currentActionId
              ? action
              : {
                  ...action,
                  payload: (() => {
                    const next = { ...action.payload };
                    if (next.id === tempId) next.id = serverId;
                    const metrics = next.metrics as
                      | { sourceSetId?: unknown }
                      | undefined;
                    if (metrics?.sourceSetId === tempId) {
                      next.metrics = { ...metrics, sourceSetId: serverId };
                    }
                    return next;
                  })(),
                },
          ),
        })),

      replaceTrayId: (tempId, trayId, workoutDayExerciseId) =>
        set((state) => ({
          workoutByWeekdayByDay: Object.fromEntries(
            Object.entries(state.workoutByWeekdayByDay).map(
              ([day, workout]) => [
                day,
                workout
                  ? {
                      ...workout,
                      trays: workout.trays.map((tray) =>
                        tray.id === tempId
                          ? {
                              ...tray,
                              id: trayId,
                              workoutDayExerciseId:
                                workoutDayExerciseId ??
                                tray.workoutDayExerciseId ??
                                trayId,
                            }
                          : tray,
                      ),
                    }
                  : workout,
              ],
            ),
          ),
          pendingSyncActions: state.pendingSyncActions.map((action) => ({
            ...action,
            payload: (() => {
              const next = { ...action.payload };
              if (next.trayId === tempId) next.trayId = trayId;
              if (next.workoutDayExerciseId === tempId) {
                next.workoutDayExerciseId = workoutDayExerciseId ?? trayId;
              }
              return next;
            })(),
          })),
        })),

      removePendingSyncAction: (id) =>
        set((state) => ({
          pendingSyncActions: state.pendingSyncActions.filter(
            (action) => action.id !== id,
          ),
        })),

      clearPendingSyncActions: () => set({ pendingSyncActions: [] }),
    }),
    {
      name: "excercise-store-v1",
      storage: createJSONStorage(() => safeStateStorage),
      partialize: (state: ExcerciseStore) => ({
        workoutOverviewByDay: state.workoutOverviewByDay,
        workoutByWeekdayByDay: state.workoutByWeekdayByDay,
        pendingSyncActions: state.pendingSyncActions,
      }),
    },
  ),
);
