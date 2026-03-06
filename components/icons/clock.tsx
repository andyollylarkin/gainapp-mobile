import IconProps from "./props";
import { Svg, Path } from "react-native-svg";
export default function ClockIcon(props: IconProps) {
  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 18 18"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 9C1.5 4.85775 4.85775 1.5 9 1.5C13.1423 1.5 16.5 4.85775 16.5 9C16.5 13.1423 13.1423 16.5 9 16.5C4.85775 16.5 1.5 13.1423 1.5 9ZM9 6C9 5.80109 8.92098 5.61032 8.78033 5.46967C8.63968 5.32902 8.44891 5.25 8.25 5.25C8.05109 5.25 7.86032 5.32902 7.71967 5.46967C7.57902 5.61032 7.5 5.80109 7.5 6V9.75C7.5 9.94891 7.57902 10.1397 7.71967 10.2803C7.86032 10.421 8.05109 10.5 8.25 10.5H12C12.1989 10.5 12.3897 10.421 12.5303 10.2803C12.671 10.1397 12.75 9.94891 12.75 9.75C12.75 9.55109 12.671 9.36032 12.5303 9.21967C12.3897 9.07902 12.1989 9 12 9H9V6Z"
        fill={props.color ?? "#000000"}
      />
    </Svg>
  );
}
