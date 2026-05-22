import config from "@/config";

const FIXED_USER_ID = "bebf5efa-ea6e-4025-adb3-edcf0b7c5155";

export interface DeleteExerciseRequest {
  day: string;
  trayId: string;
}

export async function deleteExercise(payload: DeleteExerciseRequest): Promise<void> {
  const encodedTrayId = encodeURIComponent(payload.trayId);
  const url = `${config.apiBaseUrlDev}/api/users/${FIXED_USER_ID}/workouts/exercises/${encodedTrayId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete exercise: ${response.status}`);
  }
}
