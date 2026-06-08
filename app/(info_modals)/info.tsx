import GuideTab from "@/components/build-components/composite/info-tab/guide-tab";
import InfoTab from "@/components/build-components/composite/info-tab/info-tab";
import StatsTab from "@/components/build-components/composite/info-tab/stats-tab";
import TabViewComponent from "@/components/build-components/tab-view";
import { Colors, typography } from "@/constants/theme";
import {
  getExerciseInfo,
  ExerciseInfoResponse,
} from "@/logic/api/exercise-info";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InfoModal() {
  const params: { title: string; exerciseId: string } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const modalHeaderOverlayHeight = insets.top + 22;

  const [exerciseInfo, setExerciseInfo] = useState<ExerciseInfoResponse | null>(
    null,
  );

  useEffect(() => {
    if (!params.exerciseId) return;
    getExerciseInfo(params.exerciseId)
      .then(setExerciseInfo)
      .catch((err) => console.warn("Failed to load exercise info", err));
  }, [params.exerciseId]);

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
            {exerciseInfo?.title ?? params.title}
          </Text>
          <View style={{ width: "100%" }}>
            <TabViewComponent.View>
              <TabViewComponent.TabItem tab-name="Guide">
                <GuideTab
                  videoUrl={exerciseInfo?.videoUrl ?? undefined}
                  description={exerciseInfo?.description ?? undefined}
                />
              </TabViewComponent.TabItem>
              <TabViewComponent.TabItem tab-name="Info">
                <InfoTab
                  muscles={{
                    primary: (exerciseInfo?.muscles.primary ??
                      "") as MuscleGroup,
                    secondary: (exerciseInfo?.muscles.secondary ??
                      "") as MuscleGroup,
                  }}
                  equipment={
                    exerciseInfo?.equipment.map((eq) => ({
                      name: eq.name,
                      imageUrl: eq.imageUrl ?? "",
                    })) ?? []
                  }
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
