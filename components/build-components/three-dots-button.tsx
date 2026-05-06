import { Colors } from "@/constants/theme";
import { GestureResponderEvent, Pressable } from "react-native";
import ThreeDotsIcon from "../icons/three-dots";
import Circle from "../parts/circle";

export default function ThreeDotsButton({
  onPress,
  onPressIn,
  color,
}: {
  onPress?: (e: GestureResponderEvent) => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  color: string;
}) {
  return (
    <Pressable onPress={onPress} onPressIn={onPressIn}>
      <Circle bgColor={color}>
        <ThreeDotsIcon
          width={16}
          height={16}
          color={Colors.general.color.grayTones.muted50}
        />
      </Circle>
    </Pressable>
  );
}
