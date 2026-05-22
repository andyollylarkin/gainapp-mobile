import { useExcerciseStore } from "@/store/excercise-store";
import { useEffect, useState } from "react";

// Hook to check if the Zustand store has been rehydrated from persistent storage
export function useStoreHydrated(): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check if store has been rehydrated
    const unsub = useExcerciseStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // If already hydrated, set state immediately
    if (useExcerciseStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => {
      unsub();
    };
  }, []);

  return isHydrated;
}
