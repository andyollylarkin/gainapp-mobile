import apiDataFetchAvailable from "@/utils/data-fetch-available";
import { StateCreator, StoreMutatorIdentifier } from "zustand";

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

type StoreWithPendingActions = {
  pendingSyncActions: PendingSyncAction[];
};

type StoreWithSyncCollections = StoreWithPendingActions & {
  excercises?: any[];
  workoutByWeekdayByDay?: Record<string, any>;
};

function parseString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getServerSetId(result: unknown): string {
  const id = (result as { id?: unknown } | undefined)?.id;
  return typeof id === "string" ? id : "";
}

function replaceSetIdInPayload(
  payload: Record<string, unknown>,
  tempId: string,
  serverId: string,
): Record<string, unknown> {
  const nextPayload: Record<string, unknown> = { ...payload };

  if (payload.id === tempId) {
    nextPayload.id = serverId;
  }

  const metrics = payload.metrics as { sourceSetId?: unknown } | undefined;
  if (metrics?.sourceSetId === tempId) {
    nextPayload.metrics = { ...metrics, sourceSetId: serverId };
  }

  return nextPayload;
}

function replaceSetIdInCollections(
  state: StoreWithSyncCollections,
  tempId: string,
  serverId: string,
  currentActionId: string,
) {
  const nextExcercises = Array.isArray(state.excercises)
    ? state.excercises.map((excercise) =>
        excercise?.id === tempId ? { ...excercise, id: serverId } : excercise,
      )
    : state.excercises;

  const nextWorkoutByWeekdayByDay = state.workoutByWeekdayByDay
    ? Object.fromEntries(
        Object.entries(state.workoutByWeekdayByDay).map(([day, workout]) => [
          day,
          workout
            ? {
                ...workout,
                trays: Array.isArray(workout.trays)
                  ? workout.trays.map((tray: any) => ({
                      ...tray,
                      sets: Array.isArray(tray.sets)
                        ? tray.sets.map((set: any) =>
                            set?.id === tempId ? { ...set, id: serverId } : set,
                          )
                        : tray.sets,
                    }))
                  : workout.trays,
              }
            : workout,
        ]),
      )
    : state.workoutByWeekdayByDay;

  const nextPendingSyncActions = Array.isArray(state.pendingSyncActions)
    ? state.pendingSyncActions.map((pendingAction) =>
        pendingAction.id === currentActionId
          ? pendingAction
          : {
              ...pendingAction,
              payload: replaceSetIdInPayload(
                pendingAction.payload ?? {},
                tempId,
                serverId,
              ),
            },
      )
    : state.pendingSyncActions;

  return {
    excercises: nextExcercises,
    workoutByWeekdayByDay: nextWorkoutByWeekdayByDay,
    pendingSyncActions: nextPendingSyncActions,
  };
}

export type SyncMiddleware = <
  T extends StoreWithPendingActions,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  config: StateCreator<T, Mps, Mcs>,
) => StateCreator<T, Mps, Mcs>;

export function createSyncMiddleware(
  actionsMap: Record<
    PendingSyncActionType,
    (payload: Record<string, unknown>) => unknown | Promise<unknown>
  >,
): SyncMiddleware {
  let isSyncing = false;

  return (config) => (set, get, api) =>
    (config as unknown as StateCreator<StoreWithPendingActions, [], []>)(
      async (args, ...rest) => {
        (set as (...a: any[]) => void)(args, ...rest);

        if (isSyncing) {
          return;
        }

        const pending =
          (get as () => StoreWithPendingActions)().pendingSyncActions ?? [];
        if (pending.length === 0) {
          return;
        }

        try {
          isSyncing = true;
          const apiAvailable = await apiDataFetchAvailable();
          if (!apiAvailable) {
            return;
          }

          const syncedIds: string[] = [];

          for (const action of pending) {
            const handler = actionsMap[action.type];
            if (!handler) {
              continue;
            }

            try {
              const result = await handler(action.payload);

              if (action.type === "addExerciseSet") {
                const tempId = parseString(action.payload.id);
                const serverId = getServerSetId(result);

                if (tempId && serverId && tempId !== serverId) {
                  (set as (...a: any[]) => void)(
                    (state: StoreWithSyncCollections) =>
                      replaceSetIdInCollections(
                        state,
                        tempId,
                        serverId,
                        action.id,
                      ),
                  );
                }
              }

              syncedIds.push(action.id);
            } catch (error) {
              console.warn("Sync action failed", action.type, error);
            }
          }

          if (syncedIds.length > 0) {
            const syncedSet = new Set(syncedIds);
            (set as (...a: any[]) => void)(
              (state: StoreWithPendingActions) => ({
                pendingSyncActions: state.pendingSyncActions.filter(
                  (action) => !syncedSet.has(action.id),
                ),
              }),
            );
          }
        } catch (error) {
          console.error("Error checking API availability:", error);
        } finally {
          isSyncing = false;
        }
      },
      get as any,
      api as any,
    ) as any;
}
