import ExcerciseTray from "@/components/build-components/composite/excercise-tray";
import MultiplyIcon from "@/components/icons/multiply-icon";
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
      <ExcerciseTray
        title={{
          type: "Barbell",
          title: "Bench Press",
          backgroundColor: "#1A1A1A",
          iconsColor: "#262626",
          icon1Click: () => console.log("1 click"),
          icon2Click: () => console.log("2 click"),
        }}
        history={{
          firstText: 20,
          secondText: 20,
          delimiter: (
            <MultiplyIcon color={Colors.general.color.grayTones.muted40} />
          ),
          color: Colors.general.color.grayTones.muted40,
        }}
        description={{ items: ["Set", "Previous", "kg", "Reps"] }}
        excercises={[
          {
            initialState: "progress",
            onPress: (currentState, transferState) => {
              if (currentState === "current") {
                transferState("done");
              }
            },
            history: {
              firstText: 20,
              secondText: 20,
              delimiter: (
                <MultiplyIcon color={Colors.general.color.grayTones.muted40} />
              ),
            },
            excerciseOrder: "W",
            maxInputValue: 100,
            input: {
              field1: "70",
              field2: "80",
            },
          },
        ]}
      />
    </View>
  );
}
