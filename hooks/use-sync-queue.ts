import { addExercise } from "@/logic/api/add-exercise";
import { addExerciseSet } from "@/logic/api/add-exercise-set";
import { addSuperset } from "@/logic/api/add-superset";
import { deleteExercise } from "@/logic/api/delete-exercise";
import { deleteExerciseSet } from "@/logic/api/delete-exercise-set";
import { getWorkoutByWeekday } from "@/logic/api/exercises-by-weekday";
import { completeExerciseSet } from "@/logic/api/update-exercise-set";
import {
  PendingSyncActionType,
  useExcerciseStore,
} from "@/store/excercise-store";
import { Day, DayEnum } from "@/types";
import { useEffect, useRef } from "react";
import useApiReached from "./use-api-reached";

function isServerTrayId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function runAction(
  type: PendingSyncActionType,
  payload: Record<string, unknown>,
): Promise<unknown> {
  switch (type) {
    case "addExerciseSet":
      return addExerciseSet(payload as never);
    case "updateExerciseSetParams":
    case "completeExerciseSet":
      return completeExerciseSet(payload as never);
    case "deleteExerciseSet": {
      const id = typeof payload.id === "string" ? payload.id : "";
      if (!id) throw new Error("deleteExerciseSet: missing id");
      return deleteExerciseSet(id);
    }
    case "addExercise":
      return addExercise(payload as never);
    case "addSuperset":
      return addSuperset(payload as never);
    case "deleteExercise":
      return deleteExercise(payload as never);
    default:
      throw new Error(`Unknown sync action type: ${type}`);
  }
}

async function refetchAndMerge(dayKey: string) {
  try {
    const fresh = await getWorkoutByWeekday(
      Day.fromString(dayKey as keyof typeof DayEnum),
    );
    useExcerciseStore.getState().mergeWorkoutFromApi(dayKey as DayEnum, fresh);
  } catch {
    // Refetch is best-effort
  }
}

export function useSyncQueue() {
  const isApiReached = useApiReached();
  const isSyncing = useRef(false);

  const pendingSyncActions = useExcerciseStore((s) => s.pendingSyncActions);
  const removePendingSyncAction = useExcerciseStore(
    (s) => s.removePendingSyncAction,
  );
  const replaceSetId = useExcerciseStore((s) => s.replaceSetId);
  const replaceTrayId = useExcerciseStore((s) => s.replaceTrayId);

  useEffect(() => {
    if (!isApiReached || pendingSyncActions.length === 0 || isSyncing.current)
      return;

    async function flush() {
      isSyncing.current = true;
      try {
        for (const snapshot of pendingSyncActions) {
          const action = useExcerciseStore
            .getState()
            .pendingSyncActions.find((a) => a.id === snapshot.id);
          if (!action) continue;

          // addExerciseSet needs a real server workoutDayExerciseId — skip until
          // the parent addExercise/addSuperset has been synced first.
          if (action.type === "addExerciseSet") {
            const wdeId =
              typeof action.payload.workoutDayExerciseId === "string"
                ? action.payload.workoutDayExerciseId
                : "";
            if (!isServerTrayId(wdeId)) continue;
          }

          try {
            const result = await runAction(action.type, action.payload);

            if (action.type === "addExerciseSet") {
              const tempId =
                typeof action.payload.id === "string" ? action.payload.id : "";
              const res = result as Record<string, unknown>;
              const serverId = typeof res?.id === "string" ? res.id : "";
              if (tempId && serverId && tempId !== serverId) {
                replaceSetId(tempId, serverId, action.id);
              }
              removePendingSyncAction(action.id);
              continue;
            }

            if (action.type === "addExercise") {
              const tempId =
                typeof action.payload.trayId === "string"
                  ? action.payload.trayId
                  : "";
              const res = result as Record<string, unknown>;
              const serverId =
                typeof res?.trayId === "string" ? res.trayId : "";
              const serverWdeId =
                typeof res?.workoutDayExerciseId === "string"
                  ? res.workoutDayExerciseId
                  : undefined;
              if (tempId && serverId && tempId !== serverId) {
                replaceTrayId(tempId, serverId, serverWdeId);
              }
              removePendingSyncAction(action.id);
              const dayKey =
                typeof action.payload.day === "string" ? action.payload.day : null;
              if (dayKey) await refetchAndMerge(dayKey);
              continue;
            }

            if (action.type === "addSuperset") {
              const tempIds = Array.isArray(action.payload.exercises)
                ? (action.payload.exercises as Record<string, unknown>[])
                    .map((ex) =>
                      typeof ex.trayId === "string" ? ex.trayId : "",
                    )
                    .filter(Boolean)
                : [];
              const res = result as Record<string, unknown>;
              const serverIds = Array.isArray(res?.trayIds)
                ? (res.trayIds as unknown[]).filter(
                    (v): v is string => typeof v === "string",
                  )
                : [];
              const serverWdeIds = Array.isArray(res?.workoutDayExerciseIds)
                ? (res.workoutDayExerciseIds as unknown[]).filter(
                    (v): v is string => typeof v === "string",
                  )
                : [];
              if (serverIds.length === tempIds.length) {
                tempIds.forEach((tempId, i) => {
                  const serverId = serverIds[i];
                  if (tempId && serverId && tempId !== serverId) {
                    replaceTrayId(tempId, serverId, serverWdeIds[i]);
                  }
                });
              }
              removePendingSyncAction(action.id);
              const dayKey =
                typeof action.payload.day === "string" ? action.payload.day : null;
              if (dayKey) await refetchAndMerge(dayKey);
              continue;
            }

            removePendingSyncAction(action.id);
          } catch (e) {
            console.warn(`[SyncQueue] ${action.type} failed:`, e);
          }
        }
      } finally {
        isSyncing.current = false;
      }
    }

    flush();
  }, [
    isApiReached,
    pendingSyncActions,
    removePendingSyncAction,
    replaceSetId,
    replaceTrayId,
  ]);
}
