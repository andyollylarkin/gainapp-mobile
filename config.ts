export type Config = {
  apiBaseUrl: string;
  apiBaseUrlDev: string;
};

const config: Config = {
  apiBaseUrl: "https://api.gainapp.dev",
  apiBaseUrlDev: "http://localhost:9000",
};

export default config;
