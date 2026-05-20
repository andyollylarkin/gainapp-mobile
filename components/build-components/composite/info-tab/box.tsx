import { Colors } from "@/constants/theme";
import { View } from "react-native";

export function Box(props: { children: React.ReactElement }) {
  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: Colors.general.color.darkTones.bgTray,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 6,
      }}
    >
      {props.children}
    </View>
  );
}

export function BoxList(props: { children: React.ReactElement[] }) {
  return (
    <View
      style={{
        borderRadius: 24,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: "column",
        gap: 2,
        overflow: "hidden",
      }}
    >
      {props.children}
    </View>
  );
}
