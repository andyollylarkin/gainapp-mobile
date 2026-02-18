import { useEffect, useState } from "react";

type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
  real: number;
};

export default function useCountdown(targetSeconds: number): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    real: targetSeconds,
  });

  useEffect(() => {
    const toTimeLeft = (remainingSeconds: number): TimeLeft => {
      const clamped = Math.max(remainingSeconds, 0);
      const hours = Math.floor(clamped / 3600);
      const minutes = Math.floor((clamped % 3600) / 60);
      const seconds = Math.floor(clamped % 60);
      return { hours, minutes, seconds, real: clamped };
    };

    let remaining = Math.max(Math.floor(targetSeconds), 0);
    setTimeLeft(toTimeLeft(remaining));

    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining < 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, real: 0 });
        return;
      }
      setTimeLeft(toTimeLeft(remaining));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetSeconds]);

  return timeLeft;
}
