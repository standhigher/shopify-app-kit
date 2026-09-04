# @standhigher/shopify-app-kit

[![npm version](https://img.shields.io/npm/v/@standhigher/shopify-app-kit.svg)](https://www.npmjs.com/package/@standhigher/shopify-app-kit)
[![npm downloads](https://img.shields.io/npm/dm/@standhigher/shopify-app-kit.svg)](https://www.npmjs.com/package/@standhigher/shopify-app-kit)
[![CI](https://github.com/standhigher/shopify-app-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/standhigher/shopify-app-kit/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@standhigher/shopify-app-kit.svg)](./LICENSE)
[![docs](https://img.shields.io/badge/docs-available-brightgreen.svg)](./packages/shopify-app-kit/docs)

Typed React utilities for Shopify embedded app feedback, save flows, navigation, resource picking, and analytics adapters.

[中文说明](./README.zh-CN.md)

## Package

The publishable package lives in [`packages/shopify-app-kit`](./packages/shopify-app-kit).

- [npm package](https://www.npmjs.com/package/@standhigher/shopify-app-kit)
- [Storybook demo](https://standhigher.github.io/shopify-app-kit/)
- [Core HTTP and Error](./packages/shopify-app-kit/docs/core.md)
- [Analytics](./packages/shopify-app-kit/docs/analytics.md)
- [Usage docs](./packages/shopify-app-kit/docs/business-users.md)
- [Development docs](./packages/shopify-app-kit/docs/development.md)
- [Release docs](./packages/shopify-app-kit/docs/release.md)
- [Compatibility matrix](./packages/shopify-app-kit/docs/compatibility.md)
- [API stability](./packages/shopify-app-kit/docs/api-stability.md)
- [Roadmap to 1.0.0](./docs/roadmap.md)
- [Changelog](./CHANGELOG.md)

## Install

```bash
npm install @standhigher/shopify-app-kit @shopify/polaris react react-dom
```

## Quick Example

```tsx
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";
import { http } from "@standhigher/shopify-app-kit/http";
import { useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";
```

## Development

```bash
npm ci --registry=https://registry.npmjs.org
npm run lint
npm run test
npm run typecheck
npm run build
npm run verify:package
npm run build-storybook
npm --prefix packages/shopify-app-kit run test:e2e
```

See the package README for the full API overview: [`packages/shopify-app-kit/README.md`](./packages/shopify-app-kit/README.md).

## Publish

Log in to npmjs from the repository root before publishing:

```bash
npm run login:npm
```

Follow the npmjs web authentication link shown in the terminal.

After completing the release checks and confirming your npmjs account has publish access, publish the package:

```bash
npm run publish:pkg
```

This command publishes only `@standhigher/shopify-app-kit` to the public npmjs registry; the private workspace root is not published.
