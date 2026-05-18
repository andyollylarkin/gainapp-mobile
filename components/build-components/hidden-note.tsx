import { Colors, typography } from "@/constants/theme";
import { useContextMenu } from "@/store/menu-store";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";

export default function HiddenNote(props: {
  onPress?: () => void;
  contextMenuId: string;
}) {
  const menu = useContextMenu<string, TextInput>(props.contextMenuId);
  const ref = useRef<TextInput | null>(null);
  const [hidden, setHidden] = useState(!menu?.value);

  const updateVisibility = useCallback(() => {
    const shouldHide = !menu?.value;
    setHidden(shouldHide);
  }, [menu?.value]);

  useEffect(() => {
    if (menu?.clicks && menu.clicks > 0) {
      setHidden(false);
    }
  }, [menu?.clicks]);

  useEffect(() => {
    if (ref.current && !ref.current.isFocused()) ref.current.focus();
  }, [ref.current]);

  useEffect(() => {
    if (ref.current) {
      menu?.setTarget(ref.current);
    }
  }, [menu]);

  if (hidden) return null;

  return (
    <View style={{ width: "100%" }}>
      <TextInput
        ref={ref}
        multiline
        onFocus={() => setHidden(false)}
        placeholder="Add Note"
        onBlur={updateVisibility}
        placeholderTextColor={Colors.general.color.grayTones.muted40}
        onEndEditing={updateVisibility}
        scrollEnabled={false}
        onChangeText={(text) => menu?.setValue(text)}
        style={{
          ...typography.regularM,
          color: Colors.general.color.grayTones.muted40,
          height: undefined,
          minHeight: 40,
          padding: 0,
          margin: 0,
        }}
        value={menu?.value || ""}
      />
    </View>
  );
}
