import BlurHeader from "@/components/blur-header";
import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { useCallback, useMemo } from "react";

export default function AddExModalsLayout() {
  const renderHeader = useCallback(
    () => <BlurHeader enableSwipeToClose blurIntensity={10} />,
    [],
  );

  const addExScreenOptions = useMemo(
    () => ({
      presentation: "card" as const,
      gestureEnabled: true,
      fullScreenGestureEnabled: true,
      animation: "slide_from_bottom" as const,
      headerTransparent: true,
      contentStyle: {
        backgroundColor: Colors.general.color.darkTones.bg,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
      header: renderHeader,
    }),
    [renderHeader],
  );

  return (
    <Stack>
      <Stack.Screen name="add_ex" options={addExScreenOptions} />
    </Stack>
  );
}
