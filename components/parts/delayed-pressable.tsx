import React, {
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Pressable } from "react-native";

export interface DelayedPressableProps<TArgs extends unknown[]> {
  onPress: (...args: TArgs) => void;
  onPressEnd?: () => void;
  delay: number;
  children: ReactElement<{ onPress?: (...args: TArgs) => void }>;
}

/**
 * A wrapper component that adds a delay to the onPress event of its child component.
 * The onPress event will only be triggered if the user presses and holds the child component for the specified delay duration.
 * If the user releases the press before the delay, the onPress event will not be triggered.
 */
export default function DelayedPressable<TArgs extends unknown[]>(
  props: DelayedPressableProps<TArgs>,
) {
  const { onPress, onPressEnd, delay, children } = props;
  const originalChildOnPress = children.props.onPress;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handlePressIn = useCallback(
    (...args: TArgs) => {
      clearTimer();

      if (delay <= 0) {
        onPress(...args);
        onPressEnd?.();
        return;
      }

      timeoutRef.current = setTimeout(() => {
        onPress(...args);
        onPressEnd?.();
        timeoutRef.current = null;
      }, delay);
    },
    [clearTimer, delay, onPress, onPressEnd],
  );

  useEffect(
    () => () => {
      clearTimer();
    },
    [clearTimer],
  );

  const childWithOnPress = React.cloneElement(children, {
    onPress: (...args: TArgs) => {
      originalChildOnPress?.(...args);
      handlePressIn(...args);
    },
  });

  return (
    <Pressable
      onPressOut={() => {
        clearTimer();
      }}
      style={{ alignSelf: "stretch" }}
    >
      {childWithOnPress}
    </Pressable>
  );
}
