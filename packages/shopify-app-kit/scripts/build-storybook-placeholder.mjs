import { existsSync } from "node:fs";

const requiredDocs = [
  "README.md",
  "README.zh-CN.md",
  "docs/core.md",
  "docs/core.zh-CN.md",
  "docs/core-http-error-design.zh-CN.md",
  "docs/business-users.md",
  "docs/development.md",
  "docs/app-events.md",
  "docs/analytics.md",
  "docs/analytics.zh-CN.md",
  "docs/resource-picker.md",
  "docs/save-flow.md"
];

const missing = requiredDocs.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.error("Missing documentation files for docs/storybook surface:");
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log("Storybook is not configured for this package yet.");
console.log("Documentation surface check passed for README and docs pages.");
