import { addExercise } from "@/logic/api/add-exercise";
import { addExerciseSet } from "@/logic/api/add-exercise-set";
import { addSuperset } from "@/logic/api/add-superset";
import { deleteExercise } from "@/logic/api/delete-exercise";
import { deleteExerciseSet } from "@/logic/api/delete-exercise-set";
import { completeExerciseSet } from "@/logic/api/update-exercise-set";
import {
  PendingSyncActionType,
  useExcerciseStore,
} from "@/store/excercise-store";
import { useEffect, useRef } from "react";
import useApiReached from "./use-api-reached";

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function runAction(
  type: PendingSyncActionType,
  payload: Record<string, unknown>,
): Promise<unknown> {
  if (type === "addExerciseSet") return addExerciseSet(payload as any);
  if (type === "updateExerciseSetParams")
    return completeExerciseSet(payload as any);
  if (type === "completeExerciseSet")
    return completeExerciseSet(payload as any);
  if (type === "deleteExerciseSet") {
    const id = typeof payload.id === "string" ? payload.id : "";
    if (!id) throw new Error("Invalid payload for deleteExerciseSet");
    return deleteExerciseSet(id);
  }
  if (type === "addExercise") return addExercise(payload as any);
  if (type === "addSuperset") return addSuperset(payload as any);
  if (type === "deleteExercise") return deleteExercise(payload as any);
}

function getServerSetId(result: unknown): string {
  const id = (result as { id?: unknown } | undefined)?.id;

  return typeof id === "string" ? id : "";
}

function getServerTrayId(result: unknown): string {
  const trayId = (result as { trayId?: unknown } | undefined)?.trayId;

  return typeof trayId === "string" ? trayId : "";
}

function getServerWorkoutDayExerciseId(result: unknown): string {
  const workoutDayExerciseId = (
    result as { workoutDayExerciseId?: unknown } | undefined
  )?.workoutDayExerciseId;

  return typeof workoutDayExerciseId === "string" ? workoutDayExerciseId : "";
}

function getServerTrayIds(result: unknown): string[] {
  const candidate = (result as { trayIds?: unknown } | undefined)?.trayIds;
  if (!Array.isArray(candidate)) return [];
  return candidate.filter((val): val is string => typeof val === "string");
}

function getServerWorkoutDayExerciseIds(result: unknown): string[] {
  const candidate =
    (result as { workoutDayExerciseIds?: unknown } | undefined)
      ?.workoutDayExerciseIds ??
    (result as { workoutDayExerciseId?: unknown } | undefined)
      ?.workoutDayExerciseId;

  if (Array.isArray(candidate)) {
    return candidate.filter((val): val is string => typeof val === "string");
  }

  if (typeof candidate === "string") {
    return [candidate];
  }

  return [];
}

// Hook that periodically checks for pending sync actions and tries to execute them when the API is reachable.
export function useSyncQueue() {
  const pendingSyncActions = useExcerciseStore((s) => s.pendingSyncActions);
  const removePendingSyncAction = useExcerciseStore(
    (s) => s.removePendingSyncAction,
  );
  const replaceSetId = useExcerciseStore((s) => s.replaceSetId);
  const replaceTrayId = useExcerciseStore((s) => s.replaceTrayId);
  const isSyncing = useRef(false);
  const { isReached, stopWatching } = useApiReached();

  useEffect(() => {
    async function flush() {
      if (isSyncing.current || pendingSyncActions.length === 0) return;

      isSyncing.current = true;

      try {
        for (const queuedAction of pendingSyncActions) {
          const latestAction = useExcerciseStore
            .getState()
            .pendingSyncActions.find((a) => a.id === queuedAction.id);

          if (!latestAction) continue;

          const action = latestAction;

          try {
            if (action.type === "addExerciseSet") {
              const workoutDayExerciseId =
                typeof action.payload.workoutDayExerciseId === "string"
                  ? action.payload.workoutDayExerciseId
                  : "";

              if (!isUuid(workoutDayExerciseId)) {
                continue;
              }
            }

            const result = await runAction(action.type, action.payload);

            if (action.type === "addExerciseSet") {
              const tempId =
                typeof action.payload.id === "string" ? action.payload.id : "";
              const serverId = getServerSetId(result);
              if (tempId && serverId && tempId !== serverId) {
                replaceSetId(tempId, serverId, action.id);
              }
            }

            if (action.type === "addExercise") {
              const tempTrayId =
                typeof action.payload.trayId === "string"
                  ? action.payload.trayId
                  : "";
              const serverTrayId = getServerTrayId(result);
              const serverWorkoutDayExerciseId =
                getServerWorkoutDayExerciseId(result);
              if (tempTrayId && serverTrayId && tempTrayId !== serverTrayId) {
                replaceTrayId(
                  tempTrayId,
                  serverTrayId,
                  serverWorkoutDayExerciseId || undefined,
                );
              }
            }

            if (action.type === "addSuperset") {
              const tempTrayIds = Array.isArray(action.payload.exercises)
                ? action.payload.exercises
                    .map((ex) =>
                      typeof (ex as { trayId?: unknown }).trayId === "string"
                        ? (ex as { trayId: string }).trayId
                        : "",
                    )
                    .filter((id) => id !== "")
                : [];

              const serverTrayIds = getServerTrayIds(result);
              const serverWorkoutDayExerciseIds =
                getServerWorkoutDayExerciseIds(result);

              if (
                serverTrayIds.length > 0 &&
                serverTrayIds.length === tempTrayIds.length
              ) {
                tempTrayIds.forEach((tempId, idx) => {
                  const serverId = serverTrayIds[idx];
                  if (tempId && serverId && tempId !== serverId) {
                    replaceTrayId(
                      tempId,
                      serverId,
                      serverWorkoutDayExerciseIds[idx],
                    );
                  }
                });
              } else {
                const singleServerId = getServerTrayId(result);
                const singleWorkoutDayExerciseId =
                  getServerWorkoutDayExerciseId(result) ||
                  serverWorkoutDayExerciseIds[0];

                if (tempTrayIds.length === 1 && singleServerId) {
                  replaceTrayId(
                    tempTrayIds[0],
                    singleServerId,
                    singleWorkoutDayExerciseId || undefined,
                  );
                }
              }
            }

            removePendingSyncAction(action.id);
          } catch (e) {
            console.warn(
              "Sync action failed:",
              action.type,
              e,
              "payload: ",
              action.payload,
            );
          }
        }
      } finally {
        isSyncing.current = false;
      }
    }

    if (isReached) flush();
  }, [
    pendingSyncActions,
    isReached,
    stopWatching,
    replaceSetId,
    replaceTrayId,
    removePendingSyncAction,
  ]);
}
