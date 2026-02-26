import Box from "@/components/parts/box";
import { Colors, typography } from "@/constants/theme";
import { ReactElement } from "react";
import { ImageProps, Text, View } from "react-native";

export interface ExcerciseItemProps {
  excerciseName: string;
  sets: number;
  reps: number;
  radiusTop?: number;
  radiusBottom?: number;
  onClick?: (id: string) => void;
  image?: ReactElement<ImageProps>;
  id: string;
}

export default function ExcerciseItem(props: ExcerciseItemProps) {
  return (
    <Box
      bgColor={Colors.general.color.darkTones.bgTray}
      borderColor={Colors.general.color.darkTones.bgTray}
      radiusTop={props.radiusTop}
      radiusBottom={props.radiusBottom}
      paddingHorizontal={12}
      paddingVertical={12}
      onPress={() => props.onClick?.(props.id)}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
        }}
      >
        {props.image ? (
          <View style={{ maxWidth: 56, aspectRatio: 1 }}>{props.image}</View>
        ) : (
          <View
            style={{
              width: 56,
              height: 56,
              backgroundColor: Colors.general.color.darkTones.bgLight,
            }}
          />
        )}
        <View>
          <Text
            style={{
              ...typography.mediumM,
              color: Colors.general.color.grayTones.main,
            }}
          >
            {props.excerciseName}
          </Text>
          <Text
            style={{
              ...typography.regularM,
              color: Colors.general.color.grayTones.muted50,
            }}
          >{`${props.sets ?? 0} sets of ${props.reps} reps`}</Text>
        </View>
      </View>
    </Box>
  );
}
