import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:6007",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"]
  },
  webServer: {
    command: "storybook dev -p 6007 --no-open --ci",
    url: "http://127.0.0.1:6007",
    reuseExistingServer: true,
    timeout: 120_000,
    cwd: "."
  }
});
