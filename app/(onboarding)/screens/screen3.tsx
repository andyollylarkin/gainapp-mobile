import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import type { SlideProps } from "../index";
import { ImageCachable } from "@/components/image-cachable";

export default function Screen3({ onAnswer }: SlideProps) {
  return (
    <View style={styles.container}>
      <View style={styles.visualArea}>
        <View style={styles.backdropWrapper}>
          <ImageCachable
            source={require("../../../assets/onboarding/screen3/1.png")}
            style={styles.backdrop}
            contentFit="cover"
            blurRadius={4}
          />
        </View>

        <View style={styles.cardContainer}>
          <ImageCachable
            source={require("../../../assets/onboarding/screen3/2.png")}
            style={styles.card}
            contentFit="contain"
          />
        </View>

        <LinearGradient
          colors={["#0a0a0a", "transparent"]}
          style={styles.fadeTop}
        />
        <LinearGradient
          colors={["transparent", "#0a0a0a"]}
          style={styles.fadeBottom}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  visualArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backdropWrapper: {
    position: "absolute",
    top: 20,
    left: 56,
    right: 60,
    bottom: 0,
    opacity: 0.5,
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  cardContainer: {
    alignItems: "center",
    width: "100%",
  },
  card: {
    bottom: 85,
    width: "120%",
    height: 400,
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
});
