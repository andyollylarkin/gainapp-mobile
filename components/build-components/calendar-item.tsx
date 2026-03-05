import CalendarIcon from "../icons/calendar";
import Circle, { CircleIconContent } from "../parts/circle";
export default function CalendarItem() {
  return (
    <Circle bgColor="#41DD42">
      <CircleIconContent>
        <CalendarIcon width={18} height={18} color="#4D2C00" />
      </CircleIconContent>
    </Circle>
  );
}
