import TrashIcon from "@/components/icons/trash";
import SwipeableButton from "@/components/parts/swipable-button";
import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import SetItem, { SetItemProps } from "./set-item";

export default function SwipeableSet(
  props: SetItemProps & { onSwipeEnd?: (direction: "left" | "right") => void },
) {
  const { onSwipeEnd, ...setItemProps } = props;

  return (
    <Swipeable
      containerStyle={styles.swipeable}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={80}
      onSwipeableOpen={(direction) => {
        if (onSwipeEnd) {
          onSwipeEnd(direction);
          console.log("Swipeable opened to the", direction);
        }
      }}
      renderRightActions={() => (
        <SwipeableButton
          color={Colors.general.color.redTones.redBgLight}
          icon={
            <TrashIcon
              width={18}
              height={18}
              color={Colors.general.color.redTones.redMain}
            />
          }
        />
      )}
    >
      <SetItem {...setItemProps} />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rightAction: { width: 50, height: 50, backgroundColor: "purple" },
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
