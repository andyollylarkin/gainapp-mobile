import { Colors } from "@/constants/theme";
import CalendarNextIcon from "../icons/calendar-next";
import Circle, { CircleIconContent } from "../parts/circle";

export default function CalendarNextItem() {
  return (
    <Circle bgColor="#41DD42" size={44}>
      <CircleIconContent>
        <CalendarNextIcon
          width={18}
          height={18}
          color={Colors.general.color.greenTones.greenBgLight}
        />
      </CircleIconContent>
    </Circle>
  );
}
