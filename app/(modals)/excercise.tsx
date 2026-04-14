import ScaledPressable from "@/components/animated/scaled-pressable";
import ExcerciseTray from "@/components/build-components/composite/excercise-tray";
import ResetTimer from "@/components/build-components/reset-timer";
import TextButton from "@/components/parts/text-button";
import { Colors, typography } from "@/constants/theme";
import useCurrentDay from "@/hooks/use-current-day";
import { completeExerciseSet } from "@/logic/api/update-exercise-set";
import {
  getWorkoutByWeekday,
  WorkoutByWeekdayResponse,
  WorkoutWeekdaySet,
} from "@/logic/api/exercises-by-weekday";
import { useExcerciseStore } from "@/store/excercise-store";
import { useExcerciseTimerStore } from "@/store/excercise-timer-store";
import { Day, DayEnum } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TopDescriptionProps {
  name: string;
  time: string;
  onTimePress?: () => void;
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

function TopDescription({
  name,
  time,
  onTimePress,
}: TopDescriptionProps): React.JSX.Element {
  return (
    <View style={{ gap: 24 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ maxHeight: 40, width: "auto" }}>
          <ScaledPressable scaleDuration={100} scaleTo={0.96}>
            <TextButton
              text={time}
              onPressIn={onTimePress}
              bgColor={Colors.general.color.darkTones.bgTray}
              textColor={Colors.general.color.grayTones.muted50}
            />
          </ScaledPressable>
        </View>
        <Text
          style={{
            ...typography.mediumL,
            color: Colors.general.color.grayTones.main,
          }}
        >
          {name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <View style={{ maxHeight: 40 }}>
            <ScaledPressable scaleDuration={200} scaleTo={0.94}>
              <TextButton
                text="Finish"
                bgColor={Colors.general.color.grayTones.main}
                textColor={Colors.general.color.darkTones.bg}
                onPressIn={() => router.back()}
              />
            </ScaledPressable>
          </View>
        </View>
      </View>
      <Text
        style={{
          ...typography.regularL,
          color: Colors.general.color.grayTones.muted40,
        }}
      >
        Add note
      </Text>
    </View>
  );
}

export default function ExcerciseModal() {
  const insets = useSafeAreaInsets();
  const currentDay = useCurrentDay();
  const params = useLocalSearchParams();
  const dayParam = Array.isArray(params.day) ? params.day[0] : params.day;
  const requestDayName: keyof typeof DayEnum =
    typeof dayParam === "string" &&
    (Object.values(DayEnum) as string[]).includes(dayParam)
      ? (dayParam as keyof typeof DayEnum)
      : currentDay.name;
  const modalHeaderOverlayHeight = insets.top + 22;
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(0);
  const [workoutData, setWorkoutData] =
    useState<WorkoutByWeekdayResponse | null>(null);
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(false);
  const { addExcercise, setTrayActiveIndex } = useExcerciseStore();
  const { currentRest, updateCurrentRest } = useExcerciseTimerStore();
  const timerOpacity = useSharedValue(0);

  const showOrHideTimer = (show: boolean) => {
    if (show) {
      updateCurrentRest(120);
      setTimerKey((k) => k + 1); // перемонтируем ResetTimer
      setTimerStarted(true);
      timerOpacity.value = withTiming(1, { duration: 220 });
    } else {
      timerOpacity.value = withTiming(0, { duration: 220 });
      setTimerStarted(false);
    }
  };

  useEffect(() => {
    let isActive = true;
    setIsLoadingWorkout(true);

    getWorkoutByWeekday(Day.fromString(requestDayName))
      .then((response) => {
        if (!isActive) return;
        setWorkoutData(response);
      })
      .catch((error) => {
        if (!isActive) return;
        console.warn("Failed to load weekday workout", error);
        setWorkoutData(null);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingWorkout(false);
      });

    return () => {
      isActive = false;
    };
  }, [requestDayName]);

  useEffect(() => {
    if (!workoutData || workoutData.isRestDay) {
      return;
    }

    useExcerciseStore.setState({ excercises: [], trayActiveIndex: {} });

    workoutData.trays.forEach((tray) => {
      tray.sets.forEach((set) => {
        addExcercise(
          {
            id: set.id,
            history: {
              firstText: set.history.firstText,
              secondText: set.history.secondText,
              delimiter: set.history.delimiter,
            },
            excerciseOrder: "W",
            maxInputValue: 500,
            initialState: set.completed ? "done" : "progress",
            input: {
              field1: String(set.parameter1),
              field2: String(set.parameter2),
            },
            trayId: tray.id,
          },
          tray.id,
        );
      });

      setTrayActiveIndex(tray.id, calculateActiveIndex(tray.sets));
    });
  }, [addExcercise, setTrayActiveIndex, workoutData]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.general.color.darkTones.bg,
        position: "relative",
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          zIndex: 10,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          opacity: timerOpacity,
        }}
      >
        <View style={{ maxWidth: 278 }}>
          <ResetTimer
            key={timerKey}
            decreaseAmount={15}
            increaseAmount={15}
            timeout={119}
            start={timerStarted}
            onTimeout={() => showOrHideTimer(false)}
            onTick={(timeLeft) => {
              if (timeLeft <= 0) return;
              updateCurrentRest(timeLeft);
            }}
          />
        </View>
      </Animated.View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 12,
          paddingTop: modalHeaderOverlayHeight,
          paddingBottom: 24 + insets.bottom,
          paddingHorizontal: 8,
        }}
      >
        <TopDescription
          name={workoutData?.description.workoutName ?? "Workout"}
          time={`${workoutData?.description.durationMinutes ?? 0}m`}
        />
        {isLoadingWorkout ? (
          <Text
            style={{
              ...typography.regularL,
              color: Colors.general.color.grayTones.muted40,
            }}
          >
            Loading workout...
          </Text>
        ) : workoutData?.isRestDay ? (
          <Text
            style={{
              ...typography.regularL,
              color: Colors.general.color.grayTones.muted40,
            }}
          >
            Rest day
          </Text>
        ) : (
          workoutData?.trays.map((tray) => (
            <ExcerciseTray
              key={tray.id}
              id={tray.id}
              description={{ items: tray.description.items }}
              disable={timerStarted}
              history={{
                color: Colors.general.color.grayTones.muted40,
                delimiter: tray.history.delimiter,
                firstText: tray.history.firstText,
                secondText: tray.history.secondText,
              }}
              title={{
                backgroundColor: "#1A1A1A",
                icon1Click: () => {},
                icon2Click: () => {},
                iconsColor: "#262626",
                type: tray.title.type,
                expanded: true,
                title: tray.title.title,
              }}
              onExcerciseChange={(_, id) => {
                console.log(`Excercise with id ${id} changed`);
              }}
              onExcerciseComplete={(_, id, { currentCompleted, total }) => {
                console.log(
                  `Excercise completed. Progress: ${currentCompleted} / ${total}`,
                );
                const resolvedWorkoutDayExerciseId =
                  tray.workoutDayExerciseId ?? tray.id;

                void completeExerciseSet({
                  workoutDayExerciseId: resolvedWorkoutDayExerciseId,
                  setNumber: currentCompleted,
                  metrics: {
                    sourceSetId: id,
                  },
                  completed: true,
                  restSecondsActual: currentRest,
                }).catch((error) => {
                  console.warn("Failed to send completed exercise set", error);
                });
                showOrHideTimer(true);
              }}
              onExcerciseRemove={(_, id) => {
                console.log(`Excercise with id ${id} removed`);
              }}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
