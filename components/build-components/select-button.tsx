import { Colors, typography } from "@/constants/theme";
import { Text, View } from "react-native";
import ScaledPressable from "../animated/scaled-pressable";
import ActionsSheet, { ActionsSheetItem } from "./actions-sheet";
import { useEffect, useState } from "react";

export default function SelectButton(props: {
  value: string | number;
  onPress: (val: string | number) => void;
  items: string[] | number[];
}) {
  if (!props.items || props.items.length === 0) {
    props.items = [];
  }

  const actions: ActionsSheetItem[] = props?.items?.map((val, _) => {
    return {
      text: val.toString(),
      onPress: () => {
        (props.onPress(val), setCurrentText(val));
      },
    };
  });

  useEffect(() => {
    if (props.items.length > 0) setCurrentText(props.items[0].toString());
  }, [props.items]);

  const [currentText, setCurrentText] = useState<string | number>(props.value);

  return (
    <View
      style={{
        backgroundColor: Colors.general.color.darkTones.bgTray,
        borderRadius: 20,
        alignSelf: "flex-start",
        paddingHorizontal: 24,
        paddingVertical: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActionsSheet
        items={actions}
        menuPaddingHorizontal={16}
        menuPaddingVertical={10}
        itemPaddingHorizontal={0}
        trigger={({ openMenu, triggerRef }) => (
          <View ref={triggerRef}>
            <ScaledPressable scaleDuration={100} scaleTo={0.97}>
              <Text
                style={{
                  color: Colors.general.color.grayTones.muted50,
                  ...typography.mediumM,
                }}
                onPress={openMenu}
              >
                {currentText}
              </Text>
            </ScaledPressable>
          </View>
        )}
      />
    </View>
  );
}
