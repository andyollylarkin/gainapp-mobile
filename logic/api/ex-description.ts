import config from "@/config";
import { Day } from "@/types";

const FIXED_USER_ID = "bebf5efa-ea6e-4025-adb3-edcf0b7c5155";

export interface WorkoutOverviewDescription {
  workoutName: string;
  excercisesCount: number;
  durationMinutes: number;
}

export interface WorkoutOverviewExercise {
  excerciseName: string;
  sets: number;
  reps: number;
  image: string;
  id: string;
}

export interface WorkoutOverviewResponse {
  description: WorkoutOverviewDescription;
  exercises: WorkoutOverviewExercise[];
  isRestDay: boolean;
}

export async function getWorkoutOverviewByDay(
  day: Day,
): Promise<WorkoutOverviewResponse> {
  const weekday = Day.toNumber(day);
  const url = `${config.apiBaseUrlDev}/api/users/${FIXED_USER_ID}/workouts/weekday/${weekday}/overview`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch workout overview: ${response.status}`);
  }

  return (await response.json()) as WorkoutOverviewResponse;
}
