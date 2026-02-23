import IconProps from "@/components/icons/props";
import { typography } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export interface TextButtonProps {
  text: string;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
  icon?: React.ReactElement<IconProps, React.ComponentType<IconProps>>;
}

export default function TextButton({
  text,
  bgColor,
  textColor,
  onClick,
  icon,
}: TextButtonProps) {
  return (
    <Pressable
      onPress={onClick}
      style={{ backgroundColor: bgColor, ...styles.button }}
    >
      {icon && icon}
      <Text style={{ color: textColor, ...styles.text }}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 38,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    textAlign: "center",
    gap: 6,
  },
  text: {
    ...typography.mediumM,
  },
});
