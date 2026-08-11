# Business User Guide / 业务使用者指南

## 中文

### 适用对象

这份文档面向在业务 Shopify app 中接入 `@standhigher/shopify-app-kit` 的业务研发、技术负责人和产品技术同学。

这个包的目标是复用 Shopify embedded app 中常见的前端能力：统一 Provider、反馈组件、保存流程、导航、资源选择和事件上报门面。它不是完整业务框架，也不接管你的 OAuth、Webhook、Admin API、后端鉴权或计费服务。

### 安装

```bash
npm install @standhigher/shopify-app-kit react react-dom
```

`react` 和 `react-dom` 是 peer dependencies，业务项目需要自己提供。

### 推荐接入方式

在应用根部包一层 `ShopifyAppKitProvider`：

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

按能力从 subpath 引入，不建议从根入口导入所有能力：

```tsx
import { useToast } from "@standhigher/shopify-app-kit/feedback";
import { useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";
import { useAppNavigation } from "@standhigher/shopify-app-kit/navigation";
import { useProductPicker } from "@standhigher/shopify-app-kit/resource-picker";
import { createAnalytics } from "@standhigher/shopify-app-kit/analytics";
```

### 能力地图

| 模块 | 业务用途 | 典型接入点 |
|---|---|---|
| `core` | 应用上下文、运行环境、默认文案 | App 根组件 |
| `feedback` | Toast、Banner、Modal、确认弹窗 | 表单提交、危险操作、状态提示 |
| `save-flow` | 脏数据判断、保存条、离开保护 | 设置页、编辑页、配置页 |
| `navigation` | App 内跳转、Admin 跳转、外链跳转 | 菜单、按钮、操作入口 |
| `resource-picker` | 产品/集合选择 | 活动配置、规则配置、商品范围选择 |
| `analytics` | 前端事件上报门面 | 页面曝光、点击、关键业务事件 |

### 保存流程示例

```tsx
import { AppSaveBar, LeaveGuard, useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";

export function SettingsPage({ value, saveSettings, resetSettings }) {
  const form = useDirtyForm({
    initialValue: value,
    value,
    onSave: saveSettings,
    onDiscard: resetSettings
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

业务侧需要负责把表单值恢复到最近的干净状态。保存成功后，`useDirtyForm` 会更新 clean snapshot；保存失败时会保留 dirty 状态，方便用户重试。

### 事件上报边界

```ts
import {
  createAnalytics,
  shopifyAppEventsAdapter
} from "@standhigher/shopify-app-kit/analytics";

export const analytics = createAnalytics({
  adapters: [
    shopifyAppEventsAdapter({ endpoint: "/api/shopify/app-events" })
  ]
});
```

`shopifyAppEventsAdapter` 只会请求业务后端 endpoint。Shopify secret、Admin API token、App Events bearer token、OAuth token 都必须留在业务后端，不允许放进前端包或浏览器代码。

### Phase 1 不包含

- Layout/UI Patterns 完整组件库
- `ScopeGate`
- `BillingGate`
- `CustomerPicker`
- AI 组件
- OAuth、Webhook、Admin API token 管理
- 直接请求 Shopify App Events API

### 接入检查清单

- 应用根部已经配置 `ShopifyAppKitProvider`。
- 只从需要的 subpath 引入能力。
- 所有默认用户可见文案均可被业务项目覆盖。
- 业务后端负责 Shopify token、secret、OAuth 和 webhook。
- 保存流程失败时保留用户输入，并给出可重试路径。
- 事件上报只发送标量 attributes，不发送对象、数组、token 或 secret。

## English

### Audience

This guide is for business engineers, technical leads, and product engineers who want to use `@standhigher/shopify-app-kit` inside a Shopify app.

The package provides reusable frontend building blocks for Shopify embedded apps: provider context, feedback UI, save flow helpers, navigation, resource picker hooks, and analytics adapters. It is not a full business framework and does not own OAuth, webhooks, Admin API calls, backend authentication, or billing services.

### Installation

```bash
npm install @standhigher/shopify-app-kit react react-dom
```

`react` and `react-dom` are peer dependencies and must be provided by the host app.

### Recommended Setup

Wrap your app with `ShopifyAppKitProvider`:

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

Import features from subpath exports:

```tsx
import { useToast } from "@standhigher/shopify-app-kit/feedback";
import { useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";
import { useAppNavigation } from "@standhigher/shopify-app-kit/navigation";
import { useProductPicker } from "@standhigher/shopify-app-kit/resource-picker";
import { createAnalytics } from "@standhigher/shopify-app-kit/analytics";
```

### Capability Map

| Module | Business Use | Typical Entry Point |
|---|---|---|
| `core` | App context, runtime, default messages | App root |
| `feedback` | Toast, banner, modal, confirm dialog | Form submit, destructive action, status message |
| `save-flow` | Dirty state, save bar, leave guard | Settings and edit pages |
| `navigation` | App navigation, Admin links, external links | Menus, buttons, action entries |
| `resource-picker` | Product and collection picking | Campaign, rule, and product-scope settings |
| `analytics` | Frontend event facade | Page views, clicks, key business events |

### Save Flow Example

```tsx
import { AppSaveBar, LeaveGuard, useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";

export function SettingsPage({ value, saveSettings, resetSettings }) {
  const form = useDirtyForm({
    initialValue: value,
    value,
    onSave: saveSettings,
    onDiscard: resetSettings
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

The host app owns form state resets. After a successful save, `useDirtyForm` updates its clean snapshot. If saving fails, dirty state is preserved so the user can retry.

### Analytics Boundary

```ts
import {
  createAnalytics,
  shopifyAppEventsAdapter
} from "@standhigher/shopify-app-kit/analytics";

export const analytics = createAnalytics({
  adapters: [
    shopifyAppEventsAdapter({ endpoint: "/api/shopify/app-events" })
  ]
});
```

`shopifyAppEventsAdapter` only posts to your backend endpoint. Shopify secrets, Admin API tokens, App Events bearer tokens, and OAuth tokens must stay in the business backend.

### Not Included In Phase 1

- Complete Layout/UI Patterns library
- `ScopeGate`
- `BillingGate`
- `CustomerPicker`
- AI components
- OAuth, webhook, or Admin API token management
- Direct Shopify App Events API calls

### Adoption Checklist

- The app root is wrapped with `ShopifyAppKitProvider`.
- Features are imported from the required subpath only.
- User-facing default messages can be overridden by the host app.
- The business backend owns Shopify tokens, secrets, OAuth, and webhooks.
- Failed saves preserve user input and offer a retry path.
- Analytics attributes are scalar values and never include tokens or secrets.
