import { GestureResponderEvent, Pressable } from "react-native";
import Circle from "../parts/circle";
import TimelineIcon from "../icons/timeline";
import { Colors } from "@/constants/theme";

export default function ThreeDotsButton({
  onPressIn,
  color,
}: {
  onPressIn?: (e: GestureResponderEvent) => void;
  color: string;
}) {
  return (
    <Pressable onPressIn={onPressIn}>
      <Circle bgColor={color}>
        <TimelineIcon color={Colors.general.color.grayTones.muted50} />
      </Circle>
    </Pressable>
  );
}
