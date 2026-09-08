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
- [Core HTTP and Error](./packages/shopify-app-kit/docs/core.md)
- [Analytics](./packages/shopify-app-kit/docs/analytics.md)
- [Usage docs](./packages/shopify-app-kit/docs/business-users.md)
- [Development docs](./packages/shopify-app-kit/docs/development.md)
- [Release docs](./packages/shopify-app-kit/docs/release.md)
- [Roadmap to 1.0.0](./docs/roadmap.md)
- [Changelog](./CHANGELOG.md)

## Built by standhigher

`@standhigher/shopify-app-kit` is built by standhigher for Shopify app teams.
Explore [standhigher Products](https://standhigher.github.io/shopify-app-kit/products/?utm_source=GitHub&utm_medium=social&utm_content=standhigher-shopify-app-kit)
to discover apps that help merchants grow.

| App | What it helps with |
| --- | --- |
| [BestTrack Order Tracking](https://apps.shopify.com/besttrack?utm_source=GitHub&utm_medium=social) | Create branded order tracking experiences and reduce support questions. |
| [Bestreach: Email&SMS Marketing](https://apps.shopify.com/bestreach-email-sms-marketing?utm_source=GitHub&utm_medium=social) | Run personalized email and SMS campaigns for customer retention. |
| [BestUpsell](https://apps.shopify.com/bestupsellapp?utm_source=GitHub&utm_medium=social) | Add upsells, bundles, cart offers, and post-purchase deals. |
| [BestFeed AI](https://apps.shopify.com/bestfeed?utm_source=GitHub&utm_medium=social) | Optimize product content for AI search and discovery. |
| [BestSourcing AI Inventory](https://apps.shopify.com/bestsourcing?utm_source=GitHub&utm_medium=social) | Forecast inventory, plan restocks, and monitor stock health. |
| [Bestros](https://apps.shopify.com/bestros?utm_source=GitHub&utm_medium=social) | Understand cross-channel attribution with order-level customer journeys. |
| [BestBundle: AI Bundles](https://apps.shopify.com/bestbundle?utm_source=GitHub&utm_medium=social) | Create AI-powered bundle and gift offers that increase order value. |
| [SonarFulfill Easy Dropshipping](https://apps.shopify.com/sonarfulfill?utm_source=GitHub&utm_medium=social) | Discover, refine, and publish dropshipping products faster. |

## Install

```bash
npm install @standhigher/shopify-app-kit react react-dom
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
npm run build-storybook
```

See the package README for the full API overview: [`packages/shopify-app-kit/README.md`](./packages/shopify-app-kit/README.md).
