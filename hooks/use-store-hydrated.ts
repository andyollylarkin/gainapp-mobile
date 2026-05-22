import { useExcerciseStore } from "@/store/excercise-store";
import { useEffect, useState } from "react";

export function useStoreHydrated(): boolean {
  const [isHydrated, setIsHydrated] = useState(
    () => useExcerciseStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (isHydrated) return;
    return useExcerciseStore.persist.onFinishHydration(() => setIsHydrated(true));
  }, [isHydrated]);

  return isHydrated;
}
