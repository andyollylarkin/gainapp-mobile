import ScaledPressable from "@/components/animated/scaled-pressable";
import { HistoryTextProps } from "@/components/history-text";
import TimerIcon from "@/components/icons/timer";
import Accordion from "@/components/parts/accordion";
import TextButton from "@/components/parts/text-button";
import { Colors } from "@/constants/theme";
import { useExcerciseStore } from "@/store/excercise-store";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { addExerciseSet } from "../../../logic/api/add-exercise-set";
import ColumnDescription, {
  ColumnDescriptionProps,
} from "../column-description";
import ExcerciseTitle, { ExcerciseTitleProps } from "../excercise-title";
import { SetItemProps } from "./set-item";
import SwipeableSet from "./swipable-set";

export interface ExcerciseTrayProps {
  title: ExcerciseTitleProps;
  description: ColumnDescriptionProps;
  history: HistoryTextProps;
  id: string;
  onExcerciseChange?: (excercise: SetItemProps, id: string) => void;
  onExcerciseComplete?: (
    excercise: SetItemProps,
    id: string,
    { total, currentCompleted }: { total: number; currentCompleted: number },
  ) => void;
  onExcerciseRemove?: (excercise: SetItemProps, id: string) => void;
  disable?: boolean;
}

export default function ExcerciseTray(props: ExcerciseTrayProps) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);
  const {
    excercises,
    addExcercise,
    updateExcercise,
    removeExcercise,
    setTrayActiveIndex,
    getActiveIndex,
  } = useExcerciseStore();

  const createDefaultExcercise = (base: SetItemProps): SetItemProps => ({
    ...base,
    id: `exercise-${Date.now()}-${Math.random()}`,
    initialState: "progress",
  });

  const fallbackSet: SetItemProps = {
    id: "fallback",
    history: {
      firstText: 0,
      secondText: 0,
      delimiter: "x",
    },
    excerciseOrder: "W",
    maxInputValue: 500,
    initialState: "progress",
    input: { field1: "0", field2: "0" },
  };

  const trayExcercises = excercises.filter(
    (excercise) => excercise.trayId === props.id,
  );

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          setIsExpanded((current) => !current);
        }}
      >
        <ExcerciseTitle {...props.title} expanded={isExpanded} />
      </Pressable>
      <Accordion isExpanded={isExpanded}>
        <ColumnDescription {...props.description} />
        {trayExcercises.map((excercise, index) => (
          <View key={excercise.id} style={styles.exerciseRow}>
            <SwipeableSet
              onPressEnd={() => {
                if (props.disable) return;
                if (index !== getActiveIndex(props.id)) return;

                setTrayActiveIndex(props.id, index + 1);

                props.onExcerciseComplete?.(excercise, excercise.id, {
                  total: trayExcercises.length,
                  currentCompleted: index + 1,
                });
              }}
              disabledSwipe={index === 0 || getActiveIndex(props.id) > index}
              onSwipeEnd={() => {
                props.onExcerciseChange?.(excercise, excercise.id);
                props.onExcerciseRemove?.(excercise, excercise.id);
                removeExcercise(excercise.id, props.id);
              }}
              {...excercise}
              initialState={
                excercise.initialState === "done"
                  ? "done"
                  : index === getActiveIndex(props.id)
                    ? "current"
                    : "progress"
              }
              onPress={(initialState, stateTransition) => {
                if (props.disable) return;
                if (index !== getActiveIndex(props.id)) return;
                if (initialState === "current" || initialState === "progress") {
                  stateTransition("done");
                  updateExcercise(
                    excercise.id,
                    { initialState: "done" },
                    props.id,
                  );
                }
                props.onExcerciseChange?.(excercise, excercise.id);
              }}
              onInputChange={(field1, field2) => {
                updateExcercise(
                  excercise.id,
                  {
                    input: { field1, field2 },
                  },
                  props.id,
                );
              }}
              excerciseOrder={index === 0 ? "W" : index}
            />
          </View>
        ))}
        <View style={styles.bottomContainer}>
          <View style={styles.buttons}>
            <TextButton
              icon={
                <TimerIcon
                  color={Colors.general.color.grayTones.muted50}
                  height={20}
                  width={20}
                />
              }
              text={"2min 30s"}
              bgColor={Colors.general.color.darkTones.bgMiddle}
              textColor={Colors.general.color.grayTones.muted50}
            />
          </View>
          <View style={styles.buttons}>
            <ScaledPressable scaleDuration={150} scaleTo={0.94}>
              <TextButton
                text={"Add Set"}
                onPressIn={() => {
                  const baseSet =
                    trayExcercises[trayExcercises.length - 1] ?? fallbackSet;
                  const nextExcercise = {
                    ...createDefaultExcercise(baseSet),
                    trayId: props.id,
                  };
                  addExcercise(nextExcercise, props.id);

                  void addExerciseSet({
                    workoutDayExerciseId: props.id,
                    id: nextExcercise.id,
                    metrics: {
                      field1: nextExcercise.input.field1,
                      field2: nextExcercise.input.field2,
                    },
                    completed: false,
                    restSecondsActual: null,
                  }).catch((error) => {
                    console.warn("Failed to add exercise set", error);
                  });
                }}
                bgColor={Colors.general.color.darkTones.bgMiddle}
                textColor={Colors.general.color.grayTones.muted50}
              />
            </ScaledPressable>
          </View>
        </View>
      </Accordion>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#1A1A1A",
    backgroundColor: "#1A1A1A",
  },
  buttons: {
    minWidth: 108,
    maxHeight: 36,
  },
  bottomContainer: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseRow: {
    height: 44,
  },
});
