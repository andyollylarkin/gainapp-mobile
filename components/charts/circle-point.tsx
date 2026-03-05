import { useId } from "react";
import { G, Mask, Path, Rect } from "react-native-svg";
import { ChartLineRenderProps, ChartPointRenderProps } from "./chart";
export function CirclePoint(props: ChartPointRenderProps) {
  const maskId = useId();

  return (
    <G x={props.x - 8} y={props.y - 8}>
      <Mask
        id={maskId}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <Rect fill="white" width="16" height="16" />
        <Path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM5.98882 8C5.98882 9.11074 6.88926 10.0112 8 10.0112C9.11074 10.0112 10.0112 9.11074 10.0112 8C10.0112 6.88926 9.11074 5.98882 8 5.98882C6.88926 5.98882 5.98882 6.88926 5.98882 8Z" />
      </Mask>
      <Path
        d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM5.98882 8C5.98882 9.11074 6.88926 10.0112 8 10.0112C9.11074 10.0112 10.0112 9.11074 10.0112 8C10.0112 6.88926 9.11074 5.98882 8 5.98882C6.88926 5.98882 5.98882 6.88926 5.98882 8Z"
        fill={props.color || "#27C2FF"}
      />
    </G>
  );
}

export function LinePoint(
  props: ChartLineRenderProps & { strokeWidth?: number; pointGap?: number },
) {
  const gapFromPointCenter = props.pointGap ?? 10;

  const pathD = props.points
    .slice(1)
    .map((end, index) => {
      const start = props.points[index];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy);

      if (length <= gapFromPointCenter * 2) {
        return "";
      }

      const ux = dx / length;
      const uy = dy / length;

      const x1 = start.x + ux * gapFromPointCenter;
      const y1 = start.y + uy * gapFromPointCenter;
      const x2 = end.x - ux * gapFromPointCenter;
      const y2 = end.y - uy * gapFromPointCenter;

      return `M${x1} ${y1} L${x2} ${y2}`;
    })
    .filter(Boolean)
    .join(" ");

  return (
    <G>
      <Path
        d={pathD}
        fill="none"
        stroke={props.color || "#27C2FF"}
        strokeWidth={props.strokeWidth ?? 2}
        strokeLinecap="round"
      />
    </G>
  );
}
