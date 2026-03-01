import IconProps from "./props";
import { Svg, Path, G, Mask, Defs, ClipPath, Rect } from "react-native-svg";

export default function PlayIcon(props: IconProps) {
  const { width, height, color } = props;
  return (
    <Svg
      width={width ?? 20}
      height={height ?? 20}
      viewBox="0 0 20 20"
      fill="none"
    >
      <G clipPath="url(#clip0_487_1417)">
        <Mask
          id="mask0_487_1417"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="20"
          height="20"
        >
          <Path
            d="M9.99996 18.3334C14.6025 18.3334 18.3333 14.6026 18.3333 10.0001C18.3333 5.39758 14.6025 1.66675 9.99996 1.66675C5.39746 1.66675 1.66663 5.39758 1.66663 10.0001C1.66663 14.6026 5.39746 18.3334 9.99996 18.3334Z"
            fill="white"
            stroke="white"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <Path
            d="M8.33325 10.0002V7.11353L10.8333 8.55686L13.3333 10.0002L10.8333 11.4435L8.33325 12.8869V10.0002Z"
            fill="black"
            stroke="black"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </Mask>
        <G mask="url(#mask0_487_1417)">
          <Path d="M0 0H20V20H0V0Z" fill={color || "white"} />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_487_1417">
          <Rect width="20" height="20" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
