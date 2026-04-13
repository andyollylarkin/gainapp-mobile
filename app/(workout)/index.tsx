import ExcerciseItem, {
  ExcerciseItemProps,
} from "@/components/build-components/composite/excercise-item";
import WorkoutPageDesc from "@/components/build-components/composite/workoutpage-desc";
import DayPicker from "@/components/build-components/day-picker";
import PlayIcon from "@/components/icons/play";
import SliderButton from "@/components/parts/slider-button";
import { Colors, typography } from "@/constants/theme";
import useCurrentDay from "@/hooks/use-current-day";
import {
  getWorkoutOverviewByDay,
  WorkoutOverviewResponse,
} from "@/logic/api/ex-description";
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

  const contentTopOffset = insets.top + 30 + 24;
  const snapStep = SNAP_ITEM_HEIGHT + ITEM_GAP;

  useEffect(() => {
    let isActive = true;

    setIsLoadingOverview(true);

    getWorkoutOverviewByDay(currentDaySelected)
      .then((response) => {
        if (!isActive) return;
        setOverview(response);
      })
      .catch((error) => {
        console.warn("Failed to load workout overview", error);
        if (!isActive) return;
        setOverview(null);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingOverview(false);
      });

    return () => {
      isActive = false;
    };
  }, [currentDaySelected]);

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
        {isLoadingOverview ? (
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
        ) : (
          <WorkoutContent items={items} description={overview?.description} />
        )}
        {currentDaySelected === currentDay && (
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
          <SliderButton<"Go to next workout" | "Start today's workout">
            color={
              currentDay === currentDaySelected
                ? Colors.general.color.grayTones.main
                : Colors.general.color.darkTones.bgLight
            }
            textColor={
              currentDay === currentDaySelected
                ? Colors.general.color.darkTones.bg
                : Colors.general.color.grayTones.main
            }
            text={
              currentDay === currentDaySelected
                ? "Start today's workout"
                : "Go to next workout"
            }
            onHoldEnd={() => {
              if (currentDay === currentDaySelected && items.length > 0) {
                router.push(`/(modals)/excercise?id=${items[0].id}`);
              }
            }}
            onHoldStart={() => console.log("Hold start")}
            holdDuration={1500}
            holdOverlayColor="#808080"
            icon={
              <PlayIcon
                width={20}
                height={20}
                color={
                  currentDay === currentDaySelected
                    ? Colors.general.color.darkTones.bg
                    : Colors.general.color.grayTones.main
                }
              />
            }
          />
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
          excercisesCount={description?.excercisesCount ?? items.length}
          durationMinutes={description?.durationMinutes ?? 0}
        />
      </View>

      {items.map((item, index) => (
        <ExcerciseItem
          key={item.id}
          {...item}
          onClick={(id) => {
            router.push(`/(modals)/excercise?id=${id}`);
          }}
          radiusTop={index === 0 ? 24 : 6}
          radiusBottom={index === len - 1 ? 24 : 6}
        />
      ))}
    </>
  );
}
