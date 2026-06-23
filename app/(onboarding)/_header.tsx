import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ArrowIcon from "@/components/icons/arrow";
import { Colors } from "@/constants/theme";

type OnboardingHeaderProps = {
  index: number;
  total: number;
  onBack: () => void;
};

export default function OnboardingHeader({ index, total, onBack }: OnboardingHeaderProps) {
  const insets = useSafeAreaInsets();

  const progressStyle = useAnimatedStyle(() => ({
    width: withTiming(`${(index / total) * 100}%` as any, { duration: 300 }),
  }));

  return (
    <View style={[styles.header, { top: insets.top + 20 }]}>
      <Pressable
        style={[styles.backButton, { opacity: index === 0 ? 0.3 : 1 }]}
        onPress={onBack}
        disabled={index === 0}
      >
        <ArrowIcon
          width={16}
          height={16}
          color={Colors.general.color.grayTones.muted50}
          direction="left"
        />
      </Pressable>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 39,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.general.color.darkTones.bgMiddle,
    justifyContent: "center",
    alignItems: "center",
  },
  progressTrack: {
    width: 224,
    height: 4,
    borderRadius: 10,
    backgroundColor: Colors.general.color.grayTones.muted30,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    borderRadius: 10,
    backgroundColor: Colors.general.color.grayTones.main,
  },
});
