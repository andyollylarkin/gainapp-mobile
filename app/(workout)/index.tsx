import ExcerciseItem, {
  ExcerciseItemProps,
} from "@/components/build-components/composite/excercise-item";
import WorkoutPageDesc from "@/components/build-components/composite/workoutpage-desc";
import DayPicker from "@/components/build-components/day-picker";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const dayPickerTop = insets.top;
  const dayPickerHeight = 30;
  const dayPickerBottomGap = 24;
  const contentTopOffset = dayPickerTop + dayPickerHeight + dayPickerBottomGap;

  const items: ExcerciseItemProps[] = [
    {
      excerciseName: "Running",
      reps: 5,
      sets: 4,
      id: "1",
    },
    {
      excerciseName: "Push-ups",
      reps: 10,
      sets: 3,
      radiusBottom: 6,
      id: "2",
    },
    {
      excerciseName: "Squats",
      reps: 15,
      sets: 4,
      id: "3",
    },
    {
      excerciseName: "Plank",
      reps: 60, // seconds
      sets: 3,
      id: "4",
    },
    {
      excerciseName: "Jumping Jacks",
      reps: 20,
      sets: 4,
      id: "5",
    },
  ];

  const lenItems = items.length;
  const snapItemHeight = 86;
  const itemGap = 2;
  const snapStep = snapItemHeight + itemGap;
  const snapOffsets = items.map((_, index) => index * snapStep);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.general.color.darkTones.bg,
        position: "relative",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          // backgroundColor: Colors.general.color.darkTones.bg,
          paddingTop: dayPickerTop,
        }}
      ></View>
      <ScrollView
        scrollsToTop
        style={{
          flex: 1,
        }}
        // TODO: fix snap
        snapToAlignment="start"
        snapToOffsets={snapOffsets.map((offset) => {
          return offset + (contentTopOffset - 8);
        })}
        disableIntervalMomentum
        decelerationRate="fast"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 24,
          paddingHorizontal: 8,
          justifyContent: "flex-start",
          alignItems: "center",
          gap: itemGap,
        }}
      >
        <View style={{marginBottom: 22}}>
          <DayPicker />
        </View>
        <View
          style={{ width: "100%", paddingHorizontal: 12, marginBottom: 12 }}
        >
          <WorkoutPageDesc
            workoutName="Push workout"
            excercisesCount={5}
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
            radiusBottom={index === lenItems - 1 ? 24 : 6}
          />
        ))}
      </ScrollView>
    </View>
  );
}
