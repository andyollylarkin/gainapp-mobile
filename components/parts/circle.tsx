import { typography } from "@/constants/theme";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { ReactElement } from "react";
import { Text, View } from "react-native";
import { SvgProps } from "react-native-svg";

export type CircleTextContentProps = {
  textColor: string;
  children: "W" | number;
};

export function CircleTextContent({
  textColor,
  children,
}: CircleTextContentProps) {
  return (
    <Text
      style={{
        color: textColor,
        ...typography.mediumM,
      }}
    >
      {children}
    </Text>
  );
}

type AppSvgProps = Omit<SvgProps, "width" | "height"> & {
  width?: 18;
  height?: 18;
  color?: string;
};

export type AppSvgComponent = (props: AppSvgProps) => React.ReactElement;

export type CircleIconContentProps = {
  children: React.ReactElement<any, AppSvgComponent>;
};

export function CircleIconContent({ children }: CircleIconContentProps) {
  return <>{children}</>;
}

export interface CircleProps {
  bgColor?: string;
  children:
    | ReactElement<typeof CircleTextContent>
    | ReactElement<typeof CircleIconContent>;
  gradient?: LinearGradientProps & { angle?: number };
  size?: number;
}

export default function Circle({
  bgColor,
  children,
  gradient,
  size = 30,
}: CircleProps) {
  const circleStyle = {
    width: "100%" as const,
    aspectRatio: 1,
    transform: [{ rotate: `${gradient?.angle ?? 0}deg` }],
    borderRadius: 9999,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    maxWidth: size,
    maxHeight: size,
  };

  if (gradient) {
    return (
      <LinearGradient {...gradient} style={circleStyle}>
        <View
          style={{
            transform: [
              {
                rotate:
                  (gradient?.angle ?? 0) > 0 ? `-${gradient.angle}deg` : "0deg",
              },
            ],
          }}
        >
          {children}
        </View>
      </LinearGradient>
    );
  }

  return (
    <View
      style={{
        ...circleStyle,
        backgroundColor: bgColor,
      }}
    >
      {children}
    </View>
  );
}
