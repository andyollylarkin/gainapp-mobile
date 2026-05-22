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
        for (const action of pendingSyncActions) {
          try {
            const result = await runAction(action.type, action.payload);

            if (action.type === "addExerciseSet") {
              const tempId =
                typeof action.payload.id === "string" ? action.payload.id : "";
              const serverId = getServerSetId(result);
              if (tempId && serverId && tempId !== serverId) {
                replaceSetId(tempId, serverId, action.id);
              }
            }

            if (action.type === "addExercise" || action.type === "addSuperset") {
              const tempTrayId =
                typeof action.payload.trayId === "string"
                  ? action.payload.trayId
                  : "";
              const serverTrayId = getServerTrayId(result);
              if (tempTrayId && serverTrayId && tempTrayId !== serverTrayId) {
                replaceTrayId(tempTrayId, serverTrayId);
              }
            }

            removePendingSyncAction(action.id);
          } catch (e) {
            console.warn("Sync action failed:", action.type, e);
          }
        }
      } finally {
        isSyncing.current = false;
      }
    }

    if (isReached) flush();
  }, [pendingSyncActions, isReached, stopWatching, replaceSetId, replaceTrayId, removePendingSyncAction]);
}
