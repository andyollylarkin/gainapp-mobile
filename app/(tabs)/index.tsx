import ColumnDescription from "@/components/build-components/column-description";
import type { SetItemProps } from "@/components/build-components/composite/set-item";
import SwipeableSet from "@/components/build-components/composite/swipable-set";
import ExcerciseTitle from "@/components/build-components/excercise-title";
import MultiplyIcon from "@/components/icons/multiply-icon";
import DelayedPressable from "@/components/parts/delayed-pressable";
import { Colors } from "@/constants/theme";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: Colors.general.color.darkTones.bg,
        paddingTop: 250,
      }}
    >
      <ExcerciseTitle
        type="Barbell"
        title="Bench Press"
        backgroundColor={"#1A1A1A"}
        iconsColor="#262626"
        icon1Click={() => console.log("1 click")}
        icon2Click={() => console.log("2 click")}
      />
      <ColumnDescription items={["Set", "Previous", "kg", "Reps"]} />
      <SwipeableSet
        initialState="progress"
        onPress={(currentState, transferState) => {
          if (currentState === "progress") {
            transferState("done");
          }
        }}
        onSwipeEnd={() => {}}
        input={{
          field1: "99",
          field2: "100",
        }}
        history={{
          delimiter: (
            <MultiplyIcon color={Colors.general.color.grayTones.muted40} />
          ),
          firstText: 20,
          secondText: 20,
        }}
        excerciseOrder="W"
        maxInputValue={100}
      />
    </View>
  );
}
