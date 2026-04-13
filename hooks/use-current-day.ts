import { Day } from "@/types";
import { useEffect, useState } from "react";

export default function useCurrentDay(): Day {
  const [currentDay, setCurrentDay] = useState<Day>(
    Day.fromNumber(new Date().getDay()),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDayIndex = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)

      setCurrentDay(Day.fromNumber(currentDayIndex));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentDay || Day.fromString("Monday");
}
