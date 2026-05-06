import { ReactNode } from "react";
import { G } from "react-native-svg";

interface FillThicknessProps {
  thickness?: number;
  children: ReactNode;
}

export default function FillThickness({
  thickness = 0,
  children,
}: FillThicknessProps) {
  const offset = Math.max(0, thickness) * 0.18;

  if (offset === 0) {
    return <>{children}</>;
  }

  return (
    <>
      <G transform={`translate(${-offset} 0)`}>{children}</G>
      <G transform={`translate(${offset} 0)`}>{children}</G>
      <G transform={`translate(0 ${-offset})`}>{children}</G>
      <G transform={`translate(0 ${offset})`}>{children}</G>
      {children}
    </>
  );
}
