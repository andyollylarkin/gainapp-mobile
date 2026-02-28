import IconProps from "@/components/icons/props";
import { typography } from "@/constants/theme";
import { useCallback } from "react";
import {
  ColorValue,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface SliderButtonProps<T> {
  icon: React.ReactElement<IconProps>;
  holdDuration: number;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  color: ColorValue;
  holdOverlayColor: ColorValue;
  textColor: ColorValue;
  text: T;
}

export default function SliderButton<T>(props: SliderButtonProps<T>) {
  const holdProgress = useSharedValue(0);
  const containerWidth = useSharedValue(0);

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: props.holdOverlayColor,
      width: containerWidth.value * holdProgress.value,
    };
  });

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    containerWidth.value = event.nativeEvent.layout.width;
  };

  const handleHoldStart = () => {
    props.onHoldStart();
    cancelAnimation(holdProgress);
    holdProgress.value = withTiming(1, { duration: props.holdDuration });
  };

  const handleHoldEnd = useCallback(() => {
    if (holdProgress.value < 1) {
      cancelAnimation(holdProgress);
      holdProgress.value = withTiming(0, { duration: 150 });
      return;
    }
    props.onHoldEnd();
    cancelAnimation(holdProgress);
    holdProgress.value = withTiming(0, { duration: 150 });
  }, [holdProgress, props]);

  return (
    <View
      style={[styles.container, { backgroundColor: props.color }]}
      onLayout={handleContainerLayout}
    >
      <Animated.View style={overlayAnimatedStyle}></Animated.View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          justifyContent: "center",
        }}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        onTouchCancel={handleHoldEnd}
      >
        {props.icon}
        <Text
          style={{
            color: props.textColor,
            ...typography.mediumM,
            textAlign: "center",
          }}
        >
          {props.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 29,
    borderRadius: 61,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
});
