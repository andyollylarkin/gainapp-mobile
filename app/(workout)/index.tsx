import ExcerciseTray from "@/components/build-components/composite/excercise-tray";
import DayPicker from "@/components/build-components/day-picker";
import MultiplyIcon from "@/components/icons/multiply-icon";
import PlayIcon from "@/components/icons/play";
import SliderButton from "@/components/parts/slider-button";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
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
      <SliderButton
        color={"red"}
        textColor={"white"}
        text={"Slide Me"}
        icon={<PlayIcon color={"white"} width={20} height={20} />}
        holdDuration={2000}
        onHoldEnd={() => router.push("/modal")}
        onHoldStart={() => console.log("Hold started")}
        holdOverlayColor={"blue"}
      />
      <DayPicker />
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
