import BlurHeader from "@/components/blur-header";
import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";

export default function ExerciseModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="excercise"
        options={{
          presentation: "card",
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          animation: "slide_from_bottom",
          headerTransparent: true,
          contentStyle: {
            backgroundColor: Colors.general.color.darkTones.bg,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
          header: () => <BlurHeader enableSwipeToClose blurIntensity={10} />,
        }}
      />
    </Stack>
  );
}
