import { Colors, typography } from "@/constants/theme";
import { TextInput, StyleSheet, View, Pressable } from "react-native";
import MagnifyingGlassIcon from "../icons/magnifying-glass";
import ScaledPressable from "../animated/scaled-pressable";
import CloseIcon from "../icons/close";

const EMPTY_SEARCH_VALUE = "";

export default function SearchInput(props: {
  placeholder?: string;
  value: string;
  setValue: (current: string) => void;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.container}>
      <MagnifyingGlassIcon
        width={14.65}
        height={14.65}
        color={Colors.general.color.grayTones.muted40}
      />
      <TextInput
        style={styles.input}
        value={props.value}
        onChangeText={props.onChange}
        placeholder={props.placeholder || "Search"}
        placeholderTextColor={Colors.general.color.grayTones.muted40}
      />
      <View
        style={{ opacity: props.value.length > 0 ? 1 : 0 }}
        pointerEvents={props.value.length > 0 ? "auto" : "none"}
      >
        <ScaledPressable scaleDuration={150} scaleTo={0.95}>
          <Pressable onPress={() => props.setValue(EMPTY_SEARCH_VALUE)}>
            <View style={styles.closeButton}>
              <CloseIcon
                width={18}
                height={18}
                thickness={2}
                color={Colors.general.color.grayTones.muted50}
              />
            </View>
          </Pressable>
        </ScaledPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: Colors.general.color.darkTones.bgTray,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 12,
    paddingVertical: 7,
    borderRadius: 24,
    gap: 6,
    width: "100%",
  },
  input: {
    ...typography.mediumM,
    color: Colors.general.color.grayTones.muted40,
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.general.color.darkTones.bgMiddle,
    alignItems: "center",
    justifyContent: "center",
  },
});
