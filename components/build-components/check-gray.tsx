import { Colors } from "@/constants/theme";
import SuccessIcon from "../icons/sucess-icon";
import Circle from "../parts/circle";

export default function CheckGray() {
  return (
    <Circle bgColor={Colors.general.color.darkTones.bgLight}>
      <SuccessIcon color={Colors.general.color.grayTones.muted50} />
    </Circle>
  );
}
