import CalendarIcon from "../icons/calendar";
import Circle, { CircleIconContent } from "../parts/circle";
export default function CalendarItem() {
  return (
    <Circle bgColor="#41DD42" size={44}>
      <CalendarIcon width={24} height={24} color="#0C410C" />
    </Circle>
  );
}
