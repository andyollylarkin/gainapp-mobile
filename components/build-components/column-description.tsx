import { Colors, typography } from "@/constants/theme";
import { MaxFourNonEmptyArray } from "@/types";
import { StyleSheet, Text, View } from "react-native";

type description = "Set" | "Previous" | "kg" | "Reps";

export interface ColumnDescriptionProps {
  items: MaxFourNonEmptyArray<description>;
}
export default function ColumnDescription({ items }: ColumnDescriptionProps) {
  const hasFourthItem = items.length === 4;

  return (
    <View style={styles.container}>
      <View style={[styles.partContainer, styles.leftPartContainer]}>
        <View style={styles.setSlot}>
          {items[0] && <Text style={styles.itemText}>{items[0]}</Text>}
        </View>
        <View style={styles.historySlot}>
          {items[1] && <Text style={styles.itemText}>{items[1]}</Text>}
        </View>
      </View>
      <View style={[styles.partContainer, styles.rightPartContainer]}>
        <View style={styles.twoFieldHeaderSlot}>
          {hasFourthItem ? (
            <>
              <View style={styles.inputHalfSlot}>
                {items[2] && <Text style={styles.itemText}>{items[2]}</Text>}
              </View>
              <View style={styles.inputDelimiterSpacer} />
              <View style={styles.inputHalfSlot}>
                {items[3] && <Text style={styles.itemText}>{items[3]}</Text>}
              </View>
            </>
          ) : (
            <View style={styles.inputCenterSlot}>
              {items[2] && <Text style={styles.itemText}>{items[2]}</Text>}
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
    marginBottom: 4,
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
