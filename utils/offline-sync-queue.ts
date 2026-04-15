import { File, Paths } from "expo-file-system";

export type OfflineSyncActionType =
  | "addExerciseSet"
  | "updateExerciseSetParams"
  | "completeExerciseSet"
  | "deleteExerciseSet";

export interface OfflineSyncAction {
  id: string;
  createdAt: number;
  type: OfflineSyncActionType;
  payload: Record<string, unknown>;
}

const queueFile = new File(Paths.document, "pending-sync-actions.json");

async function readQueue(): Promise<OfflineSyncAction[]> {
  try {
    if (!queueFile.exists) {
      return [];
    }

    const content = await queueFile.text();
    if (!content) {
      return [];
    }

    const parsed = JSON.parse(content) as OfflineSyncAction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeQueue(queue: OfflineSyncAction[]): Promise<void> {
  if (!queueFile.exists) {
    queueFile.create({ overwrite: true, intermediates: true });
  }

  queueFile.write(JSON.stringify(queue));
}

export async function enqueueOfflineSyncAction(
  type: OfflineSyncActionType,
  payload: Record<string, unknown>,
): Promise<void> {
  const queue = await readQueue();

  queue.push({
    id: `${Date.now()}-${Math.random()}`,
    createdAt: Date.now(),
    type,
    payload,
  });

  await writeQueue(queue);
}
