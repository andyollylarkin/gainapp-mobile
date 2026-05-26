import ScaledPressable from "@/components/animated/scaled-pressable";
import { HistoryTextProps } from "@/components/history-text";
import TimerIcon from "@/components/icons/timer";
import Accordion from "@/components/parts/accordion";
import TextButton from "@/components/parts/text-button";
import { Colors } from "@/constants/theme";
import { WorkoutWeekdaySet } from "@/logic/api/exercises-by-weekday";
import { useExerciseSettings } from "@/store/excercise-settings-store";
import { useExcerciseStore } from "@/store/excercise-store";
import { DayEnum } from "@/types";
import * as Crypto from "expo-crypto";
import React, { RefObject, useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import ColumnDescription, {
  ColumnDescriptionProps,
} from "../column-description";
import ExcerciseTitle, { ExcerciseTitleProps } from "../excercise-title";
import HideableNote from "../hidden-note";
import AdjustTimerModal from "./adjust-timer-modal";
import Modal from "./modal";
import { SetItemProps, SetState } from "./set-item";
import SwipeableSet from "./swipable-set";
import { timeToString } from "@/utils/timer-to-string";

export interface ExcerciseTrayProps {
  title: ExcerciseTitleProps;
  description: ColumnDescriptionProps;
  history: HistoryTextProps;
  id: string;
  day: DayEnum;
  onExcerciseChange?: (excercise: SetItemProps, id: string) => void;
  onExcerciseComplete?: (
    excercise: SetItemProps,
    id: string,
    { total, currentCompleted }: { total: number; currentCompleted: number },
  ) => void;
  onExcerciseRemove?: (excercise: SetItemProps, id: string) => void;
  disable?: boolean;
  onInputFocus?: (
    obj: RefObject<TextInput | null>,
    value: string,
    setValue: (nextValue: string) => void,
  ) => void;
  onInputBlur?: () => void;
}

type TrayExercise = SetItemProps & { trayId: string };

interface ExerciseRowProps {
  excercise: TrayExercise;
  index: number;
  activeIndex: number;
  total: number;
  workoutDayExerciseId: string;
  disable?: boolean;
  queueUpdateExerciseSetParams: (payload: Record<string, unknown>) => void;
  onExcerciseChange?: (excercise: SetItemProps, id: string) => void;
  onExcerciseComplete?: (
    excercise: SetItemProps,
    id: string,
    { total, currentCompleted }: { total: number; currentCompleted: number },
  ) => void;
  onExcerciseRemove?: (excercise: SetItemProps, id: string) => void;
  onInputFocus?: (
    obj: RefObject<TextInput | null>,
    value: string,
    setValue: (nextValue: string) => void,
  ) => void;
  onInputBlur?: () => void;
}

function calculateActiveIndex(sets: WorkoutWeekdaySet[]): number {
  let lastSequentialIndex = 0;
  for (let i = 0; i < sets.length; i++) {
    if (sets[i].completed) {
      lastSequentialIndex = i + 1;
    } else {
      break;
    }
  }
  return lastSequentialIndex;
}

function toSetItemProps(
  set: WorkoutWeekdaySet,
  index: number,
  trayId: string,
): TrayExercise {
  return {
    id: set.id,
    history: set.history,
    excerciseOrder: index === 0 ? "W" : index,
    maxInputValue: 500,
    initialState: (set.completed ? "done" : "progress") as SetState,
    input: { field1: String(set.parameter1), field2: String(set.parameter2) },
    trayId,
  };
}

const ExerciseRow = React.memo(function ExerciseRow(props: ExerciseRowProps) {
  const {
    excercise,
    index,
    activeIndex,
    total,
    workoutDayExerciseId,
    disable,
    queueUpdateExerciseSetParams,
    onExcerciseChange,
    onExcerciseComplete,
    onExcerciseRemove,
  } = props;

  return (
    <View style={styles.exerciseRow}>
      <SwipeableSet
        onInputFocus={props.onInputFocus}
        onInputBlur={props.onInputBlur}
        disabledSwipe={index === 0 || activeIndex > index}
        onSwipeEnd={() => {
          onExcerciseRemove?.(excercise, excercise.id);
        }}
        {...excercise}
        initialState={
          excercise.initialState === "done"
            ? "done"
            : index === activeIndex
              ? "current"
              : "progress"
        }
        onPress={(initialState, stateTransition) => {
          if (disable) return;
          if (index !== activeIndex) return;

          if (initialState === "current" || initialState === "progress") {
            stateTransition("done");
            const nextCompleted = activeIndex + 1;
            onExcerciseComplete?.(excercise, excercise.id, {
              total,
              currentCompleted: nextCompleted,
            });
          }

          onExcerciseChange?.(excercise, excercise.id);
        }}
        onInputChange={(field1, field2) => {
          queueUpdateExerciseSetParams({
            workoutDayExerciseId,
            parameter1: Number(field1),
            parameter2: Number(field2 ?? 0),
            setNumber: index + 1,
          });
        }}
        excerciseOrder={index === 0 ? "W" : index}
      />
    </View>
  );
}, areExerciseRowPropsEqual);

function areExerciseRowPropsEqual(
  prev: ExerciseRowProps,
  next: ExerciseRowProps,
) {
  return (
    prev.excercise.id === next.excercise.id &&
    prev.excercise.initialState === next.excercise.initialState &&
    prev.excercise.input.field1 === next.excercise.input.field1 &&
    prev.excercise.input.field2 === next.excercise.input.field2 &&
    prev.index === next.index &&
    prev.activeIndex === next.activeIndex &&
    prev.total === next.total &&
    prev.workoutDayExerciseId === next.workoutDayExerciseId &&
    prev.disable === next.disable
  );
}

export default function ExcerciseTray(props: ExcerciseTrayProps) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);

  const tray = useExcerciseStore(
    useCallback(
      (state) =>
        state.workoutByWeekdayByDay[props.day]?.trays.find(
          (t) => t.id === props.id,
        ) ?? null,
      [props.day, props.id],
    ),
  );

  const queueAddExerciseSet = useExcerciseStore((s) => s.queueAddExerciseSet);
  const queueUpdateExerciseSetParams = useExcerciseStore(
    (s) => s.queueUpdateExerciseSetParams,
  );

  const sets = useMemo(() => tray?.sets ?? [], [tray]);
  const activeIndex = calculateActiveIndex(sets);
  const totalExercises = sets.length;
  const workoutDayExerciseId = tray?.workoutDayExerciseId ?? props.id;

  const setItems = useMemo(
    () => sets.map((set, index) => toSetItemProps(set, index, props.id)),
    [sets, props.id],
  );

  const exerciseRows = useMemo(
    () =>
      setItems.map((excercise, index) => (
        <ExerciseRow
          onInputFocus={props.onInputFocus}
          onInputBlur={props.onInputBlur}
          key={excercise.id}
          excercise={excercise}
          index={index}
          activeIndex={activeIndex}
          total={totalExercises}
          workoutDayExerciseId={workoutDayExerciseId}
          disable={props.disable}
          queueUpdateExerciseSetParams={queueUpdateExerciseSetParams}
          onExcerciseChange={props.onExcerciseChange}
          onExcerciseComplete={props.onExcerciseComplete}
          onExcerciseRemove={props.onExcerciseRemove}
        />
      )),
    [
      setItems,
      activeIndex,
      totalExercises,
      workoutDayExerciseId,
      props.disable,
      props.onExcerciseChange,
      props.onExcerciseComplete,
      props.onExcerciseRemove,
      queueUpdateExerciseSetParams,
      props.onInputFocus,
      props.onInputBlur,
    ],
  );
  const [timerModalOpen, setTimerModalOpen] = useState<boolean>(false);
  const { incrementRestTime, restTime, decrementRestTime } =
    useExerciseSettings();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          setIsExpanded((current) => !current);
        }}
      >
        <Modal.Container visible={timerModalOpen}>
          <AdjustTimerModal
            currentValue={restTime}
            openState={timerModalOpen}
            setClose={() => setTimerModalOpen(false)}
            title="Adjust rest timer"
            exerciseTitle="Barbell Bench Press"
            caption="Rest 1:30–2:00 min between sets for maximum muscle growth. Take your time if needed"
            onIncrease={() => {
              incrementRestTime(30);
            }}
            onDecrease={() => {
              decrementRestTime(30);
            }}
            onDone={() => setTimerModalOpen(false)}
            step={30}
            image={null}
          />
        </Modal.Container>
        <ExcerciseTitle
          {...props.title}
          id={props.id}
          expanded={isExpanded}
          day={props.day}
        />
      </Pressable>
      <Accordion isExpanded={isExpanded}>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            width: "100%",
            flex: 1,
          }}
        >
          <HideableNote contextMenuId={props.id} />
        </View>
        <ColumnDescription {...props.description} />
        {exerciseRows}
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
              text={timeToString(restTime)}
              bgColor={Colors.general.color.darkTones.bgMiddle}
              textColor={Colors.general.color.grayTones.muted50}
              onPressIn={() => setTimerModalOpen(true)}
            />
          </View>
          <View style={styles.buttons}>
            <ScaledPressable scaleDuration={150} scaleTo={0.94}>
              <TextButton
                text={"Add Set"}
                onPressIn={() => {
                  const lastSet = sets[sets.length - 1];
                  const parameter1 = lastSet?.parameter1 ?? 0;
                  const parameter2 = lastSet?.parameter2 ?? 0;
                  const newSetId = Crypto.randomUUID();

                  queueAddExerciseSet({
                    workoutDayExerciseId,
                    id: newSetId,
                    parameter1,
                    parameter2,
                    metrics: { field1: parameter1, field2: parameter2 },
                    completed: false,
                    restSecondsActual: null,
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
