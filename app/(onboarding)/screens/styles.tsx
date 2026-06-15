import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slideMargin: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
});

export const slideStyleNoMargin = styles.slide;
export const slideStyleMargin = styles.slideMargin;
