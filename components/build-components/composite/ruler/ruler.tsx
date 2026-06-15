import { forwardRef, useState } from "react";
import { View, Text } from "react-native";
import RulerLine, { RulerLineHandle } from "./ruler-line";
import { Colors } from "@/constants/theme";

type Delimiter = "'" | ".";

const Ruler = forwardRef<
  RulerLineHandle,
  {
    defaultValue?: number;
    delimiter?: Delimiter;
    onValueChange?: (val: number) => void;
  }
>(function Ruler(props, ref) {
  const { defaultValue = 200, delimiter = "." } = props;
  const [val, setVal] = useState(props.defaultValue);
  return (
    <View style={{ flexDirection: "column", alignItems: "center", gap: 12 }}>
      <Text
        style={{
          fontFamily: "Inter-Bold",
          fontSize: 36,
          lineHeight: 36 * 1.25,
          color: Colors.general.color.grayTones.main,
        }}
      >
        {`${val}${delimiter === "." ? "." : "'"}0${delimiter === "." ? "" : "''"}`}
      </Text>
      <RulerLine
        ref={ref}
        initialValue={defaultValue}
        onValueChange={(v) => {
          setVal(v);
          props.onValueChange?.(v);
        }}
      />
    </View>
  );
});

export default Ruler;
