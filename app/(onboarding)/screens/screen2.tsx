import { Image, StyleSheet, View } from "react-native";
import type { SlideProps } from "../index";

export default function Screen2({ onAnswer }: SlideProps) {
  return (
    <View style={styles.container}>
      <View style={styles.visualArea}>
        <View style={styles.backdropWrapper}>
          <Image
            source={require("../../../assets/onboarding/screen2/1.png")}
            style={styles.backdrop}
            resizeMode="cover"
            blurRadius={4}
          />
        </View>

        <Image
          source={require("../../../assets/onboarding/screen2/3.png")}
          style={styles.shadow}
          resizeMode="stretch"
        />

        <Image
          source={require("../../../assets/onboarding/screen2/2.png")}
          style={styles.card}
          resizeMode="contain"
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
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  backdropWrapper: {
    position: "absolute",
    top: 40,
    left: 56,
    right: 60,
    bottom: 0,
    opacity: 0.5,
    overflow: "hidden",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  card: {
    bottom: 130,
    width: "85%",
    height: "75%",
  },
  shadow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: 80,
  },
});
