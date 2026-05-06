import { ReactNode } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";

export default function BubblePressable({
  onPress,
  children,
  style,
  bubbleSize = 44,
}: {
  onPress: () => void;
  children: ReactNode;
  style: object;
  bubbleSize?: number;
}) {
  const bubbleScale = useSharedValue(0);
  const bubbleOpacity = useSharedValue(0);

  const bubbleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
    opacity: bubbleOpacity.value,
  }));

  const handlePress = () => {
    bubbleScale.value = 0;
    bubbleOpacity.value = 0;
    Haptics.impactAsync();

    bubbleScale.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 100 }),
    );
    bubbleOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 100 }),
    );

    onPress();
  };
  return (
    <Pressable onPress={handlePress} style={style}>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: "center",
            justifyContent: "center",
          },
          bubbleAnimatedStyle,
        ]}
      >
        <View
          style={{
            width: bubbleSize,
            height: bubbleSize,
            borderRadius: bubbleSize / 2,
            backgroundColor: "rgba(165, 165, 165, 0.22)",
          }}
        />
      </Animated.View>
      {children}
    </Pressable>
  );
}
