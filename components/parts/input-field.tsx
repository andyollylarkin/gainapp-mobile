import { Colors, typography } from "@/constants/theme";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

export type BgColor =
  | (typeof Colors)["general"]["color"]["darkTones"]["bgMiddle"]
  | (typeof Colors)["general"]["color"]["blueTones"]["main"]
  | (typeof Colors)["general"]["color"]["greenTones"]["greenMain"]
  | (typeof Colors)["general"]["color"]["greenTones"]["greenBgLight"]
  | (typeof Colors)["general"]["color"]["goldTones"]["goldMain"]
  | (typeof Colors)["general"]["color"]["goldTones"]["goldBgLight"]
  | (typeof Colors)["general"]["color"]["darkTones"]["bgLight"];

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
  maxLength?: number;
  maxNumberValue?: number;
  onChange?: (value: string) => void;
  onClick?: () => void;
  onFocus?: () => void;
}

export default function InputField(props: InputFieldProps) {
  const fieldType = props.type || "text";
  const [selectedField, setSelectedField] = useState<boolean>(false);
  const [innerValue, setInnerValue] = useState<string>(props.value ?? "");

  useEffect(() => {
    if (props.value !== undefined) {
      setInnerValue(props.value);
    }
  }, [props.value]);

  const sanitizeNumberValue = (value: string) => {
    const normalized = value.replace(/,/g, ".").replace(/[^\d.]/g, "");
    const firstDotIndex = normalized.indexOf(".");

    if (firstDotIndex === -1) {
      return normalized;
    }

    const integerPart = normalized.slice(0, firstDotIndex);
    const decimalPart = normalized.slice(firstDotIndex + 1).replace(/\./g, "");
    return `${integerPart}.${decimalPart}`;
  };

  const handleChangeText = (value: string) => {
    let nextValue = fieldType === "number" ? sanitizeNumberValue(value) : value;

    if (fieldType === "number" && props.maxNumberValue !== undefined) {
      const numericValue = parseFloat(nextValue);
      if (!isNaN(numericValue) && numericValue > props.maxNumberValue) {
        nextValue = props.maxNumberValue.toString();
      }
    }

    setInnerValue(nextValue);

    props.onChange?.(nextValue);
  };

  return (
    <TextInput
      value={innerValue}
      onFocus={() => {
        setSelectedField(true);
        if (props.onFocus) {
          props.onFocus();
        }
      }}
      onBlur={(e) => {
        setSelectedField(false);
      }}
      onChangeText={handleChangeText}
      keyboardType={fieldType === "number" ? "numeric" : "default"}
      placeholder={props.placeholder}
      secureTextEntry={fieldType === "password"}
      placeholderTextColor={props.textColor}
      maxLength={props.maxLength}
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
    height: "100%",
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: "center",
    textAlignVertical: "center",
    ...typography.mediumM,
  },
});
