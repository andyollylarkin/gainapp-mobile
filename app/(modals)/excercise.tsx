import ExcerciseTray from "@/components/build-components/composite/excercise-tray";
import MultiplyIcon from "@/components/icons/multiply-icon";
import { Colors } from "@/constants/theme";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExcerciseModal() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 8,
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 12,
          paddingBottom: 24 + insets.bottom,
        }}
      >
        <ExcerciseTray
          description={{ items: ["Set", "Previous", "kg", "Reps"] }}
          history={{
            color: Colors.general.color.grayTones.muted40,
            delimiter: <MultiplyIcon />,
            firstText: 20,
            secondText: 20,
          }}
          title={{
            backgroundColor: "#1A1A1A",
            icon1Click: () => {},
            icon2Click: () => {},
            iconsColor: "#262626",
            type: "Treadmill",
            expanded: true,
            title: "Treadmill",
          }}
          excercises={[
            {
              history: {
                firstText: 20,
                secondText: 20,
                delimiter: (
                  <MultiplyIcon
                    color={Colors.general.color.grayTones.muted40}
                  />
                ),
              },
              excerciseOrder: "W",
              maxInputValue: 200,
              initialState: "current",
              input: {
                field1: "40",
                field2: "12",
              },
            },
            {
              history: {
                firstText: 40,
                secondText: 10,
                delimiter: (
                  <MultiplyIcon
                    color={Colors.general.color.grayTones.muted40}
                  />
                ),
              },
              excerciseOrder: 2,
              maxInputValue: 200,
              initialState: "progress",
              input: {
                field1: "45",
                field2: "10",
              },
            },
          ]}
          onExcerciseChange={(_, id) => {
            console.log(`Excercise with id ${id} changed`);
          }}
          onExcerciseComplete={(_, id) => {
            console.log(`Excercise with id ${id} completed`);
          }}
          onExcerciseRemove={(_, id) => {
            console.log(`Excercise with id ${id} removed`);
          }}
        />
        <ExcerciseTray
          description={{ items: ["Set", "Previous", "kg", "Reps"] }}
          history={{
            color: Colors.general.color.grayTones.muted40,
            delimiter: <MultiplyIcon />,
            firstText: 20,
            secondText: 20,
          }}
          title={{
            backgroundColor: "#1A1A1A",
            icon1Click: () => {},
            icon2Click: () => {},
            iconsColor: "#262626",
            type: "Treadmill",
            expanded: true,
            title: "Treadmill",
          }}
          excercises={[
            {
              history: {
                firstText: 20,
                secondText: 20,
                delimiter: (
                  <MultiplyIcon
                    color={Colors.general.color.grayTones.muted40}
                  />
                ),
              },
              excerciseOrder: "W",
              maxInputValue: 200,
              initialState: "current",
              input: {
                field1: "40",
                field2: "12",
              },
            },
            {
              history: {
                firstText: 40,
                secondText: 10,
                delimiter: (
                  <MultiplyIcon
                    color={Colors.general.color.grayTones.muted40}
                  />
                ),
              },
              excerciseOrder: 2,
              maxInputValue: 200,
              initialState: "progress",
              input: {
                field1: "45",
                field2: "10",
              },
            },
          ]}
          onExcerciseChange={(_, id) => {
            console.log(`Excercise with id ${id} changed`);
          }}
          onExcerciseComplete={(_, id) => {
            console.log(`Excercise with id ${id} completed`);
          }}
          onExcerciseRemove={(_, id) => {
            console.log(`Excercise with id ${id} removed`);
          }}
        />
        <ExcerciseTray
          description={{ items: ["Set", "Previous", "kg", "Reps"] }}
          history={{
            color: Colors.general.color.grayTones.muted40,
            delimiter: <MultiplyIcon />,
            firstText: 20,
            secondText: 20,
          }}
          title={{
            backgroundColor: "#1A1A1A",
            icon1Click: () => {},
            icon2Click: () => {},
            iconsColor: "#262626",
            type: "Treadmill",
            expanded: true,
            title: "Treadmill",
          }}
          excercises={[
            {
              history: {
                firstText: 20,
                secondText: 20,
                delimiter: (
                  <MultiplyIcon
                    color={Colors.general.color.grayTones.muted40}
                  />
                ),
              },
              excerciseOrder: "W",
              maxInputValue: 200,
              initialState: "current",
              input: {
                field1: "40",
                field2: "12",
              },
            },
            {
              history: {
                firstText: 40,
                secondText: 10,
                delimiter: (
                  <MultiplyIcon
                    color={Colors.general.color.grayTones.muted40}
                  />
                ),
              },
              excerciseOrder: 2,
              maxInputValue: 200,
              initialState: "progress",
              input: {
                field1: "45",
                field2: "10",
              },
            },
          ]}
          onExcerciseChange={(_, id) => {
            console.log(`Excercise with id ${id} changed`);
          }}
          onExcerciseComplete={(_, id) => {
            console.log(`Excercise with id ${id} completed`);
          }}
          onExcerciseRemove={(_, id) => {
            console.log(`Excercise with id ${id} removed`);
          }}
        />
        <ExcerciseTray
          description={{ items: ["Set", "Previous", "kg", "Reps"] }}
          history={{
            color: Colors.general.color.grayTones.muted40,
            delimiter: <MultiplyIcon />,
            firstText: 20,
            secondText: 20,
          }}
          title={{
            backgroundColor: "#1A1A1A",
            icon1Click: () => {},
            icon2Click: () => {},
            iconsColor: "#262626",
            type: "Treadmill",
            expanded: true,
            title: "Treadmill",
          }}
          excercises={[
            {
              history: {
                firstText: 20,
                secondText: 20,
                delimiter: (
                  <MultiplyIcon
                    color={Colors.general.color.grayTones.muted40}
                  />
                ),
              },
              excerciseOrder: "W",
              maxInputValue: 200,
              initialState: "current",
              input: {
                field1: "40",
                field2: "12",
              },
            },
            {
              history: {
                firstText: 40,
                secondText: 10,
                delimiter: (
                  <MultiplyIcon
                    color={Colors.general.color.grayTones.muted40}
                  />
                ),
              },
              excerciseOrder: 2,
              maxInputValue: 200,
              initialState: "progress",
              input: {
                field1: "45",
                field2: "10",
              },
            },
          ]}
          onExcerciseChange={(_, id) => {
            console.log(`Excercise with id ${id} changed`);
          }}
          onExcerciseComplete={(_, id) => {
            console.log(`Excercise with id ${id} completed`);
          }}
          onExcerciseRemove={(_, id) => {
            console.log(`Excercise with id ${id} removed`);
          }}
        />
        <ExcerciseTray
          description={{ items: ["Set", "Previous", "kg", "Reps"] }}
          history={{
            color: Colors.general.color.grayTones.muted40,
            delimiter: <MultiplyIcon />,
            firstText: 20,
            secondText: 20,
          }}
          title={{
            backgroundColor: "#1A1A1A",
            icon1Click: () => {},
            icon2Click: () => {},
            iconsColor: "#262626",
            type: "Treadmill",
            expanded: true,
            title: "Treadmill",
          }}
          excercises={[
            {
              history: {
                firstText: 20,
                secondText: 20,
                delimiter: (
                  <MultiplyIcon
                    color={Colors.general.color.grayTones.muted40}
                  />
                ),
              },
              excerciseOrder: "W",
              maxInputValue: 200,
              initialState: "current",
              input: {
                field1: "40",
                field2: "12",
              },
            },
            {
              history: {
                firstText: 40,
                secondText: 10,
                delimiter: (
                  <MultiplyIcon
                    color={Colors.general.color.grayTones.muted40}
                  />
                ),
              },
              excerciseOrder: 2,
              maxInputValue: 200,
              initialState: "progress",
              input: {
                field1: "45",
                field2: "10",
              },
            },
          ]}
          onExcerciseChange={(_, id) => {
            console.log(`Excercise with id ${id} changed`);
          }}
          onExcerciseComplete={(_, id) => {
            console.log(`Excercise with id ${id} completed`);
          }}
          onExcerciseRemove={(_, id) => {
            console.log(`Excercise with id ${id} removed`);
          }}
        />
        <ExcerciseTray
          description={{ items: ["Set", "Previous", "kg", "Reps"] }}
          history={{
            color: Colors.general.color.grayTones.muted40,
            delimiter: <MultiplyIcon />,
            firstText: 20,
            secondText: 20,
          }}
          title={{
            backgroundColor: "#1A1A1A",
            icon1Click: () => {},
            icon2Click: () => {},
            iconsColor: "#262626",
            type: "Treadmill",
            expanded: true,
            title: "Treadmill",
          }}
          excercises={[
            {
              history: {
                firstText: 20,
                secondText: 20,
                delimiter: (
                  <MultiplyIcon
                    color={Colors.general.color.grayTones.muted40}
                  />
                ),
              },
              excerciseOrder: "W",
              maxInputValue: 200,
              initialState: "current",
              input: {
                field1: "40",
                field2: "12",
              },
            },
            {
              history: {
                firstText: 40,
                secondText: 10,
                delimiter: (
                  <MultiplyIcon
                    color={Colors.general.color.grayTones.muted40}
                  />
                ),
              },
              excerciseOrder: 2,
              maxInputValue: 200,
              initialState: "progress",
              input: {
                field1: "45",
                field2: "10",
              },
            },
          ]}
          onExcerciseChange={(_, id) => {
            console.log(`Excercise with id ${id} changed`);
          }}
          onExcerciseComplete={(_, id) => {
            console.log(`Excercise with id ${id} completed`);
          }}
          onExcerciseRemove={(_, id) => {
            console.log(`Excercise with id ${id} removed`);
          }}
        />
      </ScrollView>
    </View>
  );
}
