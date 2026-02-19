import CheckDark from "@/components/build-components/check-dark";
import CheckGold from "@/components/build-components/check-gold";
import CheckGreen from "@/components/build-components/check-green";
import SetNumberWarpup from "@/components/build-components/set-number-warpup";
import InputField from "@/components/parts/input-field";
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
      <ResetTimer decreaseAmount={15} increaseAmount={15} timeout={30} />
      <CheckGold />
      <CheckGreen />
      <CheckDark />
      <SetNumberWarpup
        color={theme.color.greenTones.greenMain}
        textColor={theme.color.greenTones.greenBgLight}
        text={1}
      />
      <SetNumberWarpup
        color={theme.color.goldTones.goldMain}
        textColor={theme.color.goldTones.goldBgLight}
        text={2}
      />
      <SetNumberWarpup
        color={theme.color.darkTones.bgMiddle}
        textColor={theme.color.grayTones.muted50}
        text={"W"}
      />
      <InputField
        bgColor={theme.color.darkTones.bgMiddle}
        textColor={theme.color.grayTones.main}
      />
      <InputField
        bgColor={theme.color.blueTones.main}
        textColor={theme.color.grayTones.main}
      />
      <InputField
        bgColor={theme.color.greenTones.greenMain}
        textColor={theme.color.greenTones.greenBgLight}
      />
      <InputField
        bgColor={theme.color.greenTones.greenBgLight}
        textColor={theme.color.greenTones.greenMain}
      />
      <InputField
        bgColor={theme.color.goldTones.goldMain}
        textColor={theme.color.goldTones.goldBgLight}
      />
      <InputField
        bgColor={theme.color.goldTones.goldBgLight}
        textColor={theme.color.goldTones.goldMain}
      />
    </View>
  );
}
