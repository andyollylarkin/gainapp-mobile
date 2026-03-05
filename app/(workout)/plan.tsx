import Chart from "@/components/charts/chart";
import { CirclePoint, LinePoint } from "@/components/charts/circle-point";
import { Colors, typography } from "@/constants/theme";
import { View, Text } from "react-native";

export default function PlanScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          backgroundColor: Colors.general.color.darkTones.bgTray,
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderRadius: 24,
          borderColor: Colors.general.color.darkTones.bgTray,
          borderWidth: 1,
          flexDirection: "column",
          gap: 12,
        }}
      >
        <View
          style={{ flexDirection: "column", gap: 2, alignItems: "flex-start",padding:4 }}
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
        <Chart
          width={362}
          height={168}
          data={[
            { y: 2, x: 1 },
            { y: 13, x: 2 },
            { y: 6, x: 3 },
            { y: 8, x: 4 },
            { y: 12, x: 5 },
            { y: 27, x: 6 },
            { y: 40, x: 7 },
          ]}
          renderPoint={(props) => <CirclePoint {...props} />}
          renderLine={(props) => <LinePoint {...props} strokeWidth={4} />}
          formatYTick={(val, _) => {
            return `${val} kg`;
          }}
          formatXTick={(val, _) => {
            console.log(val);
            return `${val} W`;
          }}
          style={{
            grid: {
              color: Colors.general.color.grayTones.muted30,
              lastIndexColor: "gray",
              opacity: 0.3,
              fontFamily: typography.mediumS.fontFamily,
              fontSize: typography.mediumS.fontSize,
            },
            showGrid: true,
            chartContainer: {
              color: "#27C2FF",
            },
          }}
        />
      </View>
    </View>
  );
}
