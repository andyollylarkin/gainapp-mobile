import { Colors, typography } from "@/constants/theme";
import { useEffect } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type SegmentedOption<T extends string = string> = {
  label: string;
  value: T;
};

type Props<T extends string = string> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

const PADDING = 4;

export default function SegmentedSwitch<T extends string = string>({
  options,
  value,
  onChange,
}: Props<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);
  const containerWidth = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    const idx = options.findIndex((o) => o.value === value);
    const itemWidth = (containerWidth.value - PADDING * 2) / options.length;
    translateX.value = withTiming(idx * itemWidth, { duration: 200 });
  }, [value, options]);

  function onLayout(e: LayoutChangeEvent) {
    const width = e.nativeEvent.layout.width;
    containerWidth.value = width;
    const idx = options.findIndex((o) => o.value === value);
    const itemWidth = (width - PADDING * 2) / options.length;
    translateX.value = idx * itemWidth;
  }

  const indicatorStyle = useAnimatedStyle(() => {
    const itemWidth = (containerWidth.value - PADDING * 2) / options.length;
    return {
      width: itemWidth,
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View
      onLayout={onLayout}
      style={{
        flexDirection: "row",
        backgroundColor: Colors.general.color.darkTones.bgTray,
        borderRadius: 999,
        padding: PADDING,
      }}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            top: PADDING,
            left: PADDING,
            bottom: PADDING,
            borderRadius: 999,
            backgroundColor: Colors.general.color.darkTones.bgMiddle,
          },
          indicatorStyle,
        ]}
      />
      {options.map((option, index) => {
        const isActive = index === activeIndex;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={{
              width: 67,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                ...typography.mediumM,
                color: isActive
                  ? Colors.general.color.grayTones.main
                  : Colors.general.color.grayTones.muted30,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
