const API_BASE_URL = "http://192.168.2.131:9000";
const FIXED_USER_ID = "bebf5efa-ea6e-4025-adb3-edcf0b7c5155";

export async function deleteExerciseSet(setId: string): Promise<void> {
  const encodedSetId = encodeURIComponent(setId);
  const url = `${API_BASE_URL}/api/users/${FIXED_USER_ID}/workouts/exercise-sets/${encodedSetId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete exercise set: ${response.status}`);
  }
}
