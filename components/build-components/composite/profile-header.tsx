import SettingsIcon from "@/components/icons/settings";
import ShareIcon from "@/components/icons/share";
import { Colors, typography } from "@/constants/theme";
import { Pressable, Text, View } from "react-native";

interface ProfileHeaderProps {
  onSharePress?: () => void;
  onSettingsPress?: () => void;
  userName?: string;
}

export default function ProfileHeader({
  onSharePress,
  onSettingsPress,
  userName = "Unknown",
}: ProfileHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 4,
        paddingBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View
          style={{
            width: 30,
            aspectRatio: 1,
            maxWidth: 30,
            maxHeight: 30,
            borderRadius: 15,
            backgroundColor: Colors.general.color.grayTones.muted30,
          }}
        ></View>
        <Text
          style={{
            ...typography.mediumXL,
            color: Colors.general.color.grayTones.main,
          }}
        >
          {userName}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Pressable onPress={onSharePress}>
          <ShareIcon
            width={30}
            height={30}
            color={Colors.general.color.grayTones.main}
          />
        </Pressable>
        <Pressable onPress={onSettingsPress}>
          <SettingsIcon
            width={30}
            height={30}
            color={Colors.general.color.grayTones.main}
          />
        </Pressable>
      </View>
    </View>
  );
}
