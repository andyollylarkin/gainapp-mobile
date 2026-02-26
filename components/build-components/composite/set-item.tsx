import HistoryText from "@/components/history-text";
import CrossIcon from "@/components/icons/cross";
import MultiplyIcon from "@/components/icons/multiply-icon";
import DelayedPressable from "@/components/parts/delayed-pressable";
import InputField from "@/components/parts/input-field";
import { Colors } from "@/constants/theme";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
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
  onPress?: (
    currentState: SetState,
    setNextState: (newState: SetState) => void,
  ) => void;
  onPressEnd?: () => void;
  onInputChange?: (field1: string, field2: string | null) => void;
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
    selectColor: Colors.general.color.darkTones.bgMiddle,
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
    selectColor: Colors.general.color.darkTones.bgLight,
    selectTextColor: Colors.general.color.grayTones.main,
  },
} as const;

export default function SetItem(props: SetItemProps) {
  const [state, setState] = useState(colorSchemes[props.initialState]); // TODO: use state machine
  const [currentState, setCurrentState] = useState(props.initialState);
  const scale = useSharedValue(1);
  const colorState = useSharedValue({
    backgroundColor: colorSchemes[props.initialState].bgColor,
    textColor: colorSchemes[props.initialState].textColor,
    warpupColor: colorSchemes[props.initialState].warpupColor,
    warpupTextColor: colorSchemes[props.initialState].warpupTextColor,
    inputFieldColor: colorSchemes[props.initialState].inputFieldColor,
    inputFieldTextColor: colorSchemes[props.initialState].inputFieldTextColor,
    selectColor: colorSchemes[props.initialState].selectColor,
    selectTextColor: colorSchemes[props.initialState].selectTextColor,
  });

  const stateTransition = (newState: SetState) => {
    colorState.value = {
      backgroundColor: colorSchemes[newState].bgColor,
      textColor: colorSchemes[newState].textColor,
      warpupColor: colorSchemes[newState].warpupColor,
      warpupTextColor: colorSchemes[newState].warpupTextColor,
      inputFieldColor: colorSchemes[newState].inputFieldColor,
      inputFieldTextColor: colorSchemes[newState].inputFieldTextColor,
      selectColor: colorSchemes[newState].selectColor,
      selectTextColor: colorSchemes[newState].selectTextColor,
    };

    scale.value = withSequence(
      withTiming(1.1, { duration: 120 }),
      withTiming(1, { duration: 120 }),
    );

    setState(colorSchemes[newState]);
    setCurrentState(newState);
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (currentState === "done") return;
    if (props.initialState !== currentState) {
      colorState.value = {
        backgroundColor: colorSchemes[props.initialState].bgColor,
        textColor: colorSchemes[props.initialState].textColor,
        warpupColor: colorSchemes[props.initialState].warpupColor,
        warpupTextColor: colorSchemes[props.initialState].warpupTextColor,
        inputFieldColor: colorSchemes[props.initialState].inputFieldColor,
        inputFieldTextColor:
          colorSchemes[props.initialState].inputFieldTextColor,
        selectColor: colorSchemes[props.initialState].selectColor,
        selectTextColor: colorSchemes[props.initialState].selectTextColor,
      };
      setState(colorSchemes[props.initialState]);
      setCurrentState(props.initialState);
    }
  }, [colorState, currentState, props.initialState]);

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
            color={colorState.value.warpupColor}
            textColor={colorState.value.warpupTextColor}
          />
          <HistoryText
            color={Colors.general.color.grayTones.muted40}
            firstText={props.history.firstText}
            secondText={props.history.secondText}
            delimiter={props.history.delimiter}
          />
        </View>
        <View style={[styles.partContainer, styles.rightPartContainer]}>
          {props.input.field2 !== null ? (
            <TwoField
              defaultValue={"0"}
              delimiter="x"
              delimiterColor={colorState.value.inputFieldTextColor}
              firstFieldValue={props.input.field1}
              secondFieldValue={props.input.field2}
              fieldColor={colorState.value.inputFieldColor}
              textColor={colorState.value.inputFieldTextColor}
              selectColor={colorState.value.selectColor}
              selectTextColor={colorState.value.selectTextColor}
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
                bgColor={colorState.value.inputFieldColor}
                textColor={colorState.value.inputFieldTextColor}
                selectColor={colorState.value.selectColor}
                selectTextColor={colorState.value.selectTextColor}
                type="number"
                placeholder="0"
                value={props.input.field1}
                maxNumberValue={props.maxInputValue}
                onChange={(value) => props.onInputChange?.(value, null)}
              />
            </View>
          )}
          <DelayedPressable
            delay={200}
            onPress={() => props.onPress?.(currentState, stateTransition)}
            onPressEnd={() => {
              props.onPressEnd && props.onPressEnd();
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
