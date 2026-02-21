import type { SetItemProps } from "@/components/build-components/composite/set-item";
import SwipeableSet from "@/components/build-components/composite/swipable-set";
import MultiplyIcon from "@/components/icons/multiply-icon";
import DelayedPressable from "@/components/parts/delayed-pressable";
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
      <DelayedPressable
        delay={1000}
        onPress={(
          _state: Parameters<NonNullable<SetItemProps["onPress"]>>[0],
          nextState: Parameters<NonNullable<SetItemProps["onPress"]>>[1],
        ) => {
          if (_state === "progress") {
            nextState("done");
          }
        }}
      >
        <SwipeableSet
          initialState="progress"
          onSwipeEnd={() => {}}
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
      </DelayedPressable>
    </View>
  );
}
