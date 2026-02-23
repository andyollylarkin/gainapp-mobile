import useCountdown from "@/hooks/use-countdown";
import { StyleSheet, View, Text } from "react-native";
import TextButton from "./parts/text-button";
import { Colors, Fonts, typography } from "@/constants/theme";
import { useEffect, useState } from "react";

export interface ResetTimeProps {
  increaseAmount: number;
  decreaseAmount: number;
  onTimeout?: () => void;
  timeout: number;
}

export default function ResetTimer(props: ResetTimeProps) {
  const [targetTime, setTargetTime] = useState(props.timeout);

  const timeLeft = useCountdown(targetTime);

  const theme = Colors["general"];

  useEffect(() => {
    if (timeLeft.real === 0) {
      console.warn("Timer out");
      props.onTimeout?.();
    }
  }, [props, props.onTimeout, timeLeft.real]);

  return (
    <View style={styles.element}>
      <View style={{ maxWidth: 88 }}>
        <TextButton
          text={"-" + props.decreaseAmount + " sec"}
          bgColor={theme.color.darkTones.bgLight}
          textColor={theme.color.grayTones.main}
          onClick={() => {
            if (timeLeft.real - props.decreaseAmount < 0) {
              setTargetTime(0);
              return;
            }
            setTargetTime(timeLeft.real - props.decreaseAmount);
          }}
        />
      </View>
      <Text style={styles.text}>
        {timeLeft.minutes}:
        {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
      </Text>
      <View style={{ maxWidth: 88 }}>
        <TextButton
          text={"+" + props.increaseAmount + " sec"}
          bgColor={theme.color.darkTones.bgLight}
          textColor={theme.color.grayTones.main}
          onClick={() => {
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
    ...typography.mediumL
  },
  text: {
    ...typography.mediumL,
    color: Colors["general"].color.grayTones.main,
  },
});
