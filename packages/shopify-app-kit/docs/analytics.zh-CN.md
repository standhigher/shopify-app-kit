# Analytics

[English docs](./analytics.md)

Analytics 模块为 Shopify embedded app 提供一个轻量的前端事件上报门面。它负责校验事件、补充时间戳，并把事件分发给一个或多个 adapter。

## 推荐的全局门面用法

大多数业务应用建议在应用启动时初始化一次 analytics，然后业务模块统一导入稳定的 `analytics` 门面。

```ts
// app/analytics.ts
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

export { analytics };
```

各业务模块无需再通过 props 传入 analytics 实例，可以直接调用：

```ts
import { analytics } from "./analytics";

await analytics.track({
  name: "settings_saved",
  attributes: { surface: "shipping_rules" }
});
```

导出的 `analytics` 对象是稳定的。若在 `initAnalytics(...)` 之前调用 `analytics.track(...)`，它会 no-op；开发环境只警告一次用于提示接入顺序，生产环境保持静默。

辅助方法：

- `initAnalytics(options)` 创建并保存全局 client。重复调用会替换当前 client。
- `getAnalytics()` 返回已初始化的 client；未初始化时返回 no-op 门面。
- `resetAnalytics()` 清空全局 client 和警告状态，主要用于测试。

SSR 注意事项：全局门面更适合浏览器端 / Shopify embedded app 客户端代码。不要在服务端模块级全局实例里保存请求级 shop 信息、用户身份、secret 或后端凭据。

## 事件模型

```ts
interface AppKitEvent {
  name: string;
  attributes?: Record<string, string | number | boolean | null>;
  idempotencyKey?: string;
  timestamp?: string;
}
```

规则：

- `name` 是事件名称。
- `attributes` 只能包含标量：string、number、boolean、null。
- 不允许对象和数组。
- `timestamp` 可选，不传时 `createAnalytics` 会自动补当前 ISO 时间。
- `billing_event` 必须传 `idempotencyKey`。

## Adapter 机制

Adapter 只需要实现一个 `track` 方法：

```ts
interface AnalyticsAdapter {
  track: (event: AppKitEvent) => Promise<void> | void;
}
```

`createAnalytics({ adapters })` 会先校验事件，然后按顺序调用每个 adapter。

```ts
import {
  createAnalytics,
  consoleAnalyticsAdapter,
  shopifyAppEventsAdapter
} from "@standhigher/shopify-app-kit/analytics";

export const analytics = createAnalytics({
  adapters: [
    consoleAnalyticsAdapter(),
    shopifyAppEventsAdapter({ endpoint: "/api/shopify/app-events" })
  ]
});
```

当你需要隔离 client 时可以直接使用 `createAnalytics`，例如测试、Story fixture 或高级依赖注入。普通业务模块建议优先使用上面的全局门面。

## 校验规则

合法示例：

```ts
await analytics.track({
  name: "settings_saved",
  attributes: {
    surface: "shipping_rules",
    changed: true,
    itemCount: 3
  }
});
```

非法示例：

```ts
await analytics.track({
  name: "settings_saved",
  attributes: {
    nested: { bad: true }
  }
});
```

对象和数组会被拒绝，因为前端事件应保持紧凑、可序列化，并降低误传隐私数据的风险。

## billing_event 幂等要求

`billing_event` 必须包含 `idempotencyKey`。

```ts
await analytics.track({
  name: "billing_event",
  idempotencyKey: "charge-demo.myshopify.com-2026-08-12-pro",
  attributes: {
    plan: "pro",
    amount: 29
  }
});
```

前端只负责要求传入 key。真正的幂等控制必须由业务后端执行，例如去重、锁定、状态检查或幂等记录落库。

## 前后端职责边界

前端负责：

- 构造并校验事件 payload。
- 避免发送 secret 和非标量 attributes。
- 通过 adapter 把事件发送到业务后端。
- 必要时记录 adapter 失败。

后端负责：

- 校验当前 shop/session 身份。
- 按需附加 Shopify 凭据。
- 对 billing 事件执行幂等控制。
- 转发到 Shopify App Events 或内部数据系统。
- 处理审计、重试、死信和告警。

不要把 Shopify secret、Admin API token、OAuth token、webhook secret 或 App Events bearer token 放进浏览器代码。

## 推荐事件命名

建议使用稳定的小写 snake_case：

- `app_loaded`
- `page_viewed`
- `settings_saved`
- `save_failed`
- `resource_picker_opened`
- `resource_picker_selected`
- `billing_event`

命名建议：

- 已完成动作使用过去式，例如 `settings_saved`。
- 业务维度放进 attributes，例如 `surface`、`plan`、`resourceType`。
- 事件名要稳定，随意改名会影响下游报表和看板。

## 常见接入示例

### 开发环境输出到 Console

```ts
const analytics = createAnalytics({
  adapters: [consoleAnalyticsAdapter()]
});
```

### 测试环境关闭上报

```ts
const analytics = createAnalytics({
  adapters: [noopAnalyticsAdapter()]
});
```

### 发送到业务后端

```ts
const analytics = createAnalytics({
  adapters: [
    shopifyAppEventsAdapter({
      endpoint: "/api/shopify/app-events"
    })
  ]
});
```

adapter 发送的 payload：

```json
{
  "event": {
    "name": "app_loaded",
    "attributes": {
      "surface": "settings"
    },
    "timestamp": "2026-08-12T00:00:00.000Z"
  }
}
```

### 自定义 Adapter

```ts
const customAdapter: AnalyticsAdapter = {
  async track(event) {
    await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event })
    });
  }
};
```

## 错误处理

当一个或多个 adapter 失败时：

- 每个失败 adapter 都会触发 `onError`。
- 所有 adapter 执行完后，`track` 会抛出 `AggregateError`。

```ts
const analytics = createAnalytics({
  adapters,
  onError(error, event) {
    console.error("analytics adapter failed", event.name, error);
  }
});
```

建议把 `onError` 用于日志、Sentry 或非阻塞诊断。不要因为 analytics 失败就阻断主要业务流程。

## 安全注意事项

- 不要在事件中包含 secret、token、bearer、cookie 或 webhook secret。
- 不要发送嵌套对象，避免误带隐私数据。
- 优先发送稳定 id 和粗粒度业务元数据，不发送原始业务 payload。
- 后端 endpoint 必须校验当前 shop/session。
- billing 事件必须由后端执行幂等控制。

## 运行时兼容性

`shopifyAppEventsAdapter` 在未显式传入 `fetch` 时，会通过 runtime global fallback 获取全局 `fetch`。检测顺序为 `globalThis`、`window`、`self`、`global`，最后使用运行时兜底。

测试或非浏览器运行时建议显式传入 `fetch`：

```ts
shopifyAppEventsAdapter({
  endpoint: "/api/shopify/app-events",
  fetch: testFetch
});
```
