import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import ChartIcon from "@/components/icons/chart";
import PlanIcon from "@/components/icons/plan";
import WorkoutIcon from "@/components/icons/workout";
import { Colors, typography } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors.general.color.grayTones.main,
        tabBarInactiveTintColor: Colors.general.color.grayTones.muted30,
        tabBarLabelStyle: {
          marginTop: 6,
          ...typography.semiBoldS,
        },
        sceneStyle: {
          backgroundColor: Colors.general.color.darkTones.bg,
        },
        tabBarStyle: {
          backgroundColor: Colors.general.color.darkTones.bg,
          borderTopColor: Colors.general.color.darkTones.bg,
        },
      }}
    >
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ focused }) => {
            const color = focused
              ? Colors.general.color.grayTones.main
              : Colors.general.color.grayTones.muted30;
            return <ChartIcon color={color} width={24} height={24} />;
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Workout",
          tabBarIcon: ({ focused }) => {
            const color = focused
              ? Colors.general.color.grayTones.main
              : Colors.general.color.grayTones.muted30;
            return <WorkoutIcon color={color} width={24} height={24} />;
          },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plans",
          tabBarIcon: ({ focused }) => {
            const color = focused
              ? Colors.general.color.grayTones.main
              : Colors.general.color.grayTones.muted30;
            return <PlanIcon color={color} width={24} height={24} />;
          },
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
