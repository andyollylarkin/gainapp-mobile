import { ColorValue, StyleSheet, View } from "react-native";

export interface BoxProps {
  borderColor: ColorValue;
  bgColor: ColorValue;
  children: React.ReactNode;
}

export default function Box(props: BoxProps) {
  const { children, borderColor, bgColor } = props;
  return (
    <View style={[styles.box, { borderColor, backgroundColor: bgColor }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 24,
    borderWidth: 2,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxHeight: 130,
  },
});
