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
- [Storybook 示例](https://standhigher.github.io/shopify-app-kit/)
- [Core HTTP 与 Error](./packages/shopify-app-kit/docs/core.zh-CN.md)
- [Core HTTP / Error 设计实现说明](./packages/shopify-app-kit/docs/core-http-error-design.zh-CN.md)
- [Analytics 使用说明](./packages/shopify-app-kit/docs/analytics.zh-CN.md)
- [使用文档](./packages/shopify-app-kit/docs/business-users.md)
- [开发文档](./packages/shopify-app-kit/docs/development.md)
- [发布文档](./packages/shopify-app-kit/docs/release.md)
- [兼容矩阵](./packages/shopify-app-kit/docs/compatibility.md)
- [API 稳定性](./packages/shopify-app-kit/docs/api-stability.md)
- [演进规划](./docs/roadmap.md)
- [更新日志](./CHANGELOG.md)

## 安装

```bash
npm install @standhigher/shopify-app-kit @shopify/polaris react react-dom
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
npm run verify:package
npm run build-storybook
npm --prefix packages/shopify-app-kit run test:e2e
```

完整 API 和能力说明见包 README：[`packages/shopify-app-kit/README.md`](./packages/shopify-app-kit/README.md)。

## 发布

发布前先在仓库根目录登录 npmjs：

```bash
npm run login:npm
```

请按终端输出的链接完成 npmjs 网页认证。

完成发布前检查并确认当前 npmjs 账号具有发布权限后，再执行：

```bash
npm run publish:pkg
```

该命令只会将 `@standhigher/shopify-app-kit` 发布到 npmjs 公共 registry，不会发布标记为私有的 workspace 根包。
