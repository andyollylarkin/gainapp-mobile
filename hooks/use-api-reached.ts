import apiDataFetchAvailable from "@/utils/data-fetch-available";
import { useEffect, useRef, useState } from "react";

export default function useApiReached(): boolean {
  const [isReached, setIsReached] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function check() {
      const available = await apiDataFetchAvailable();
      if (mountedRef.current) setIsReached(available);
    }

    check();
    const interval = setInterval(check, 5000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  return isReached;
}
