import TrashIcon from "@/components/icons/trash";
import SwipeableButton from "@/components/parts/swipable-button";
import { Colors } from "@/constants/theme";
import { useState } from "react";
import { StyleSheet } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import SetItem, { SetItemProps } from "./set-item";

export default function SwipeableSet(
  props: SetItemProps & {
    onSwipeEnd?: (direction: "left" | "right") => void;
    disabled?: boolean;
  },
) {
  const { onSwipeEnd, disabled, ...setItemProps } = props;

  return (
    <Swipeable
      enabled={!disabled}
      containerStyle={styles.swipeable}
      friction={1}
      enableTrackpadTwoFingerGesture
      rightThreshold={10}
      onSwipeableOpen={(direction) => {
        if (onSwipeEnd) {
          onSwipeEnd(direction);
        }
      }}
      renderRightActions={
        disabled
          ? undefined
          : (progress, dragX) => <RightAction dragX={dragX} />
      }
    >
      <SetItem {...setItemProps} />
    </Swipeable>
  );
}

function RightAction({ dragX }: { dragX: SharedValue<number> }) {
  const [actionWidth, setActionWidth] = useState(0);

  const iconStyle = useAnimatedStyle(() => {
    const width = actionWidth || 1;
    const visibleWidth = Math.min(Math.max(-dragX.value, 0), width);
    const translateX = (width - visibleWidth) / 2;
    return { transform: [{ translateX }] };
  });

  return (
    <Animated.View
      style={styles.rightAction}
      onLayout={(event) => setActionWidth(event.nativeEvent.layout.width)}
    >
      <SwipeableButton
        color={Colors.general.color.redTones.redBgLight}
        icon={
          <Animated.View style={iconStyle}>
            <TrashIcon
              width={18}
              height={18}
              color={Colors.general.color.redTones.redMain}
            />
          </Animated.View>
        }
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rightAction: {
    width: "100%",
    height: "100%",
  },
  separator: {
    width: "100%",
    borderTopWidth: 1,
  },
  swipeable: {
    maxHeight: 44,
    height: 50,
    alignItems: "center",
  },
});
