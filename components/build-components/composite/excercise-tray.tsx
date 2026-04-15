import ScaledPressable from "@/components/animated/scaled-pressable";
import { HistoryTextProps } from "@/components/history-text";
import TimerIcon from "@/components/icons/timer";
import Accordion from "@/components/parts/accordion";
import TextButton from "@/components/parts/text-button";
import { Colors } from "@/constants/theme";
import { useExcerciseStore } from "@/store/excercise-store";
import { debounce } from "@/utils/debounce";
import React, { useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  unstable_batchedUpdates,
} from "react-native";
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

type TrayExercise = SetItemProps & { trayId: string };

interface ExerciseRowProps {
  excercise: TrayExercise;
  index: number;
  activeIndex: number;
  total: number;
  trayId: string;
  disable?: boolean;
  updateExcercise: (
    id: string,
    updatedExcercise: Partial<TrayExercise>,
    trayId: string,
  ) => void;
  removeExcercise: (id: string, trayId: string) => void;
  setTrayActiveIndex: (id: string, activeIndex: number) => void;
  onExcerciseChange?: (excercise: SetItemProps, id: string) => void;
  onExcerciseComplete?: (
    excercise: SetItemProps,
    id: string,
    { total, currentCompleted }: { total: number; currentCompleted: number },
  ) => void;
  onExcerciseRemove?: (excercise: SetItemProps, id: string) => void;
  updateSetParams: (
    f1: string,
    f2: string | null,
    id: string,
    setNumber?: string | number,
  ) => void;
}

const ExerciseRow = React.memo(function ExerciseRow(props: ExerciseRowProps) {
  const {
    excercise,
    index,
    activeIndex,
    total,
    trayId,
    disable,
    updateExcercise,
    removeExcercise,
    setTrayActiveIndex,
    onExcerciseChange,
    onExcerciseComplete,
    onExcerciseRemove,
    updateSetParams,
  } = props;

  return (
    <View style={styles.exerciseRow}>
      <SwipeableSet
        disabledSwipe={index === 0 || activeIndex > index}
        onSwipeEnd={() => {
          onExcerciseChange?.(excercise, excercise.id);
          onExcerciseRemove?.(excercise, excercise.id);
          removeExcercise(excercise.id, trayId);
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

            unstable_batchedUpdates(() => {
              setTrayActiveIndex(trayId, nextCompleted);
              updateExcercise(excercise.id, { initialState: "done" }, trayId);
            });

            onExcerciseComplete?.(excercise, excercise.id, {
              total,
              currentCompleted: nextCompleted,
            });
          }

          onExcerciseChange?.(excercise, excercise.id);
        }}
        onInputChange={(field1, field2) => {
          updateExcercise(
            excercise.id,
            {
              input: { field1, field2 },
            },
            trayId,
          );
          const setNumber = index + 1;
          updateSetParams(field1, field2, trayId, setNumber);
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
    prev.excercise === next.excercise &&
    prev.index === next.index &&
    prev.activeIndex === next.activeIndex &&
    prev.total === next.total &&
    prev.trayId === next.trayId &&
    prev.disable === next.disable
  );
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
    queueAddExerciseSet,
    queueUpdateExerciseSetParams,
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
  const activeIndex = getActiveIndex(props.id);
  const totalExercises = trayExcercises.length;

  const updateSetParams = useMemo<
    (
      f1: string,
      f2: string | null,
      id: string,
      setNumber?: string | number,
    ) => void
  >(() => {
    return debounce(
      async (
        f1: string,
        f2: string | null,
        id: string,
        setNumber?: string | number,
      ) => {
        if (setNumber === "W") setNumber = 1;

        queueUpdateExerciseSetParams({
          workoutDayExerciseId: id,
          parameter1: Number(f1),
          parameter2: Number(f2 ?? 0),
          setNumber: Number(setNumber),
        });
      },
      800,
    ) as (
      f1: string,
      f2: string | null,
      id: string,
      setNumber?: string | number,
    ) => void;
  }, [queueUpdateExerciseSetParams]);

  const exerciseRows = useMemo(
    () =>
      trayExcercises.map((excercise, index) => (
        <ExerciseRow
          key={excercise.id}
          excercise={excercise}
          index={index}
          activeIndex={activeIndex}
          total={totalExercises}
          trayId={props.id}
          disable={props.disable}
          updateExcercise={updateExcercise}
          removeExcercise={removeExcercise}
          setTrayActiveIndex={setTrayActiveIndex}
          onExcerciseChange={props.onExcerciseChange}
          onExcerciseComplete={props.onExcerciseComplete}
          onExcerciseRemove={props.onExcerciseRemove}
          updateSetParams={updateSetParams}
        />
      )),
    [
      trayExcercises,
      activeIndex,
      totalExercises,
      props.id,
      props.disable,
      props.onExcerciseChange,
      props.onExcerciseComplete,
      props.onExcerciseRemove,
      updateExcercise,
      removeExcercise,
      setTrayActiveIndex,
      updateSetParams,
    ],
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
                  const previousSet =
                    trayExcercises[trayExcercises.length - 1] ?? fallbackSet;
                  const previousInput = {
                    field1: previousSet.input.field1 ?? "0",
                    field2: previousSet.input.field2 ?? "0",
                  };
                  const parameter1 = Number(previousInput.field1) || 0;
                  const parameter2 = Number(previousInput.field2) || 0;

                  const nextExcercise = {
                    ...createDefaultExcercise(previousSet),
                    input: previousInput,
                    trayId: props.id,
                  };
                  addExcercise(nextExcercise, props.id);

                  queueAddExerciseSet({
                    workoutDayExerciseId: props.id,
                    id: nextExcercise.id,
                    parameter1,
                    parameter2,
                    metrics: {
                      field1: parameter1,
                      field2: parameter2,
                    },
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
