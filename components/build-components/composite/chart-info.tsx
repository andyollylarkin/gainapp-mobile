import Chart, { ChartProps } from "@/components/charts/chart";
import { CirclePoint, LinePoint } from "@/components/charts/circle-point";
import { Colors, typography } from "@/constants/theme";
import { useState } from "react";
import { LayoutChangeEvent, Text, View } from "react-native";
import ThreeDotsButton from "../three-dots-button";
import ScaledPressable from "@/components/animated/scaled-pressable";

type ChartInfoProps = Pick<ChartProps, "data">;

export default function ChartInfo(props: ChartInfoProps) {
  const [chartWidth, setChartWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setChartWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      style={{
        backgroundColor: Colors.general.color.darkTones.bgTray,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 24,
        borderColor: Colors.general.color.darkTones.bgMiddle,
        borderWidth: 2,
        flexDirection: "column",
        gap: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            gap: 2,
            alignItems: "flex-start",
            padding: 4,
          }}
        >
          <Text
            style={{
              ...typography.mediumM,
              color: Colors.general.color.grayTones.muted30,
            }}
          >
            Push Workout
          </Text>
          <Text
            style={{
              ...typography.mediumM,
              color: Colors.general.color.grayTones.main,
            }}
          >
            Total Volume
          </Text>
        </View>
        <ScaledPressable scaleTo={0.94} scaleDuration={150}>
          <ThreeDotsButton color={Colors.general.color.darkTones.bgMiddle} />
        </ScaledPressable>
      </View>
      <View onLayout={onLayout}>
        {chartWidth > 0 && (
          <Chart
            {...props}
            width={chartWidth}
            height={168}
            pointWidth={24}
            renderPoint={(props) => <CirclePoint {...props} color="#27C2FF" />}
            renderLine={(props) => <LinePoint strokeWidth={4} {...props} />}
            formatYTick={(val) => `${val} k`}
            formatXTick={(val) => {
              const d = new Date(val);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
            style={{
              grid: {
                color: Colors.general.color.grayTones.muted30,
                lastIndexColor: Colors.general.color.grayTones.muted30,
                lastValueColor: Colors.general.color.grayTones.muted30,
                opacity: 0.4,
                fontFamily: typography.mediumS.fontFamily,
                fontSize: typography.mediumS.fontSize,
              },
              showGrid: true,
              chartContainer: {
                color: "#27C2FF",
              },
            }}
          />
        )}
      </View>
    </View>
  );
}
