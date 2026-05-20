import { Colors } from "@/constants/theme";
import { View, Text } from "react-native";

export default function StatsTab(): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: Colors.general.color.grayTones.muted40 }}>
        Stats content
      </Text>
    </View>
  );
}
