import { Colors, typography } from "@/constants/theme";
import useCountdown from "@/hooks/use-countdown";
import { NumberFlow } from "number-flow-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
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
  const [targetTime, setTargetTime] = useState(props.timeout);
  const hasMountedRef = useRef(false);
  const hasStartedRef = useRef(false);

  const timeLeft = useCountdown(targetTime, props.start ?? false);

  const theme = Colors["general"];

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    setTargetTime(props.timeout);
  }, [props.timeout]);

  useEffect(() => {
    if (props.start) {
      hasStartedRef.current = true;
    }
  }, [props.start]);

  useEffect(() => {
    if (!props.start || !hasStartedRef.current) {
      return;
    }

    if (timeLeft.real === 0 && targetTime > 0) {
      hasStartedRef.current = false;
      console.warn("Timer out");
      props.onTimeout?.();
    }
  }, [props, props.onTimeout, props.start, targetTime, timeLeft.real]);

  useEffect(() => {
    props.onTick?.(timeLeft.real);
  }, [props, timeLeft.real]);

  return (
    <View style={styles.element}>
      <View style={{ maxWidth: 88 }}>
        <TextButton
          text={"-" + props.decreaseAmount + " sec"}
          bgColor={theme.color.darkTones.bgLight}
          textColor={theme.color.grayTones.main}
          onPressIn={() => {
            if (timeLeft.real <= props.decreaseAmount) return;
            if (timeLeft.real - props.decreaseAmount < 0) {
              setTargetTime(0);
              return;
            }
            setTargetTime(timeLeft.real - props.decreaseAmount);
          }}
        />
      </View>
      <View style={[styles.text, { flexDirection: "row", gap: 4 }]}>
        <NumberFlow
          value={timeLeft.minutes}
          style={
            (typography.mediumL, { color: Colors.general.color.grayTones.main })
          }
        />
        <Text
          style={
            (typography.mediumL, { color: Colors.general.color.grayTones.main })
          }
        >
          :
        </Text>
        <NumberFlow
          value={timeLeft.seconds}
          style={
            (typography.mediumL, { color: Colors.general.color.grayTones.main })
          }
        />
      </View>
      <View style={{ maxWidth: 88 }}>
        <TextButton
          text={"+" + props.increaseAmount + " sec"}
          bgColor={theme.color.darkTones.bgLight}
          textColor={theme.color.grayTones.main}
          onPressIn={() => {
            if (timeLeft.real <= 0) {
              return;
            }
            setTargetTime(timeLeft.real + props.increaseAmount);
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
