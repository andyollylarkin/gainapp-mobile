import ScaledPressable from "@/components/animated/scaled-pressable";
import ArrowIcon from "@/components/icons/arrow";
import GymIcon from "@/components/icons/gym";
import IconProps from "@/components/icons/props";
import SuccessIcon from "@/components/icons/sucess-icon";
import Circle from "@/components/parts/circle";
import { Colors } from "@/constants/theme";
import type { ComponentType } from "react";
import { Pressable, Text, View } from "react-native";

type KeyboardItems =
  | []
  | [
      RenderItem,
      RenderItem,
      RenderItem,
      RenderItem,
      RenderItem,
      RenderItem,
      RenderItem,
      RenderItem,
      RenderItem,
      RenderItem,
      RenderItem,
      RenderItem,
    ];

type PanelItems = [] | [RenderItem, RenderItem, RenderItem, RenderItem];
type KeyboardKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type PanelKey = 1 | 2 | 3 | 4;

export type RenderItem = {
  id: number;
  value: string | number | ComponentType<IconProps> | null;
  onClick?: (value?: string | number) => void;
};

export default function Keyboard({
  items,
  panel,
}: {
  items: KeyboardItems;
  panel?: PanelItems;
}) {
  const renderValue = (item: RenderItem) => {
    if (typeof item.value === "function") {
      const Icon = item.value;

      return (
        <ScaledPressable scaleTo={0.97} scaleDuration={150}>
          <Pressable
            onPress={() => item.onClick?.()}
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 30,
              paddingVertical: 4,
            }}
          >
            <Icon
              color={Colors.general.color.grayTones.main}
              width={22}
              height={22}
            />
          </Pressable>
        </ScaledPressable>
      );
    }

    return (
      <ScaledPressable scaleTo={0.98} scaleDuration={150}>
        <Pressable
          onPress={() => item.onClick?.(item.value as number)}
          style={{ width: "100%" }}
        >
          <View>
            <Text
              style={{
                color: Colors.general.color.grayTones.main,
                paddingVertical: 4,
                maxWidth: 100,
                textAlign: "center",
                width: "100%",
                marginBottom: 30,
                fontFamily: "Inter-Medium",
                fontWeight: "500",
                fontSize: 22,
                lineHeight: 22 * 1.2,
              }}
            >
              {item.value}
            </Text>
          </View>
        </Pressable>
      </ScaledPressable>
    );
  };

  const keyboardRows: RenderItem[][] = [];
  for (let i = 0; i < items.length; i += 3) {
    keyboardRows.push(items.slice(i, i + 3));
  }

  const panelRows = panel ?? [];
  const hasPanel = panelRows.length > 0;
  const totalRows = Math.max(keyboardRows.length, panelRows.length);

  return (
    <View
      style={{
        backgroundColor: Colors.general.color.darkTones.bg,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: "100%",
        minHeight: 300,
        paddingTop: 24,
        paddingBottom: 12,
      }}
    >
      <View style={{ justifyContent: "center" }}>
        {Array.from({ length: totalRows }).map((_, rowIndex) => {
          const rowItems = keyboardRows[rowIndex] ?? [];
          const panelItem = panelRows[rowIndex];

          return (
            <View
              key={`keyboard-row-${rowIndex}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: hasPanel ? 3 : 1, flexDirection: "row" }}>
                {[0, 1, 2].map((columnIndex) => {
                  const cellItem = rowItems[columnIndex];

                  return (
                    <View
                      key={`keyboard-cell-${rowIndex}-${columnIndex}`}
                      style={{ width: "33.33%", alignItems: "center" }}
                    >
                      {cellItem ? (
                        renderValue(cellItem)
                      ) : (
                        <View
                          style={{
                            width: "33.33%",
                            marginBottom: 30,
                            paddingVertical: 4,
                          }}
                        />
                      )}
                    </View>
                  );
                })}
              </View>

              {hasPanel ? (
                <View style={{ flex: 1, alignItems: "center" }}>
                  {panelItem ? (
                    renderValue(panelItem)
                  ) : (
                    <View
                      style={{
                        width: "100%",
                        marginBottom: 30,
                        paddingVertical: 4,
                      }}
                    />
                  )}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const keyboardItems: KeyboardItems = [
  { id: 1, value: 1, onClick: (val) => console.log(`${val} clicked`) },
  { id: 2, value: 2 },
  { id: 3, value: 3 },
  { id: 4, value: 4 },
  { id: 5, value: 5 },
  { id: 6, value: 6 },
  { id: 7, value: 7 },
  { id: 8, value: 8 },
  { id: 9, value: 9 },
  { id: 10, value: "." },
  { id: 11, value: 0 },
  {
    id: 12,
    value: () => (
      <ArrowIcon
        direction="left"
        height={26}
        width={26}
        color={Colors.general.color.grayTones.main}
      />
    ),
  },
];

const panelItems: PanelItems = [
  {
    id: 1,
    value: () => (
      <Circle bgColor={Colors.general.color.darkTones.bgMiddle} size={36}>
        <ArrowIcon
          direction="down"
          height={20}
          width={20}
          color={Colors.general.color.grayTones.muted50}
        />
      </Circle>
    ),
  },
  {
    id: 2,
    value: () => (
      <Circle bgColor={Colors.general.color.darkTones.bgMiddle} size={36}>
        <GymIcon
          height={20}
          width={20}
          color={Colors.general.color.grayTones.muted50}
        />
      </Circle>
    ),
  },
  { id: 3, value: null },
  {
    id: 4,
    value: () => (
      <Circle bgColor={Colors.general.color.grayTones.main} size={36}>
        <SuccessIcon
          color={Colors.general.color.darkTones.bg}
          width={20}
          height={20}
        />
      </Circle>
    ),
  },
];

type Handler = (val?: number | string) => void;

type Handlers = {
  keyboard?: Partial<Record<KeyboardKey, Handler>>;
  panel?: Partial<Record<PanelKey, Handler>>;
};

const DefaultKeyboard = (handlers?: Handlers) => {
  keyboardItems.forEach((item, idx) => {
    if (idx >= 12) return;
    const key = item.id as KeyboardKey;
    const handler = handlers?.keyboard?.[key];

    if (handler) {
      item.onClick = handler;
    }
  });
  panelItems.forEach((item, idx) => {
    if (idx >= 4) return;
    const key = (idx + 1) as PanelKey;
    const handler = handlers?.panel?.[key];

    if (handler) {
      item.onClick = handler;
    }
  });

  return <Keyboard items={keyboardItems} panel={panelItems} />;
};

export { DefaultKeyboard };
