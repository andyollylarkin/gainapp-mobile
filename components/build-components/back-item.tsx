import { Colors } from "@/constants/theme";
import BackIcon from "../icons/back";
import Circle from "../parts/circle";

export default function BackItem() {
  return (
    <Circle bgColor={Colors.general.color.greenTones.greenBg} size={30}>
      <BackIcon
        color={Colors.general.color.greenTones.greenMain}
        width={18}
        height={18}
      />
    </Circle>
  );
}
