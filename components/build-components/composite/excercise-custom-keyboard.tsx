import { DefaultKeyboard } from "@/components/build-components/keyboard/keyboard";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated } from "react-native";

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
  const keyboardHeightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(keyboardHeightAnim, {
      toValue: visible ? EXCERCISE_KEYBOARD_HEIGHT : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [visible, keyboardHeightAnim]);

  const innerTranslateY = keyboardHeightAnim.interpolate({
    inputRange: [0, EXCERCISE_KEYBOARD_HEIGHT],
    outputRange: [-EXCERCISE_KEYBOARD_HEIGHT, 0],
  });

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
        height: keyboardHeightAnim,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          height: EXCERCISE_KEYBOARD_HEIGHT,
          transform: [{ translateY: innerTranslateY }],
        }}
      >
        <DefaultKeyboard keyboard={keyboardHandlers} panel={panelHandlers} />
      </Animated.View>
    </Animated.View>
  );
}
