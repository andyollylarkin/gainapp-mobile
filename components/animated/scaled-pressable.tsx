import React, { ReactElement } from "react";
import { GestureResponderEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export interface ScaledPressableProps {
  scaleTo: number;
  scaleDuration: number;
  children: ReactElement<
    Required<{ onPressIn?: (e: GestureResponderEvent) => void }>
  >;
}

export default function ScaledPressable({
  children,
  scaleTo,
  scaleDuration,
}: ScaledPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const triggerAnimation = () => {
    scale.value = withSequence(
      withTiming(scaleTo, { duration: scaleDuration }),
      withTiming(1, { duration: scaleDuration }),
    );
  };

  const child = React.cloneElement(children, {
    onPressIn: (e: GestureResponderEvent) => {
      triggerAnimation();
      children.props.onPressIn?.(e);
    },
  });

  return <Animated.View style={animatedStyle}>{child}</Animated.View>;
}
