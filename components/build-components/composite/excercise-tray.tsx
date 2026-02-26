import { HistoryTextProps } from "@/components/history-text";
import TimerIcon from "@/components/icons/timer";
import Accordion from "@/components/parts/accordion";
import TextButton from "@/components/parts/text-button";
import { Colors } from "@/constants/theme";
import useEventBus from "@/hooks/use-event-bus";
import { NonEmptyArray, StartTimerEvent } from "@/types";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import ColumnDescription, {
  ColumnDescriptionProps,
} from "../column-description";
import ExcerciseTitle, { ExcerciseTitleProps } from "../excercise-title";
import { SetItemProps } from "./set-item";
import SwipeableSet from "./swipable-set";

type PublicSetItemProps = Omit<SetItemProps, "onPress" | "id" | "_id">;
type ExerciseWithId = PublicSetItemProps & { _id: string };

export interface ExcerciseTrayProps {
  title: ExcerciseTitleProps;
  description: ColumnDescriptionProps;
  excercises: NonEmptyArray<PublicSetItemProps>;
  history: HistoryTextProps;
  onExcerciseChange?: (excercise: PublicSetItemProps, id: string) => void;
  onExcerciseComplete?: (excercise: PublicSetItemProps, id: string) => void;
  onExcerciseRemove?: (excercise: PublicSetItemProps, id: string) => void;
}

export default function ExcerciseTray(props: ExcerciseTrayProps) {
  const [excercises, addOrRemoveExcercises] = React.useState<
    NonEmptyArray<ExerciseWithId>
  >(
    () =>
      props.excercises.map((ex, i) => ({
        ...ex,
        _id: `exercise-${Date.now()}-${i}`,
      })) as NonEmptyArray<ExerciseWithId>,
  );
  const [currentActiveIndex, setCurrentActiveIndex] = React.useState<number>(0);
  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);
  const eventBus = useEventBus<string, StartTimerEvent>();

  useEffect(() => {}, [currentActiveIndex]);

  const createDefaultExcercise = (base: ExerciseWithId): ExerciseWithId => ({
    ...base,
    _id: `exercise-${Date.now()}-${Math.random()}`,
    initialState: "progress",
  });

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
        {excercises.map((excercise, index) => (
          <View key={excercise._id} style={styles.exerciseRow}>
            <SwipeableSet
              id={excercise._id}
              onPressEnd={() => {
                if (index !== currentActiveIndex) return;

                setCurrentActiveIndex((current) => {
                  return current + 1;
                });
                eventBus.emit(
                  "startTimer",
                  new StartTimerEvent(
                    `exercise-timer-${Date.now()}`,
                    Date.now(),
                    150,
                  ),
                );

                props.onExcerciseComplete?.(excercise, excercise._id);
              }}
              disabledSwipe={index === 0 || currentActiveIndex > index}
              onSwipeEnd={() => {
                props.onExcerciseChange?.(excercise, excercise._id);

                addOrRemoveExcercises((current) => {
                  if (index === 0) return current;
                  const filtered = current.filter(
                    (ex) => ex._id !== excercise._id,
                  );
                  return (
                    filtered.length > 0 ? filtered : current
                  ) as NonEmptyArray<ExerciseWithId>;
                });

                props.onExcerciseRemove?.(excercise, excercise._id);
              }}
              {...excercise}
              initialState={
                index === currentActiveIndex ? "current" : "progress"
              }
              onPress={(initialState, stateTransition) => {
                if (index !== currentActiveIndex) return;
                if (initialState === "current" || initialState === "progress") {
                  stateTransition("done");
                }
                props.onExcerciseChange?.(excercise, excercise._id);
              }}
              onInputChange={(field1, field2) => {
                addOrRemoveExcercises((current) => {
                  const updated = current.map((ex) =>
                    ex._id === excercise._id
                      ? { ...ex, input: { field1, field2 } }
                      : ex,
                  );
                  return updated as NonEmptyArray<ExerciseWithId>;
                });
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
            <TextButton
              text={"Add Set"}
              onClick={() => {
                addOrRemoveExcercises((current) => {
                  const nextExcercise = createDefaultExcercise(
                    current[current.length - 1],
                  );
                  return [
                    ...current,
                    nextExcercise,
                  ] as NonEmptyArray<ExerciseWithId>;
                });
              }}
              bgColor={Colors.general.color.darkTones.bgMiddle}
              textColor={Colors.general.color.grayTones.muted50}
            />
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
