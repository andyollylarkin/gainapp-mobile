import { StyleSheet, View } from "react-native";

import ArrowCircleIcon from "@/components/icons/arrow-circle";
import SliderButton from "@/components/parts/slider-button";
import { Colors } from "@/constants/theme";

type OnboardingNextButtonProps = {
  isLast: boolean;
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  wide?: boolean;
  hideIcon?: boolean;
};

export default function OnboardingNextButton({
  isLast,
  onPress,
  disabled,
  label,
  wide,
  hideIcon,
}: OnboardingNextButtonProps) {
  return (
    <View
      style={[
        styles.wrapper,
        wide && styles.wrapperWide,
        disabled && styles.wrapperDisabled,
      ]}
    >
      <SliderButton
        fullWidth
        color={Colors.general.color.grayTones.main}
        holdOverlayColor={Colors.general.color.grayTones.main}
        textColor={Colors.general.color.darkTones.bg}
        text={label ?? (isLast ? "Start" : "Next")}
        holdDuration={0}
        disabled={disabled}
        {...(!hideIcon && {})}
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
  wrapperWide: {
    width: 200,
  },
  wrapperDisabled: {
    opacity: 0.35,
  },
});
