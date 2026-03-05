import CalendarItem from "@/components/build-components/calendar-item";
import { View } from "react-native";

export default function StatsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CalendarItem/>
    </View>
  );
}
