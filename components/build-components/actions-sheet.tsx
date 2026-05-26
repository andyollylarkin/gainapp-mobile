import type IconProps from "@/components/icons/props";
import { Colors, typography } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import {
  ComponentType,
  ReactNode,
  RefObject,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScaledPressable from "../animated/scaled-pressable";

export interface ActionsSheetItem {
  text: string;
  icon?: ComponentType<IconProps>;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface ActionsSheetProps {
  items: ActionsSheetItem[];
  menuPaddingHorizontal?: number;
  menuPaddingVertical?: number;
  itemPaddingHorizontal?: number;
  itemPaddingVertical?: number;
  forceBelow?: boolean;
  maxHeight?: number;
  trigger: (params: {
    openMenu: () => void;
    triggerRef: RefObject<View | null>;
  }) => ReactNode;
}

const MENU_WIDTH = 270;
const MENU_RADIUS = 28;
const MENU_ITEM_HEIGHT = 44;
const MENU_TRIGGER_GAP = 0;

export default function ActionsSheet({
  items,
  trigger,
  menuPaddingHorizontal = 16,
  menuPaddingVertical = 10,
  itemPaddingHorizontal = 6,
  itemPaddingVertical = 10,
  forceBelow = false,
  maxHeight = 300,
}: ActionsSheetProps) {
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const menuScale = useRef(new Animated.Value(0.96)).current;
  const menuTranslateY = useRef(new Animated.Value(8)).current;

  const menuHeight = useMemo(() => {
    return items.length * MENU_ITEM_HEIGHT + 20;
  }, [items.length]);

  const animateOpen = () => {
    overlayOpacity.setValue(0);
    menuOpacity.setValue(0);
    menuScale.setValue(0.96);
    menuTranslateY.setValue(8);

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacity, {
        toValue: 1,
        duration: 170,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(menuScale, {
        toValue: 1,
        duration: 170,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(menuTranslateY, {
        toValue: 0,
        duration: 170,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = (onComplete?: unknown) => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacity, {
        toValue: 0,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(menuScale, {
        toValue: 0.98,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(menuTranslateY, {
        toValue: 6,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setOpen(false);
      if (typeof onComplete === "function") {
        setTimeout(() => onComplete(), 50);
      }
    });
  };

  const openMenu = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
      requestAnimationFrame(animateOpen);
    });
  };

  const onActionPress = (action: ActionsSheetItem) => {
    closeMenu(() => action.onPress());
  };

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const horizontalPadding = 12;
  const verticalPadding = 16;

  const preferredX = anchor.x + anchor.width - MENU_WIDTH;
  const clampedX = Math.max(
    horizontalPadding,
    Math.min(preferredX, screenWidth - MENU_WIDTH - horizontalPadding),
  );

  const showAbove = forceBelow
    ? false
    : anchor.y + anchor.height + MENU_TRIGGER_GAP + menuHeight >
      screenHeight - verticalPadding;

  const belowTop = anchor.y + anchor.height + MENU_TRIGGER_GAP + 8;
  const aboveTop = anchor.y - menuHeight - MENU_TRIGGER_GAP;
  const finalTop = showAbove ? aboveTop : belowTop;

  return (
    <>
      {trigger({ openMenu, triggerRef })}
      <Modal
        transparent
        visible={open}
        animationType="none"
        onRequestClose={() => closeMenu()}
      >
        <View style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: overlayOpacity }]}
          >
            <View style={styles.overlayTint} />
          </Animated.View>

          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => closeMenu()}
          />

          <Animated.View
            style={[
              styles.menuWrapper,
              {
                top: finalTop,
                left: clampedX,
                width: MENU_WIDTH,
                opacity: menuOpacity,
                transform: [
                  { scale: menuScale },
                  { translateY: menuTranslateY },
                ],
              },
            ]}
          >
            <View style={styles.glassShell}>
              <View style={styles.glassTintBack} />
              <BlurView
                intensity={36}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
              <ExpoLinearGradient
                colors={[
                  "rgba(255,255,255,0.10)",
                  "rgba(255,255,255,0.03)",
                  "rgba(0,0,0,0.03)",
                  "rgba(0,0,0,0.20)",
                ]}
                start={{ x: 0.08, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              <View
                style={[
                  styles.menuContent,
                  {
                    paddingHorizontal: menuPaddingHorizontal,
                    paddingVertical: menuPaddingVertical,
                  },
                ]}
              >
                <ScrollView
                  style={{ maxHeight }}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <View key={`${item.text}-${index}`}>
                        <ScaledPressable scaleDuration={100} scaleTo={0.97}>
                          <Pressable
                            onPress={() => {
                              if (item.disabled) {
                                return;
                              }
                              onActionPress(item);
                            }}
                            style={[
                              styles.menuItem,
                              {
                                paddingHorizontal: itemPaddingHorizontal,
                                paddingVertical: itemPaddingVertical,
                              },
                            ]}
                          >
                            {Icon ? (
                              <Icon
                                width={24}
                                thickness={1}
                                height={24}
                                color={
                                  item?.disabled
                                    ? Colors.general.color.grayTones.muted40
                                    : item.destructive
                                      ? "#FF383C"
                                      : "rgba(255,255,255,0.92)"
                                }
                              />
                            ) : null}
                            <Text
                              style={[
                                styles.menuItemText,
                                item.destructive &&
                                  styles.menuItemTextDestructive,
                                {
                                  color: item?.disabled
                                    ? Colors.general.color.grayTones.muted40
                                    : Colors.general.color.grayTones.main,
                                },
                              ]}
                            >
                              {item.text}
                            </Text>
                          </Pressable>
                        </ScaledPressable>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlayTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  menuWrapper: {
    position: "absolute",
    zIndex: 20,
  },
  glassShell: {
    width: "100%",
    minHeight: 0,
    borderRadius: MENU_RADIUS,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(204,204,204,0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 14,
  },
  glassTintBack: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  menuContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuItem: {
    paddingHorizontal: 6,
    paddingVertical: 10,
    minHeight: MENU_ITEM_HEIGHT,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    columnGap: 8,
  },
  menuItemText: {
    ...typography.sfPro,
    color: Colors.general.color.grayTones.main,
  },
  menuItemTextDestructive: {
    color: "#FF383C",
  },
});
