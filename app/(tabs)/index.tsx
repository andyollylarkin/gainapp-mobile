import Circle, { CircleIconContent } from "@/components/parts/circle";

import TrophyIcon from "@/components/icons/trophy-icon";
import InputField from "@/components/parts/input-field";
import { Colors } from "@/constants/theme";
import { View } from "react-native";
import HistoryText from "@/components/history-text";
import MultiplyIcon from "@/components/icons/multiply-icon";

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
      <View style={{ width: 100, marginBottom: 24 }}>
        <Circle bgColor={theme.color.orangeTones.prMain}>
          <CircleIconContent>
            <TrophyIcon color={theme.color.orangeTones.prBg} />
          </CircleIconContent>
        </Circle>
      </View>
      <InputField
        bgColor={theme.input.darkBgColor}
        textColor={"white"}
        type="text"
      />
      <HistoryText
        firstText="10"
        delimiter={<MultiplyIcon color={theme.color.grayTones.muted40} />}
        secondText="20"
        color={theme.color.grayTones.muted40}
      ></HistoryText>
    </View>
  );
}
