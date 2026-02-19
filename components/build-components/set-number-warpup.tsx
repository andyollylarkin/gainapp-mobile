import { Colors } from "@/constants/theme";
import Circle, { CircleTextContent } from "../parts/circle";

type SetNumberWarpupType = "W" | number;

export interface SetNumberWarpupProps {
  color:
    | (typeof Colors)["general"]["color"]["greenTones"]["greenMain"]
    | (typeof Colors)["general"]["color"]["darkTones"]["bgMiddle"]
    | (typeof Colors)["general"]["color"]["goldTones"]["goldMain"];
  textColor:
    | (typeof Colors)["general"]["color"]["greenTones"]["greenBgLight"]
    | (typeof Colors)["general"]["color"]["darkTones"]["bgLight"]
    | (typeof Colors)["general"]["color"]["goldTones"]["goldBgLight"]
    | (typeof Colors)["general"]["color"]["grayTones"]["muted50"];
  text: SetNumberWarpupType;
}

export default function SetNumberWarpup({
  color,
  textColor,
  text,
}: SetNumberWarpupProps) {
  return (
    <Circle bgColor={color}>
      <CircleTextContent textColor={textColor}>{text}</CircleTextContent>
    </Circle>
  );
}
