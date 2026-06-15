import Ruler from "@/components/build-components/composite/ruler/ruler";
import { RulerLineHandle } from "@/components/build-components/composite/ruler/ruler-line";
import SegmentedSwitch from "@/components/build-components/segmented-switch";
import { Colors, typography } from "@/constants/theme";
import { KgToLbs, LbsToKg } from "@/utils/kg_to_lbs";
import { useRef, useState } from "react";
import { Text, View } from "react-native";

const UNIT_OPTIONS = [
  { label: "lbs", value: "lbs" },
  { label: "kg", value: "kg" },
] as const;

type Unit = (typeof UNIT_OPTIONS)[number]["value"];

export default function Screen10({
  onAnswer,
}: {
  onAnswer: (value: unknown) => void;
}) {
  const [unit, setUnit] = useState<Unit>("lbs");
  const [rulerValue, setRulerValue] = useState<number>(160);
  const rulerRef = useRef<RulerLineHandle>(null);

  function handleUnitChange(newUnit: Unit) {
    const newValue = Math.round(
      newUnit === "kg" ? LbsToKg(rulerValue) : KgToLbs(rulerValue),
    );
    setRulerValue(newValue);
    setUnit(newUnit);
    rulerRef.current?.scrollTo(newValue);
  }

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          paddingTop: 60,
          paddingLeft: 20,
          ...typography.mediumExtra,
          color: Colors.general.color.grayTones.main,
        }}
      >
        What is your current weight?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Ruler
          ref={rulerRef}
          defaultValue={rulerValue}
          delimiter="."
          onValueChange={(v) => {
            setRulerValue(v);
            onAnswer(unit === "kg" ? v : Math.round(LbsToKg(v)));
          }}
        />

        <SegmentedSwitch
          options={UNIT_OPTIONS}
          value={unit}
          onChange={handleUnitChange}
        />
      </View>
    </View>
  );
}
