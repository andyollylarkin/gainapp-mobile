/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { useFonts } from "expo-font";
import { Platform, StyleSheet } from "react-native";

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
      greenTones: {
        greenMain: "#00E552",
        greenBg: "#003312",
        greenBgLight: "#004D1B",
      },
      goldTones: {
        goldMain: "#E7B500",
        goldBgLight: "#4D3C00",
        goldBg: "#332800",
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
} as const;

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

export const typography = StyleSheet.create({
  mediumL: {
    fontSize: 18,
    lineHeight: 18 * 1.2,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  mediumM: {
    fontSize: 16,
    lineHeight: 16 * 1.25,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  mediumS: {
    fontSize: 14,
    lineHeight: 14 * 1.25,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  regularL: {
    fontSize: 18,
    lineHeight: 18 * 1.2,
    fontWeight: "400",
    fontFamily: "Inter-Regular",
  },
  regularM: {
    fontSize: 16,
    lineHeight: 16 * 1.25,
    fontWeight: "400",
    fontFamily: "Inter-Regular",
  },
  regularS: {
    fontSize: 14,
    lineHeight: 14 * 1.25,
    fontWeight: "400",
    fontFamily: "Inter-Regular",
  },
});

export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    Inter: require("../fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../fonts/Inter-Medium.ttf"),
  });

  return fontsLoaded;
}
