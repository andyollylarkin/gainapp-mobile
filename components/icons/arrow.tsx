import IconProps from "./props";
import { Svg, Path } from "react-native-svg";

export default function ArrowIcon(props: IconProps) {
  const { width, height, color } = props;
  return (
    <Svg
      width={width ?? 16}
      height={height ?? 16}
      viewBox="0 0 16 16"
      fill="none"
    >
      <Path
        d="M6.66663 12L10.6666 8L6.66663 4"
        stroke={color ?? "white"}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
