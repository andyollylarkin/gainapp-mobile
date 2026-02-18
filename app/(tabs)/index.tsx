import ResetTimer from "@/components/reset-timer";
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
      <ResetTimer decreaseAmount={15} increaseAmount={15} timeout={5} />
    </View>
  );
}
