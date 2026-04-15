import config from "@/config";
import { isConnectedToNetwork } from "./networking";

export default async function apiDataFetchAvailable(): Promise<boolean> {
  const url = config.apiBaseUrlDev + "/ping";

  try {
    const response = await fetch(url);
    const isNetworkAvailable = await isConnectedToNetwork();
    return response.ok && isNetworkAvailable;
  } catch {
    return false;
  }
}
