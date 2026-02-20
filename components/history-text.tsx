import { Colors, typography } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MultiplyIcon from "./icons/multiply-icon";
import CrossIcon from "./icons/cross";

export interface HistoryTextProps {
  firstText: string | number;
  secondText: string | number;
  delimiter:
    | string
    | React.ReactElement<
        typeof MultiplyIcon | React.ReactElement<typeof CrossIcon>
      >;
  color: string;
}
export default function HistoryText({
  firstText,
  secondText,
  delimiter,
}: HistoryTextProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{firstText}</Text>
      <View style={styles.delimiter}>{delimiter}</View>
      <Text style={styles.text}>{secondText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    ...typography.mediumM,
    color: Colors.general.color.grayTones.muted40,
    textAlign: "center",
  },
  delimiter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
