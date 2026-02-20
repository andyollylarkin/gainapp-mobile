import SetItem from "@/components/build-components/composite/set";
import MultiplyIcon from "@/components/icons/multiply-icon";
import { Colors } from "@/constants/theme";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.general.color.darkTones.bg,
        width: "100%",
      }}
    >
      <SetItem
        type="pr_record"
        history={{
          delimiter: (
            <MultiplyIcon color={Colors.general.color.grayTones.muted40} />
          ),
          firstText: 20,
          secondText: 20,
        }}
        checkValue={"W"}
        maxInputValue={100}
      />
    </View>
  );
}
