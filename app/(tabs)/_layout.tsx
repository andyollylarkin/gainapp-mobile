import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
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
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => null,
        }}
      />
    </Tabs>
  );
}
