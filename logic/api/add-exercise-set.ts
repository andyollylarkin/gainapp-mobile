const API_BASE_URL = "http://127.0.0.1:9000";
const FIXED_USER_ID = "bebf5efa-ea6e-4025-adb3-edcf0b7c5155";

export interface AddExerciseSetRequest {
  workoutDayExerciseId: string;
  id: string;
  metrics: Record<string, unknown>;
  completed: boolean | null;
  restSecondsActual: number | null;
}

export async function addExerciseSet(
  payload: AddExerciseSetRequest,
): Promise<void> {
  const url = `${API_BASE_URL}/api/users/${FIXED_USER_ID}/workouts/exercise-sets/add`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to add exercise set: ${response.status}`);
  }
}
