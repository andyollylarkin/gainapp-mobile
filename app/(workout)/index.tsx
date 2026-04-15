import ExcerciseItem, {
  ExcerciseItemProps,
} from "@/components/build-components/composite/excercise-item";
import WorkoutPageDesc from "@/components/build-components/composite/workoutpage-desc";
import DayPicker from "@/components/build-components/day-picker";
import GainLogo from "@/components/icons/gain-logo";
import PlayIcon from "@/components/icons/play";
import SliderButton from "@/components/parts/slider-button";
import { Colors, typography } from "@/constants/theme";
import useApiReached from "@/hooks/use-api-reached";
import useCurrentDay from "@/hooks/use-current-day";
import useNetworkConnected from "@/hooks/use-network-connected";
import { useSyncQueue } from "@/hooks/use-sync-queue";
import {
  getWorkoutOverviewByDay,
  WorkoutOverviewResponse,
} from "@/logic/api/ex-description";
import { getWorkoutByWeekday } from "@/logic/api/exercises-by-weekday";
import { generateAiWorkout } from "@/logic/api/generate-ai";
import { useExcerciseStore } from "@/store/excercise-store";
import { Day } from "@/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SNAP_ITEM_HEIGHT = 86;
const ITEM_GAP = 2;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const currentDay = useCurrentDay();
  const [currentDaySelected, setCurrentDay] = useState<Day>(currentDay);
  const [overview, setOverview] = useState<WorkoutOverviewResponse | null>(
    null,
  );
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
  const {
    getWorkoutOverviewForDay,
    setWorkoutOverviewForDay,
    setWorkoutByWeekdayForDay,
  } = useExcerciseStore();

  useSyncQueue();

  const contentTopOffset = insets.top + 30 + 24;
  const snapStep = SNAP_ITEM_HEIGHT + ITEM_GAP;

  useEffect(() => {
    let isActive = true;

    setOverview(getWorkoutOverviewForDay(currentDaySelected.name));
    setIsLoadingOverview(true);

    getWorkoutOverviewByDay(currentDaySelected)
      .then((response) => {
        if (!isActive) return;
        setOverview(response);
        setWorkoutOverviewForDay(currentDaySelected.name, response);

        void getWorkoutByWeekday(currentDaySelected)
          .then((weekdayWorkout) => {
            if (!isActive) return;
            setWorkoutByWeekdayForDay(currentDaySelected.name, weekdayWorkout);
          })
          .catch((weekdayError) => {
            if (!isActive) return;
            console.warn("Failed to cache weekday workout", weekdayError);
          });
      })
      .catch((error) => {
        console.warn("Failed to load workout overview", error);
        if (!isActive) return;
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingOverview(false);
      });

    return () => {
      isActive = false;
    };
  }, [
    currentDaySelected,
    getWorkoutOverviewForDay,
    setWorkoutOverviewForDay,
    setWorkoutByWeekdayForDay,
  ]);

  const items: ExcerciseItemProps[] = (overview?.exercises ?? []).map(
    (exercise) => ({
      excerciseName: exercise.excerciseName,
      reps: exercise.reps,
      sets: exercise.sets,
      id: exercise.id,
    }),
  );

  const snapOffsets = items.map(
    (_, index) => index * snapStep + (contentTopOffset - 8),
  );

  const handleGenerateWorkout = async () => {
    if (isGeneratingWorkout) {
      return;
    }

    setIsGeneratingWorkout(true);
    try {
      const generatedOverview = await generateAiWorkout();
      setOverview(generatedOverview);
      setWorkoutOverviewForDay(currentDaySelected.name, generatedOverview);

      const weekdayWorkout = await getWorkoutByWeekday(currentDaySelected);
      setWorkoutByWeekdayForDay(currentDaySelected.name, weekdayWorkout);
    } catch (error) {
      console.warn("Failed to generate AI workout", error);
    } finally {
      setIsGeneratingWorkout(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.general.color.darkTones.bg,
      }}
    >
      <ScrollView
        scrollsToTop
        snapToAlignment="start"
        snapToOffsets={snapOffsets}
        disableIntervalMomentum
        decelerationRate="fast"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 20,
          paddingBottom: 24,
          paddingHorizontal: 8,
          alignItems: "center",
          gap: ITEM_GAP,
        }}
      >
        <View style={{ marginBottom: 22 }}>
          <DayPicker
            currentDay={currentDaySelected}
            onDaySelect={(day) => setCurrentDay(day)}
          />
        </View>
        {isLoadingOverview && !overview ? (
          <Text
            style={{
              ...typography.regularL,
              color: Colors.general.color.grayTones.muted40,
            }}
          >
            Loading...
          </Text>
        ) : overview?.isRestDay ? (
          <RestDayContent />
        ) : overview ? (
          <WorkoutContent
            items={items}
            description={overview?.description}
            selectedDay={currentDaySelected}
          />
        ) : (
          <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
            <GenerateContent
              onGenerate={handleGenerateWorkout}
              isGenerating={isGeneratingWorkout}
            />
          </View>
        )}
        {overview && !overview.isRestDay && (
          <Text
            style={{
              ...typography.regularS,
              color: "#5E5E62",
              textAlign: "center",
              maxWidth: 260,
              marginTop: 12,
            }}
          >
            We will progressively increase the load in your workout
          </Text>
        )}
      </ScrollView>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          alignItems: "center",
          padding: 24,
        }}
      >
        <View style={{ width: 248 }}>
          {overview && (
            <SliderButton<"Go to next workout" | "Start today's workout">
              color={
                currentDay === currentDaySelected && !overview.isRestDay
                  ? Colors.general.color.grayTones.main
                  : Colors.general.color.darkTones.bgLight
              }
              textColor={
                currentDay === currentDaySelected && !overview.isRestDay
                  ? Colors.general.color.darkTones.bg
                  : Colors.general.color.grayTones.main
              }
              text={
                currentDay === currentDaySelected && !overview.isRestDay
                  ? "Start today's workout"
                  : "Go to next workout"
              }
              onHoldEnd={() => {
                if (currentDay === currentDaySelected && items.length > 0) {
                  router.push(
                    `/(modals)/excercise?id=${items[0].id}&day=${currentDaySelected.name}`,
                  );
                } else {
                  setCurrentDay((prev) => prev.nextDay());
                }
              }}
              onHoldStart={() => console.log("Hold start")}
              holdDuration={
                !currentDay || !currentDaySelected ? 1500 : 1500 / 2
              }
              holdOverlayColor="#808080"
              icon={
                <PlayIcon
                  width={20}
                  height={20}
                  color={
                    currentDay === currentDaySelected && !overview.isRestDay
                      ? Colors.general.color.darkTones.bg
                      : Colors.general.color.grayTones.main
                  }
                />
              }
            />
          )}
        </View>
      </View>
    </View>
  );
}

