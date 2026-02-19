import { Colors, typography, useAppFonts } from "@/constants/theme";
import { StyleSheet, TextInput } from "react-native";

type bgColor =
  | (typeof Colors)["general"]["color"]["darkTones"]["bgMiddle"]
  | (typeof Colors)["general"]["color"]["blueTones"]["main"]
  | (typeof Colors)["general"]["color"]["greenTones"]["greenMain"]
  | (typeof Colors)["general"]["color"]["greenTones"]["greenBgLight"]
  | (typeof Colors)["general"]["color"]["goldTones"]["goldMain"]
  | (typeof Colors)["general"]["color"]["goldTones"]["goldBgLight"];

type textColor =
  | (typeof Colors)["general"]["color"]["grayTones"]["main"]
  | (typeof Colors)["general"]["color"]["greenTones"]["greenBgLight"]
  | (typeof Colors)["general"]["color"]["greenTones"]["greenMain"]
  | (typeof Colors)["general"]["color"]["blueTones"]["main"]
  | (typeof Colors)["general"]["color"]["goldTones"]["goldBgLight"]
  | (typeof Colors)["general"]["color"]["goldTones"]["goldMain"];

export interface InputFieldProps {
  bgColor: bgColor;
  textColor: textColor;
  value?: string;
  type?: "text" | "number" | "password";
  placeholder?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
}

export default function InputField(props: InputFieldProps) {
  const fieldType = props.type || "text";
  useAppFonts();

  return (
    <TextInput
      value={props.value}
      onChangeText={props.onChange}
      keyboardType={fieldType === "number" ? "numeric" : "default"}
      placeholder={props.placeholder}
      secureTextEntry={fieldType === "password"}
      placeholderTextColor={props.textColor}
      style={[
        styles.input,
        {
          backgroundColor: props.bgColor,
          color: props.textColor,
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
