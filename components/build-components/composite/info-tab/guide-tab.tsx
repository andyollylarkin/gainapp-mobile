import { Colors, typography } from "@/constants/theme";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function GuideTab(props: {
  videoUrl?: string;
  description?: string;
}) {
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
