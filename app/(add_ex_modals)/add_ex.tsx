import CheckCircle from "@/components/build-components/check-circle";
import {
  Box,
  BoxList,
} from "@/components/build-components/composite/info-tab/box";
import SearchInput from "@/components/build-components/search-input";
import SelectButton from "@/components/build-components/select-button";
import { MuscleGroup } from "@/components/icons/muscle-body/back";
import { Colors, typography } from "@/constants/theme";
import { DayEnum } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

enum Equipment {
  Barbell = "Barbell",
  Dumbbell = "Dumbbell",
  Machine = "Machine",
  Bodyweight = "Bodyweight",
  CableMachine = "Cable Machine",
  SmithMachine = "Smith Machine",
  CurlBar = "Curl Bar",
  Other = "Other",
}

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
  const params: { day: DayEnum } = useLocalSearchParams();
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.general.color.darkTones.bg,
        position: "relative",
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 26,
          paddingTop: modalHeaderOverlayHeight,
          paddingBottom: 24 + insets.bottom,
          paddingHorizontal: 8,
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
            Add Exercises
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
                onPress={function (val: string | number): void {
                  setMuscleGroupSelected(val);
                }}
              />
              <SelectButton
                items={["All Equipment", ...EQUIPMENT]}
                value={equipmentSelected}
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
          onExerciseSelect={(exercise) => {
            setSelectedExercises((curr) => [...curr, exercise]);
          }}
        />
      </ScrollView>
    </View>
  );
}

type Exercise = {
  id: string | number;
  imgUrl: string;
  name: string;
  equipment: Equipment;
  category?: MuscleGroup;
};

function List(props: {
  exercises: Exercise[];
  onExerciseSelect: (exercise: Exercise) => void;
}): React.ReactElement {
  const grouped = useMemo(() => {
    const sorted = [...props.exercises].sort((a, b) => {
      const catA = a.category ?? "";
      const catB = b.category ?? "";
      return catA.localeCompare(catB);
    });

    const map = new Map<string, Exercise[]>();
    for (const ex of sorted) {
      const key = ex.category ?? "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ex);
    }
    return map;
  }, [props.exercises]);

  const [checked, setChecked] = useState<Set<string | number>>(new Set());

  return (
    <View style={{ flex: 1, width: "100%" }}>
      {Array.from(grouped.entries()).map((entry) => {
        const [category, exercises] = entry;
        return (
          <View key={category} style={{ marginBottom: 24 }}>
            <Text
              style={{
                ...typography.mediumL,
                color: Colors.general.color.grayTones.muted40,
                paddingHorizontal: 12,
                marginBottom: 12,
              }}
            >
              {category}
            </Text>
            <BoxList>
              {exercises.map((exercise) => (
                <ItemBox
                  checked={checked.has(exercise.id)}
                  key={exercise.id}
                  exercise={exercise}
                  onCheckedChange={(isChecked) => {
                    props.onExerciseSelect(exercise);
                    setChecked((prev) => {
                      const next = new Set(prev);
                      if (isChecked) {
                        next.add(exercise.id);
                      } else {
                        next.delete(exercise.id);
                      }
                      return next;
                    });
                  }}
                />
              ))}
            </BoxList>
          </View>
        );
      })}
    </View>
  );
}

function ItemBox(props: {
  exercise: Exercise;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}): React.ReactElement {
  return (
    <Pressable onPress={() => props.onCheckedChange(!props.checked)}>
      <Box key={props?.exercise?.id}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 12,
            alignItems: "center",
            paddingRight: 24,
            paddingLeft: 12,
          }}
        >
          {props.exercise.imgUrl ? (
            <Image
              src={props.exercise.imgUrl}
              style={{
                maxWidth: 56,
                aspectRatio: "1",
                borderRadius: 12,
              }}
            />
          ) : (
            <View
              style={{
                width: 56,
                borderRadius: 12,
                maxWidth: 56,
                aspectRatio: "1",
                backgroundColor: Colors.general.color.grayTones.muted40,
              }}
            />
          )}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                height: "100%",
                gap: 6,
              }}
            >
              <Text
                style={{
                  ...typography.mediumM,
                  color: Colors.general.color.grayTones.main,
                }}
              >
                {props.exercise.name}
              </Text>
              <Text
                style={{
                  ...typography.mediumM,
                  color: Colors.general.color.grayTones.muted50,
                }}
              >
                {props.exercise.equipment}
              </Text>
            </View>
          </View>
          <View>
            <CheckCircle checked={props.checked} size={22} />
          </View>
        </View>
      </Box>
    </Pressable>
  );
}
