import { Colors, typography, useAppFonts } from "@/constants/theme";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

export type BgColor =
  | (typeof Colors)["general"]["color"]["darkTones"]["bgMiddle"]
  | (typeof Colors)["general"]["color"]["blueTones"]["main"]
  | (typeof Colors)["general"]["color"]["greenTones"]["greenMain"]
  | (typeof Colors)["general"]["color"]["greenTones"]["greenBgLight"]
  | (typeof Colors)["general"]["color"]["goldTones"]["goldMain"]
  | (typeof Colors)["general"]["color"]["goldTones"]["goldBgLight"];

export type TextColor =
  | (typeof Colors)["general"]["color"]["grayTones"]["main"]
  | (typeof Colors)["general"]["color"]["greenTones"]["greenBgLight"]
  | (typeof Colors)["general"]["color"]["greenTones"]["greenMain"]
  | (typeof Colors)["general"]["color"]["blueTones"]["main"]
  | (typeof Colors)["general"]["color"]["goldTones"]["goldBgLight"]
  | (typeof Colors)["general"]["color"]["goldTones"]["goldMain"];

export interface InputFieldProps {
  bgColor: BgColor;
  textColor: TextColor;
  selectColor?: BgColor;
  selectTextColor?: TextColor;
  value?: string;
  type?: "text" | "number" | "password";
  placeholder?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
  onFocus?: () => void;
}

export default function InputField(props: InputFieldProps) {
  const fieldType = props.type || "text";
  useAppFonts();
  const [selectedField, setSelectedField] = useState<boolean>(false);

  return (
    <TextInput
      value={props.value}
      onFocus={() => {
        setSelectedField(true);
        if (props.onFocus) {
          props.onFocus();
        }
      }}
      onBlur={(e) => {
        setSelectedField(false);
      }}
      onChangeText={props.onChange}
      keyboardType={fieldType === "number" ? "numeric" : "default"}
      placeholder={props.placeholder}
      secureTextEntry={fieldType === "password"}
      placeholderTextColor={props.textColor}
      style={[
        styles.input,
        {
          backgroundColor: selectedField ? props.selectColor : props.bgColor,
          color: selectedField ? props.selectTextColor : props.textColor,
        },
      ]}
      onTouchStart={props.onClick}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: "center",
    ...typography.mediumM,
  },
});
