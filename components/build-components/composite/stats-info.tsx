import ArrowIcon from "@/components/icons/arrow";
import ClockIcon from "@/components/icons/clock";
import LightningIcon from "@/components/icons/lightning";
import Box from "@/components/parts/box";
import CellBar from "@/components/parts/cell-bar";
import { Colors, typography } from "@/constants/theme";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import BackItem from "../back-item";
import CalendarItem from "../calendar-item";
import CheckGreen from "../check-green";

type Item = {
  workOutName: string;
  exercisesCount: number;
  workoutDuration: string | number;
  date: Date;
};

export interface StatsInfoProps {
  title: string;
  items: Item[];
  weeksRange: `${string} - ${string}`;
  totalProgress?: number;
  currentProgress?: number;
  onDropdownPress?: (direction: "down" | "up") => void;
}

const isToday = (date: Date, today: Date) =>
  date.getFullYear() === today.getFullYear() &&
  date.getMonth() === today.getMonth() &&
  date.getDate() === today.getDate();

export default function StatsInfo(props: StatsInfoProps) {
  const [isOpen, setIsOpen] = useState(true);
  const openProgress = useSharedValue(1);
  const today = new Date();
  const todayItem = props.items.find((item) => isToday(item.date, today));

  const bottomAnimStyle = useAnimatedStyle(() => ({
    opacity: openProgress.value,
    maxHeight: openProgress.value * 600,
    overflow: "hidden",
  }));

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    openProgress.value = withTiming(next ? 1 : 0, { duration: 300 });
    props.onDropdownPress?.(next ? "down" : "up");
  };

  return (
    <Box
      bgColor={Colors.general.color.darkTones.bgTray}
      borderColor={Colors.general.color.darkTones.bgMiddle}
      radiusBottom={24}
      radiusTop={24}
    >
      <View style={styles.boxContainer}>
        <View style={styles.upperBox}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <CalendarItem />
            <View style={{ flexDirection: "column", gap: 2 }}>
              <Text
                style={{
                  ...typography.mediumL,
                  color: Colors.general.color.grayTones.main,
                }}
              >
                {props.title}
              </Text>
              <Text
                style={{
                  ...typography.mediumM,
                  color: Colors.general.color.grayTones.muted50,
                }}
              >
                {props.weeksRange}
              </Text>
            </View>
          </View>
          <DropdownButton isOpen={isOpen} onToggle={toggle} />
        </View>
        <CellBar
          gap={12}
          borderRadius={6}
          max={props.totalProgress ?? 4}
          height={12}
          filledColor={Colors.general.color.greenTones.greenMain}
          emptyColor={Colors.general.color.greenTones.greenBgLight}
          current={props.currentProgress ?? 2}
        />
        {isOpen ? (
          <Animated.View style={[styles.bottomBox, bottomAnimStyle]}>
            {props.items &&
              props.items.length > 0 &&
              props.items.map((item, index) => (
                <StatsItem key={index} item={item} today={today} />
              ))}
          </Animated.View>
        ) : todayItem ? (
          <StatsItem item={todayItem} today={today} />
        ) : null}
      </View>
    </Box>
  );
}

function StatsItem({ item, today }: { item: Item; today: Date }) {
  const isToday = (date: Date, today: Date) =>
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const dateLabel = isToday(item.date, today)
    ? "Today"
    : `${String(item.date.getDate()).padStart(2, "0")} ${item.date.toLocaleDateString("en-US", { month: "short" })}`;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 6,
          flex: 1,
        }}
      >
        <Text
          style={{
            ...typography.mediumM,
            color: Colors.general.color.grayTones.main,
          }}
        >
          {item.workOutName} - {dateLabel}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <LightningIcon
              width={18}
              height={18}
              color={Colors.general.color.grayTones.muted40}
            />
            <Text
              style={{
                ...typography.regularM,
                color: Colors.general.color.grayTones.muted40,
              }}
            >
              {item.exercisesCount} exercises
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <ClockIcon
              width={18}
              height={18}
              color={Colors.general.color.grayTones.muted40}
            />
            <Text
              style={{
                ...typography.regularM,
                color: Colors.general.color.grayTones.muted40,
              }}
            >
              {item.workoutDuration} minutes
            </Text>
          </View>
        </View>
      </View>
      {isToday(item.date, today) || item.date > today ? (
        <BackItem />
      ) : (
        <CheckGreen />
      )}
    </View>
  );
}

function DropdownButton({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const onPress = () => {
    opacity.value = withSequence(
      withTiming(0, { duration: 150 }),
      withTiming(1, { duration: 150 }),
    );
    setTimeout(onToggle, 150);
  };

  return (
    <Animated.View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 41,
          gap: 4,
          backgroundColor: Colors.general.color.darkTones.bgMiddle,
          width: 30,
          height: 30,
        },
        animatedStyle,
      ]}
      onTouchEnd={onPress}
    >
      <ArrowIcon
        width={18}
        height={18}
        direction={isOpen ? "down" : "up"}
        color={Colors.general.color.grayTones.muted50}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  upperBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomBox: {
    flexDirection: "column",
    gap: 16,
    width: "100%",
  },
  boxContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 24,
    justifyContent: "center",
  },
});
