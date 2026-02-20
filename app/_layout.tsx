import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Colors, useAppFonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

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
    <ThemeProvider value={appTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: Colors.general.color.darkTones.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
