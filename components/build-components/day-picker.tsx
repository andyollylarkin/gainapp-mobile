import { Colors, typography } from "@/constants/theme";
import useCurrentDay from "@/hooks/use-current-day";
import { Day } from "@/types";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { FIRST_DAY_OF_THE_WEEK } from "../../constants";

export interface DayPickerProps {
  currentDay?: Day;
  onDaySelect?: (day: Day) => void;
}

export default function DayPicker({ currentDay, onDaySelect }: DayPickerProps) {
  const current = useCurrentDay();

  if (!currentDay) {
    currentDay = current;
  }

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      {Day.map((day) => {
        const isCurrent = day.name === currentDay.name;
        const isCurrentMonday =
          isCurrent && day.name === FIRST_DAY_OF_THE_WEEK.name;

        return (
          <Pressable
            key={day.name}
            onPress={() => {
              scale.value = withSequence(
                withTiming(1.1, { duration: 100 }),
                withTiming(1, { duration: 100 }),
              );
              onDaySelect?.(day);
            }}
          >
            <Animated.View
              style={[
                isCurrentMonday
                  ? styles.firstDay
                  : isCurrent
                    ? styles.currentDay
                    : styles.day,
                isCurrent ? animatedStyle : {},
              ]}
            >
              <Text
                style={
                  isCurrentMonday
                    ? styles.firstDayText
                    : isCurrent
                      ? styles.currentDayText
                      : styles.otherDayText
                }
              >
                {day.name.charAt(0).toUpperCase()}
              </Text>
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    gap: 28,
    paddingHorizontal: 12,
  },
  firstDay: {
    backgroundColor: Colors.general.color.grayTones.main,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 45,
    color: Colors.general.color.darkTones.bg,
  },
  currentDay: {
    backgroundColor: Colors.general.color.darkTones.bgMiddle,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 45,
  },
  day: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 45,
  },
  currentDayText: {
    ...typography.mediumM,
    color: Colors.general.color.grayTones.main,
  },
  firstDayText: {
    ...typography.mediumM,
    color: Colors.general.color.darkTones.bg,
  },
  otherDayText: {
    ...typography.mediumM,
    color: Colors.general.color.grayTones.muted40,
  },
});
