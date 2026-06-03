import config from "@/config";

export interface ExerciseEquipmentItem {
  name: string;
  imageUrl: string | null;
}

export interface ExerciseMuscles {
  primary: string;
  secondary: string;
}

export interface ExerciseInfoResponse {
  id: string;
  title: string;
  videoUrl: string | null;
  description: string | null;
  muscles: ExerciseMuscles;
  equipment: ExerciseEquipmentItem[];
}

export async function getExerciseInfo(
  exerciseId: string,
): Promise<ExerciseInfoResponse> {
  const response = await fetch(
    `${config.apiBaseUrlDev}/api/exercises/${exerciseId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch exercise info: ${response.status}`);
  }

  const body = await response.json()

  console.log("INFO BODY", body)

  return body as ExerciseInfoResponse;
}
