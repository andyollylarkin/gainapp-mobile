import { Colors } from "@/constants/theme";
import SuccessIcon from "../icons/sucess-icon";
import Circle from "../parts/circle";
import { View } from "react-native";

export default function CheckGray({ onPress }: { onPress?: () => void }) {
  return (
    <View onTouchStart={() => onPress && onPress()}>
      <Circle bgColor={Colors.general.color.darkTones.bgLight} size={30}>
        <SuccessIcon color={Colors.general.color.grayTones.muted50} />
      </Circle>
    </View>
  );
}
