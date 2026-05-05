import { ColorProps } from "react-native-svg";

type IconProps = {
  width: number;
  height: number;
  color?: ColorProps["color"] | `#${string}`;
};

export default IconProps;
