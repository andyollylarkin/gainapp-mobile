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

export interface SliderButtonProps<T extends string> {
  icon: React.ReactElement<IconProps>;
  holdDuration: number;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  color: ColorValue;
  holdOverlayColor: ColorValue;
  disabled?: boolean;
  textColor: ColorValue;
  text: T;
  fullWidth?: boolean;
}

export default function SliderButton<T extends string>(
  props: SliderButtonProps<T>,
) {
  const holdProgress = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const scale = useSharedValue(1);

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

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    containerWidth.value = event.nativeEvent.layout.width;
  };

  const handleHoldStart = () => {
    props.onHoldStart();
    cancelAnimation(holdProgress);
    if (props.disabled) return;
    holdProgress.value = withTiming(1, { duration: props.holdDuration });
    // shrink button
    scale.value = withTiming(0.98, { duration: 60 });
  };

  const handleHoldEnd = useCallback(() => {
    // return to normal size
    if (props.disabled) return;
    scale.value = withTiming(1, { duration: 60 });
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
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: props.color },
        props.fullWidth && styles.fullWidth, // 👈 условный стиль
        animatedContainerStyle,
      ]}
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
            flexWrap: "nowrap",
            overflow: "hidden",
          }}
          numberOfLines={1}
        >
          {props.text}
        </Text>
      </View>
    </Animated.View>
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
  fullWidth: {
    width: "100%",
    alignSelf: "stretch",
  },
});
