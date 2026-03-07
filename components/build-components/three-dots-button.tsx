import { Colors } from "@/constants/theme";
import { GestureResponderEvent, Pressable } from "react-native";
import ThreeDotsIcon from "../icons/three-dots";
import Circle from "../parts/circle";

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
        <ThreeDotsIcon color={Colors.general.color.grayTones.muted50} />
      </Circle>
    </Pressable>
  );
}
