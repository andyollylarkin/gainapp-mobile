import { ExpoContextMenuProvider } from "@appandflow/expo-context-menu";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Colors, useAppFonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useAppFonts();

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
      <ExpoContextMenuProvider>
        <ThemeProvider value={appTheme}>
          <View></View>
          <View style={{ flex: 1, position: "relative" }}>
            <Stack
              screenOptions={{
                headerTransparent: true,
                headerStyle: {
                  backgroundColor: "transparent",
                },
                contentStyle: {
                  backgroundColor: Colors.general.color.darkTones.bg,
                },
              }}
            >
              <Stack.Screen name="(workout)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(modals)"
                options={{
                  headerShown: false,
                  presentation: "fullScreenModal",
                }}
              />
            </Stack>
          </View>
          <StatusBar style="light" translucent backgroundColor="transparent" />
        </ThemeProvider>
      </ExpoContextMenuProvider>
    </GestureHandlerRootView>
  );
}
