import { useMemo, useState } from "react";
import { Exercise } from "./types";
import { View, Text } from "react-native";
import { Colors, typography } from "@/constants/theme";
import { BoxList } from "../info-tab/box";
import ItemBox from "./item-box";

export default function List(props: {
  exercises: Exercise[];
  onExerciseSelect: (exercise: Exercise) => void;
  onExerciseDeselect: (exercise: Exercise) => void;
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
                    if (isChecked) {
                      props.onExerciseSelect(exercise);
                    } else {
                      props.onExerciseDeselect(exercise);
                    }
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
