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
  duration = 300,
  style,
}: AccordionProps) {
  const expanded = useSharedValue(isExpanded ? 1 : 0);
  const contentHeight = useSharedValue(0);
  const containerHeight = useSharedValue(-1);

  useEffect(() => {
    if (containerHeight.value < 0) return;

    expanded.value = isExpanded ? 1 : 0;
    containerHeight.value = withTiming(isExpanded ? contentHeight.value : 0, {
      duration,
    });
  }, [isExpanded, duration, contentHeight, containerHeight, expanded]);

  const animatedStyle = useAnimatedStyle(() => {
    if (containerHeight.value < 0) {
      return {
        overflow: "hidden",
      };
    }

    return {
      height: containerHeight.value,
      overflow: "hidden",
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>
      <View
        onLayout={(e) => {
          const measuredHeight = e.nativeEvent.layout.height;
          if (measuredHeight <= 0) return;

          const prevHeight = contentHeight.value;
          contentHeight.value = measuredHeight;

          if (containerHeight.value < 0) {
            containerHeight.value = isExpanded ? measuredHeight : 0;
            return;
          }

          if (
            expanded.value === 1 &&
            Math.abs(prevHeight - measuredHeight) > 0.5
          ) {
            containerHeight.value = withTiming(measuredHeight, {
              duration: 300,
            });
          }
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
}
