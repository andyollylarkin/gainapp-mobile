import { typography } from "@/constants/theme";
import { Pressable, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import IconProps from "../icons/props";

export interface CompositeButtonProps {
  text: "Go to next workout" | "Start today's workout";
  bgColor: string;
  textColor: string;
  icon?: React.ReactElement<IconProps>;
  onPress?: () => void;
}

export default function CompositeButton(props: CompositeButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withTiming(0.96, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 100 });
      }}
      onPress={props.onPress}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            backgroundColor: props.bgColor,
            paddingVertical: 16,
            paddingHorizontal: 29,
            borderRadius: 61,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          },
        ]}
      >
        {props.icon}
        <Text style={{ color: props.textColor, ...typography.mediumM }}>
          {props.text}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
