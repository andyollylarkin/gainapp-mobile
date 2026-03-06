import { Colors } from "@/constants/theme";
import Circle, { CircleIconContent } from "../parts/circle";
import TrophyIcon from "../icons/trophy-icon";
import { View } from "react-native";

export default function CheckGold({ onPress }: { onPress?: () => void }) {
  return (
    <View onTouchStart={() => onPress && onPress()}>
      <Circle
        gradient={{
          colors: [
            Colors.general.color.goldTones.goldMain,
            "#FFE380",
            Colors.general.color.goldTones.goldMain,
          ],
          angle: 120,
        }}
        size={40}
      >
        <CircleIconContent>
          <TrophyIcon color={Colors.general.color.goldTones.goldBgLight} />
        </CircleIconContent>
      </Circle>
    </View>
  );
}
