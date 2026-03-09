import { Colors } from "@/constants/theme";
import { GestureResponderEvent, Pressable } from "react-native";
import TimelineIcon from "../icons/timeline";
import Circle from "../parts/circle";

export default function StatsButton({
  onPressIn,
  color,
}: {
  color: string;
  onPressIn?: (e: GestureResponderEvent) => void;
}) {
  return (
    <Pressable onPressIn={onPressIn}>
      <Circle bgColor={color}>
        <TimelineIcon
          width={18}
          height={18}
          color={Colors.general.color.grayTones.muted50}
        />
      </Circle>
    </Pressable>
  );
}
