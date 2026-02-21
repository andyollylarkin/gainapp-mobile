import TrashIcon from "@/components/icons/trash";
import SwipeableButton from "@/components/parts/swipable-button";
import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import SetItem, { SetItemProps } from "./set-item";

export default function SwipeableSet(props: SetItemProps) {
  return (
    <Swipeable
      containerStyle={styles.swipeable}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={80}
      renderRightActions={() => (
        <SwipeableButton
          color={Colors.general.color.redTones.redBgLight}
          onPress={() => console.info("click trash button")}
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
      <SetItem {...props} />
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
