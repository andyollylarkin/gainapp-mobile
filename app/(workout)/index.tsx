import ExcerciseItem, {
  ExcerciseItemProps,
} from "@/components/build-components/composite/excercise-item";
import WorkoutPageDesc from "@/components/build-components/composite/workoutpage-desc";
import DayPicker from "@/components/build-components/day-picker";
import PlayIcon from "@/components/icons/play";
import SliderButton from "@/components/parts/slider-button";
import { Colors, typography } from "@/constants/theme";
import useCurrentDay from "@/hooks/use-current-day";
import { useSyncQueue } from "@/hooks/use-sync-queue";
import { useWorkoutData } from "@/hooks/use-workout-data";
import {
  getWorkoutOverviewByDay,
  WorkoutOverviewResponse,
} from "@/logic/api/ex-description";
import { useExcerciseStore } from "@/store/excercise-store";
import { useDayStore } from "@/store/day-store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SNAP_ITEM_HEIGHT = 86;
const ITEM_GAP = 2;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const currentDay = useCurrentDay();
  const { selectedDay, setSelectedDay } = useDayStore();
  const currentDaySelected = selectedDay ?? currentDay;
  const setCurrentDay = setSelectedDay;
  const [overview, setOverview] = useState<WorkoutOverviewResponse | null>(
    null,
  );
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  const { getWorkoutOverviewForDay, setWorkoutOverviewForDay } =
    useExcerciseStore();
  const { workout: workoutByWeekday } = useWorkoutData(currentDaySelected);

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
      })
      .catch((error) => {
        if (!isActive) return;
        console.warn("Failed to load workout overview", error);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingOverview(false);
      });

    return () => {
      isActive = false;
    };
  }, [currentDaySelected, getWorkoutOverviewForDay, setWorkoutOverviewForDay]);

  const items: ExcerciseItemProps[] = workoutByWeekday
    ? workoutByWeekday.trays.map((tray) => ({
        excerciseName: tray.title.title,
        sets: tray.sets.length,
        reps: tray.sets[0]?.parameter2 ?? 0,
        id: tray.id,
      }))
    : (overview?.exercises ?? []).map((exercise) => ({
        excerciseName: exercise.excerciseName,
        reps: exercise.reps,
        sets: exercise.sets,
        id: exercise.id,
      }));

  const snapOffsets = items.map(
    (_, index) => index * snapStep + (contentTopOffset - 8),
  );


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
          <WorkoutContent items={items} description={overview?.description} />
        ) : null}
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
                currentDay.equals(currentDaySelected) && !overview.isRestDay
                  ? Colors.general.color.grayTones.main
                  : Colors.general.color.darkTones.bgLight
              }
              textColor={
                currentDay.equals(currentDaySelected) && !overview.isRestDay
                  ? Colors.general.color.darkTones.bg
                  : Colors.general.color.grayTones.main
              }
              text={
                currentDay.equals(currentDaySelected) && !overview.isRestDay
                  ? "Start today's workout"
                  : "Go to next workout"
              }
              onHoldEnd={() => {
                if (currentDay.equals(currentDaySelected)) {
                  router.push(
                    `/(modals)/excercise?id=${items[0]?.id}&day=${currentDaySelected.name}`,
                  );
                } else {
                  setCurrentDay(currentDaySelected.nextDay());
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
                    currentDay.equals(currentDaySelected) && !overview.isRestDay
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
}: {
  items: ExcerciseItemProps[];
  description?: WorkoutOverviewResponse["description"];
}) {
  const len = items.length;

  return (
    <>
      <View
        style={{
          width: "100%",
          paddingHorizontal: 12,
          marginBottom: 12,
        }}
      >
        <WorkoutPageDesc
          workoutName={description?.workoutName ?? "Workout"}
          excercisesCount={items.length}
          durationMinutes={description?.durationMinutes ?? 0}
        />
      </View>

      {items.map((item, index) => (
        <ExcerciseItem
          key={item.id}
          {...item}
          onClick={(id) => {
            router.push(`/(info_modals)/info?title=Barbell`);
          }}
          radiusTop={index === 0 ? 24 : 6}
          radiusBottom={index === len - 1 ? 24 : 6}
        />
      ))}
    </>
  );
}
