import TabViewComponent from "@/components/build-components/tab-view";
import { Colors, typography } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
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
                  videoUrl="https://nexus.devinside.tech/repository/binary-data/video/00011201-3-4-Sit-up_Waist.mp4"
                  description="Example description"
                />
              </TabViewComponent.TabItem>
              <TabViewComponent.TabItem tab-name="Info">
                <InfoTab />
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

function GuideTab(props: { videoUrl?: string; description?: string }) {
  const player = useVideoPlayer(props.videoUrl || "", (playerInstance) => {
    playerInstance.loop = true;
  });

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!props.videoUrl) {
      setIsReady(false);
      return;
    }

    console.log("Video URL:", props.videoUrl);
  }, [props.videoUrl]);

  useEffect(() => {
    const subscription = player.addListener("statusChange", (status) => {
      if (status.error) {
        console.error("Video error:", status.error);
        setError(true);
        setIsReady(false);
      } else if (status.status === "readyToPlay") {
        setIsReady(true);
        setError(false);
        player.play();
      } else if (status.status === "loading") {
        setIsReady(false);
      }
    });

    return () => subscription.remove();
  }, [player]);

  const showPlaceholder = !props.videoUrl || !isReady || error;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      {showPlaceholder ? (
        <View
          style={{
            width: "100%",
            height: 241,
            backgroundColor: Colors.general.color.darkTones.bgTray,
            borderRadius: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: Colors.general.color.grayTones.main }}>
            {!props.videoUrl
              ? "No video available"
              : error
                ? "Failed to load video"
                : "Loading video..."}
          </Text>
        </View>
      ) : (
        <VideoView
          player={player}
          style={{ width: "100%", height: 241, borderRadius: 24 }}
        />
      )}
      <Text
        style={{
          ...typography.regularM,
          color: Colors.general.color.grayTones.main,
          textAlign: "left",
          alignSelf: "flex-start",
          flex: 1,
          flexWrap: "wrap",
        }}
      >
        {props.description ?? "No description available."}
      </Text>
    </View>
  );
}

function InfoTab(): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: Colors.general.color.grayTones.muted40 }}>
        Info content
      </Text>
    </View>
  );
}

function StatsTab(): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: Colors.general.color.grayTones.muted40 }}>
        Stats content
      </Text>
    </View>
  );
}
