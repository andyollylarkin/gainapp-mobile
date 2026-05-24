import { Colors, typography } from "@/constants/theme";
import { Text, View } from "react-native";
import VideoPlayer from "./video-player";

export default function GuideTab(props: {
  videoUrl?: string;
  description?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <VideoPlayer videoUrl={props.videoUrl} />
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
