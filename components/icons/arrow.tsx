import { G, Path, Svg } from "react-native-svg";
import IconProps from "./props";

const ROTATION = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
};

export default function ArrowIcon(
  props: IconProps & { direction?: "up" | "down" | "left" | "right" },
) {
  const { width = 16, height = 16, color, direction = "right" } = props;
  const rotate = ROTATION[direction];

  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <G transform={`rotate(${rotate}, 8, 8)`}>
        <Path
          d="M6.66663 12L10.6666 8L6.66663 4"
          stroke={color ?? "white"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}
