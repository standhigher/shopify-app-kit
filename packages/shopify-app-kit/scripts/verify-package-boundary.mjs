import { access, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = resolve(packageRoot, "package.json");
const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
const require = createRequire(import.meta.url);

const requiredFiles = [
  "dist/index.js",
  "dist/index.cjs",
  "dist/index.d.ts",
  "dist/core.js",
  "dist/feedback.js",
  "dist/save-flow.js",
  "dist/navigation.js",
  "dist/resource-picker.js",
  "dist/analytics.js",
  "dist/shopify-adapters.js"
];

for (const relativePath of requiredFiles) {
  await access(resolve(packageRoot, relativePath));
}

for (const [subpath, target] of Object.entries(packageJson.exports)) {
  const importTarget = typeof target === "string" ? target : target.import;
  if (!importTarget) throw new Error(`Missing import export target for ${subpath}`);
  await access(resolve(packageRoot, importTarget));
}

const entry = await import(resolve(packageRoot, "dist/index.js"));
if (typeof entry.ShopifyAppKitProvider !== "function") {
  throw new Error("ESM entry does not expose ShopifyAppKitProvider");
}

const cjsEntry = require(resolve(packageRoot, "dist/index.cjs"));
if (typeof cjsEntry.ShopifyAppKitProvider !== "function") {
  throw new Error("CJS entry does not expose ShopifyAppKitProvider");
}

const source = await readFile(resolve(packageRoot, "dist/feedback.js"), "utf8");
if (!source.includes('from "@shopify/polaris"')) {
  throw new Error("Polaris import must remain external in the published ESM output");
}
if (packageJson.dependencies?.["@shopify/polaris"] || packageJson.optionalDependencies?.["@shopify/polaris"]) {
  throw new Error("Polaris must not be bundled as a runtime dependency");
}
if (!packageJson.peerDependencies?.["@shopify/polaris"]) {
  throw new Error("Polaris must be declared as a peer dependency");
}

console.log(`Package boundary verified for ${packageJson.name}@${packageJson.version}`);
