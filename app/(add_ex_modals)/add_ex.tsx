import List from "@/components/build-components/composite/add-exercises/item-list";
import SelectButtons from "@/components/build-components/composite/add-exercises/select-buttons-row";
import {
  Equipment,
  Exercise,
} from "@/components/build-components/composite/add-exercises/types";
import SearchInput from "@/components/build-components/search-input";
import SelectButton from "@/components/build-components/select-button";
import { Colors, typography } from "@/constants/theme";
import { useExcerciseStore } from "@/store/excercise-store";
import { DayEnum } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MUSCLE_GROUPS = [
  "Abs",
  "Adductors",
  "Biceps",
  "Calves",
  "Chest",
  "Forearms",
  "Frontal Delts",
  "Lats",
  "Traps",
  "Triceps",
  "Glutes",
  "Lower Back",
  "Hamstrings",
  "Rear Delts",
  "Quads",
];

const EQUIPMENT = [
  "Barbell",
  "Dumbbell",
  "Machine",
  "Bodyweight",
  "Cable Machine",
  "Smith Machine",
  "Curl Bar",
  "Other",
];

const TEST_EX: Exercise[] = [
  {
    id: 1,
    imgUrl: "",
    name: "Exercise 1",
    equipment: Equipment.Barbell,
    category: "Abs",
  },
  {
    id: 2,
    imgUrl: "",
    name: "Exercise 2",
    equipment: Equipment.Dumbbell,
    category: "Chest",
  },
  {
    id: 3,
    imgUrl: "",
    name: "Exercise 3",
    equipment: Equipment.Machine,
    category: "Triceps",
  },
  {
    id: 4,
    imgUrl: "",
    name: "Exercise 4",
    equipment: Equipment.CableMachine,
    category: "Triceps",
  },
  {
    id: 5,
    imgUrl: "",
    name: "Exercise 5",
    equipment: Equipment.SmithMachine,
    category: "Lats",
  },
  {
    id: 6,
    imgUrl: "",
    name: "Exercise 6",
    equipment: Equipment.CurlBar,
    category: "Lats",
  },
  {
    id: 7,
    imgUrl: "",
    name: "Exercise 6",
    equipment: Equipment.Machine,
    category: "Lats",
  },
];

