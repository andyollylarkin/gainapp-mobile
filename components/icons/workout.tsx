import IconProps from "./props";
import { Svg, Path } from "react-native-svg";

export default function WorkoutIcon(props: IconProps) {
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
        d="M2 7C2 4.23858 4.23858 2 7 2H17C19.7614 2 22 4.23858 22 7V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V7ZM8.5 11H15.5V9C15.5 8.44772 15.9477 8 16.5 8H18.5C19.0523 8 19.5 8.44772 19.5 9V15C19.5 15.5523 19.0523 16 18.5 16H16.5C15.9477 16 15.5 15.5523 15.5 15V13H8.5V15C8.5 15.5523 8.05228 16 7.5 16H5.5C4.94772 16 4.5 15.5523 4.5 15V9C4.5 8.44772 4.94772 8 5.5 8H7.5C8.05228 8 8.5 8.44772 8.5 9V11Z"
        fill={props.color}
      />
    </Svg>
  );
}
