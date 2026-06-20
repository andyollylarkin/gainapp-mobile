import { useState } from "react";
import { Text, View } from "react-native";
import WheelPickerGain from "@/components/wheel-picker";
import { Colors, typography } from "@/constants/theme";
import type { PickerItem } from "@quidone/react-native-wheel-picker";

const MIN_AGE = 10;
const MAX_AGE = 100;

const ages: PickerItem<number>[] = Array.from(
  { length: MAX_AGE - MIN_AGE + 1 },
  (_, i) => ({ value: MIN_AGE + i, label: String(MIN_AGE + i) }),
);

export default function Slide11({
  onAnswer,
}: {
  onAnswer: (value: unknown) => void;
  onValidChange?: (isValid: boolean) => void;
}) {
  const [age, setAge] = useState(27);

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          paddingTop: 60,
          paddingLeft: 20,
          ...typography.mediumExtra,
          color: Colors.general.color.grayTones.main,
        }}
      >
        {"What's your age?"}
      </Text>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <WheelPickerGain
          data={ages}
          value={age}
          onValueChanged={({ item }) => {
            setAge(item.value);
            onAnswer({ age: item.value });
          }}
        />
      </View>
    </View>
  );
}
