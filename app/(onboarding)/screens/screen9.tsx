import Ruler from "@/components/build-components/composite/ruler/ruler";
import { RulerLineHandle } from "@/components/build-components/composite/ruler/ruler-line";
import SegmentedSwitch from "@/components/build-components/segmented-switch";
import { Colors, typography } from "@/constants/theme";
import { CmToFt, FtToCm } from "@/utils/ft_to_cm";
import { useRef, useState } from "react";
import { Text, View } from "react-native";

const UNIT_OPTIONS = [
  { label: "ft", value: "ft" },
  { label: "cm", value: "cm" },
] as const;

type Unit = (typeof UNIT_OPTIONS)[number]["value"];

export default function Slide9({
  onAnswer,
}: {
  onAnswer: (value: unknown) => void;
}) {
  const [unit, setUnit] = useState<Unit>("ft");
  const [rulerValue, setRulerValue] = useState<number>(6);
  const rulerRef = useRef<RulerLineHandle>(null);

  function handleUnitChange(newUnit: Unit) {
    const newValue = Math.round(
      newUnit === "cm" ? FtToCm(rulerValue) : CmToFt(rulerValue),
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
        How tall are you?
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
          delimiter={unit === "ft" ? `'` : "."}
          onValueChange={(v) => setRulerValue(v)}
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
