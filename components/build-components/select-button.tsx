import { Colors, typography } from "@/constants/theme";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import ScaledPressable from "../animated/scaled-pressable";
import ActionsSheet, { ActionsSheetItem } from "./actions-sheet";

export default function SelectButton(props: {
  value: string | number;
  onPress: (val: string | number) => void;
  items: string[] | number[];
  color?: string;
  textColor?: string;
}) {
  let items = props.items;
  if (!props?.items || props?.items?.length === 0) {
    items = [];
  }

  const [currentText, setCurrentText] = useState<string | number>(props.value);

  useEffect(() => {
    if (items.length > 0) setCurrentText(items[0].toString());
  }, [items]);

  const actions: ActionsSheetItem[] = items?.map((val) => ({
    text: val.toString(),
    onPress: () => {
      props.onPress(val);
      setCurrentText(val);
    },
  }));

  return (
    <View
      style={{
        backgroundColor: props.color ?? Colors.general.color.darkTones.bgTray,
        borderRadius: 20,
        alignSelf: "flex-start",
        paddingHorizontal: 24,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActionsSheet
        items={actions}
        menuPaddingHorizontal={16}
        menuPaddingVertical={10}
        itemPaddingHorizontal={0}
        forceBelow
        maxHeight={500}
        trigger={({ openMenu, triggerRef }) => (
          <View ref={triggerRef}>
            <ScaledPressable scaleDuration={100} scaleTo={0.97}>
              <Text
                style={{
                  color: props.textColor ?? Colors.general.color.grayTones.muted50,
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
