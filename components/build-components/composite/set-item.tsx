import HistoryText from "@/components/history-text";
import CrossIcon from "@/components/icons/cross";
import MultiplyIcon from "@/components/icons/multiply-icon";
import { Colors } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import CheckDark from "../check-dark";
import CheckGold from "../check-gold";
import CheckGreen from "../check-green";
import SetNumberWarpup from "../set-number-warpup";
import TwoField from "../two-field";

export interface SetItemProps {
  history: {
    firstText: string | number;
    secondText: string | number;
    delimiter:
      | string
      | React.ReactElement<
          typeof MultiplyIcon | React.ReactElement<typeof CrossIcon>
        >;
  };
  checkValue: "W" | number;
  maxInputValue: number;
  type: "pr_record" | "done" | "progress" | "current";
}

const colorSchemes = {
  pr_record: {
    bgColor: Colors.general.color.goldTones.goldBg,
    textColor: Colors.general.color.greenTones.greenBgLight,
    checkItem: CheckGold,
    warpupColor: Colors.general.color.goldTones.goldMain,
    warpupTextColor: Colors.general.color.goldTones.goldBgLight,
    inputFieldColor: Colors.general.color.goldTones.goldBgLight,
    inputFieldTextColor: Colors.general.color.goldTones.goldMain,
    selectColor: Colors.general.color.goldTones.goldMain,
    selectTextColor: Colors.general.color.goldTones.goldBgLight,
  },
  done: {
    bgColor: Colors.general.color.greenTones.greenBg,
    textColor: Colors.general.color.goldTones.goldBgLight,
    checkItem: CheckGreen,
    warpupColor: Colors.general.color.greenTones.greenMain,
    warpupTextColor: Colors.general.color.greenTones.greenBgLight,
    inputFieldColor: Colors.general.color.greenTones.greenBgLight,
    inputFieldTextColor: Colors.general.color.greenTones.greenMain,
    selectColor: Colors.general.color.greenTones.greenMain,
    selectTextColor: Colors.general.color.greenTones.greenBgLight,
  },
  progress: {
    bgColor: Colors.general.color.darkTones.bgTray,
    textColor: "",
    checkItem: CheckDark,
    warpupColor: Colors.general.color.darkTones.bgMiddle,
    warpupTextColor: Colors.general.color.grayTones.muted50,
    inputFieldColor: Colors.general.color.darkTones.bgMiddle,
    inputFieldTextColor: Colors.general.color.grayTones.main,
    selectColor: Colors.general.color.darkTones.bgMiddle,
    selectTextColor: Colors.general.color.grayTones.main,
  },
  current: {
    bgColor: Colors.general.color.darkTones.bgTray,
    textColor: "",
    checkItem: CheckDark,
    warpupColor: Colors.general.color.darkTones.bgMiddle,
    warpupTextColor: Colors.general.color.grayTones.muted50,
    inputFieldColor: Colors.general.color.darkTones.bgMiddle,
    inputFieldTextColor: Colors.general.color.grayTones.main,
    selectColor: Colors.general.color.darkTones.bgMiddle,
    selectTextColor: Colors.general.color.grayTones.main,
  },
};

export default function SetItem(props: SetItemProps) {
  const {
    checkItem: CheckItem,
    warpupColor,
    warpupTextColor,
    bgColor,
    inputFieldColor,
    inputFieldTextColor,
    selectColor,
    selectTextColor,
  } = colorSchemes[props.type];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.innerContainer}>
        <View style={[styles.partContainer, styles.leftPartContainer]}>
          <SetNumberWarpup
            text={props.checkValue}
            color={warpupColor}
            textColor={warpupTextColor}
          />
          <HistoryText
            color={Colors.general.color.grayTones.muted40}
            firstText={props.history.firstText}
            secondText={props.history.secondText}
            delimiter={props.history.delimiter}
          />
        </View>
        <View style={[styles.partContainer, styles.rightPartContainer]}>
          <TwoField
            delimiter="x"
            delimiterColor={inputFieldTextColor}
            fieldColor={inputFieldColor}
            textColor={inputFieldTextColor}
            selectColor={selectColor}
            selectTextColor={selectTextColor}
          />
          <CheckItem />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  partContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  leftPartContainer: {
    flex: 1,
    gap: 8,
  },
  rightPartContainer: {
    gap: 12,
  },
});
