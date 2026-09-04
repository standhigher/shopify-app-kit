import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@standhigher/shopify-app-kit/core", replacement: resolve(__dirname, "src/core.ts") },
      {
        find: "@standhigher/shopify-app-kit/error",
        replacement: resolve(__dirname, "src/error.ts")
      },
      {
        find: "@standhigher/shopify-app-kit/http",
        replacement: resolve(__dirname, "src/http.ts")
      },
      {
        find: "@standhigher/shopify-app-kit/feedback",
        replacement: resolve(__dirname, "src/feedback.ts")
      },
      {
        find: "@standhigher/shopify-app-kit/save-flow",
        replacement: resolve(__dirname, "src/save-flow.ts")
      },
      {
        find: "@standhigher/shopify-app-kit/navigation",
        replacement: resolve(__dirname, "src/navigation.ts")
      },
      {
        find: "@standhigher/shopify-app-kit/resource-picker",
        replacement: resolve(
        __dirname,
        "src/resource-picker.ts"
        )
      },
      {
        find: "@standhigher/shopify-app-kit/analytics",
        replacement: resolve(__dirname, "src/analytics.ts")
      },
      {
        find: "@standhigher/shopify-app-kit/shopify-adapters",
        replacement: resolve(__dirname, "src/shopify-adapters.ts")
      },
      { find: "@standhigher/shopify-app-kit", replacement: resolve(__dirname, "src/index.ts") }
    ]
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/test/**"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    }
  }
});
