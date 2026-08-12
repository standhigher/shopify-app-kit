# Core HTTP and Error

[中文文档](./core.zh-CN.md)

The Core layer provides low-level utilities shared by Shopify embedded app features. It currently includes HTTP requests and normalized API errors.

## Public Imports

Use the flat public subpaths:

```ts
import { http, createHttpClient } from "@standhigher/shopify-app-kit/http";
import { ApiError, normalizeError } from "@standhigher/shopify-app-kit/error";
```

Do not import internal paths such as `@standhigher/shopify-app-kit/core/http`.

## Backend Envelope

Business backends should return the shared envelope:

```json
{
  "code": "SUCCESS",
  "message": "success",
  "data": {},
  "traceId": "d269fc99a56d0c2053c7b1b824b9f8d0",
  "details": "optional error details"
}
```

`details` is optional. `code`, `message`, `data`, and `traceId` are required.

`code: "SUCCESS"` resolves with `data`. Other codes reject with `ApiError`, mapping `traceId` to `requestId`.

## HTTP Client

```ts
const order = await http.get<Order>("/api/orders/1001");

await http.post("/api/orders", {
  sku: "SKU-001",
  quantity: 1
});
```

Defaults:

- Timeout: `15000ms`
- Retry: `GET` only
- Retryable failures: network errors, timeout, and HTTP `5xx`
- Request id: generated per request and sent as `x-request-id`

Plain HTTP requests rely on Shopify App Bridge-enhanced `globalThis.fetch` to attach session authentication. The package does not manually fetch or expose session tokens.

## Custom Client

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

Use a custom `fetch` in tests or non-browser runtimes:

```ts
const api = createHttpClient({ fetch: testFetch });
```

## Error Model

```ts
interface ApiError {
  code: string;
  message: string;
  status?: number;
  requestId?: string;
  details?: unknown;
}
```

Catch `ApiError` at feature boundaries and render business-friendly feedback. Keep technical details in logs or tracing systems.
