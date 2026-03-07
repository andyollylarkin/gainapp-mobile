import Bar from "@/components/charts/bar";
import Chart, { ChartProps } from "@/components/charts/chart";
import FlameIcon from "@/components/icons/flame";
import Circle, { CircleIconContent } from "@/components/parts/circle";
import { Colors, typography } from "@/constants/theme";
import { useState } from "react";
import { LayoutChangeEvent, Text, View } from "react-native";

type ChartInfoProps = Pick<ChartProps, "data"> & {
  weeklyGoal?: number;
  weekStreak?: number;
};

export default function BarChartInfo(props: ChartInfoProps) {
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
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Circle bgColor="#FF9400" size={44}>
          <CircleIconContent>
            <FlameIcon width={24} height={24} color={"#4D2C00"} />
          </CircleIconContent>
        </Circle>
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
              ...typography.mediumL,
              color: Colors.general.color.grayTones.main,
            }}
          >
            {props.weekStreak ? `${props.weekStreak} Week Streak` : "No Streak"}
          </Text>
          <Text
            style={{
              ...typography.mediumM,
              color: Colors.general.color.grayTones.muted50,
            }}
          >
            {`Weekly Goal: ${props.weeklyGoal ?? 0} Workouts`}
          </Text>
        </View>
      </View>
      <View onLayout={onLayout}>
        {chartWidth > 0 && (
          <Chart
            {...props}
            step={1}
            yMin={0}
            width={chartWidth}
            height={168}
            pointWidth={24}
            renderPoint={(props) => <Bar {...props} color="#FF9400" />}
            formatYTick={(val) => `${val}`}
            formatXTick={(val) => `${val} W`}
            style={{
              grid: {
                color: Colors.general.color.grayTones.muted30,
                lastIndexColor: "#4D2C00",
                lastValueColor: "#FF9400",
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
