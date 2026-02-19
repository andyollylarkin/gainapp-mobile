import { Colors } from "@/constants/theme";
import SuccessIcon from "../icons/sucess-icon";
import Circle from "../parts/circle";

export default function CheckDark() {
  return (
    <Circle bgColor={Colors.general.color.darkTones.bgMiddle}>
      <SuccessIcon color={Colors.general.color.grayTones.muted50} />
    </Circle>
  );
}
