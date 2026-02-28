import { Colors, typography } from "@/constants/theme";
import useCurrentDay from "@/hooks/use-current-day";
import { Day } from "@/types";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface DayPickerProps {
  currentDay?: Day;
  onDaySelect?: (day: Day) => void;
}

export default function DayPicker({ currentDay, onDaySelect }: DayPickerProps) {
  const current = useCurrentDay();

  if (!currentDay) {
    currentDay = current;
  }

  const days: Day[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return (
    <View style={styles.container}>
      {days.map((day) => {
        const isCurrent = day === currentDay;
        const isCurrentMonday = isCurrent && day === "Monday";

        return (
          <Pressable key={day} onPress={() => onDaySelect?.(day)}>
            <View
              style={
                isCurrentMonday
                  ? styles.firstDay
                  : isCurrent
                    ? styles.currentDay
                    : styles.day
              }
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
                {day.charAt(0).toUpperCase()}
              </Text>
            </View>
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
