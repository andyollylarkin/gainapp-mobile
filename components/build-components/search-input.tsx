import { Colors, typography } from "@/constants/theme";
import { TextInput, StyleSheet, View } from "react-native";
import MagnifyingGlassIcon from "../icons/magnifying-glass";

export default function SearchInput(props: {
  placeholder?: string;
  value: string;
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6,
    width: "100%",
  },
  input: {
    ...typography.mediumM,
    color: Colors.general.color.grayTones.muted40,
    width: "100%",
  },
});
