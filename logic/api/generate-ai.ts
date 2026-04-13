import { WorkoutOverviewResponse } from "@/logic/api/ex-description";

const API_BASE_URL = "http://127.0.0.1:9000";
const FIXED_USER_ID = "bebf5efa-ea6e-4025-adb3-edcf0b7c5155";

export async function generateAiWorkout(): Promise<WorkoutOverviewResponse> {
  const url = `${API_BASE_URL}/api/users/${FIXED_USER_ID}/workouts/generate-ai`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to generate AI workout: ${response.status}`);
  }

  return (await response.json()) as WorkoutOverviewResponse;
}
