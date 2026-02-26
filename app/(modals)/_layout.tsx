import { Colors } from "@/constants/theme";
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
        paddingBottom: 12,
        paddingTop: insets.top + 5,
        alignItems: "center",
      }}
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
          contentStyle: {
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
