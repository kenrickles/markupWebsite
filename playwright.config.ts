import { defineConfig, devices } from "@playwright/test";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const previewURL = `http://127.0.0.1:3100${basePath}/`;
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: previewURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], browserName: "chromium" },
    },
  ],
  webServer: {
    command: "node scripts/serve-export.mjs",
    env: { PORT: "3100" },
    url: previewURL,
    reuseExistingServer: false,
  },
});
