import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.modalCard}>
        <Text style={styles.title}>Modal Window</Text>
        <Text style={styles.description}>Окно открыто из app/_layout.tsx.</Text>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.general.color.darkTones.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    backgroundColor: Colors.general.color.darkTones.bgMiddle,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  description: {
    color: Colors.general.color.grayTones.muted50,
    fontSize: 14,
  },
  closeButton: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.general.color.grayTones.muted50,
  },
  closeText: {
    color: Colors.general.color.darkTones.bg,
    fontWeight: "600",
  },
});
