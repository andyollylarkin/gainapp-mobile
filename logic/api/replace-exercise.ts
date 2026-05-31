import config from "@/config";

const FIXED_USER_ID = "bebf5efa-ea6e-4025-adb3-edcf0b7c5155";

export interface ReplaceExerciseRequest {
  trayId: string;
  exerciseId: string | number;
  name: string;
  equipment: string;
  category?: string;
}

export async function replaceExercise(
  payload: ReplaceExerciseRequest,
): Promise<void> {
  const url = `${config.apiBaseUrlDev}/api/users/${FIXED_USER_ID}/workouts/exercises/${payload.trayId}`;

  const { trayId: _trayId, ...body } = payload;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to replace exercise: ${response.status}`);
  }
}
