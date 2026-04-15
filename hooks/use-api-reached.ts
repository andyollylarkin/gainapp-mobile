import { useState } from "react";
import useNetworkConnected from "./use-network-connected";
import apiDataFetchAvailable from "@/utils/data-fetch-available";

export default function useApiReached(): {
  isReached: boolean;
  stopWatching: () => void;
} {
  const [apiReached, setApiReached] = useState<boolean>(true);
  const { isConnected, stopWatching: stopWatchingNetwork } =
    useNetworkConnected();

  const interval = setInterval(async () => {
    const available = await apiDataFetchAvailable();
    setApiReached(available && isConnected);
  }, 5000);

  return {
    isReached: apiReached,
    stopWatching: () => {
      clearInterval(interval);
      stopWatchingNetwork();
    },
  };
}
