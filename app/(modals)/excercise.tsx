import ScaledPressable from "@/components/animated/scaled-pressable";
import ExcerciseCustomKeyboard from "@/components/build-components/composite/excercise-custom-keyboard";
import ExcerciseTray from "@/components/build-components/composite/excercise-tray";
import ResetTimer from "@/components/build-components/reset-timer";
import GainLogo from "@/components/icons/gain-logo";
import SliderButton from "@/components/parts/slider-button";
import TextButton from "@/components/parts/text-button";
import { Colors, typography } from "@/constants/theme";
import useCurrentDay from "@/hooks/use-current-day";
import { useWorkoutData } from "@/hooks/use-workout-data";
import { generateAiWorkout } from "@/logic/api/generate-ai";
import { useExcerciseStore } from "@/store/excercise-store";
import { useExcerciseTimerStore } from "@/store/excercise-timer-store";
import { Day, DayEnum } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { RefObject, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TopDescriptionProps {
  name: string;
  time: string;
  onTimePress?: () => void;
}

function EmptyWorkoutContent({
  isGenerating,
  onGenerate,
  day,
  showGenerateBtn,
}: {
  isGenerating: boolean;
  onGenerate: () => void;
  showGenerateBtn: boolean | undefined;
  day: string;
}) {
  if (!showGenerateBtn) {
    return (
      <Pressable
        onPress={() =>
          router.push(`/(add_ex_modals)/add_ex?day=${day}&trayId=${""}`)
        }
      >
        <Text
          style={{
            ...typography.mediumM,
            color: Colors.general.color.grayTones.muted40,
            textAlign: "center",
          }}
        >
          Add exercise
        </Text>
      </Pressable>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        gap: 24,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          gap: 6,
          alignItems: "center",
          alignSelf: "center",
          maxWidth: 248,
        }}
      >
        <Text
          style={{
            ...typography.mediumL,
            color: Colors.general.color.grayTones.main,
            textAlign: "center",
          }}
        >
          No exercises here yet
        </Text>
        <Text
          style={{
            ...typography.regularM,
            color: Colors.general.color.grayTones.muted40,
            textAlign: "center",
          }}
          numberOfLines={2}
        >
          You can generate workout with Ai or add exercises manually
        </Text>
      </View>
      <View style={{ gap: 12, alignItems: "center" }}>
        <View style={{ width: "100%", maxWidth: 248 }}>
          <SliderButton
            color={Colors.general.color.grayTones.main}
            textColor={Colors.general.color.darkTones.bg}
            text={isGenerating ? "Generating..." : "Generate Workout"}
            holdDuration={0}
            onHoldStart={() => {}}
            onHoldEnd={onGenerate}
            icon={
              <GainLogo
                width={20}
                height={20}
                color={Colors.general.color.darkTones.bg}
                secondaryColor={Colors.general.color.grayTones.main}
              />
            }
            holdOverlayColor={Colors.general.color.grayTones.main}
          />
        </View>
        <Pressable
          onPress={() =>
            router.push(`/(add_ex_modals)/add_ex?day=${day}&trayId=${""}`)
          }
        >
          <Text
            style={{
              ...typography.mediumM,
              color: Colors.general.color.grayTones.muted40,
              textAlign: "center",
            }}
          >
            Add exercise
          </Text>
        </Pressable>
      </View>
    </View>
  );
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
  const { workout: workoutData, isLoading: isLoadingWorkout } = useWorkoutData(
    Day.fromString(requestDayName),
  );
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

  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
  const { setWorkoutOverviewForDay } = useExcerciseStore();

  const handleGenerateWorkout = async () => {
    if (isGeneratingWorkout) return;

    setIsGeneratingWorkout(true);
    try {
      const generatedOverview = await generateAiWorkout();
      setWorkoutOverviewForDay(requestDayEnum as DayEnum, generatedOverview);
    } catch (error) {
      console.warn("Failed to generate AI workout", error);
    } finally {
      setIsGeneratingWorkout(false);
    }
  };

  useEffect(() => {
    return () => {
      if (blurHideTimeoutRef.current) {
        clearTimeout(blurHideTimeoutRef.current);
      }
    };
  }, []);

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
          flexGrow: 1,
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
              day={requestDayEnum}
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
                workoutDayExerciseId: tray.workoutDayExerciseId,
                day: requestDayEnum,
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
        <EmptyWorkoutContent
          showGenerateBtn={
            workoutData?.trays?.length === undefined ||
            workoutData.trays.length === 0
              ? true
              : false
          }
          isGenerating={isGeneratingWorkout}
          onGenerate={handleGenerateWorkout}
          day={requestDayEnum}
        />
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
