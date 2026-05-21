import { Colors } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export default function CheckCircle(props: {
  size?: number;
  checked?: boolean;
  setChecked?: (checked: boolean) => void;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const size = props.size || 88;

  return (
    <View
      style={[
        styles.outerRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: props.checked
            ? "#2196F3"
            : Colors.general.color.darkTones.bg,
        },
      ]}
    >
      <View
        style={[
          styles.innerDot,
          {
            width: size * 0.67,
            height: size * 0.67,
            borderRadius: (size * 0.67) / 2,
            backgroundColor: props.checked ? "#2196F3" : "transparent",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerRing: {
    borderWidth: 2,
    borderColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
  },
  innerDot: {
    backgroundColor: "#2196F3",
  },
});
