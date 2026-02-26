import { Colors } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { Stack, useRouter } from "expo-router";
import { useMemo } from "react";
import { PanResponder, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ModalHandleHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy > 6 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 60 || gestureState.vy > 0.7) {
            if (router.canGoBack()) {
              router.back();
            }
          }
        },
      }),
    [router],
  );

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        backgroundColor: "transparent",
        overflow: "hidden",
        paddingBottom: 12,
        paddingTop: insets.top + 5,
        alignItems: "center",
      }}
    >
      <BlurView
        intensity={30}
        tint="dark"
        experimentalBlurMethod="none"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: Colors.general.color.darkTones.bg,
          opacity: 0.8,
        }}
      />
      <View
        style={{
          height: 5,
          width: 40,
          borderRadius: 2.5,
          backgroundColor: Colors.general.color.darkTones.bgTray,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </View>
  );
}

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="excercise"
        options={{
          presentation: "fullScreenModal",
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
          header: () => <ModalHandleHeader />,
        }}
      />
    </Stack>
  );
}