function GenerateContent({
  onGenerate,
  isGenerating,
}: {
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          gap: 6,
          alignItems: "center",
          justifyContent: "flex-start",
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
            wordWrap: "break-word",
            maxWidth: 270,
          }}
        >
          You can generate workout with Ai or add exercises manually
        </Text>
      </View>
      <View style={{ flexDirection: "column", gap: 12 }}>
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
        <Text
          style={{
            ...typography.mediumM,
            color: Colors.general.color.grayTones.muted40,
            textAlign: "center",
          }}
        >
          Add exercise
        </Text>
      </View>
    </View>
  );
}

function RestDayContent() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Text
        style={{
          ...typography.mediumL,
          color: Colors.general.color.grayTones.main,
          textAlign: "left",
        }}
      >
        Rest day
      </Text>
      <Text
        style={{
          ...typography.regularL,
          color: Colors.general.color.grayTones.muted40,
          textAlign: "left",
        }}
      >
        Go touch some grass
      </Text>
    </View>
  );
}

function WorkoutContent({
  items,
  description,
  selectedDay,
}: {
  items: ExcerciseItemProps[];
  description?: WorkoutOverviewResponse["description"];
  selectedDay: Day;
}) {
  const len = items.length;
  const { pendingSyncActions } = useExcerciseStore();
  const { isReached: isConnected } = useApiReached();

  return (
    <>
      <View
        style={{
          width: "100%",
          paddingHorizontal: 12,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "red" }}>{pendingSyncActions.length}</Text>
        <Text style={{ color: "red" }}>
          {isConnected ? "Online" : "Offline"}
        </Text>
        <WorkoutPageDesc
          workoutName={description?.workoutName ?? "Workout"}
          excercisesCount={description?.excercisesCount ?? items.length}
          durationMinutes={description?.durationMinutes ?? 0}
        />
      </View>

      {items.map((item, index) => (
        <ExcerciseItem
          key={item.id}
          {...item}
          onClick={(id) => {
            router.push(`/(modals)/excercise?id=${id}&day=${selectedDay.name}`);
          }}
          radiusTop={index === 0 ? 24 : 6}
          radiusBottom={index === len - 1 ? 24 : 6}
        />
      ))}
    </>
  );
}
