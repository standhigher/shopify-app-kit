# @standhigher/shopify-app-kit

[![npm version](https://img.shields.io/npm/v/@standhigher/shopify-app-kit.svg)](https://www.npmjs.com/package/@standhigher/shopify-app-kit)
[![npm downloads](https://img.shields.io/npm/dm/@standhigher/shopify-app-kit.svg)](https://www.npmjs.com/package/@standhigher/shopify-app-kit)
[![CI](https://github.com/standhigher/shopify-app-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/standhigher/shopify-app-kit/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@standhigher/shopify-app-kit.svg)](./LICENSE)
[![docs](https://img.shields.io/badge/docs-available-brightgreen.svg)](./packages/shopify-app-kit/docs)

面向 Shopify embedded app 的类型化 React 工具包，覆盖反馈组件、保存流程、导航、资源选择和事件上报 adapter。

[English README](./README.md)

## 包位置

实际发布包位于 [`packages/shopify-app-kit`](./packages/shopify-app-kit)。

- [npm 包](https://www.npmjs.com/package/@standhigher/shopify-app-kit)
- [Core HTTP 与 Error](./packages/shopify-app-kit/docs/core.zh-CN.md)
- [Core HTTP / Error 设计实现说明](./packages/shopify-app-kit/docs/core-http-error-design.zh-CN.md)
- [Analytics 使用说明](./packages/shopify-app-kit/docs/analytics.zh-CN.md)
- [使用文档](./packages/shopify-app-kit/docs/business-users.md)
- [开发文档](./packages/shopify-app-kit/docs/development.md)
- [发布文档](./packages/shopify-app-kit/docs/release.md)
- [演进规划](./docs/roadmap.md)
- [更新日志](./CHANGELOG.md)

## standhigher 出品

`@standhigher/shopify-app-kit` 由 standhigher 为 Shopify 应用团队构建。访问
[standhigher Products](https://standhigher.github.io/shopify-app-kit/products/?utm_source=GitHub&utm_medium=social&utm_content=standhigher-shopify-app-kit)，
了解帮助商家增长的应用。

| 应用 | 可帮助商家完成 |
| --- | --- |
| [BestTrack Order Tracking](https://apps.shopify.com/besttrack?utm_source=GitHub&utm_medium=social) | 创建品牌化订单追踪体验，减少客服咨询。 |
| [Bestreach: Email&SMS Marketing](https://apps.shopify.com/bestreach-email-sms-marketing?utm_source=GitHub&utm_medium=social) | 通过个性化邮件和短信活动提升客户留存。 |
| [BestUpsell](https://apps.shopify.com/bestupsellapp?utm_source=GitHub&utm_medium=social) | 添加加购、捆绑、购物车优惠和购后优惠。 |
| [BestFeed AI](https://apps.shopify.com/bestfeed?utm_source=GitHub&utm_medium=social) | 优化商品内容，提升在 AI 搜索和发现中的表现。 |
| [BestSourcing AI Inventory](https://apps.shopify.com/bestsourcing?utm_source=GitHub&utm_medium=social) | 预测库存、规划补货并监控库存健康度。 |
| [Bestros](https://apps.shopify.com/bestros?utm_source=GitHub&utm_medium=social) | 通过订单级客户旅程了解跨渠道归因。 |
| [BestBundle: AI Bundles](https://apps.shopify.com/bestbundle?utm_source=GitHub&utm_medium=social) | 创建 AI 驱动的捆绑与赠品优惠，提高客单价。 |
| [SonarFulfill Easy Dropshipping](https://apps.shopify.com/sonarfulfill?utm_source=GitHub&utm_medium=social) | 更快发现、完善并发布代发货商品。 |

## 安装

```bash
npm install @standhigher/shopify-app-kit react react-dom
```

## 快速示例

```tsx
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";
import { http } from "@standhigher/shopify-app-kit/http";
import { useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";
```

## 本地开发

```bash
npm ci --registry=https://registry.npmjs.org
npm run lint
npm run test
npm run typecheck
npm run build
npm run build-storybook
```

完整 API 和能力说明见包 README：[`packages/shopify-app-kit/README.md`](./packages/shopify-app-kit/README.md)。
