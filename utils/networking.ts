import { getNetworkStateAsync } from "expo-network";

export async function isConnectedToNetwork(): Promise<boolean> {
  const networkState = await getNetworkStateAsync();

  return (
    (networkState.isConnected && networkState.isInternetReachable) || false
  );
}
