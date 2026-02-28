import ExcerciseTray from "@/components/build-components/composite/excercise-tray";
import ResetTimer from "@/components/build-components/reset-timer";
import MultiplyIcon from "@/components/icons/multiply-icon";
import TextButton from "@/components/parts/text-button";
import { Colors, typography } from "@/constants/theme";
import { useExcerciseStore } from "@/store/excercise-store";
import { useExcerciseTimerStore } from "@/store/excercise-timer-store";
import { router } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TopDescription({
  name,
  time,
}: {
  name: string;
  time: string;
}): React.JSX.Element {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          padding: 8,
        }}
      >
        <TextButton
          text={time}
          bgColor={Colors.general.color.darkTones.bgTray}
          textColor={Colors.general.color.grayTones.muted50}
        />
      </View>
      <Text
        style={{
          ...typography.mediumL,
          color: Colors.general.color.grayTones.main,
        }}
      >
        {name}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <TextButton
          text="Finish"
          bgColor={Colors.general.color.grayTones.main}
          textColor={Colors.general.color.darkTones.bg}
          onClick={() => router.back()}
        />
      </View>
    </View>
  );
}

export default function ExcerciseModal() {
  const insets = useSafeAreaInsets();
  const reqInfo = useRouteInfo();
  const excersiceId = reqInfo.params["id"];
  const modalHeaderOverlayHeight = insets.top + 22;
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(0);

  const { excercises, addExcercise, updateExcercise, getTotalExcercises } =
    useExcerciseStore();
  const [completedExcercises, setCompletedExcercises] = useState<number>(0);
  const { currentRest, updateCurrentRest } = useExcerciseTimerStore();
  const timerOpacity = useSharedValue(0);

  const showOrHideTimer = (show: boolean) => {
    console.log("Show timer", show, "Rest", currentRest);
    if (show) {
      updateCurrentRest(120);
      setTimerKey((k) => k + 1); // перемонтируем ResetTimer
      setTimerStarted(true);
      timerOpacity.value = withTiming(1, { duration: 220 });
    } else {
      timerOpacity.value = withTiming(0, { duration: 220 });
      setTimerStarted(false);
    }
  };

  const ex = [
    {
      id: "ex1",
      history: {
        firstText: 20,
        secondText: 20,
        delimiter: (
          <MultiplyIcon color={Colors.general.color.grayTones.muted40} />
        ),
      },
      excerciseOrder: "W",
      maxInputValue: 200,
      initialState: "current",
      input: { field1: "40", field2: "12" },
    },
    {
      id: "ex2",
      history: {
        firstText: 40,
        secondText: 10,
        delimiter: (
          <MultiplyIcon color={Colors.general.color.grayTones.muted40} />
        ),
      },
      excerciseOrder: 2,
      maxInputValue: 200,
      initialState: "progress",
      input: { field1: "45", field2: "10" },
    },
  ];

  useEffect(() => {
    if (excercises.length === 0) {
      ex.forEach((e) => {
        console.log("State", e.id, e.initialState);
        addExcercise({ ...e, trayId: "tray-1" }, "tray-1");
      });
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.general.color.darkTones.bg,
        position: "relative",
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          zIndex: 10,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          opacity: timerOpacity,
        }}
      >
        <View style={{ maxWidth: 278 }}>
          <ResetTimer
            key={timerKey}
            decreaseAmount={15}
            increaseAmount={15}
            timeout={120}
            start={timerStarted}
            onTimeout={() => showOrHideTimer(false)}
            onTick={(timeLeft) => {
              console.log("Timer tick", timeLeft);
              if (timeLeft <= 0) return;
              updateCurrentRest(timeLeft);
            }}
          />
        </View>
      </Animated.View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 12,
          paddingTop: modalHeaderOverlayHeight,
          paddingBottom: 24 + insets.bottom,
          paddingHorizontal: 8,
        }}
      >
        <TopDescription name="Fullbody" time="01:23" />
        <ExcerciseTray
          id="tray-1"
          description={{ items: ["Set", "Previous", "kg", "Reps"] }}
          disable={timerStarted}
          history={{
            color: Colors.general.color.grayTones.muted40,
            delimiter: <MultiplyIcon />,
            firstText: 20,
            secondText: 20,
          }}
          title={{
            backgroundColor: "#1A1A1A",
            icon1Click: () => {},
            icon2Click: () => {},
            iconsColor: "#262626",
            type: "Treadmill",
            expanded: true,
            title: "Treadmill",
          }}
          onExcerciseChange={(_, id) => {
            console.log(`Excercise with id ${id} changed`);
          }}
          onExcerciseComplete={(ex, id, { currentCompleted, total }) => {
            console.log(
              `Excercise completed. Progress: ${currentCompleted} / ${total}`,
            );
            showOrHideTimer(true);
            setCompletedExcercises((current) => current + 1);
          }}
          onExcerciseRemove={(_, id) => {
            console.log(`Excercise with id ${id} removed`);
          }}
        />
      </ScrollView>
    </View>
  );
}
