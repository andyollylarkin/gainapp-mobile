import { Colors } from "@/constants/theme";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Circle } from "react-native-progress";

function encodeVideoUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    parsed.pathname = parsed.pathname
      .split("/")
      .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
      .join("/");
    return parsed.toString();
  } catch {
    return url;
  }
}

export default function VideoPlayer({
  videoUrl,
  useCaching = true,
}: {
  videoUrl?: string;
  useCaching?: boolean;
}) {
  const player = useVideoPlayer(
    { uri: encodeVideoUrl(videoUrl), useCaching: useCaching },
    (playerInstance) => {
      playerInstance.loop = true;
      playerInstance.muted = true;
    },
  );

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!videoUrl) {
      setIsReady(false);
      return;
    }

    console.log("Video URL:", videoUrl);
  }, [videoUrl]);

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

  const showPlaceholder = !videoUrl || !isReady || error;

  return showPlaceholder ? (
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
        {!videoUrl ? (
          "No video available"
        ) : error ? (
          "Failed to load video"
        ) : (
          <Circle
            color={Colors.general.color.grayTones.muted40}
            size={40}
            indeterminate={true}
          />
        )}
      </Text>
    </View>
  ) : (
    <View style={{ width: "100%", height: 241, borderRadius: 24, overflow: "hidden" }}>
      <VideoView
        player={player}
        contentFit="cover"
        nativeControls={false}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
