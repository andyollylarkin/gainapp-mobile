import { Colors, typography } from "@/constants/theme";
import { useState } from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function Slide5({
  onAnswer,
  onValidChange,
}: {
  onAnswer: (value: unknown) => void;
  onValidChange?: (isValid: boolean) => void;
}) {
  const [name, setName] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, gap: 24 }}>
      <Text
        style={{
          paddingTop: 60,
          paddingLeft: 20,
          ...typography.mediumExtra,
          color: Colors.general.color.grayTones.main,
        }}
      >
        What is your name?
      </Text>
      <TextInput
        style={{
          marginLeft: 20,
          ...typography.mediumXL,
          color: Colors.general.color.grayTones.muted30,
        }}
        placeholderTextColor={Colors.general.color.grayTones.muted30}
        placeholder="Your name"
        value={name ?? ""}
        onChangeText={(text) => {
          setName(text);
          if (text === "") {
            onValidChange?.(false);
            return;
          }
          onValidChange?.(true);
          onAnswer(text);
          onValidChange?.(text.trim().length > 0);
        }}
      />
    </View>
  );
}
