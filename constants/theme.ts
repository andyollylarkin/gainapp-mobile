/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { useFonts } from "expo-font";
import { Platform } from "react-native";
import { red } from "react-native-reanimated/lib/typescript/Colors";

export const Colors = {
  general: {
    input: {
      darkBgColor: "#0D0D0D",
    },
    color: {
      darkTones: {
        bg: "#0D0D0D",
        bgTray: "#1A1A1A",
        bgMiddle: "#262626",
        bgLight: "#404040",
      },
      grayTones: {
        main: "#F2F2F2",
        muted50: "#808080",
        muted40: "#666666",
        muted30: "#4D4D4D",
      },
      done: {
        doneMain: "#00E552",
        doneBg: "#003312",
        doneBgLight: "#004D1B",
      },
      orangeTones: {
        prMain: "#E55400",
        prBgLight: "#4D1C00",
        prBg: "#331300",
      },
      redTones: {
        redMain: "#E51300",
        redBgLight: "#4D0600",
        redBg: "#330400",
      },
      blueTones: {
        main: "#0092FF",
      },
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "Inter",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "Inter",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "Inter",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "Inter",
  },
  default: {
    sans: "Inter",
    serif: "Inter",
    rounded: "Inter",
    mono: "Inter",
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Inter, Georgia, 'Times New Roman', serif",
    rounded:
      "Inter, 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "Inter, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    Inter: require("../fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../fonts/Inter-Medium.ttf"),
  });

  return fontsLoaded;
}
