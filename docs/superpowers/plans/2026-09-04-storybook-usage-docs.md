# Storybook Usage Docs Implementation Plan

> **Goal:** 在 Storybook 中提供 Shopify Embedded App 使用说明、参数表和宿主前置条件，并保持现有运行时 API 不变。

## Implementation

- [x] Add a `Getting Started / 使用说明` MDX page with installation, Polaris host setup, Controls/Canvas/Docs guidance, feature links, and fallback behavior.
- [x] Include `.mdx` files in the Storybook story glob.
- [x] Add feature-level Docs descriptions and Provider argTypes for public parameters.
- [x] Link the deployed Storybook guide from both package READMEs and development docs.
- [x] Record the documentation change in the root and package changelogs.

## Verification

Run the repository lint, unit tests, typecheck, package build, Storybook build, Storybook smoke tests, and npm pack dry-run before committing. Do not run `npm publish`; the package release remains manual.
