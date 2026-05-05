import { DefaultKeyboard } from "@/components/build-components/keyboard/keyboard";
import React, { useEffect, useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const EXCERCISE_KEYBOARD_HEIGHT = 320;

interface ExcerciseCustomKeyboardProps {
  visible: boolean;
  onAppend: (value?: string | number) => void;
  onBackspace: () => void;
  onHide: () => void;
}

export default function ExcerciseCustomKeyboard({
  visible,
  onAppend,
  onBackspace,
  onHide,
}: ExcerciseCustomKeyboardProps) {
  const keyboardTranslateY = useSharedValue(EXCERCISE_KEYBOARD_HEIGHT);

  useEffect(() => {
    keyboardTranslateY.value = withTiming(
      visible ? 0 : EXCERCISE_KEYBOARD_HEIGHT,
      { duration: 220 },
    );
  }, [visible, keyboardTranslateY]);

  const keyboardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: keyboardTranslateY.value }],
  }));

  const keyboardHandlers = useMemo(
    () => ({
      1: onAppend,
      2: onAppend,
      3: onAppend,
      4: onAppend,
      5: onAppend,
      6: onAppend,
      7: onAppend,
      8: onAppend,
      9: onAppend,
      10: onAppend,
      11: onAppend,
      12: onBackspace,
    }),
    [onAppend, onBackspace],
  );

  const panelHandlers = useMemo(
    () => ({
      1: onHide,
      4: onHide,
    }),
    [onHide],
  );

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        elevation: 100,
        height: EXCERCISE_KEYBOARD_HEIGHT,
      }}
    >
      <Animated.View
        style={[
          {
            height: EXCERCISE_KEYBOARD_HEIGHT,
          },
          keyboardAnimatedStyle,
        ]}
      >
        <DefaultKeyboard keyboard={keyboardHandlers} panel={panelHandlers} />
      </Animated.View>
    </Animated.View>
  );
}
