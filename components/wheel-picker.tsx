import React, { memo, useMemo } from "react";
import { Animated, Text } from "react-native";
import WheelPicker, {
  type PickerItem,
  type RenderItemContainerProps,
  type RenderItemProps,
  type OnValueChanged,
  usePickerItemHeight,
  useScrollContentOffset,
} from "@quidone/react-native-wheel-picker";
import { Colors } from "@/constants/theme";

const GainItemContainer = memo(
  function GainItemContainer({
    index,
    item,
    faces,
    renderItem,
    itemTextStyle,
  }: RenderItemContainerProps<PickerItem<any>>) {
    const offset = useScrollContentOffset();
    const height = usePickerItemHeight();

    const inputRange = useMemo(
      () => faces.map((f) => height * (index + f.index)),
      [faces, height, index],
    );

    const scaleOutputRange = useMemo(
      () =>
        faces.map((f) => {
          const dist = Math.abs(f.index);
          if (dist === 0) return 1;
          if (dist === 1) return 0.78;
          if (dist === 2) return 0.58;
          return 0.42;
        }),
      [faces],
    );

    const { opacity, translateY, scale } = useMemo(
      () => ({
        opacity: offset.interpolate({
          inputRange,
          outputRange: faces.map((x) => x.opacity),
          extrapolate: "clamp",
        }),
        translateY: offset.interpolate({
          inputRange,
          outputRange: faces.map((x) => x.offsetY),
          extrapolate: "extend",
        }),
        scale: offset.interpolate({
          inputRange,
          outputRange: scaleOutputRange,
          extrapolate: "clamp",
        }),
      }),
      [faces, inputRange, offset, scaleOutputRange],
    );

    return (
      <Animated.View
        style={{
          height,
          opacity,
          transform: [{ translateY }, { scale }],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {renderItem({ item, index, itemTextStyle })}
      </Animated.View>
    );
  },
);

const GainDefaultItem = memo(
  function GainDefaultItem({ item }: RenderItemProps<PickerItem<any>>) {
    return (
      <Text
        style={{
          color: Colors.general.color.grayTones.main,
          fontSize: 36,
          fontFamily: "Inter-Bold",
          lineHeight: 36 * 1.25,
          textAlign: "center",
        }}
      >
        {item.label ?? String(item.value)}
      </Text>
    );
  },
);

export type WheelPickerGainProps<T> = {
  data: PickerItem<T>[];
  value: T;
  onValueChanged: OnValueChanged<PickerItem<T>>;
  itemHeight?: number;
  visibleItemCount?: number;
  renderItem?: (props: RenderItemProps<PickerItem<T>>) => React.ReactElement | null;
};

export default function WheelPickerGain<T>({
  data,
  value,
  onValueChanged,
  itemHeight = 80,
  visibleItemCount = 7,
  renderItem,
}: WheelPickerGainProps<T>) {
  return (
    <WheelPicker
      data={data}
      value={value}
      onValueChanged={onValueChanged}
      itemHeight={itemHeight}
      visibleItemCount={visibleItemCount}
      renderItem={renderItem ?? ((props) => <GainDefaultItem {...props} />)}
      renderItemContainer={(props) => <GainItemContainer {...props} />}
      overlayItemStyle={{
        borderTopWidth: 0,
        borderBottomWidth: 0,
        backgroundColor: "transparent",
      }}
      style={{ backgroundColor: "transparent" }}
    />
  );
}
