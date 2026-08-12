# Core HTTP 与 Error

Core 层提供多个 Shopify embedded app 可以复用的底层通用能力。当前包含统一 HTTP 请求和统一 API 错误模型。

## 公开入口

业务项目应使用扁平的公开 subpath：

```ts
import { http, createHttpClient } from "@standhigher/shopify-app-kit/http";
import { ApiError, normalizeError } from "@standhigher/shopify-app-kit/error";
```

不要引入内部路径，例如 `@standhigher/shopify-app-kit/core/http`。

## 后端响应约定

业务后端应返回统一响应包：

```json
{
  "code": "SUCCESS",
  "message": "success",
  "data": {},
  "traceId": "d269fc99a56d0c2053c7b1b824b9f8d0",
  "details": "可选错误详情"
}
```

`details` 是可选字段。`code`、`message`、`data`、`traceId` 是必填字段。

`code: "SUCCESS"` 时，HTTP client 会直接返回 `data`。其他 `code` 会抛出 `ApiError`，并把 `traceId` 映射为 `requestId`。

## HTTP Client

```ts
const order = await http.get<Order>("/api/orders/1001");

await http.post("/api/orders", {
  sku: "SKU-001",
  quantity: 1
});
```

默认行为：

- Timeout：`15000ms`
- Retry：仅 `GET` 请求
- 可重试失败：网络错误、timeout、HTTP `5xx`
- Request id：每次请求自动生成，并通过 `x-request-id` 请求头发送

普通 HTTP 请求依赖 Shopify App Bridge 增强后的 `globalThis.fetch` 自动附加 session authentication。本包不会手动获取或暴露 session token。

## 自定义 Client

```ts
const api = createHttpClient({
  timeout: 15000,
  retry: 1,
  headers: {
    "x-app-surface": "settings"
  }
});

const data = await api.get<MyData>("/api/settings");
```

测试或非浏览器运行时可以传入自定义 `fetch`：

```ts
const api = createHttpClient({ fetch: testFetch });
```

## 错误模型

```ts
interface ApiError {
  code: string;
  message: string;
  status?: number;
  requestId?: string;
  details?: unknown;
}
```

建议在 feature 边界捕获 `ApiError`，将 `message` 转换为面向用户的反馈；`code`、`requestId`、`details` 更适合进入日志、链路追踪或故障排查系统。
