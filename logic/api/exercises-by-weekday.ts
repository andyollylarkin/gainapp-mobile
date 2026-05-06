import { WorkoutOverviewDescription } from "@/logic/api/ex-description";
import { Day } from "@/types";

const API_BASE_URL = "http://192.168.2.131:9000";
const FIXED_USER_ID = "bebf5efa-ea6e-4025-adb3-edcf0b7c5155";

export interface WorkoutWeekdaySetHistory {
  firstText: string | number;
  secondText: string | number;
  delimiter: string;
}

export interface WorkoutWeekdaySet {
  id: string;
  setNumber: number;
  parameter1: number;
  parameter2: number;
  completed: boolean;
  history: WorkoutWeekdaySetHistory;
}

export interface WorkoutWeekdayTray {
  id: string;
  workoutDayExerciseId?: string;
  title: {
    type: string;
    title: string;
  };
  description: {
    items: ["Set", "Previous", "kg", "Reps"] | ["Set", "Previous", "kg"];
  };
  history: WorkoutWeekdaySetHistory;
  sets: WorkoutWeekdaySet[];
}

export interface WorkoutByWeekdayResponse {
  description: WorkoutOverviewDescription;
  isRestDay: boolean;
  trays: WorkoutWeekdayTray[];
}

export async function getWorkoutByWeekday(
  day: Day,
): Promise<WorkoutByWeekdayResponse> {
  const url = `${API_BASE_URL}/api/users/${FIXED_USER_ID}/workouts/weekday/${Day.toNumber(day)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch workout by weekday: ${response.status}`);
  }

  const js = await response.json();

  return js as WorkoutByWeekdayResponse;
}
