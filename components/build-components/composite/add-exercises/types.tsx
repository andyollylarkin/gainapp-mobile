import { MuscleGroup } from "@/components/icons/muscle-body/back";

export type Exercise = {
  id: string | number;
  imgUrl: string;
  name: string;
  equipment: Equipment;
  category?: MuscleGroup;
};

export enum Equipment {
  Barbell = "Barbell",
  Dumbbell = "Dumbbell",
  Machine = "Machine",
  Bodyweight = "Bodyweight",
  CableMachine = "Cable Machine",
  SmithMachine = "Smith Machine",
  CurlBar = "Curl Bar",
  Other = "Other",
}
