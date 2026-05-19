import ScaledPressable from "@/components/animated/scaled-pressable";
import AdjustTimerModal from "@/components/build-components/composite/adjust-timer-modal";
import ExcerciseCustomKeyboard from "@/components/build-components/composite/excercise-custom-keyboard";
import ExcerciseTray from "@/components/build-components/composite/excercise-tray";
import Modal from "@/components/build-components/composite/modal";
import ResetTimer from "@/components/build-components/reset-timer";
import TextButton from "@/components/parts/text-button";
import { Colors, typography } from "@/constants/theme";
import useCurrentDay from "@/hooks/use-current-day";
import {
  getWorkoutByWeekday,
  WorkoutByWeekdayResponse,
  WorkoutWeekdaySet,
} from "@/logic/api/exercises-by-weekday";
import { useExcerciseStore } from "@/store/excercise-store";
import { useExcerciseTimerStore } from "@/store/excercise-timer-store";
import { Day, DayEnum } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { RefObject, useEffect, useRef, useState } from "react";
import { ScrollView, Text, TextInput, View, Image } from "react-native";
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
    <View style={{ gap: 24, position: "relative" }}>
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
  const requestDayEnum = Day.fromString(requestDayName).name;
  const modalHeaderOverlayHeight = insets.top + 22;
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(0);
  const [workoutData, setWorkoutData] =
    useState<WorkoutByWeekdayResponse | null>(null);
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(false);
  const queueCompleteExerciseSet = useExcerciseStore(
    (state) => state.queueCompleteExerciseSet,
  );
  const queueDeleteExerciseSet = useExcerciseStore(
    (state) => state.queueDeleteExerciseSet,
  );
  const currentRest = useExcerciseTimerStore((state) => state.currentRest);
  const updateCurrentRest = useExcerciseTimerStore(
    (state) => state.updateCurrentRest,
  );
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

  const currentSetValueRef = useRef<((next: string) => void) | null>(null);
  const focusedInputRef = useRef<RefObject<TextInput | null> | null>(null);
  const currentValueRef = useRef<string>("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const blurHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyInputValue = (nextValue: string) => {
    currentValueRef.current = nextValue;
    currentSetValueRef.current?.(nextValue);
  };

  const appendInputValue = (val?: string | number) => {
    const chunk = String(val ?? "");

    if (!chunk) return;

    const nextValue = `${currentValueRef.current}${chunk}`;
    applyInputValue(nextValue);
  };

  const removeLastInputChar = () => {
    const nextValue = currentValueRef.current.slice(0, -1);
    applyInputValue(nextValue);
  };

  const hideCustomKeyboard = () => {
    if (blurHideTimeoutRef.current) {
      clearTimeout(blurHideTimeoutRef.current);
      blurHideTimeoutRef.current = null;
    }

    setIsKeyboardVisible(false);
    focusedInputRef.current?.current?.blur();
    focusedInputRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (blurHideTimeoutRef.current) {
        clearTimeout(blurHideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    const cachedWorkout = useExcerciseStore
      .getState()
      .getWorkoutByWeekdayForDay(requestDayEnum);
    setWorkoutData(cachedWorkout);
    setIsLoadingWorkout(true);

    getWorkoutByWeekday(Day.fromString(requestDayName))
      .then((response) => {
        if (!isActive) return;

        // Keep local unsynced progress if cached data for this day already exists.
        if (!cachedWorkout) {
          setWorkoutData(response);
          useExcerciseStore
            .getState()
            .setWorkoutByWeekdayForDay(requestDayEnum, response);
        }
      })
      .catch((error) => {
        if (!isActive) return;
        console.warn("Failed to load weekday workout", error);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingWorkout(false);
      });

    return () => {
      isActive = false;
    };
  }, [requestDayName, requestDayEnum]);

  useEffect(() => {
    if (!workoutData || workoutData.isRestDay) {
      return;
    }

    const { addExcercise, setTrayActiveIndex } = useExcerciseStore.getState();

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
  }, [workoutData]);

  const [modalOpen, setModalOpen] = useState<boolean>(true);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.general.color.darkTones.bg,
        position: "relative",
      }}
    >
      <Modal.Container>
        <AdjustTimerModal
          onDone={() => {}}
          currentValue={0}
          openState={modalOpen}
          setClose={() => setModalOpen(false)}
          title="Adjust rest timer"
          exerciseTitle="Barbell Bench Press"
          step={1}
          image={null}
          caption="Rest 1:30–2:00 min between sets for maximum muscle growth. Take your time if needed"
          onDecrease={(val) => console.log("VAL DEC", val)}
          onIncrease={(val) => console.log("VAL INC:", val)}
        />
      </Modal.Container>
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

        {isLoadingWorkout && !workoutData ? (
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
          workoutData?.trays.map((tray, idx) => (
            <ExcerciseTray
              onInputFocus={(obj, value, setValue) => {
                if (blurHideTimeoutRef.current) {
                  clearTimeout(blurHideTimeoutRef.current);
                  blurHideTimeoutRef.current = null;
                }

                currentSetValueRef.current = setValue;
                currentValueRef.current = value;
                focusedInputRef.current = obj;
                setIsKeyboardVisible(true);
              }}
              onInputBlur={() => {
                blurHideTimeoutRef.current = setTimeout(() => {
                  setIsKeyboardVisible(false);
                  focusedInputRef.current = null;
                }, 80);
              }}
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
                id: tray.id,
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

                queueCompleteExerciseSet({
                  workoutDayExerciseId: resolvedWorkoutDayExerciseId,
                  setNumber: currentCompleted,
                  metrics: {
                    sourceSetId: id,
                  },
                  completed: true,
                  restSecondsActual: currentRest,
                });
                showOrHideTimer(true);
              }}
              onExcerciseRemove={(_, id) => {
                queueDeleteExerciseSet({ id });
              }}
            />
          ))
        )}
      </ScrollView>
      <ExcerciseCustomKeyboard
        visible={isKeyboardVisible}
        onAppend={appendInputValue}
        onBackspace={removeLastInputChar}
        onHide={hideCustomKeyboard}
      />
    </View>
  );
}
