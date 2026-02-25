import IconProps from "./props";
import { Svg, Path } from "react-native-svg";

export default function PlanIcon(props: IconProps) {
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
        d="M2 7C2 4.23858 4.23858 2 7 2H17C19.7614 2 22 4.23858 22 7V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V7ZM18 15C18.6 15 19 15.4 19 16C19 16.6 18.6 17 18 17H10C9.4 17 9 16.6 9 16C9 15.4 9.4 15 10 15H18ZM19 12C19 11.4 18.6 11 18 11H10C9.4 11 9 11.4 9 12C9 12.6 9.4 13 10 13H18C18.6 13 19 12.6 19 12ZM18 7C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9H10C9.4 9 9 8.6 9 8C9 7.4 9.4 7 10 7H18ZM7 8C7 7.4 6.6 7 6 7C5.4 7 5 7.4 5 8C5 8.6 5.4 9 6 9C6.6 9 7 8.6 7 8ZM6 11C6.6 11 7 11.4 7 12C7 12.6 6.6 13 6 13C5.4 13 5 12.6 5 12C5 11.4 5.4 11 6 11ZM7 16C7 15.4 6.6 15 6 15C5.4 15 5 15.4 5 16C5 16.6 5.4 17 6 17C6.6 17 7 16.6 7 16Z"
        fill={props.color}
      />
    </Svg>
  );
}
