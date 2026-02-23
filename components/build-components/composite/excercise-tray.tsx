import { HistoryTextProps } from "@/components/history-text";
import TimerIcon from "@/components/icons/timer";
import TextButton from "@/components/parts/text-button";
import { Colors } from "@/constants/theme";
import { NonEmptyArray } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import ColumnDescription, {
  ColumnDescriptionProps,
} from "../column-description";
import ExcerciseTitle, { ExcerciseTitleProps } from "../excercise-title";
import { SetItemProps } from "./set-item";
import SwipeableSet from "./swipable-set";

export interface ExcerciseTrayProps {
  title: ExcerciseTitleProps;
  description: ColumnDescriptionProps;
  excercises: NonEmptyArray<SetItemProps>;
  history: HistoryTextProps;
}

export default function ExcerciseTray(props: ExcerciseTrayProps) {
  const [excercises, addOrRemoveExcercises] = React.useState<
    NonEmptyArray<SetItemProps>
  >(props.excercises);

  const createDefaultExcercise = (base: SetItemProps): SetItemProps => ({
    ...base,
    initialState: "progress",
    history: props.history,
  });

  return (
    <View style={styles.container}>
      <ExcerciseTitle {...props.title} />
      <ColumnDescription {...props.description} />
      {excercises.map((excercise, index) => (
        <View key={index} style={styles.exerciseRow}>
          <SwipeableSet
            disabled={index === 0}
            onSwipeEnd={() => {
              addOrRemoveExcercises((current) => {
                if (index === 0) return current;
                return current.filter(
                  (_, i) => i !== index,
                ) as NonEmptyArray<SetItemProps>;
              });
            }}
            {...excercise}
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
                ] as NonEmptyArray<SetItemProps>;
              });
            }}
            bgColor={Colors.general.color.darkTones.bgMiddle}
            textColor={Colors.general.color.grayTones.muted50}
          />
        </View>
      </View>
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
