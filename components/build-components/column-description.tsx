import { Colors, typography } from "@/constants/theme";
import { KgOrLbs, useSettingsStore } from "@/store/excercise-settings-store";
import { MaxFourNonEmptyArray } from "@/types";
import { StyleSheet, Text, View } from "react-native";

type description = "Set" | "Previous" | KgOrLbs | "Reps";

export interface ColumnDescriptionProps {
  items: MaxFourNonEmptyArray<description>;
}
export default function ColumnDescription({ items }: ColumnDescriptionProps) {
  const measurementUnit = useSettingsStore((state) => state.measurementUnit);
  const hasFourthItem = items.length === 4;

  const displayItems = [...items] as MaxFourNonEmptyArray<description>;
  if ((displayItems[2] as string).toLowerCase() === "kg" || (displayItems[2] as string).toLowerCase() === "lbs") {
    displayItems[2] = (measurementUnit === "kg" ? "Kg" : "Lbs") as KgOrLbs;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.partContainer, styles.leftPartContainer]}>
        <View style={styles.setSlot}>
          {displayItems[0] && <Text style={styles.itemText}>{displayItems[0]}</Text>}
        </View>
        <View style={styles.historySlot}>
          {displayItems[1] && <Text style={styles.itemText}>{displayItems[1]}</Text>}
        </View>
      </View>
      <View style={[styles.partContainer, styles.rightPartContainer]}>
        <View style={styles.twoFieldHeaderSlot}>
          {hasFourthItem ? (
            <>
              <View style={styles.inputHalfSlot}>
                {displayItems[2] && <Text style={styles.itemText}>{displayItems[2]}</Text>}
              </View>
              <View style={styles.inputDelimiterSpacer} />
              <View style={styles.inputHalfSlot}>
                {displayItems[3] && <Text style={styles.itemText}>{displayItems[3]}</Text>}
              </View>
            </>
          ) : (
            <View style={styles.inputCenterSlot}>
              {displayItems[2] && <Text style={styles.itemText}>{displayItems[2]}</Text>}
            </View>
          )}
        </View>
        <View style={styles.checkSlot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    maxWidth: "100%",
    flexShrink: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: Colors.general.color.darkTones.bgTray,
    height: 32,
  },
  partContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 1,
    minWidth: 0,
  },
  leftPartContainer: {
    flex: 1,
    gap: 8,
  },
  rightPartContainer: {
    gap: 12,
  },
  setSlot: {
    width: 30,
    alignItems: "center",
  },
  historySlot: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
  },
  twoFieldHeaderSlot: {
    width: 139,
    flexDirection: "row",
    alignItems: "center",
  },
  inputHalfSlot: {
    flex: 1,
    alignItems: "center",
  },
  inputCenterSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputDelimiterSpacer: {
    width: 26,
  },
  checkSlot: {
    width: 30,
  },
  itemText: {
    ...typography.mediumM,
    color: Colors.general.color.grayTones.muted50,
    flexShrink: 1,
    minWidth: 0,
  },
});
