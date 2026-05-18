import { Path, Svg } from "react-native-svg";
import FillThickness from "./fill-thickness";
import IconProps from "./props";

export default function MinusIcon(props: IconProps) {
  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 18 18"
      fill="none"
    >
      <FillThickness thickness={props.thickness}>
        <Path
          d="M3.6002 8.10019C3.10238 8.10019 2.7002 8.50238 2.7002 9.0002C2.7002 9.49801 3.10238 9.9002 3.6002 9.9002H14.4002C14.898 9.9002 15.3002 9.49801 15.3002 9.0002C15.3002 8.50238 14.898 8.10019 14.4002 8.10019H3.6002Z"
          fill={props.color}
        />
      </FillThickness>
    </Svg>
  );
}
