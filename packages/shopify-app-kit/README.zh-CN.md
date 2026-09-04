# @standhigher/shopify-app-kit

[![npm version](https://img.shields.io/npm/v/@standhigher/shopify-app-kit.svg)](https://www.npmjs.com/package/@standhigher/shopify-app-kit)
[![npm downloads](https://img.shields.io/npm/dm/@standhigher/shopify-app-kit.svg)](https://www.npmjs.com/package/@standhigher/shopify-app-kit)
[![CI](https://github.com/standhigher/shopify-app-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/standhigher/shopify-app-kit/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@standhigher/shopify-app-kit.svg)](https://github.com/standhigher/shopify-app-kit/blob/main/LICENSE)
[![docs](https://img.shields.io/badge/docs-available-brightgreen.svg)](https://github.com/standhigher/shopify-app-kit/tree/main/packages/shopify-app-kit/docs)

面向 Shopify embedded app 的类型化 React 工具包，覆盖反馈组件、保存流程、导航、资源选择和事件上报 adapter。

[English README](./README.md)

## 链接

- [npm 包](https://www.npmjs.com/package/@standhigher/shopify-app-kit)
- [GitHub 仓库](https://github.com/standhigher/shopify-app-kit)
- [Storybook 示例](https://standhigher.github.io/shopify-app-kit/)
- [示例代码](https://github.com/standhigher/shopify-app-kit/tree/main/packages/shopify-app-kit/examples)
- [API 文档](https://github.com/standhigher/shopify-app-kit/tree/main/packages/shopify-app-kit/docs)
- [Core HTTP 与 Error](https://github.com/standhigher/shopify-app-kit/blob/main/packages/shopify-app-kit/docs/core.zh-CN.md)
- [Core HTTP / Error 设计实现说明](https://github.com/standhigher/shopify-app-kit/blob/main/packages/shopify-app-kit/docs/core-http-error-design.zh-CN.md)
- [Analytics 使用说明](https://github.com/standhigher/shopify-app-kit/blob/main/packages/shopify-app-kit/docs/analytics.zh-CN.md)
- [使用文档](https://github.com/standhigher/shopify-app-kit/blob/main/packages/shopify-app-kit/docs/business-users.md)
- [更新日志](https://github.com/standhigher/shopify-app-kit/blob/main/CHANGELOG.md)

## 安装

```bash
npm install @standhigher/shopify-app-kit @shopify/polaris react react-dom
```

`react`、`react-dom` 和 `@shopify/polaris` 是 peer dependencies，需要由业务项目提供。
Polaris CSS 也由宿主负责引入，例如 `import "@shopify/polaris/build/esm/styles.css";`。

## 基础用法

在应用根部配置 `ShopifyAppKitProvider`：

```tsx
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";

export function App() {
  return (
    <ShopifyAppKitProvider appName="Fulfillment Desk" shop="demo.myshopify.com">
      <Routes />
    </ShopifyAppKitProvider>
  );
}
```

### Polaris Provider 组合

Shopify App Kit 不会替宿主创建 Polaris 上下文。使用反馈或保存条时，推荐按以下顺序组合：

```tsx
import { AppProvider, Frame } from "@shopify/polaris";
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";
import { ToastProvider } from "@standhigher/shopify-app-kit/feedback";

export function App() {
  return (
    <AppProvider i18n={{}}>
      <Frame>
        <ShopifyAppKitProvider appName="Fulfillment Desk">
          <ToastProvider><Routes /></ToastProvider>
        </ShopifyAppKitProvider>
      </Frame>
    </AppProvider>
  );
}
```

`AppBanner`、`AppModal`、`ConfirmDialog` 和 `AppSaveBar` 默认使用 Polaris；`AppSaveBar` 使用 `ContextualSaveBar`，必须放在宿主 `Frame` 下。`ToastProvider` 只管理 Toast/Confirm 状态，不替宿主创建 `AppProvider` 或 `Frame`。

按模块从 subpath exports 引入：

```tsx
import { useToast } from "@standhigher/shopify-app-kit/feedback";
import { useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";
import { useAppNavigation } from "@standhigher/shopify-app-kit/navigation";
import { useProductPicker } from "@standhigher/shopify-app-kit/resource-picker";
import { analytics, initAnalytics } from "@standhigher/shopify-app-kit/analytics";
import { http } from "@standhigher/shopify-app-kit/http";
import { ApiError } from "@standhigher/shopify-app-kit/error";
```

## 功能概览

| Subpath | 能力 |
|---|---|
| `@standhigher/shopify-app-kit/core` | Provider、运行环境检测、文案覆盖、应用上下文 |
| `@standhigher/shopify-app-kit/http` | Embedded app 后端请求客户端，支持 timeout、request id、GET retry、响应解包 |
| `@standhigher/shopify-app-kit/error` | `ApiError`、后端响应包识别、错误归一化 |
| `@standhigher/shopify-app-kit/feedback` | Toast、Banner、Modal、确认弹窗、Promise 风格确认 hook |
| `@standhigher/shopify-app-kit/save-flow` | 脏数据状态、保存条 fallback、浏览器离开保护 |
| `@standhigher/shopify-app-kit/navigation` | App 内跳转、Shopify Admin 链接、安全外链 |
| `@standhigher/shopify-app-kit/resource-picker` | 产品和集合选择 hook，通过业务 adapter 接入 |
| `@standhigher/shopify-app-kit/analytics` | 全局事件上报门面、事件 schema 校验、多 adapter 分发、console/noop/backend adapter |

## 示例

更多示例在 [`examples`](https://github.com/standhigher/shopify-app-kit/tree/main/packages/shopify-app-kit/examples)。

### 保存流程

```tsx
import { AppSaveBar, LeaveGuard, useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";

export function SettingsForm({ value, onSave, onDiscard }) {
  const form = useDirtyForm({
    initialValue: value,
    value,
    onSave,
    onDiscard
  });

  return (
    <>
      <LeaveGuard dirty={form.dirty} />
      <AppSaveBar
        dirty={form.dirty}
        saving={form.status === "saving"}
        onSave={form.save}
        onDiscard={form.discard}
      />
    </>
  );
}
```

### 事件上报

```ts
import {
  analytics,
  consoleAnalyticsAdapter,
  initAnalytics,
  shopifyAppEventsAdapter
} from "@standhigher/shopify-app-kit/analytics";

initAnalytics({
  adapters: [
    consoleAnalyticsAdapter(),
    shopifyAppEventsAdapter({ endpoint: "/api/shopify/app-events" })
  ]
});

await analytics.track({
  name: "settings_saved",
  attributes: { surface: "shipping_rules" }
});
```

`shopifyAppEventsAdapter` 只请求业务后端 endpoint。OAuth、Webhook、Admin API token、App Events bearer token 和 Shopify secret 必须留在业务后端。

### Core HTTP

```ts
import { http } from "@standhigher/shopify-app-kit/http";
import { ApiError } from "@standhigher/shopify-app-kit/error";

try {
  const settings = await http.get<Settings>("/api/settings");
  await http.post("/api/settings", settings);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.code, error.requestId);
  }
}
```

HTTP client 会解包统一后端响应，默认 timeout 为 `15000ms`，仅对 `GET` 请求的网络错误、timeout 和 HTTP `5xx` 重试。更多细节见 [Core HTTP 与 Error](./docs/core.zh-CN.md)，也可查看 [English docs](./docs/core.md)。

## 兼容性

| 项目 | 支持 |
|---|---|
| React | `>=18` |
| React DOM | `>=18` |
| TypeScript | 已使用 TypeScript 5.x 验证 |
| 模块格式 | ESM、CJS、类型声明 |
| 框架 | React 框架无关；不强依赖 Next.js |
| SSR 导入安全 | 包入口不会在模块导入阶段访问浏览器全局对象 |

## Demo / Storybook

Storybook 已配置 Provider、Polaris Feedback、Save Flow、Navigation、Resource Picker 和 Analytics 的可交互 stories。使用 `npm run storybook` 本地查看，或使用 `npm run build-storybook` 构建静态站点。

### Locale 与 renderer slot

`ShopifyAppKitProvider` 内置 `en` 和 `zh-CN` 文案。区域 locale 按语言回退，未知语言回退到英文；`messages` 可覆盖单个文案。`renderers` 提供有限的 `banner`、`modal`、`toast` 和 `saveBar` 包装 slot，并传入 `DefaultComponent`，继续渲染它即可保留 Polaris 的交互和无障碍行为。`AppModal` 支持焦点、Escape/背景点击关闭、页面滚动锁定和多层 Modal 最上层关闭；`ToastProvider` 支持自动关闭、`maxToasts` 和可选去重。

## 包质量

当前仓库检查：

- ESLint
- Vitest + Testing Library 测试
- TypeScript 类型检查
- tsup 构建 ESM/CJS/DTS
- npm pack dry-run
- 文档入口检查

## 本地开发

```bash
git clone https://github.com/standhigher/shopify-app-kit.git
cd shopify-app-kit
npm ci --registry=https://registry.npmjs.org
npm run lint
npm run test
npm run typecheck
npm run build
npm run build-storybook
npm run pack:dry-run
```

## 发布准备

```bash
git diff --check
npm run lint
npm run test
npm run typecheck
npm run build
npm run build-storybook
cd packages/shopify-app-kit
npm pack --dry-run --registry=https://registry.npmjs.org/
```

可以通过配置 `NPM_TOKEN` 使用 tag 触发 GitHub Actions 发布，也可以使用 npm web 认证手动发布：

```bash
npm login --auth-type=web --registry=https://registry.npmjs.org
npm publish --access public --registry=https://registry.npmjs.org
```

更多细节见 [发布文档](./docs/release.md)。

## 边界

当前 public package 包含：core provider/runtime、feedback、save flow、navigation、product/collection picker、analytics adapters、docs、examples 和质量检查。

不包含：Layout/UI Patterns、ScopeGate、BillingGate、CustomerPicker、完整 AI 组件、OAuth、Webhook、直接 Admin API 调用、直接 Shopify App Events API 调用。
