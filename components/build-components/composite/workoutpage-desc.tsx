import LightningIcon from "@/components/icons/lightning";
import WorkoutTimerIcon from "@/components/icons/workout-timer";
import { Colors, typography } from "@/constants/theme";
import { Text, View } from "react-native";
import StatsButton from "../stats-button";
import ThreeDotsButton from "../three-dots-button";
import ScaledPressable from "@/components/animated/scaled-pressable";

export interface WorkoutPageDescProps {
  workoutName: string;
  excercisesCount: number;
  durationMinutes: number;
}

export default function WorkoutPageDesc(props: WorkoutPageDescProps) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        gap: 8,
        alignItems: "flex-start",
      }}
    >
      <View style={{ flex: 1, flexDirection: "column", gap: 12 }}>
        <Text
          style={{
            ...typography.mediumL,
            color: Colors.general.color.grayTones.main,
          }}
        >
          {props.workoutName ?? "Push workout"}
        </Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
            <LightningIcon
              height={18}
              width={18}
              color={Colors.general.color.grayTones.muted40}
            />
            <Text
              style={{
                ...typography.regularL,
                color: Colors.general.color.grayTones.muted40,
              }}
            >
              {props.excercisesCount} exercises
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
            <WorkoutTimerIcon
              height={18}
              width={18}
              color={Colors.general.color.grayTones.muted40}
            />
            <Text
              style={{
                ...typography.regularL,
                color: Colors.general.color.grayTones.muted40,
              }}
            >
              {props.durationMinutes} minutes
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row-reverse",
          gap: 12,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignSelf: "flex-start",
        }}
      >
        <ScaledPressable scaleDuration={150} scaleTo={0.94}>
          <ThreeDotsButton
            color={Colors.general.color.darkTones.bgMiddle}
            onPressIn={() => {}}
          />
        </ScaledPressable>

        <ScaledPressable scaleDuration={150} scaleTo={0.94}>
          <StatsButton
            color={Colors.general.color.darkTones.bgMiddle}
            onPressIn={() => {}}
          />
        </ScaledPressable>
      </View>
    </View>
  );
}
