import config from "@/config";

export default async function apiDataFetchAvailable(): Promise<boolean> {
  const url = config.apiBaseUrlDev + "/ping";

  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}
