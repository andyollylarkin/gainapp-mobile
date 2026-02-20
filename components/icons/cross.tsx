import IconProps from "./props";
import { Svg, Path } from "react-native-svg";

export default function CrossIcon(props: IconProps) {
  const { width, height, color } = props;
  return (
    <Svg
      width={width ?? 16}
      height={height ?? 16}
      viewBox="0 0 16 16"
      fill="none"
    >
      <Path
        d="M8 3V13"
        stroke={color ?? "white"}
        strokeWidth={1.53155}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
