import { Colors, typography } from "@/constants/theme";
import { Pressable, Text, View } from "react-native";
import ThreeDotsIcon from "../icons/three-dots";
import TimelineIcon from "../icons/timeline";
import Circle from "../parts/circle";

export interface ExcerciseTitleProps {
  type: "Barbell" | "Rope" | "Treadmill" | "Bodyweight" | "Machine";
  title: string;
  backgroundColor:
    | typeof Colors.general.color.darkTones.bgTray
    | typeof Colors.general.color.darkTones.bgMiddle;
  iconsColor:
    | typeof Colors.general.color.darkTones.bgMiddle
    | typeof Colors.general.color.darkTones.bgLight;
  icon1Click: () => void;
  icon2Click: () => void;
}

export default function ExcerciseTitle(props: ExcerciseTitleProps) {
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
      <View
        style={{
          width: 52,
          height: 52,
          backgroundColor: "gray",
        }}
      ></View>
      <View style={{ padding: 6, flexDirection: "column", gap: 2 }}>
        <Text
          style={{
            ...typography.mediumM,
            color: Colors.general.color.grayTones.muted30,
          }}
        >
          {props.type}
        </Text>
        <Text
          style={{
            ...typography.mediumL,
            color: Colors.general.color.grayTones.main,
          }}
        >
          {props.title}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "flex-end",
          flexDirection: "row",
          height: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Pressable onPress={props.icon1Click}>
            <Circle bgColor={props.iconsColor}>
              <ThreeDotsIcon color={Colors.general.color.grayTones.muted50} />
            </Circle>
          </Pressable>
          <Pressable onPress={props.icon2Click}>
            <Circle bgColor={props.iconsColor}>
              <TimelineIcon color={Colors.general.color.grayTones.muted50} />
            </Circle>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
