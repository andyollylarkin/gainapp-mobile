import { Colors, typography } from "@/constants/theme";
import { Children, type ReactElement, type ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";

export type TabViewItemProps = {
  "tab-name": string;
  children: ReactNode;
};

type TabViewChild = ReactElement<TabViewItemProps>;

function TabViewItem(props: TabViewItemProps) {
  return props.children;
}

function TabView(props: { children: TabViewChild | TabViewChild[] }) {
  const tabs = Children.toArray(props.children) as TabViewChild[];
  const [activeTab, setActiveTab] = useState(0);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: Colors.general.color.darkTones.bgTray,
          borderRadius: 999,
          padding: 2,
          gap: 6,
          marginBottom: 12,
        }}
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeTab;

          return (
            <Pressable
              key={index}
              onPress={() => setActiveTab(index)}
              style={{
                flex: 1,
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 10,
                alignItems: "center",
                backgroundColor: isActive
                  ? Colors.general.color.darkTones.bgMiddle
                  : "transparent",
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  ...typography.mediumM,
                  color: isActive
                    ? Colors.general.color.grayTones.main
                    : Colors.general.color.grayTones.muted30,
                }}
              >
                {tab.props["tab-name"]}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View>{tabs[activeTab]}</View>
    </View>
  );
}

interface TabViewInterface {
  View: typeof TabView;
  TabItem: typeof TabViewItem;
}

const TabViewComponent: TabViewInterface = {
  TabItem: TabViewItem,
  View: TabView,
};

export default TabViewComponent;
