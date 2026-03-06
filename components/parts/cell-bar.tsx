import { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

export interface CellBarProps {
  max: number;
  current: number;
  filledColor?: string;
  emptyColor?: string;
  height?: number;
  borderRadius?: number;
  gap?: number;
}

export default function CellBar({
  max,
  current,
  filledColor = "#41DD42",
  emptyColor = "#2A2A2A",
  height = 6,
  borderRadius = 3,
  gap = 3,
}: CellBarProps) {
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const count = Math.max(max, 1);
  const cellWidth = (width - gap * (count - 1)) / count;

  return (
    <View onLayout={onLayout} style={{ width: "100%", height }}>
      {width > 0 && (
        <Svg width={width} height={height}>
          {Array.from({ length: count }).map((_, i) => {
            const x = i * (cellWidth + gap);
            const filled = i < current;
            return (
              <Rect
                key={i}
                x={x}
                y={0}
                width={cellWidth}
                height={height}
                rx={borderRadius}
                ry={borderRadius}
                fill={filled ? filledColor : emptyColor}
              />
            );
          })}
        </Svg>
      )}
    </View>
  );
}
