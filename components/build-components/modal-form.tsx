import ScaledPressable from "@/components/animated/scaled-pressable";
import CloseIcon from "@/components/icons/close";
import Circle from "@/components/parts/circle";
import { Colors, typography } from "@/constants/theme";
import { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

export interface ModalProps {
  children: ReactElement;
  title: string;
  openState: boolean;
  setClose: () => void;
}

export default function ModalForm(props: ModalProps) {
  if (!props.openState) return null;
  return (
    <View
      style={{
        borderRadius: 32,
        backgroundColor: Colors.general.color.darkTones.bgTray,
        alignSelf: "stretch",
        height: "auto",
        // flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 20,
        gap: 24,
      }}
    >
      <View
        style={{
          paddingHorizontal: 8,
          paddingBottom: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: Colors.general.color.darkTones.bgMiddle,
        }}
      >
        <Text
          style={{
            ...typography.mediumL,
            color: Colors.general.color.grayTones.main,
          }}
        >
          {props.title}
        </Text>
        <ScaledPressable scaleDuration={150} scaleTo={0.95}>
          <Pressable onPress={props.setClose}>
            <Circle size={30} bgColor={Colors.general.color.darkTones.bgMiddle}>
              <CloseIcon
                width={18}
                height={18}
                thickness={2}
                color={Colors.general.color.grayTones.muted50}
              />
            </Circle>
          </Pressable>
        </ScaledPressable>
      </View>
      {props.children}
    </View>
  );
}
