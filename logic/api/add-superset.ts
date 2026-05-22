import config from "@/config";

const FIXED_USER_ID = "bebf5efa-ea6e-4025-adb3-edcf0b7c5155";

export interface AddSupersetRequest {
  day: string;
  exercises: {
    exerciseId: string | number;
    name: string;
    equipment: string;
    category?: string;
  }[];
}

export interface AddSupersetResponse {
  trayId: string;
  workoutDayExerciseId: string;
}

export async function addSuperset(
  payload: AddSupersetRequest,
): Promise<AddSupersetResponse> {
  const url = `${config.apiBaseUrlDev}/api/users/${FIXED_USER_ID}/workouts/supersets/add`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to add superset: ${response.status}`);
  }

  const data = (await response.json()) as Partial<AddSupersetResponse>;

  if (!data.trayId || !data.workoutDayExerciseId) {
    throw new Error("Failed to add superset: invalid response payload");
  }

  return {
    trayId: data.trayId,
    workoutDayExerciseId: data.workoutDayExerciseId,
  };
}
