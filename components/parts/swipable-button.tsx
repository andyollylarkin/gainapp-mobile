import {
  type ColorValue,
  type GestureResponderEvent,
  Pressable,
  StyleSheet,
} from "react-native";

export interface SwipeableButtonProps {
  color: ColorValue;
  icon: React.ReactElement;
  text?: string;
  onPress?: (event: GestureResponderEvent) => void;
}

export default function SwipeableButton(props: SwipeableButtonProps) {
  return (
    <Pressable
      style={[styles.container, { backgroundColor: props.color }]}
      onPress={props.onPress}
    >
      {props.icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 44,
  },
});