export default function AddExerciseModal() {
  const params: { day: DayEnum; trayId: string; mode?: string } =
    useLocalSearchParams();
  const isReplaceMode = params.mode === "replace";
  const insets = useSafeAreaInsets();
  const modalHeaderOverlayHeight = insets.top + 22;
  const [searchValue, setSearchValue] = useState<string>("");
  const [muscleGroupSelected, setMuscleGroupSelected] = useState<
    string | number
  >("All Muscles");
  const [equipmentSelected, setEquipmentSelected] = useState<string | number>(
    "All Equipment",
  );

  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  const queueAddExercise = useExcerciseStore((state) => state.queueAddExercise);
  const queueAddSuperset = useExcerciseStore((state) => state.queueAddSuperset);
  const queueReplaceExercise = useExcerciseStore(
    (state) => state.queueReplaceExercise,
  );

  const handleAddToWorkout = useCallback(
    (exercises: Exercise[]) => {
      if (exercises.length === 0) return;

      if (isReplaceMode) {
        const ex = exercises[0];
        queueReplaceExercise(params.day, params.trayId, {
          id: ex.id,
          name: ex.name,
          equipment: ex.equipment,
          category: ex.category ?? undefined,
        });
        router.back();
        return;
      }

      console.log(
        "[ADD_EX] Adding exercises to day:",
        params.day,
        "exercises:",
        exercises.map((e) => e.name),
      );

      exercises.forEach((ex) => {
        queueAddExercise(params.day, {
          id: ex.id,
          name: ex.name,
          equipment: ex.equipment,
          category: ex.category ?? undefined,
        });
      });

      console.log(
        "[ADD_EX] Store after add:",
        JSON.stringify(
          useExcerciseStore.getState().workoutByWeekdayByDay[params.day]?.trays
            ?.length,
        ),
      );

      router.back();
    },
    [queueAddExercise, queueReplaceExercise, params.day, params.trayId, isReplaceMode],
  );

  const handleAddSuperset = useCallback(
    (exercises: Exercise[]) => {
      if (exercises.length < 2) return;

      console.log(
        "[ADD_EX] Adding superset to day:",
        params.day,
        "exercises:",
        exercises.map((e) => e.name),
      );

      queueAddSuperset(
        params.day,
        exercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          equipment: ex.equipment,
          category: ex.category ?? undefined,
        })),
      );

      router.back();
    },
    [queueAddSuperset, params.day],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.general.color.darkTones.bg,
        position: "relative",
      }}
    >
      <SelectButtons
        selectedExercises={selectedExercises}
        onAddToWorkout={handleAddToWorkout}
        onAddSuperset={handleAddSuperset}
        mode={isReplaceMode ? "replace" : "add"}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 26,
          paddingTop: modalHeaderOverlayHeight,
          paddingBottom: 24 + insets.bottom,
          paddingHorizontal: 8,
          position: "relative",
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Text
            style={{
              ...typography.mediumL,
              color: Colors.general.color.grayTones.main,
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            {isReplaceMode ? "Replace Exercise" : "Add Exercises"}
          </Text>
          <View
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <SearchInput
              placeholder="Search"
              onChange={setSearchValue}
              value={searchValue}
              setValue={setSearchValue}
            />
            <View
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flexDirection: "row",
                width: "100%",
                gap: 12,
              }}
            >
              <SelectButton
                items={["All Muscles", ...MUSCLE_GROUPS]}
                value={muscleGroupSelected}
                color={
                  muscleGroupSelected !== "All Muscles"
                    ? Colors.general.color.grayTones.main
                    : Colors.general.color.darkTones.bgTray
                }
                textColor={
                  muscleGroupSelected !== "All Muscles"
                    ? Colors.general.color.darkTones.bg
                    : Colors.general.color.grayTones.muted50
                }
                onPress={function (val: string | number): void {
                  setMuscleGroupSelected(val);
                }}
              />
              <SelectButton
                items={["All Equipment", ...EQUIPMENT]}
                value={equipmentSelected}
                color={
                  equipmentSelected !== "All Equipment"
                    ? Colors.general.color.grayTones.main
                    : Colors.general.color.darkTones.bgTray
                }
                textColor={
                  equipmentSelected !== "All Equipment"
                    ? Colors.general.color.darkTones.bg
                    : Colors.general.color.grayTones.muted50
                }
                onPress={function (val: string | number): void {
                  setEquipmentSelected(val);
                }}
              />
            </View>
          </View>
        </View>
        <List
          // TODO: add real exercises based on search and filters
          exercises={TEST_EX.filter((ex) => {
            const matchesSearch = ex.name
              .toLowerCase()
              .includes(searchValue.toLowerCase());
            const matchesMuscleGroup =
              muscleGroupSelected === "All Muscles" ||
              ex.category === muscleGroupSelected;
            const matchesEquipment =
              equipmentSelected === "All Equipment" ||
              ex.equipment === equipmentSelected;
            return matchesSearch && matchesMuscleGroup && matchesEquipment;
          })}
          singleSelect={isReplaceMode}
          onExerciseSelect={(exercise) => {
            if (isReplaceMode) {
              setSelectedExercises([exercise]);
            } else {
              setSelectedExercises((curr) => [...curr, exercise]);
            }
          }}
          onExerciseDeselect={(exercise) => {
            setSelectedExercises((curr) =>
              curr.filter((ex) => ex.id !== exercise.id),
            );
          }}
        />
      </ScrollView>
    </View>
  );
}
