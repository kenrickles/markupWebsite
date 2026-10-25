export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kenrickles.com";
export const assetPath = (path: string) => `${BASE_PATH}${path}`;
