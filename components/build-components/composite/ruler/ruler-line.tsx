import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, useWindowDimensions, View } from "react-native";
import Svg, { Rect, Text } from "react-native-svg";
import { useRef, useEffect, memo, Fragment, forwardRef, useImperativeHandle } from "react";
import { Colors } from "@/constants/theme";

const BG = Colors.general.color.darkTones.bg;

const LINE_WIDTH = 2;
const LINE_GAP = 12;
const STEP = LINE_WIDTH + LINE_GAP;
const TOTAL_LINES = 1001;
const COLOR = Colors.general.color.grayTones.muted30;
const SVG_HEIGHT = 60;

function getLineHeight(index: number): number {
  if (index % 100 === 0) return 38;
  if (index % 10 === 0) return 32;
  return 27;
}

const RulerTicks = memo(function RulerTicks({ totalWidth }: { totalWidth: number }) {
  return (
    <Svg width={totalWidth} height={SVG_HEIGHT}>
      {Array.from({ length: TOTAL_LINES }, (_, i) => {
        const x = i * STEP;
        const h = getLineHeight(i);
        const hasLabel = i % 10 === 0;
        return (
          <Fragment key={i}>
            <Rect x={x} y={0} width={LINE_WIDTH} height={h} fill={COLOR} />
            {hasLabel && (
              <Text
                x={x + LINE_WIDTH / 2}
                y={SVG_HEIGHT - 4}
                fontSize={14}
                fontWeight="400"
                fontFamily="Inter-Regular"
                fill={COLOR}
                textAnchor="middle"
              >
                {i}
              </Text>
            )}
          </Fragment>
        );
      })}
    </Svg>
  );
});

interface RulerLineProps {
  initialValue?: number;
  onValueChange?: (value: number) => void;
}

export interface RulerLineHandle {
  scrollTo: (value: number) => void;
}

const RulerLine = forwardRef<RulerLineHandle, RulerLineProps>(function RulerLine(
  { initialValue = 0, onValueChange },
  ref
) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const totalWidth = TOTAL_LINES * STEP;
  const padding = width / 2;
  const initialValueRef = useRef(initialValue);

  useImperativeHandle(ref, () => ({
    scrollTo: (value: number) => {
      scrollRef.current?.scrollTo({ x: value * STEP, animated: true });
    },
  }));

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: initialValueRef.current * STEP, animated: false });
  }, [width]);

  return (
    <View style={{ height: SVG_HEIGHT }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={STEP}
        decelerationRate={0.9987}
        onScroll={(e) => {
          const offset = e.nativeEvent.contentOffset.x;
          const value = Math.round(offset / STEP);
          onValueChange?.(value);
        }}
        scrollEventThrottle={16}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: padding }} />
          <RulerTicks totalWidth={totalWidth} />
          <View style={{ width: padding }} />
        </View>
      </ScrollView>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: padding - LINE_WIDTH / 2,
          top: 0,
          width: LINE_WIDTH,
          height: 38,
          backgroundColor: "#FFFFFF",
        }}
      />
      <LinearGradient
        pointerEvents="none"
        colors={[BG, `${BG}00`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ position: "absolute", left: 0, top: 0, width: 140, height: SVG_HEIGHT }}
      />
      <LinearGradient
        pointerEvents="none"
        colors={[`${BG}00`, BG]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ position: "absolute", right: 0, top: 0, width: 140, height: SVG_HEIGHT }}
      />
    </View>
  );
});

export default RulerLine;
