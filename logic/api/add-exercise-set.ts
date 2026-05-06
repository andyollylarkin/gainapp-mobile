const API_BASE_URL = "http://192.168.2.131:9000";
const FIXED_USER_ID = "bebf5efa-ea6e-4025-adb3-edcf0b7c5155";

export interface AddExerciseSetRequest {
  workoutDayExerciseId: string;
  id: string;
  parameter1: number;
  parameter2: number;
  metrics: Record<string, unknown>;
  completed: boolean | null;
  restSecondsActual: number | null;
}

export interface AddExerciseSetResponse {
  id: string;
}

export async function addExerciseSet(
  payload: AddExerciseSetRequest,
): Promise<AddExerciseSetResponse> {
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

  const data = (await response.json()) as Partial<AddExerciseSetResponse>;

  if (!data.id) {
    throw new Error("Failed to add exercise set: response has no id");
  }

  return { id: data.id };
}
