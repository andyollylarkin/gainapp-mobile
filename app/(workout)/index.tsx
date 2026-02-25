import ExcerciseTray from "@/components/build-components/composite/excercise-tray";
import DayPicker from "@/components/build-components/day-picker";
import MultiplyIcon from "@/components/icons/multiply-icon";
import { Colors } from "@/constants/theme";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const dayPickerTop = insets.top;
  const dayPickerHeight = 30;
  const dayPickerBottomGap = 24;
  const contentTopOffset = dayPickerTop + dayPickerHeight + dayPickerBottomGap;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.general.color.darkTones.bg,
        position: "relative",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: Colors.general.color.darkTones.bg,
          paddingTop: dayPickerTop,
        }}
      >
        <DayPicker />
      </View>
      <ScrollView
        scrollsToTop
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingTop: contentTopOffset,
          paddingBottom: 24,
        }}
      ></ScrollView>
    </View>
  );
}
