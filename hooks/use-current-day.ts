import { Day } from "@/types";
import { useEffect, useState } from "react";

export default function useCurrentDay(): Day {
  const dayMapping: Record<number, Day> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };
  const [currentDay, setCurrentDay] = useState<Day>(
    dayMapping[new Date().getDay()],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDayIndex = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)

      setCurrentDay(dayMapping[currentDayIndex]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentDay || "Monday";
}
