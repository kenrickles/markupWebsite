export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/kenrick-portfolio" : "");
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://kenrickles.github.io/kenrick-portfolio";
export const assetPath = (path: string) => `${BASE_PATH}${path}`;
