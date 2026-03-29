import { useEffect } from "react";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { G, Rect } from "react-native-svg";
import { ChartPointRenderProps } from "./chart";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const BAR_WIDTH = 24;
const DASH_GAP = 2;
const DURATION = 400;

function DashRect({
  x,
  bottomY,
  width,
  targetHeight,
  delay,
  color,
}: {
  x: number;
  bottomY: number;
  width: number;
  targetHeight: number;
  delay: number;
  color: string;
}) {
  const heightAnim = useSharedValue(0);
  const yAnim = useSharedValue(bottomY);

  useEffect(() => {
    heightAnim.value = withDelay(
      delay,
      withTiming(targetHeight, { duration: DURATION }),
    );
    yAnim.value = withDelay(
      delay,
      withTiming(bottomY - targetHeight, { duration: DURATION }),
    );
  }, [targetHeight, bottomY, delay]);

  const animatedProps = useAnimatedProps(() => ({
    height: heightAnim.value,
    y: yAnim.value,
  }));

  return (
    <AnimatedRect
      animatedProps={animatedProps}
      x={x}
      width={width}
      rx={6}
      ry={6}
      fill={color}
    />
  );
}

export default function Bar(props: ChartPointRenderProps) {
  const dashBars = Math.min(props.item.y, props.gridLinesCount ?? 0);
  const step = props.gridHeight ?? 40;
  const dashHeight = Math.max(step - DASH_GAP, 1);
  const chartBottom = props.chartHeight ?? 0;

  const color =
    typeof props.color === "function"
      ? props.color(props.index, props.item.y, props.item.x)
      : props.color;

  return (
    <G>
      {Array.from({ length: dashBars }).map((_, i) => (
        <DashRect
          key={i}
          x={props.x - BAR_WIDTH * 0.5}
          bottomY={chartBottom - i * step}
          width={BAR_WIDTH}
          targetHeight={dashHeight}
          delay={i * 60}
          color={color ?? "black"}
        />
      ))}
    </G>
  );
}
