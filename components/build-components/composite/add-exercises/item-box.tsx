import { Pressable, View, Image, Text } from "react-native";
import { Exercise } from "./types";
import { Box } from "../info-tab/box";
import { Colors, typography } from "@/constants/theme";
import CheckCircle from "../../check-circle";

export default function ItemBox(props: {
  exercise: Exercise;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}): React.ReactElement {
  return (
    <Pressable onPress={() => props.onCheckedChange(!props.checked)}>
      <Box key={props?.exercise?.id}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 12,
            alignItems: "center",
            paddingRight: 24,
            paddingLeft: 12,
          }}
        >
          {props.exercise.imgUrl ? (
            <Image
              src={props.exercise.imgUrl}
              style={{
                maxWidth: 56,
                aspectRatio: "1",
                borderRadius: 12,
              }}
            />
          ) : (
            <View
              style={{
                width: 56,
                borderRadius: 12,
                maxWidth: 56,
                aspectRatio: "1",
                backgroundColor: Colors.general.color.grayTones.muted40,
              }}
            />
          )}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                height: "100%",
                gap: 6,
              }}
            >
              <Text
                style={{
                  ...typography.mediumM,
                  color: Colors.general.color.grayTones.main,
                }}
              >
                {props.exercise.name}
              </Text>
              <Text
                style={{
                  ...typography.mediumM,
                  color: Colors.general.color.grayTones.muted50,
                }}
              >
                {props.exercise.equipment}
              </Text>
            </View>
          </View>
          <View>
            <CheckCircle checked={props.checked} size={22} />
          </View>
        </View>
      </Box>
    </Pressable>
  );
}
