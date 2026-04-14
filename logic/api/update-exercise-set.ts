const API_BASE_URL = "http://127.0.0.1:9000";
const FIXED_USER_ID = "bebf5efa-ea6e-4025-adb3-edcf0b7c5155";

export interface CompleteExerciseSetRequest {
  workoutDayExerciseId: string;
  setNumber?: number;
  metrics?: Record<string, unknown>;
  completed?: boolean | null;
  parameter1?: string | number | null;
  parameter2?: string | number | null;
  restSecondsActual?: number | null;
}

export async function completeExerciseSet(
  payload: CompleteExerciseSetRequest,
): Promise<void> {
  const url = `${API_BASE_URL}/api/users/${FIXED_USER_ID}/workouts/exercise-sets`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to complete exercise set: ${response.status}`);
  }
}
