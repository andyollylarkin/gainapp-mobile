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

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function makePendingAction(
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

function appendAction(
  actions: PendingSyncAction[],
  type: PendingSyncActionType,
  payload: Record<string, unknown>,
): PendingSyncAction[] {
  const next = makePendingAction(type, payload);

  if (type === "updateExerciseSetParams") {
    // Only send the latest params update for a given set
    const wdeId = str(payload.workoutDayExerciseId);
    const setNum = num(payload.setNumber, -1);
    if (wdeId && setNum >= 0) {
      return [
        ...actions.filter(
          (a) =>
            !(
              a.type === "updateExerciseSetParams" &&
              a.payload.workoutDayExerciseId === wdeId &&
              a.payload.setNumber === setNum
            ),
        ),
        next,
      ];
    }
  }

  if (type === "addExerciseSet" || type === "deleteExerciseSet") {
    const id = str(payload.id);
    if (id && actions.some((a) => a.type === type && str(a.payload.id) === id)) {
      return actions;
    }
  }

  if (type === "completeExerciseSet") {
    const wdeId = str(payload.workoutDayExerciseId);
    const srcId = str(
      (payload.metrics as Record<string, unknown> | undefined)?.sourceSetId,
    );
    const setNum = num(payload.setNumber, -1);
    if (wdeId) {
      const key = srcId ? `${wdeId}:${srcId}` : `${wdeId}:${setNum}`;
      const alreadyQueued = actions.some((a) => {
        if (a.type !== "completeExerciseSet") return false;
        const aWde = str(a.payload.workoutDayExerciseId);
        const aSrc = str(
          (a.payload.metrics as Record<string, unknown> | undefined)?.sourceSetId,
        );
        const aNum = num(a.payload.setNumber, -1);
        const aKey = aSrc ? `${aWde}:${aSrc}` : `${aWde}:${aNum}`;
        return key === aKey;
      });
      if (alreadyQueued) return actions;
    }
  }

  return [...actions, next];
}

function patchTray(
  source: Partial<Record<DayEnum, WorkoutByWeekdayResponse>>,
  workoutDayExerciseId: string,
  mutateTray: (tray: WorkoutWeekdayTray) => WorkoutWeekdayTray,
): Partial<Record<DayEnum, WorkoutByWeekdayResponse>> {
  const next = { ...source };
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

function patchDeleteSet(
  source: Partial<Record<DayEnum, WorkoutByWeekdayResponse>>,
  setId: string,
): Partial<Record<DayEnum, WorkoutByWeekdayResponse>> {
  const next = { ...source };
  (Object.keys(source) as DayEnum[]).forEach((day) => {
    const workout = source[day];
    if (!workout) return;
    let changed = false;
    const trays = workout.trays.map((tray) => {
      const filtered = tray.sets.filter((s) => s.id !== setId);
      if (filtered.length === tray.sets.length) return tray;
      changed = true;
      return {
        ...tray,
        sets: filtered.map((s, i) => ({ ...s, setNumber: i + 1 })),
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

  setWorkoutOverviewForDay: (day: DayEnum, overview: WorkoutOverviewResponse) => void;
  getWorkoutOverviewForDay: (day: DayEnum) => WorkoutOverviewResponse | null;
  setWorkoutByWeekdayForDay: (day: DayEnum, workout: WorkoutByWeekdayResponse) => void;
  getWorkoutByWeekdayForDay: (day: DayEnum) => WorkoutByWeekdayResponse | null;
  mergeWorkoutFromApi: (day: DayEnum, apiWorkout: WorkoutByWeekdayResponse) => void;

  enqueueSyncAction: (type: PendingSyncActionType, payload: Record<string, unknown>) => void;

  queueAddExerciseSet: (payload: Record<string, unknown>) => void;
  queueUpdateExerciseSetParams: (payload: Record<string, unknown>) => void;
  queueCompleteExerciseSet: (payload: Record<string, unknown>) => void;
  queueDeleteExerciseSet: (payload: { id: string }) => void;

  addExerciseTrayWithId: (
    day: DayEnum,
    exercises: { id: string | number; name: string; equipment: string }[],
    trayIds: string[],
  ) => void;
  queueAddExercise: (
    day: DayEnum,
    exercise: { id: string | number; name: string; equipment: string; category?: string },
  ) => void;
  queueAddSuperset: (
    day: DayEnum,
    exercises: { id: string | number; name: string; equipment: string; category?: string }[],
  ) => void;
  queueDeleteExercise: (day: DayEnum, trayId: string, workoutDayExerciseId?: string) => void;

  replaceSetId: (tempId: string, serverId: string, currentActionId: string) => void;
  replaceTrayId: (tempId: string, trayId: string, workoutDayExerciseId?: string) => void;

  removePendingSyncAction: (id: string) => void;
  clearPendingSyncActions: () => void;
}

export const useExcerciseStore = create<ExcerciseStore>()(
  persist(
    (set, get) => ({
      workoutOverviewByDay: {},
      workoutByWeekdayByDay: {},
      pendingSyncActions: [],

      setWorkoutOverviewForDay: (day, overview) =>
        set((state) => ({
          workoutOverviewByDay: { ...state.workoutOverviewByDay, [day]: overview },
        })),

      getWorkoutOverviewForDay: (day) =>
        get().workoutOverviewByDay[day] ?? null,

      setWorkoutByWeekdayForDay: (day, workout) =>
        set((state) => ({
          workoutByWeekdayByDay: { ...state.workoutByWeekdayByDay, [day]: workout },
        })),

      getWorkoutByWeekdayForDay: (day) =>
        get().workoutByWeekdayByDay[day] ?? null,

      // Merge API data without overwriting local mutations:
      // - Trays pending delete: filtered out (don't re-add from API)
      // - Trays pending add: kept as-is (not on server yet)
      // - Trays with pending set mutations: local version wins (it's ahead)
      // - All other trays: API version wins
      mergeWorkoutFromApi: (day, apiWorkout) =>
        set((state) => {
          const local = state.workoutByWeekdayByDay[day];

          if (!local) {
            return {
              workoutByWeekdayByDay: {
                ...state.workoutByWeekdayByDay,
                [day]: apiWorkout,
              },
            };
          }

          const pendingDeleteIds = new Set(
            state.pendingSyncActions
              .filter((a) => a.type === "deleteExercise")
              .map((a) => str(a.payload.trayId)),
          );

          const pendingAddTrayIds = new Set(
            state.pendingSyncActions.flatMap((a) => {
              if (a.type === "addExercise") return [str(a.payload.trayId)];
              if (a.type === "addSuperset") {
                const exs = a.payload.exercises as { trayId?: string }[] | undefined;
                return exs?.map((ex) => str(ex.trayId)) ?? [];
              }
              return [];
            }),
          );

          const traysWithPendingSets = new Set(
            state.pendingSyncActions
              .filter((a) =>
                a.type === "addExerciseSet" ||
                a.type === "updateExerciseSetParams" ||
                a.type === "completeExerciseSet" ||
                a.type === "deleteExerciseSet",
              )
              .map((a) => str(a.payload.workoutDayExerciseId))
              .filter(Boolean),
          );

          const mergedTrays: WorkoutWeekdayTray[] = apiWorkout.trays
            .filter((t) => !pendingDeleteIds.has(t.id))
            .map((apiTray) => {
              const effectiveId = apiTray.workoutDayExerciseId ?? apiTray.id;
              if (traysWithPendingSets.has(effectiveId)) {
                const localTray = local.trays.find(
                  (t) =>
                    t.id === apiTray.id ||
                    t.workoutDayExerciseId === effectiveId,
                );
                return localTray ?? apiTray;
              }
              return apiTray;
            });

          const apiTrayIds = new Set(apiWorkout.trays.map((t) => t.id));
          const localOnlyTrays = local.trays.filter(
            (t) => pendingAddTrayIds.has(t.id) && !apiTrayIds.has(t.id),
          );

          return {
            workoutByWeekdayByDay: {
              ...state.workoutByWeekdayByDay,
              [day]: {
                ...apiWorkout,
                trays: [...mergedTrays, ...localOnlyTrays],
              },
            },
          };
        }),

      enqueueSyncAction: (type, payload) =>
        set((state) => ({
          pendingSyncActions: appendAction(state.pendingSyncActions, type, payload),
        })),

      queueAddExerciseSet: (payload) => {
        get().enqueueSyncAction("addExerciseSet", payload);
        const workoutDayExerciseId = str(payload.workoutDayExerciseId);
        const id = str(payload.id) || `local-set-${Date.now()}`;
        const parameter1 = num(payload.parameter1);
        const parameter2 = num(payload.parameter2);
        set((state) => ({
          workoutByWeekdayByDay: patchTray(
            state.workoutByWeekdayByDay,
            workoutDayExerciseId,
            (tray) => {
              if (tray.sets.some((s) => s.id === id)) return tray;
              const lastHistory = tray.sets[tray.sets.length - 1]?.history;
              return {
                ...tray,
                sets: [
                  ...tray.sets,
                  {
                    id,
                    setNumber: tray.sets.length + 1,
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
        const workoutDayExerciseId = str(payload.workoutDayExerciseId);
        const setNumber = num(payload.setNumber);
        const parameter1 = num(payload.parameter1);
        const parameter2 = num(payload.parameter2);
        set((state) => ({
          workoutByWeekdayByDay: patchTray(
            state.workoutByWeekdayByDay,
            workoutDayExerciseId,
            (tray) => ({
              ...tray,
              sets: tray.sets.map((s) =>
                s.setNumber === setNumber ? { ...s, parameter1, parameter2 } : s,
              ),
            }),
          ),
        }));
      },

      queueCompleteExerciseSet: (payload) => {
        get().enqueueSyncAction("completeExerciseSet", payload);
        const workoutDayExerciseId = str(payload.workoutDayExerciseId);
        const setNumber = num(payload.setNumber);
        const sourceSetId = str(
          (payload.metrics as Record<string, unknown> | undefined)?.sourceSetId,
        );
        set((state) => ({
          workoutByWeekdayByDay: patchTray(
            state.workoutByWeekdayByDay,
            workoutDayExerciseId,
            (tray) => ({
              ...tray,
              sets: tray.sets.map((s) => {
                const byNumber = s.setNumber === setNumber;
                const byId = sourceSetId !== "" && s.id === sourceSetId;
                return byNumber || byId ? { ...s, completed: true } : s;
              }),
            }),
          ),
        }));
      },

      queueDeleteExerciseSet: (payload) =>
        set((state) => {
          const setId = payload.id;
          const isLocalOnly =
            setId.startsWith("exercise-") ||
            state.pendingSyncActions.some(
              (a) => a.type === "addExerciseSet" && str(a.payload.id) === setId,
            );

          if (isLocalOnly) {
            return {
              pendingSyncActions: state.pendingSyncActions.filter((a) => {
                const aId = str(a.payload.id);
                const aSrc = str(
                  (a.payload.metrics as Record<string, unknown> | undefined)?.sourceSetId,
                );
                return aId !== setId && aSrc !== setId;
              }),
              workoutByWeekdayByDay: patchDeleteSet(state.workoutByWeekdayByDay, setId),
            };
          }

          return {
            pendingSyncActions: [
              ...state.pendingSyncActions,
              makePendingAction("deleteExerciseSet", payload),
            ],
            workoutByWeekdayByDay: patchDeleteSet(state.workoutByWeekdayByDay, setId),
          };
        }),

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
            history: { firstText: 0, secondText: 0, delimiter: "x" },
            sets: [
              {
                id: warmupSetId,
                setNumber: 1,
                parameter1: 0,
                parameter2: 0,
                completed: false,
                history: { firstText: 0, secondText: 0, delimiter: "x" },
              },
            ],
          };
        });

        set((state) => {
          const existing = state.workoutByWeekdayByDay[day];
          const updatedWorkout: WorkoutByWeekdayResponse = existing
            ? { ...existing, trays: [...existing.trays, ...newTrays] }
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
        const resolvedId =
          workoutDayExerciseId ||
          get()
            .getWorkoutByWeekdayForDay(day)
            ?.trays.find((t) => t.id === trayId)?.workoutDayExerciseId ||
          trayId;

        get().enqueueSyncAction("deleteExercise", {
          day,
          trayId: resolvedId,
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
            Object.entries(state.workoutByWeekdayByDay).map(([day, workout]) => [
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
            ]),
          ),
          pendingSyncActions: state.pendingSyncActions.map((action) => {
            if (action.id === currentActionId) return action;
            const next = { ...action.payload };
            if (next.id === tempId) next.id = serverId;
            const metrics = next.metrics as Record<string, unknown> | undefined;
            if (metrics?.sourceSetId === tempId) {
              next.metrics = { ...metrics, sourceSetId: serverId };
            }
            return { ...action, payload: next };
          }),
        })),

      replaceTrayId: (tempId, trayId, workoutDayExerciseId) =>
        set((state) => ({
          workoutByWeekdayByDay: Object.fromEntries(
            Object.entries(state.workoutByWeekdayByDay).map(([day, workout]) => [
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
            ]),
          ),
          pendingSyncActions: state.pendingSyncActions.map((action) => {
            const next = { ...action.payload };
            if (next.trayId === tempId) next.trayId = trayId;
            if (next.workoutDayExerciseId === tempId) {
              next.workoutDayExerciseId = workoutDayExerciseId ?? trayId;
            }
            return { ...action, payload: next };
          }),
        })),

      removePendingSyncAction: (id) =>
        set((state) => ({
          pendingSyncActions: state.pendingSyncActions.filter((a) => a.id !== id),
        })),

      clearPendingSyncActions: () => set({ pendingSyncActions: [] }),
    }),
    {
      name: "excercise-store-v3",
      storage: createJSONStorage(() => safeStateStorage),
      partialize: (state: ExcerciseStore) => ({
        workoutOverviewByDay: state.workoutOverviewByDay,
        workoutByWeekdayByDay: state.workoutByWeekdayByDay,
        pendingSyncActions: state.pendingSyncActions,
      }),
    },
  ),
);
