import config from "@/config";
import { Day } from "@/types";

const FIXED_USER_ID = "bebf5efa-ea6e-4025-adb3-edcf0b7c5155";

export interface AddExerciseRequest {
  day: Day;
  exerciseId: string | number;
  name: string;
  equipment: string;
  category?: string;
}

export interface AddExerciseResponse {
  trayId: string;
  workoutDayExerciseId: string;
}

export async function addExercise(
  payload: AddExerciseRequest,
): Promise<AddExerciseResponse> {
  const url = `${config.apiBaseUrlDev}/api/users/${FIXED_USER_ID}/workouts/exercises/add`;

  let payloadPrepared = {
    ...payload,
  };

  payloadPrepared.day = Day.toNumber(payload.day) as unknown as Day;

  console.log("Prepared payload:", payloadPrepared)

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payloadPrepared),
  });

  if (!response.ok) {
    throw new Error(`Failed to add exercise: ${response.status}`);
  }

  const data = (await response.json()) as Partial<AddExerciseResponse>;

  if (!data.trayId || !data.workoutDayExerciseId) {
    throw new Error("Failed to add exercise: invalid response payload");
  }

  return {
    trayId: data.trayId,
    workoutDayExerciseId: data.workoutDayExerciseId,
  };
}
