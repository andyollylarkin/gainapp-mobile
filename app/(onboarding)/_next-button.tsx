import { StyleSheet, View } from "react-native";

import ArrowCircleIcon from "@/components/icons/arrow-circle";
import SliderButton from "@/components/parts/slider-button";
import { Colors } from "@/constants/theme";

type OnboardingNextButtonProps = {
  isLast: boolean;
  onPress: () => void;
};

export default function OnboardingNextButton({ isLast, onPress }: OnboardingNextButtonProps) {
  return (
    <View style={styles.wrapper}>
      <SliderButton
        fullWidth
        color={Colors.general.color.grayTones.main}
        holdOverlayColor={Colors.general.color.grayTones.main}
        textColor={Colors.general.color.darkTones.bg}
        text={isLast ? "Start" : "Next"}
        holdDuration={0}
        icon={
          <ArrowCircleIcon
            width={19}
            height={19}
            color={Colors.general.color.darkTones.bg}
          />
        }
        onHoldStart={() => {}}
        onHoldEnd={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 129,
    alignSelf: "center",
    paddingBottom: 48,
  },
});
