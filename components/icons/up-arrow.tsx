import { Path, Svg } from "react-native-svg";
import IconProps from "./props";

export default function UpArrowIcon(props: IconProps) {
  const strokeWidth = Math.max(1, 2 + (props.thickness ?? 0));

  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M6.60179 17.5413L16.7808 7.3623"
        stroke={props.color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.0716 15.2148V7.07159H8.92841"
        stroke={props.color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
