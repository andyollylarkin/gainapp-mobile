import { Fonts, useAppFonts } from "@/constants/theme";
import { StyleSheet, TextInput } from "react-native";

export interface InputFieldProps {
  bgColor: string;
  textColor: string;
  value?: string;
  type?: "text" | "number" | "password";
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
    fontWeight: "regular",
    fontSize: 14,
    lineHeight: 16.8,
    fontFamily: Fonts.sans,
  },
});
