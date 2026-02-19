import { Colors } from "@/constants/theme";
import SuccessIcon from "../icons/sucess-icon";
import Circle from "../parts/circle";

export default function CheckGreen() {
  return (
    <Circle bgColor={Colors.general.color.greenTones.greenMain}>
      <SuccessIcon color={Colors.general.color.greenTones.greenBgLight} />
    </Circle>
  );
}
