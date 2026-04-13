import { Day } from "@/types";

const API_BASE_URL = "http://127.0.0.1:9000";
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

export function dayToWeekday(day: Day): number {
  const mapping: Record<Day, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  return mapping[day];
}

export async function getWorkoutOverviewByDay(
  day: Day,
): Promise<WorkoutOverviewResponse> {
  const weekday = dayToWeekday(day);
  const url = `${API_BASE_URL}/api/users/${FIXED_USER_ID}/workouts/weekday/${weekday}/overview`;

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
