import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MultiplyIcon from "./icons/multiply-icon";

export interface HistoryTextProps {
  firstText: string;
  secondText: string;
  delimiter: string | React.ReactElement<typeof MultiplyIcon>;
  color: string;
}
export default function HistoryText({
  firstText,
  secondText,
  delimiter,
  color,
}: HistoryTextProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{firstText}</Text>
      {typeof delimiter === "string" ? (
        <Text style={[styles.delimiter, { color }]}>{delimiter}</Text>
      ) : (
        delimiter
      )}
      <Text style={styles.text}>{secondText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    color: Colors.general.color.grayTones.muted40,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  delimiter: {
    marginHorizontal: 4,
  },
});
