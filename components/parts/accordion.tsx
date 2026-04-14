import React, { useEffect } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type AccordionProps = {
  isExpanded: boolean;
  children: React.ReactNode;
  duration?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Accordion({
  isExpanded,
  children,
  duration = 180,
  style,
}: AccordionProps) {
  const opacity = useSharedValue(isExpanded ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(isExpanded ? 1 : 0, { duration });
  }, [isExpanded, duration, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: isExpanded ? undefined : 0,
          overflow: "hidden",
        },
        animatedStyle,
        style,
      ]}
    >
      <View>{children}</View>
    </Animated.View>
  );
}
