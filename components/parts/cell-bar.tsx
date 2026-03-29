import { Colors } from "@/constants/theme";
import { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

export interface CellBarProps {
  max: number;
  current: number;
  filledColor?: string;
  semiFilledColor?: string;
  emptyColor?: string;
  height?: number;
  borderRadius?: number;
  gap?: number;
}

export default function CellBar({
  max,
  current,
  filledColor = Colors.general.color.greenTones.greenMain,
  semiFilledColor = Colors.general.color.greenTones.greenBg,
  emptyColor = Colors.general.color.darkTones.bgMiddle,
  height = 6,
  borderRadius = 3,
  gap = 3,
}: CellBarProps) {
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const count = Math.max(max, 1);
  const filledCount = Math.min(Math.max(Math.floor(current), 0), count);
  const cellWidth = (width - gap * (count - 1)) / count;

  return (
    <View onLayout={onLayout} style={{ width: "100%", height }}>
      {width > 0 && (
        <Svg width={width} height={height}>
          {Array.from({ length: count }).map((_, i) => {
            const x = i * (cellWidth + gap);
            const filled = i < filledCount;
            const semiFilled =
              i === filledCount && filledCount < count && current > 0;
            return (
              <Rect
                key={i}
                x={x}
                y={0}
                width={cellWidth}
                height={height}
                rx={borderRadius}
                ry={borderRadius}
                fill={
                  filled
                    ? filledColor
                    : semiFilled
                      ? semiFilledColor
                      : emptyColor
                }
              />
            );
          })}
        </Svg>
      )}
    </View>
  );
}
