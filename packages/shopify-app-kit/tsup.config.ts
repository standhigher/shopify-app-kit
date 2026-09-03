import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    core: "src/core.ts",
    error: "src/error.ts",
    http: "src/http.ts",
    feedback: "src/feedback.ts",
    "save-flow": "src/save-flow.ts",
    navigation: "src/navigation.ts",
    "resource-picker": "src/resource-picker.ts",
    analytics: "src/analytics.ts",
    "shopify-adapters": "src/shopify-adapters.ts"
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["@shopify/polaris", "react", "react-dom", "react/jsx-runtime"]
});
