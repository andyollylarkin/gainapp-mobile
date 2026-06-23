import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import type { SlideProps } from "../index";
import { ImageCachable } from "@/components/image-cachable";
const backdrop = require("../../../assets/onboarding/screen1/1.png") as number;

export default function Screen1({ onAnswer }: SlideProps) {
  return (
    <View style={styles.container}>
      <View style={styles.backdropWrapper}>
        <ImageCachable
          source={backdrop}
          style={styles.backdrop}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </View>

      <LinearGradient
        colors={["#0a0a0a", "transparent"]}
        style={styles.fadeTop}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdropWrapper: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
});
