import { Colors } from "@/constants/theme";
import SuccessIcon from "../icons/sucess-icon";
import Circle from "../parts/circle";
import { View } from "react-native";

export default function CheckGreen({ onPress }: { onPress?: () => void }) {
  return (
    <View onTouchStart={() => onPress && onPress()}>
      <Circle bgColor={Colors.general.color.greenTones.greenMain} size={30}>
        <SuccessIcon color={Colors.general.color.greenTones.greenBgLight} />
      </Circle>
    </View>
  );
}
