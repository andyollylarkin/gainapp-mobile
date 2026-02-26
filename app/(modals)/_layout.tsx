import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { View, Text } from "react-native";

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="excercise"
        options={{
          presentation: "fullScreenModal",
          header: () => (
            <View
              style={{ paddingBottom: 12, paddingTop: 5, alignItems: "center" }}
            >
              <View
                style={{
                  height: 5,
                  width: 40,
                  borderRadius: 2.5,
                  backgroundColor: Colors.general.color.grayTones.muted40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </View>
          ),
        }}
      />
    </Stack>
  );
}
