import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import ResetTimer, {
  ResetTimeProps,
} from "@/components/build-components/reset-timer";
import { Colors, useAppFonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import useEventBus from "@/hooks/use-event-bus";
import { StartTimerEvent } from "@/types";
import { useEffect, useState } from "react";
import { View } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useAppFonts();
  const emiter = useEventBus<string, StartTimerEvent>();
  const [startTimer, setStartTimer] = useState(false);
  const [timerProps, setTimerProps] = useState<ResetTimeProps>({
    decreaseAmount: 15,
    increaseAmount: 15,
    timeout: 120,
  });

  const timerOpacity = useSharedValue(0);
  const timerStyle = useAnimatedStyle(() => ({
    opacity: timerOpacity.value,
  }));

  useEffect(() => {
    const handler = (event: StartTimerEvent) => {
      setStartTimer(true);
      setTimerProps({
        decreaseAmount: 15,
        increaseAmount: 15,
        timeout: 150,
        onTimeout: () => {
          setStartTimer(false);
          timerOpacity.value = withTiming(0, { duration: 300 });
        },
      });
      timerOpacity.value = withTiming(1, { duration: 300 });
    };
    // TODO: обработка двух и более таймеров

    emiter.on("startTimer", handler);

    return () => {
      emiter.off("startTimer", handler);
    };
  }, [emiter, timerOpacity]);

  const navigationTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const appTheme = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      background: Colors.general.color.darkTones.bg,
      card: Colors.general.color.darkTones.bg,
    },
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={appTheme}>
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              contentStyle: {
                backgroundColor: Colors.general.color.darkTones.bg,
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <Animated.View
            style={[
              {
                position: "absolute",
                bottom: 100,
                zIndex: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                width: "100%",
                maxWidth: 278,
              },
              timerStyle,
            ]}
          >
            <ResetTimer {...timerProps} start={startTimer} />
          </Animated.View>
        </View>
        <StatusBar style="light" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
