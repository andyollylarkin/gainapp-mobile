import { Colors, typography } from "@/constants/theme";
import { Image, StyleSheet, Text, View } from "react-native";
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

      <View style={styles.textArea}>
        <Text style={styles.title}>Personal plan</Text>
        <Text style={styles.subtitle}>
          {"Get an AI-generated workout plan\ntailored to your goals and experience"}
        </Text>
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
  textArea: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: "center",
    gap: 12,
  },
  title: {
    ...typography.mediumExtra,
    fontSize: 40,
    lineHeight: 48,
    color: Colors.general.color.grayTones.main,
    textAlign: "center",
  },
  subtitle: {
    ...typography.regularM,
    color: Colors.general.color.grayTones.muted50,
    textAlign: "center",
    lineHeight: 22,
  },
});
