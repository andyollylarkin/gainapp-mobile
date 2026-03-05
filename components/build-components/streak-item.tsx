import FlameIcon from "../icons/flame";
import Circle, { CircleIconContent } from "../parts/circle";

export default function StreakItem() {
  return (
    <Circle bgColor="#FF9400">
      <CircleIconContent>
        <FlameIcon width={18} height={18} color="#4D2C00" />
      </CircleIconContent>
    </Circle>
  );
}
