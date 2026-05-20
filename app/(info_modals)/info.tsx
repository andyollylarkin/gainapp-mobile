import AdjustTimerModal from "@/components/build-components/composite/adjust-timer-modal";
import GuideTab from "@/components/build-components/composite/info-tab/guide-tab";
import InfoTab from "@/components/build-components/composite/info-tab/info-tab";
import StatsTab from "@/components/build-components/composite/info-tab/stats-tab";
import Modal from "@/components/build-components/composite/modal";
import TabViewComponent from "@/components/build-components/tab-view";
import { Colors, typography } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InfoModal() {
  const params: { title: string } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const modalHeaderOverlayHeight = insets.top + 22;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.general.color.darkTones.bg,
        position: "relative",
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 12,
          paddingTop: modalHeaderOverlayHeight,
          paddingBottom: 24 + insets.bottom,
          paddingHorizontal: 8,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Text
            style={{
              ...typography.mediumL,
              color: Colors.general.color.grayTones.main,
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            {params.title}
          </Text>
          <View style={{ width: "100%" }}>
            <TabViewComponent.View>
              <TabViewComponent.TabItem tab-name="Guide">
                <GuideTab
                  videoUrl="https://nexus.devinside.tech/repository/binary-data/video/00011201-3-4-Sit-up_Waist.mp4" //TODO: replace with real URL
                  description="Example description"
                />
              </TabViewComponent.TabItem>
              <TabViewComponent.TabItem tab-name="Info">
                <InfoTab
                  muscles={{
                    primary: "Biceps",
                    secondary: "Chest",
                  }}
                  equipment={[
                    { imageUrl: "", name: "Barbell" },
                    { imageUrl: "", name: "Dumbbell" },
                  ]} //TODO: replace with real data
                />
              </TabViewComponent.TabItem>
              <TabViewComponent.TabItem tab-name="Stats">
                <StatsTab />
              </TabViewComponent.TabItem>
            </TabViewComponent.View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
