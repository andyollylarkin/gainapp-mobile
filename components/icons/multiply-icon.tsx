import IconProps from "./props";
import { Svg, Path } from "react-native-svg";

export default function MultiplyIcon({
  width = 16,
  height = 16,
  color = "#E7B500",
}: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M11.25 4.75L4.75 11.25M4.75 4.75L11.25 11.25"
        stroke={color}
        strokeWidth={1.53155}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
