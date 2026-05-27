import SettingsIcon from "@/components/icons/settings";
import { Colors, typography } from "@/constants/theme";
import { useState } from "react";
import { Pressable, Text, View, Image } from "react-native";

interface ProfileHeaderProps {
  onSharePress?: () => void;
  onSettingsPress?: () => void;
  userName?: string;
  avatarUrl?: string;
}

export default function ProfileHeader({
  onSharePress,
  onSettingsPress,
  userName = "Unknown",
  avatarUrl,
}: ProfileHeaderProps) {
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

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
        {avatarUrl && !imageLoadError ? (
          <Image
            src={avatarUrl}
            onError={() => setImageLoadError(true)}
            style={{
              width: 30,
              aspectRatio: 1,
              maxWidth: 30,
              maxHeight: 30,
              borderRadius: 15,
            }}
          />
        ) : (
          <View
            style={{
              width: 30,
              aspectRatio: 1,
              maxWidth: 30,
              maxHeight: 30,
              borderRadius: 15,
              backgroundColor: Colors.general.color.grayTones.muted30,
            }}
          />
        )}
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
        {/* <Pressable onPress={onSharePress}>
          <ShareIcon
            width={30}
            height={30}
            color={Colors.general.color.grayTones.main}
          />
        </Pressable> */}
        <Pressable onPress={onSettingsPress}>
          <SettingsIcon
            width={30}
            height={30}
            color={Colors.general.color.grayTones.muted40}
          />
        </Pressable>
      </View>
    </View>
  );
}
