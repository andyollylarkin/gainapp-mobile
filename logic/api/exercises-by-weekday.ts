import config from "@/config";
import { WorkoutOverviewDescription } from "@/logic/api/ex-description";
import { KgOrLbs, useSettingsStore } from "@/store/excercise-settings-store";
import { Day } from "@/types";

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
    items: ["Set", "Previous", KgOrLbs, "Reps"];
  };
  history: WorkoutWeekdaySetHistory;
  sets: WorkoutWeekdaySet[];
}

export interface WorkoutByWeekdayResponse {
  description: WorkoutOverviewDescription;
  isRestDay: boolean;
  trays: WorkoutWeekdayTray[];
}

function pickString(
  source: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

function normalizeWorkoutByWeekdayResponse(
  raw: unknown,
  measurementUnit: KgOrLbs,
): WorkoutByWeekdayResponse {
  const response = raw as {
    description?: WorkoutOverviewDescription;
    isRestDay?: boolean;
    trays?: unknown;
  };
  const normalizedTrays: WorkoutWeekdayTray[] = Array.isArray(response.trays)
    ? response.trays.map((trayRaw) => {
        const trayObj = (trayRaw ?? {}) as Record<string, unknown>;

        const id = pickString(trayObj, ["id", "trayId", "tray_id"]) ?? "";
        const workoutDayExerciseId = pickString(trayObj, [
          "workoutDayExerciseId",
          "workout_day_exercise_id",
          "workoutDayExerciseID",
          "workoutDayExcerciseId",
          "exerciseId",
          "exercise_id",
        ]);

        return {
          ...(trayObj as unknown as WorkoutWeekdayTray),
          id,
          workoutDayExerciseId,
          description: {
            items: [
              "Set",
              "Previous",
              measurementUnit === "kg" ? ("Kg" as KgOrLbs) : ("Lbs" as KgOrLbs),
              "Reps",
            ],
          },
        };
      })
    : [];

  return {
    description: response.description as WorkoutOverviewDescription,
    isRestDay: Boolean(response.isRestDay),
    trays: normalizedTrays,
  };
}

export async function getWorkoutByWeekday(
  day: Day,
  measurementUnit: KgOrLbs,
): Promise<WorkoutByWeekdayResponse> {
  const url = `${config.apiBaseUrlDev}/api/users/${FIXED_USER_ID}/workouts/weekday/${Day.toNumber(day)}`;

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

  return normalizeWorkoutByWeekdayResponse(js, measurementUnit);
}
