import { Colors, typography } from "@/constants/theme";
import useCountdown from "@/hooks/use-countdown";
import { NumberFlow } from "number-flow-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import TextButton from "../parts/text-button";

export interface ResetTimeProps {
  increaseAmount: number;
  decreaseAmount: number;
  onTimeout?: () => void;
  onTick?: (timeLeft: number) => void;
  timeout: number;
  start?: boolean;
}

export default function ResetTimer(props: ResetTimeProps) {
  const {
    increaseAmount,
    decreaseAmount,
    onTimeout,
    onTick,
    timeout,
    start = false,
  } = props;
  const [targetTime, setTargetTime] = useState(timeout);
  const hasMountedRef = useRef(false);
  const hasStartedRef = useRef(false);

  const timeLeft = useCountdown(targetTime, start);

  const theme = Colors["general"];

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    setTargetTime(timeout);
  }, [timeout]);

  useEffect(() => {
    if (start) {
      hasStartedRef.current = true;
    }
  }, [start]);

  useEffect(() => {
    if (!start || !hasStartedRef.current) {
      return;
    }

    if (timeLeft.real === 0 && targetTime > 0) {
      hasStartedRef.current = false;
      console.warn("Timer out");
      onTimeout?.();
    }
  }, [onTimeout, start, targetTime, timeLeft.real]);

  useEffect(() => {
    if (!start || !hasStartedRef.current) {
      return;
    }

    onTick?.(timeLeft.real);
  }, [onTick, start, timeLeft.real]);

  return (
    <View style={styles.element}>
      <View style={{ maxWidth: 88 }}>
        <TextButton
          text={"-" + decreaseAmount + " sec"}
          bgColor={theme.color.darkTones.bgLight}
          textColor={theme.color.grayTones.main}
          onPressIn={() => {
            if (timeLeft.real <= decreaseAmount) return;
            if (timeLeft.real - decreaseAmount < 0) {
              setTargetTime(0);
              return;
            }
            setTargetTime(timeLeft.real - decreaseAmount);
          }}
        />
      </View>
      <View style={[styles.text, { flexDirection: "row", gap: 4 }]}>
        <NumberFlow
          value={timeLeft.minutes}
          format={{ minimumIntegerDigits: 2, useGrouping: false }}
          style={{
            ...typography.mediumL,
            color: Colors.general.color.grayTones.main,
          }}
        />
        <Text
          style={{
            ...typography.mediumL,
            color: Colors.general.color.grayTones.main,
          }}
        >
          :
        </Text>
        <NumberFlow
          value={timeLeft.seconds}
          format={{ minimumIntegerDigits: 2, useGrouping: false }}
          style={{
            ...typography.mediumL,
            color: Colors.general.color.grayTones.main,
          }}
        />
      </View>
      <View style={{ maxWidth: 88 }}>
        <TextButton
          text={"+" + increaseAmount + " sec"}
          bgColor={theme.color.darkTones.bgLight}
          textColor={theme.color.grayTones.main}
          onPressIn={() => {
            if (timeLeft.real <= 0) {
              return;
            }
            setTargetTime(timeLeft.real + increaseAmount);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  element: {
    width: "100%",
    borderRadius: 38,
    backgroundColor: Colors.general.color.darkTones.bgMiddle,
    height: 52,
    maxHeight: 52,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingVertical: 6,
    ...typography.mediumL,
  },
  text: {
    alignItems: "center",
    justifyContent: "center",
  },
});
