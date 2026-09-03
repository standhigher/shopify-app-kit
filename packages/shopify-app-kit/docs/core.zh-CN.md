# Core HTTP 与 Error

Core 层提供多个 Shopify embedded app 可以复用的底层通用能力。当前包含统一 HTTP 请求和统一 API 错误模型。

视觉组件使用 Polaris 13.x peer dependency；宿主负责安装并提供 Polaris `AppProvider`、`Frame` 以及 CSS。未安装 Polaris 时，npm 会提示缺少 peer dependency，开发环境由 Polaris 给出配置错误；本包不会静默切换到另一套 UI。

locale fallback 支持 `en` 与 `zh-CN`：区域标签按语言回退，未知语言回退到英文。
`messages` 支持按字段覆盖文案。`renderers` 提供受限包装 slot；自定义 renderer
会收到 `DefaultComponent`，必须继续渲染它，以保留默认 Polaris 交互和无障碍契约。

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
- 调用方主动取消：归一化为 `code: "ABORTED"`；只有超时触发的 abort 才归一化为 `TIMEOUT`
- 0.5.x 不加入 PATCH；如业务需要，请使用 `post`/`put` 或业务自定义 client
- `204` 响应返回 `undefined`；普通文本响应直接返回文本；JSON 解析失败时保留原始文本，不抛出解析器异常

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
