import { Fonts } from "@/constants/theme";
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
        fontFamily: Fonts.sans,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "500",
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
  suka?: string;
};

export type AppSvgComponent = (props: AppSvgProps) => React.ReactElement;

export type CircleIconContentProps = {
  children: React.ReactElement<any, AppSvgComponent>;
};

export function CircleIconContent({ children }: CircleIconContentProps) {
  return <>{children}</>;
}

export interface CircleProps {
  bgColor: string;
  children:
    | ReactElement<typeof CircleTextContent>
    | ReactElement<typeof CircleIconContent>;
}

export default function Circle({ bgColor, children }: CircleProps) {
  return (
    <View
      style={{
        width: "100%",
        aspectRatio: 1,
        borderRadius: 9999,
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
        maxWidth: 30,
        maxHeight: 30,
      }}
    >
      {children}
    </View>
  );
}
