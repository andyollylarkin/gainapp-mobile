import {
  type ColorValue,
  type GestureResponderEvent,
  Pressable,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from "react-native";

export interface SwipeableButtonProps {
  color: ColorValue;
  icon: React.ReactElement;
  text?: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}

export default function SwipeableButton(props: SwipeableButtonProps) {
  return (
    <Pressable
      style={[styles.container, { backgroundColor: props.color }, props.style]}
      onPress={props.onPress}
    >
      {props.icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});
