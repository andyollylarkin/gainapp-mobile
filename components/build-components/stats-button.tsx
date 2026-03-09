import { Colors } from "@/constants/theme";
import { GestureResponderEvent, Pressable } from "react-native";
import ThreeDotsIcon from "../icons/three-dots";
import Circle from "../parts/circle";
import ChartIcon from "../icons/chart";

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
        <ChartIcon
          width={18}
          height={18}
          color={Colors.general.color.grayTones.muted50}
        />
      </Circle>
    </Pressable>
  );
}
