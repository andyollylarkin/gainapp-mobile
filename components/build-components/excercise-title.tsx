import { Colors, typography } from "@/constants/theme";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ScaledPressable from "../animated/scaled-pressable";
import FluentDrag from "../icons/fluent-drag";
import ActionsSheet, { ActionsSheetItem } from "./actions-sheet";
import StatsButton from "./stats-button";
import ThreeDotsButton from "./three-dots-button";

export interface ExcerciseTitleProps {
  type: string;
  title: string;
  backgroundColor:
    | typeof Colors.general.color.darkTones.bgTray
    | typeof Colors.general.color.darkTones.bgMiddle;
  iconsColor:
    | typeof Colors.general.color.darkTones.bgMiddle
    | typeof Colors.general.color.darkTones.bgLight;
  menuItems?: ActionsSheetItem[];
  icon1Click: () => void;
  icon2Click: () => void;
  expanded?: boolean;
}

export default function ExcerciseTitle(props: ExcerciseTitleProps) {
  const { expanded = true } = props;
  const dragIconOpacity = useSharedValue(expanded ? 0 : 1);
  const actionIconsOpacity = useSharedValue(expanded ? 1 : 0);

  useEffect(() => {
    dragIconOpacity.value = withTiming(expanded ? 0 : 1, { duration: 220 });
    actionIconsOpacity.value = withTiming(expanded ? 1 : 0, { duration: 220 });
  }, [expanded, actionIconsOpacity, dragIconOpacity]);

  const dragIconStyle = useAnimatedStyle(() => ({
    opacity: dragIconOpacity.value,
    transform: [{ scale: 0.95 + dragIconOpacity.value * 0.05 }],
  }));

  const actionIconsStyle = useAnimatedStyle(() => ({
    opacity: actionIconsOpacity.value,
    transform: [{ scale: 0.95 + actionIconsOpacity.value * 0.05 }],
  }));

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 12,
        backgroundColor: props.backgroundColor,
      }}
    >
      {/* TODO: replace to icon */}
      <Animated.View
        style={{
          width: 52,
          height: 52,
          backgroundColor: "gray",
        }}
      ></Animated.View>
      <View style={{ padding: 6, flexDirection: "column", gap: 2 }}>
        <Text
          style={{
            ...typography.mediumL,
            color: Colors.general.color.grayTones.main,
          }}
        >
          {props.title}
        </Text>
        <Text
          style={{
            ...typography.mediumM,
            color: Colors.general.color.grayTones.muted30,
          }}
        >
          {props.type}
        </Text>
      </View>
      <View style={styles.rightActionsArea}>
        <Animated.View
          pointerEvents={expanded ? "none" : "auto"}
          style={[styles.centeredRightContainer, dragIconStyle]}
        >
          <FluentDrag
            width={24}
            height={24}
            color={Colors.general.color.grayTones.muted50}
          />
        </Animated.View>

        <Animated.View
          pointerEvents={expanded ? "auto" : "none"}
          style={[
            styles.topRightContainer,
            styles.iconsContainer,
            actionIconsStyle,
          ]}
        >
          <ScaledPressable scaleDuration={150} scaleTo={0.94}>
            <StatsButton
              color={props.iconsColor}
              onPressIn={props.icon1Click}
            />
          </ScaledPressable>
          {props.menuItems && props.menuItems.length > 0 ? (
            <ActionsSheet
              items={props.menuItems}
              trigger={({ openMenu, triggerRef }) => (
                <View ref={triggerRef}>
                  <ScaledPressable scaleDuration={150} scaleTo={0.94}>
                    <ThreeDotsButton
                      color={props.iconsColor}
                      onPress={openMenu}
                    />
                  </ScaledPressable>
                </View>
              )}
            />
          ) : (
            <ScaledPressable scaleDuration={150} scaleTo={0.94}>
              <ThreeDotsButton
                color={props.iconsColor}
                onPressIn={props.icon2Click}
              />
            </ScaledPressable>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rightActionsArea: {
    flex: 1,
    position: "relative",
    alignSelf: "stretch",
    alignItems: "flex-end",
    justifyContent: "center",
    minHeight: 52,
  },
  centeredRightContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  topRightContainer: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
});
