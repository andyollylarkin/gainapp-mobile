import { Colors } from "@/constants/theme";
import { RefObject } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import CrossIcon from "../icons/cross";
import MultiplyIcon from "../icons/multiply-icon";
import InputField, { BgColor, TextColor } from "../parts/input-field";

export interface TwoFieldProps {
  delimiter: "x" | "|";
  delimiterColor?: string;
  fieldColor: BgColor;
  textColor: TextColor;
  selectColor: BgColor;
  selectTextColor: TextColor;
  defaultValue?: string;
  firstFieldValue?: string;
  secondFieldValue?: string;
  onFirstFieldChange?: (value: string) => void;
  onSecondFieldChange?: (value: string) => void;
  onFieldBlur?: () => void;
  onFieldSelect: (
    obj: RefObject<TextInput | null>,
    value: string,
    setValue: (nextValue: string) => void,
  ) => void;
}

export default function TwoField(props: TwoFieldProps) {
  const delimiter =
    props.delimiter === "x" ? (
      <MultiplyIcon
        width={16}
        height={16}
        color={props.delimiterColor || Colors.general.color.grayTones.muted50}
      />
    ) : (
      <CrossIcon
        width={16}
        height={16}
        color={props.delimiterColor || Colors.general.color.grayTones.muted50}
      />
    );

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <InputField
          type="number"
          placeholder={props.defaultValue}
          value={props.firstFieldValue}
          maxNumberValue={100}
          bgColor={props.fieldColor}
          textColor={props.textColor}
          selectColor={props.selectColor}
          selectTextColor={props.selectTextColor}
          onChange={props.onFirstFieldChange}
          onFocus={props.onFieldSelect}
          onBlur={props.onFieldBlur}
        />
      </View>
      <View style={styles.delimiterContainer}>{delimiter}</View>
      <View style={styles.inputWrapper}>
        <InputField
          type="number"
          placeholder={props.defaultValue}
          value={props.secondFieldValue}
          maxNumberValue={100}
          bgColor={props.fieldColor}
          textColor={props.textColor}
          selectColor={props.selectColor}
          selectTextColor={props.selectTextColor}
          onChange={props.onSecondFieldChange}
          onFocus={props.onFieldSelect}
          onBlur={props.onFieldBlur}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 139,
    height: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  inputWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    minWidth: 0,
  },
  delimiterContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
});
