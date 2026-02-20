import { Colors } from "@/constants/theme";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MultiplyIcon from "../icons/multiply-icon";
import InputField, { BgColor, TextColor } from "../parts/input-field";
import CrossIcon from "../icons/cross";

export interface TwoFieldProps {
  delimiter: "x" | "|";
  fieldColor: BgColor;
  textColor: TextColor;
  selectColor: BgColor;
  selectTextColor: TextColor;
}

export default function TwoField(props: TwoFieldProps) {
  const delimiter =
    props.delimiter === "x" ? (
      <MultiplyIcon
        color={Colors.general.color.grayTones.muted50}
        width={16}
        height={16}
      />
    ) : (
      <CrossIcon
        color={Colors.general.color.grayTones.muted50}
        width={16}
        height={16}
      />
    );
  return (
    <View style={styles.container}>
      <InputField
        bgColor={props.fieldColor}
        textColor={props.textColor}
        selectColor={props.selectColor}
        selectTextColor={props.selectTextColor}
      />
      {delimiter}
      <InputField
        bgColor={props.fieldColor}
        textColor={props.textColor}
        selectColor={props.selectColor}
        selectTextColor={props.selectTextColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 139,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
