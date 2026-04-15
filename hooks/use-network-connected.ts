import { isConnectedToNetwork } from "@/utils/networking";
import { useState } from "react";

export default function useNetworkConnected(): {
  isConnected: boolean;
  stopWatching: () => void;
} {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const interval = setInterval(async () => {
    const connected = await isConnectedToNetwork();
    setIsConnected(connected);
  }, 2000);

  return {
    isConnected: isConnected,
    stopWatching: () => clearInterval(interval),
  };
}
