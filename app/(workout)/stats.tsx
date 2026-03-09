import ScaledPressable from "@/components/animated/scaled-pressable";
import BarChartInfo from "@/components/build-components/composite/bar-chart-info";
import ChartInfo from "@/components/build-components/composite/chart-info";
import StatsInfo from "@/components/build-components/composite/stats-info";
import PlusIcon from "@/components/icons/plus";
import Circle from "@/components/parts/circle";
import { Colors, typography } from "@/constants/theme";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <View style={styles.items}>
        <StatsInfo
          title="Weekly Progress"
          weeksRange="02 Mar - 08 Mar"
          totalProgress={4}
          currentProgress={2}
          items={[
            {
              exercisesCount: 5,
              workoutDuration: "60",
              workOutName: "Push",
              date: new Date("2026-03-09"),
            },
            {
              exercisesCount: 5,
              workoutDuration: "60",
              workOutName: "Push",
              date: new Date("2026-03-10"),
            },
            {
              exercisesCount: 5,
              workoutDuration: "80",
              workOutName: "Push",
              date: new Date("2026-03-11"),
            },
          ]}
        />
        <BarChartInfo
          data={[
            { y: 1, x: 1 },
            { y: 1, x: 2 },
            { y: 1, x: 3 },
            { y: 1, x: 4 },
            { y: 1, x: 5 },
            { y: 1, x: 6 },
            { y: 1, x: 7 },
          ]}
        />
        <View style={styles.workoutContainer}>
          <View style={styles.workoutSubContainer}>
            <View>
              <Text
                style={{
                  ...typography.mediumL,
                  color: Colors.general.color.grayTones.main,
                }}
              >
                {"Workout's Stats"}
              </Text>
              <Text
                style={{
                  ...typography.regularL,
                  color: Colors.general.color.grayTones.muted50,
                }}
              >
                245 total workouts
              </Text>
            </View>
            <AddButton onPress={() => console.log("Press button")} />
          </View>
          <ChartInfo
            data={[
              { y: 1, x: new Date("2026-02-01") },
              { y: 6, x: new Date("2026-02-02") },
              { y: 7, x: new Date("2026-02-03") },
              { y: 8, x: new Date("2026-02-04") },
              { y: 6, x: new Date("2026-02-05") },
            ]}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function AddButton({ onPress }: { onPress?: () => void }) {
  return (
    <ScaledPressable scaleTo={0.94} scaleDuration={150}>
      <Pressable onPressIn={onPress}>
        <Circle size={30} bgColor={Colors.general.color.darkTones.bgMiddle}>
          <PlusIcon
            width={18}
            height={18}
            color={Colors.general.color.grayTones.muted50}
          />
        </Circle>
      </Pressable>
    </ScaledPressable>
  );
}

const styles = StyleSheet.create({
  workoutContainer: {
    marginTop: 20,
  },
  workoutSubContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  screen: {
    flex: 1,
  },
  content: {
    padding: 8,
  },
  items: {
    gap: 12,
  },
});
