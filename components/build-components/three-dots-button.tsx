import { Pressable } from "react-native";
import Circle from "../parts/circle";
import TimelineIcon from "../icons/timeline";
import { Colors } from "@/constants/theme";

export default function ThreeDotsButton({
  onClick,
  color,
}: {
  onClick: () => void;
  color: string;
}) {
  return (
    <Pressable onPress={onClick}>
      <Circle bgColor={color}>
        <TimelineIcon color={Colors.general.color.grayTones.muted50} />
      </Circle>
    </Pressable>
  );
}
