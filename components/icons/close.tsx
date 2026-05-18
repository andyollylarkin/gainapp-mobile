import IconProps from "./props";
import { Svg, Path } from "react-native-svg";

export default function CloseIcon(props: IconProps) {
  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 18 18"
      fill="none"
    >
      <Path
        d="M5 13L13 5M5 5L13 13"
        stroke={props.color}
        strokeWidth={props.thickness}
        stroke-linecap="round"
      />
    </Svg>
  );
}
