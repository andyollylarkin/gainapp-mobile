import { Path, Rect, Svg } from "react-native-svg";
import FillThickness from "./fill-thickness";
import IconProps from "./props";
export default function GainLogo(
  props: IconProps & { secondaryColor?: string },
) {
  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 20 20"
      fill="none"
    >
      <FillThickness thickness={props.thickness}>
        <Rect width="20" height="20" rx="10" fill={props.color} />
        <Path
          d="M11.75 3H8.25V8.25H11.75V3Z"
          fill={props.secondaryColor || "#F2F2F2"}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17 11.75V11.2818V8.25H11.75C11.75 10.183 13.317 11.75 15.25 11.75H17ZM8.25 17V11.75L11.75 11.75V17H8.25ZM3 11.75H4.75195C6.68405 11.7489 8.25 10.1823 8.25 8.25L3 8.25L3 11.2818V11.75Z"
          fill={props.secondaryColor || "#F2F2F2"}
        />
      </FillThickness>
    </Svg>
  );
}
