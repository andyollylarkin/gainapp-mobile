import { Colors, typography } from "@/constants/theme";
import {
  Children,
  type ReactElement,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

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
  const prevTab = useRef(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  function switchTab(index: number) {
    const direction = index > prevTab.current ? 1 : -1;
    prevTab.current = index;

    opacity.value = withTiming(0, { duration: 100 }, () => {
      translateX.value = 30 * direction;
      runOnJS(setActiveTab)(index);
      translateX.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    });
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  if (tabs.length === 0) return null;

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
            <Animated.View key={index} style={{ flex: 1 }}>
              <Pressable
                onPress={() => switchTab(index)}
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
            </Animated.View>
          );
        })}
      </View>
      <Animated.View style={animatedStyle}>{tabs[activeTab]}</Animated.View>
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
