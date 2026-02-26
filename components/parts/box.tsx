import { ColorValue, Pressable, StyleSheet, View } from "react-native";

export interface BoxProps {
  borderColor: ColorValue;
  bgColor: ColorValue;
  children: React.ReactNode;
  paddingHorizontal?: number;
  paddingVertical?: number;
  radiusTop?: number;
  radiusBottom?: number;
  onPress?: () => void;
}

export default function Box(props: BoxProps) {
  const {
    children,
    borderColor,
    bgColor,
    radiusTop,
    radiusBottom,
    paddingHorizontal,
    paddingVertical,
  } = props;
  return (
    <Pressable onPress={props.onPress} style={{ width: "100%" }}>
      <View
        style={[
          styles.box,
          {
            borderColor,
            backgroundColor: bgColor,
            borderTopLeftRadius: radiusTop ?? 6,
            borderTopRightRadius: radiusTop ?? 6,
            borderBottomLeftRadius: radiusBottom ?? 6,
            borderBottomRightRadius: radiusBottom ?? 6,
            paddingHorizontal: paddingHorizontal ?? 12,
            paddingVertical: paddingVertical ?? 12,
          },
        ]}
      >
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 6,
    borderWidth: 2,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxHeight: 130,
  },
});
