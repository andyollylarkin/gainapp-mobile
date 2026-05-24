import { menuStore, useContextMenu } from "@/store/menu-store";
import { useNoteStore } from "@/store/note-store";
import { Colors, typography } from "@/constants/theme";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";

export default function HideableNote(props: {
  onPress?: () => void;
  contextMenuId: string;
}) {
  const menu = useContextMenu<string, TextInput>(props.contextMenuId);
  const ref = useRef<TextInput | null>(null);
  const note = useNoteStore((s) => s.getExerciseSetNotes(props.contextMenuId));
  const [hidden, setHidden] = useState(!menu?.value && !note);

  useEffect(() => {
    const storedNote = useNoteStore
      .getState()
      .getExerciseSetNotes(props.contextMenuId);
    if (storedNote) {
      menuStore.getState().updateValue(props.contextMenuId, storedNote);
    }
  }, [props.contextMenuId]);

  const onChangeValue = useCallback(
    (v: string) => {
      menuStore.getState().updateValue(props.contextMenuId, v);
      useNoteStore.getState().setExerciseSetNotes(props.contextMenuId, v);
    },
    [props.contextMenuId],
  );

  const updateVisibility = useCallback(() => {
    const currentNote = useNoteStore
      .getState()
      .getExerciseSetNotes(props.contextMenuId);
    const currentMenuValue =
      menuStore.getState().menus[props.contextMenuId.toLowerCase()]?.value;
    setHidden(!currentMenuValue && !currentNote);
  }, [props.contextMenuId]);

  useEffect(() => {
    if (menu?.clicks && menu.clicks > 0) {
      setHidden(false);
    }
  }, [menu?.clicks]);

  useEffect(() => {
    if (!hidden && ref.current && !ref.current.isFocused() && menu?.clicks && menu.clicks > 0) {
      ref.current.focus();
    }
  }, [hidden, menu?.clicks]);

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
        onChangeText={(text) => onChangeValue(text)}
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
