import IconProps from "./props";
import { Svg, Path } from "react-native-svg";

export default function ShareIcon(props: IconProps) {
  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 30 30"
      fill="none"
    >
      <Path
        d="M15.0005 6.24902V16.874M18.7505 8.74902L15.0005 4.99902L11.2505 8.74902M6.25049 14.999V21.249C6.25049 21.9121 6.51388 22.5479 6.98272 23.0168C7.45156 23.4856 8.08745 23.749 8.75049 23.749H21.2505C21.9135 23.749 22.5494 23.4856 23.0183 23.0168C23.4871 22.5479 23.7505 21.9121 23.7505 21.249V14.999"
        stroke={props.color ?? "white"}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
