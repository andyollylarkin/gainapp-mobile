import ExcerciseItem, {
  ExcerciseItemProps,
} from "@/components/build-components/composite/excercise-item";
import WorkoutPageDesc from "@/components/build-components/composite/workoutpage-desc";
import DayPicker from "@/components/build-components/day-picker";
import PlayIcon from "@/components/icons/play";
import SliderButton from "@/components/parts/slider-button";
import { Colors, typography } from "@/constants/theme";
import useCurrentDay from "@/hooks/use-current-day";
import { Day } from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SNAP_ITEM_HEIGHT = 86;
const ITEM_GAP = 2;

function dayCompare(day1: Day, day2: Day): number {
  const dayOrder: Day[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const idx1 = dayOrder.indexOf(day1);
  const idx2 = dayOrder.indexOf(day2);
  if (idx1 < idx2) return -1;
  if (idx1 === idx2) return 0;
  return 1;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const currentDay = useCurrentDay();
  const [currentDaySelected, setCurrentDay] = useState<Day>(currentDay);

  const contentTopOffset = insets.top + 30 + 24;
  const snapStep = SNAP_ITEM_HEIGHT + ITEM_GAP;

  const items: ExcerciseItemProps[] = [
    { excerciseName: "Running", reps: 5, sets: 4, id: "1" },
    { excerciseName: "Push-ups", reps: 10, sets: 3, id: "2" },
    { excerciseName: "Squats", reps: 15, sets: 4, id: "3" },
    { excerciseName: "Plank", reps: 60, sets: 3, id: "4" },
    { excerciseName: "Jumping Jacks", reps: 20, sets: 4, id: "5" },
  ];

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
        {dayCompare(currentDaySelected, currentDay) === -1 ||
        dayCompare(currentDaySelected, currentDay) === 0 ? (
          <WorkoutContent items={items} />
        ) : (
          <RestDayContent />
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
          <SliderButton<
            | "Go to next workout"
            | "Start today's workout"
            | "Set as today’s workout"
          >
            color={Colors.general.color.grayTones.main}
            textColor={Colors.general.color.darkTones.bg}
            text="Go to next workout"
            onHoldEnd={() => {}}
            onHoldStart={() => {}}
            holdDuration={1500}
            holdOverlayColor="#808080"
            icon={
              <PlayIcon
                width={20}
                height={20}
                color={Colors.general.color.darkTones.bg}
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

function WorkoutContent({ items }: { items: ExcerciseItemProps[] }) {
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
          workoutName="Push workout"
          excercisesCount={items.length}
          durationMinutes={60}
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
