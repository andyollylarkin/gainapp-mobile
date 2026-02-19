import { Colors } from "@/constants/theme";
import Circle, { CircleIconContent } from "../parts/circle";
import TrophyIcon from "../icons/trophy-icon";

export default function CheckGold() {
  return (
    <Circle
      gradient={{
        colors: [
          Colors.general.color.goldTones.goldMain,
          "#FFE380",
          Colors.general.color.goldTones.goldMain,
        ],
        angle: 120,
      }}
    >
      <CircleIconContent>
        <TrophyIcon color={Colors.general.color.goldTones.goldBgLight} />
      </CircleIconContent>
    </Circle>
  );
}
