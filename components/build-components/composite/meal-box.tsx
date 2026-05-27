import PencilIcon from "@/components/icons/pencil";
import { Colors, typography } from "@/constants/theme";
import { Text, View } from "react-native";

export interface MealBoxProps {
  caloriesToEat: number;
  proteins: number;
  carbs: number;
  fat: number;
}

export default function MealBox(props: MealBoxProps) {
  return (
    <View
      style={{
        backgroundColor: Colors.general.color.darkTones.bgTray,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 24,
        borderColor: Colors.general.color.darkTones.bgMiddle,
        borderWidth: 2,
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* UPPER ROW */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flexDirection: "column", gap: 2 }}>
          <Text
            style={{
              ...typography.mediumM,
              color: Colors.general.color.grayTones.muted50,
            }}
          >
            Calories to eat
          </Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Text
              style={{
                ...typography.mediumXL,
                color: Colors.general.color.grayTones.main,
              }}
            >{`${props.caloriesToEat ?? 0}`}</Text>
            <Text
              style={{
                ...typography.mediumXL,
                color: Colors.general.color.grayTones.muted50,
              }}
            >
              total
            </Text>
          </View>
        </View>
        <View
          style={{
            borderRadius: 20,
            backgroundColor: Colors.general.color.darkTones.bgMiddle,
            paddingHorizontal: 12,
            paddingVertical: 5,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}
        >
          <PencilIcon
            width={16}
            height={16}
            color={Colors.general.color.grayTones.muted50}
          />
          <Text
            style={{
              ...typography.mediumS,
              color: Colors.general.color.grayTones.muted50,
            }}
          >
            Log meals soon
          </Text>
        </View>
      </View>
      {/* LOWER ROW */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: 12,
        }}
      >
        {[
          { label: "Protein", value: props.proteins },
          { label: "Carbs", value: props.carbs },
          { label: "Fat", value: props.fat },
        ].map(({ label, value }) => (
          <View
            key={label}
            style={{
              backgroundColor: Colors.general.color.darkTones.bgMiddle,
              borderRadius: 12,
              flexDirection: "column",
              padding: 12,
              justifyContent: "flex-start",
              flex: 1,
              flexBasis: 0,
            }}
          >
            <Text
              style={{
                ...typography.mediumM,
                color: Colors.general.color.grayTones.muted50,
              }}
            >
              {label}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text
                style={{
                  ...typography.mediumL,
                  color: Colors.general.color.grayTones.main,
                }}
              >
                {value ?? 0}
              </Text>
              <Text
                style={{
                  ...typography.mediumL,
                  color: Colors.general.color.grayTones.muted50,
                }}
              >
                g
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
