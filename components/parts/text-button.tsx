import { typography } from "@/constants/theme";
import { Pressable, StyleSheet, Text } from "react-native";

export interface TextButtonProps {
  text: string;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
}

export default function TextButton({
  text,
  bgColor,
  textColor,
  onClick,
}: TextButtonProps) {
  return (
    <Pressable
      onPress={onClick}
      style={{ backgroundColor: bgColor, ...styles.button }}
    >
      <Text style={{ color: textColor, ...styles.text }}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 38,
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    textAlign: "center",
  },
  text: {
    ...typography.mediumM,
  },
});
