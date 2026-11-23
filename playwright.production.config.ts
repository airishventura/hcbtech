import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/production", fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:4180", launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } },
  projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"] } }, { name: "android", use: { ...devices["Pixel 5"] } }],
  webServer: { command: "node scripts/preview.mjs --port 4180", url: "http://127.0.0.1:4180", reuseExistingServer: false },
});
