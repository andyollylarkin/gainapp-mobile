import HistoryText from "@/components/history-text";
import CrossIcon from "@/components/icons/cross";
import MultiplyIcon from "@/components/icons/multiply-icon";
import DelayedPressable from "@/components/parts/delayed-pressable";
import InputField from "@/components/parts/input-field";
import { Colors } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import { RefObject, useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import CheckDark from "../check-dark";
import CheckGold from "../check-gold";
import CheckGray from "../check-gray";
import CheckGreen from "../check-green";
import SetNumberWarpup from "../set-number-warpup";
import TwoField from "../two-field";

export type SetState = "pr_record" | "done" | "progress" | "current";

export interface SetItemProps {
  id: string;
  history: {
    firstText: string | number;
    secondText: string | number;
    delimiter:
      | string
      | React.ReactElement<
          typeof MultiplyIcon | React.ReactElement<typeof CrossIcon>
        >;
  };
  excerciseOrder: "W" | number;
  maxInputValue: number;
  initialState: SetState;
  input: {
    field1: NonNullable<string>;
    field2: string | null;
  };
  withVibrationImpact?: boolean;
  onPress?: (
    currentState: SetState,
    setNextState: (newState: SetState) => void,
  ) => void;
  onPressEnd?: () => void;
  onInputChange?: (field1: string, field2: string | null) => void;
  onInputFocus?: (
    obj: RefObject<TextInput | null>,
    value: string,
    setValue: (nextValue: string) => void,
  ) => void;
  onInputBlur?: () => void;
}

const colorSchemes = {
  pr_record: {
    bgColor: Colors.general.color.goldTones.goldBg,
    textColor: Colors.general.color.greenTones.greenBgLight,
    checkItem: CheckGold,
    warpupColor: Colors.general.color.goldTones.goldMain,
    warpupTextColor: Colors.general.color.goldTones.goldBgLight,
    inputFieldColor: Colors.general.color.goldTones.goldBgLight,
    inputFieldTextColor: Colors.general.color.goldTones.goldMain,
    inputFieldDelimiterColor: Colors.general.color.goldTones.goldMain,
    selectColor: Colors.general.color.goldTones.goldMain,
    selectTextColor: Colors.general.color.goldTones.goldBgLight,
  },
  done: {
    bgColor: Colors.general.color.greenTones.greenBg,
    textColor: Colors.general.color.goldTones.goldBgLight,
    checkItem: CheckGreen,
    warpupColor: Colors.general.color.greenTones.greenMain,
    warpupTextColor: Colors.general.color.greenTones.greenBgLight,
    inputFieldColor: Colors.general.color.greenTones.greenBgLight,
    inputFieldTextColor: Colors.general.color.greenTones.greenMain,
    inputFieldDelimiterColor: Colors.general.color.greenTones.greenMain,
    selectColor: Colors.general.color.greenTones.greenMain,
    selectTextColor: Colors.general.color.greenTones.greenBgLight,
  },
  progress: {
    bgColor: Colors.general.color.darkTones.bgTray,
    textColor: Colors.general.color.grayTones.main,
    checkItem: CheckDark,
    warpupColor: Colors.general.color.darkTones.bgMiddle,
    warpupTextColor: Colors.general.color.grayTones.muted50,
    inputFieldColor: Colors.general.color.darkTones.bgMiddle,
    inputFieldTextColor: Colors.general.color.grayTones.main,
    inputFieldDelimiterColor: Colors.general.color.grayTones.muted50,
    selectColor: Colors.general.color.blueTones.main,
    selectTextColor: Colors.general.color.grayTones.main,
  },
  current: {
    bgColor: Colors.general.color.darkTones.bgMiddle,
    textColor: Colors.general.color.grayTones.main,
    checkItem: CheckGray,
    warpupColor: Colors.general.color.darkTones.bgLight,
    warpupTextColor: Colors.general.color.grayTones.muted50,
    inputFieldColor: Colors.general.color.darkTones.bgLight,
    inputFieldTextColor: Colors.general.color.grayTones.main,
    inputFieldDelimiterColor: Colors.general.color.grayTones.muted50,
    selectColor: Colors.general.color.blueTones.main,
    selectTextColor: Colors.general.color.grayTones.main,
  },
} as const;

export default function SetItem(props: SetItemProps) {
  const [optimisticState, setOptimisticState] = useState<SetState | null>(null);
  const scale = useSharedValue(1);

  const currentState = optimisticState ?? props.initialState;
  const state = colorSchemes[currentState];

  const stateTransition = (newState: SetState) => {
    scale.value = withSequence(
      withTiming(1.1, { duration: 120 }),
      withTiming(1, { duration: 120 }),
    );

    setOptimisticState(newState);
  };

  useEffect(() => {
    if (optimisticState && props.initialState === optimisticState) {
      setOptimisticState(null);
    }
  }, [optimisticState, props.initialState]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: state.bgColor },
        animatedContainerStyle,
      ]}
    >
      <View style={styles.innerContainer}>
        <View style={[styles.partContainer, styles.leftPartContainer]}>
          <SetNumberWarpup
            text={props.excerciseOrder}
            color={state.warpupColor}
            textColor={state.warpupTextColor}
          />
          <HistoryText
            color={Colors.general.color.grayTones.muted40}
            firstText={props.history.firstText}
            secondText={props.history.secondText}
            delimiter={
              props.history.delimiter === "x" ? (
                <MultiplyIcon
                  width={16}
                  height={16}
                  color={Colors.general.color.grayTones.muted40}
                />
              ) : (
                <CrossIcon
                  width={16}
                  height={16}
                  color={Colors.general.color.grayTones.muted40}
                />
              )
            }
          />
        </View>
        <View style={[styles.partContainer, styles.rightPartContainer]}>
          {props.input.field2 !== null ? (
            <TwoField
              onFieldSelect={(obj, value, setValue) => {
                if (obj) {
                  props.onInputFocus?.(obj, value, setValue);
                }
              }}
              onFieldBlur={() => props.onInputBlur?.()}
              defaultValue={"0"}
              delimiter="x"
              delimiterColor={state.inputFieldDelimiterColor}
              firstFieldValue={props.input.field1}
              secondFieldValue={props.input.field2}
              fieldColor={state.inputFieldColor}
              textColor={state.inputFieldTextColor}
              selectColor={state.selectColor}
              selectTextColor={state.selectTextColor}
              onFirstFieldChange={(value) =>
                props.onInputChange?.(value, props.input.field2)
              }
              onSecondFieldChange={(value) =>
                props.onInputChange?.(props.input.field1, value)
              }
            />
          ) : (
            <View style={styles.singleInputContainer}>
              <InputField
                bgColor={state.inputFieldColor}
                textColor={state.inputFieldTextColor}
                selectColor={state.selectColor}
                selectTextColor={state.selectTextColor}
                type="number"
                placeholder="0"
                value={props.input.field1}
                maxNumberValue={props.maxInputValue}
                onChange={(value) => props.onInputChange?.(value, null)}
                onFocus={(obj, value, setValue) =>
                  props.onInputFocus?.(obj, value, setValue)
                }
                onBlur={() => props.onInputBlur?.()}
              />
            </View>
          )}
          <DelayedPressable
            delay={0} // NO DELAY ON PRESS SET END
            onPress={() => props.onPress?.(currentState, stateTransition)}
            onPressEnd={() => {
              props.onPressEnd && props.onPressEnd();
              props.withVibrationImpact &&
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
          >
            <state.checkItem />
          </DelayedPressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  partContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  leftPartContainer: {
    flex: 1,
    gap: 8,
  },
  rightPartContainer: {
    gap: 12,
  },
  singleInputContainer: {
    width: 139,
    height: 32,
    justifyContent: "center",
    alignItems: "stretch",
  },
});
