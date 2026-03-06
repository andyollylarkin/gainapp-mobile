import ChartInfo from "@/components/build-components/composite/ChartInfo";
import StatsInfo from "@/components/build-components/composite/stats-info";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
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
              date: new Date("2026-03-05"),
            },
            {
              exercisesCount: 5,
              workoutDuration: "60",
              workOutName: "Push",
              date: new Date("2026-03-06"),
            },
            {
              exercisesCount: 5,
              workoutDuration: "60",
              workOutName: "Push",
              date: new Date("2026-03-07"),
            },
          ]}
        />
        <ChartInfo
          data={[
            { y: 1, x: 2 },
            { y: 6, x: 3 },
            { y: 6, x: 4 },
          ]}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
