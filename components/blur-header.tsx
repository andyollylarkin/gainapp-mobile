import { Colors } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { PanResponder, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BlurHeaderProps = {
  enableSwipeToClose?: boolean;
  overlayOpacity?: number;
  blurIntensity?: number;
};

export default function BlurHeader({
  enableSwipeToClose = false,
  overlayOpacity = 0.8,
  blurIntensity = 30,
}: BlurHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          if (!enableSwipeToClose) {
            return false;
          }

          return (
            gestureState.dy > 6 &&
            Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
          );
        },
        onPanResponderRelease: (_, gestureState) => {
          if (!enableSwipeToClose) {
            return;
          }

          if (gestureState.dy > 60 || gestureState.vy > 0.7) {
            if (router.canGoBack()) {
              router.back();
            }
          }
        },
      }),
    [enableSwipeToClose, router],
  );

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        backgroundColor: "transparent",
        paddingTop: insets.top + 5,
        alignItems: "center",
      }}
    >
      <BlurView
        intensity={blurIntensity}
		tint="dark"
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
          opacity: overlayOpacity,
        }}
      />
      {enableSwipeToClose && (
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
      )}
      <LinearGradient
        colors={["rgba(13,13,13,1)", "rgba(13,13,13,0)"]}
        style={{
          position: "absolute",
          bottom: -20,
          left: 0,
          right: 0,
          height: 20,
		  opacity: overlayOpacity,
        }}
      />
    </View>
  );
}
