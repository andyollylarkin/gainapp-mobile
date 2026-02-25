import IconProps from "./props";
import { Svg, Path } from "react-native-svg";

export default function ChartIcon(props: IconProps) {
  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 7C22 4.23858 19.7614 2 17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7ZM8 17C8.6 17 9 16.6 9 16V12C9 11.4 8.6 11 8 11C7.4 11 7 11.4 7 12V16C7 16.6 7.4 17 8 17ZM13 16C13 16.6 12.6 17 12 17C11.4 17 11 16.6 11 16V8C11 7.4 11.4 7 12 7C12.6 7 13 7.4 13 8V16ZM16 17C16.6 17 17 16.6 17 16V10C17 9.4 16.6 9 16 9C15.4 9 15 9.4 15 10V16C15 16.6 15.4 17 16 17Z"
        fill={props.color}
      />
    </Svg>
  );
}
