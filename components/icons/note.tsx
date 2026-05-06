import { Path, Svg } from "react-native-svg";
import IconProps from "./props";

export default function NoteIcon(props: IconProps) {
  const strokeWidth = Math.max(1, 1.5 + (props.thickness ?? 0));

  return (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M20 13V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H13L20 13ZM13 20V14C13 13.7348 13.1054 13.4804 13.2929 13.2929C13.4804 13.1054 13.7348 13 14 13H20"
        stroke={props.color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
