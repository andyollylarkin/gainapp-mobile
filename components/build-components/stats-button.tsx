import { Pressable } from "react-native";
import ThreeDotsIcon from "../icons/three-dots";
import Circle from "../parts/circle";
import { Colors } from "@/constants/theme";

export default function StatsButton({
  onClick,
  color,
}: {
  color: string;
  onClick: () => void;
}) {
  return (
    <Pressable onPress={onClick}>
      <Circle bgColor={color}>
        <ThreeDotsIcon color={Colors.general.color.grayTones.muted50} />
      </Circle>
    </Pressable>
  );
}
