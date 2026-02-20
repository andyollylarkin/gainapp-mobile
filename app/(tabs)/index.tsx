import TwoField from "@/components/build-components/two-field";
import { Colors } from "@/constants/theme";
import { View } from "react-native";

export default function HomeScreen() {
  const theme = Colors["general"];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 16,
      }}
    >
      <TwoField
        delimiter="x"
        fieldColor={Colors.general.color.darkTones.bgMiddle}
        textColor={Colors.general.color.grayTones.main}
        selectColor={Colors.general.color.blueTones.main}
        selectTextColor={Colors.general.color.grayTones.main}
      />
    </View>
  );
}
