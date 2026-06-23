import { Colors, typography } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";
import type { SlideProps } from "../index";

export default function Screen3({ onAnswer }: SlideProps) {
  return (
    <View style={styles.container}>
      <View style={styles.visualArea}>
        <View style={styles.backdropWrapper}>
          <Image
            source={require("../../../assets/onboarding/screen3/1.png")}
            style={styles.backdrop}
            resizeMode="cover"
            blurRadius={4}
          />
        </View>

        <View style={styles.cardContainer}>
          <Image
            source={require("../../../assets/onboarding/screen3/2.png")}
            style={styles.card}
            resizeMode="contain"
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

      <View style={styles.textArea}>
        <Text style={styles.title}>Smart progression</Text>
        <Text style={styles.subtitle}>
          {"Your workouts automatically adjust\nto keep you in progressive overload"}
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
    width: "120%",
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
