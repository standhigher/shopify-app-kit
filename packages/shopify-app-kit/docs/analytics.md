# Analytics

[中文文档](./analytics.zh-CN.md)

The Analytics module provides a small frontend event facade for Shopify embedded apps. It validates event payloads, adds timestamps, and fans events out to one or more adapters.

## Event Model

```ts
interface AppKitEvent {
  name: string;
  attributes?: Record<string, string | number | boolean | null>;
  idempotencyKey?: string;
  timestamp?: string;
}
```

Rules:

- `name` identifies the event.
- `attributes` must contain scalar values only: string, number, boolean, or null.
- Objects and arrays are rejected.
- `timestamp` is optional. If omitted, `createAnalytics` adds the current ISO timestamp.
- `billing_event` requires `idempotencyKey`.

## Adapter Mechanism

Adapters implement a single `track` method:

```ts
interface AnalyticsAdapter {
  track: (event: AppKitEvent) => Promise<void> | void;
}
```

`createAnalytics({ adapters })` validates the event once, then calls each adapter in order.

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

## Validation

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

Invalid:

```ts
await analytics.track({
  name: "settings_saved",
  attributes: {
    nested: { bad: true }
  }
});
```

Nested objects and arrays are not allowed because analytics payloads should stay compact, serializable, and safe to forward.

## Billing Idempotency

`billing_event` must include `idempotencyKey`.

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

The frontend only requires the key. The backend must enforce idempotency before forwarding or processing billing-related events.

## Frontend And Backend Boundaries

Frontend responsibilities:

- Build validated event payloads.
- Avoid secrets and non-scalar attributes.
- Send events to business backend endpoints through adapters.
- Render or log adapter failures where useful.

Backend responsibilities:

- Authenticate the shop/session.
- Attach Shopify credentials where needed.
- Enforce idempotency for billing events.
- Forward to Shopify App Events or internal analytics systems.
- Store audit logs, retries, and dead-letter handling if required.

Never put Shopify secrets, Admin API tokens, OAuth tokens, webhook secrets, or App Events bearer tokens in browser code.

## Recommended Event Names

Use stable, lowercase snake_case names:

- `app_loaded`
- `page_viewed`
- `settings_saved`
- `save_failed`
- `resource_picker_opened`
- `resource_picker_selected`
- `billing_event`

Suggested naming rules:

- Use past-tense names for completed actions: `settings_saved`.
- Use domain-specific nouns in attributes: `surface`, `plan`, `resourceType`.
- Keep names stable. Changing event names breaks downstream dashboards.

## Common Examples

### Console During Development

```ts
const analytics = createAnalytics({
  adapters: [consoleAnalyticsAdapter()]
});
```

### Disable Analytics In Tests

```ts
const analytics = createAnalytics({
  adapters: [noopAnalyticsAdapter()]
});
```

### Send To Backend

```ts
const analytics = createAnalytics({
  adapters: [
    shopifyAppEventsAdapter({
      endpoint: "/api/shopify/app-events"
    })
  ]
});
```

The adapter sends:

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

### Custom Adapter

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

## Error Handling

If one or more adapters fail:

- `onError` is called for each failed adapter.
- `track` throws an `AggregateError` after all adapters have run.

```ts
const analytics = createAnalytics({
  adapters,
  onError(error, event) {
    console.error("analytics adapter failed", event.name, error);
  }
});
```

Use `onError` for logs, Sentry, or non-blocking diagnostics. Avoid blocking primary user workflows purely because analytics failed.

## Security Notes

- Do not include secrets, tokens, bearer values, cookies, or webhook secrets in events.
- Do not send nested objects that may accidentally contain private data.
- Prefer stable ids and coarse metadata over raw payloads.
- Backend endpoints must authenticate the current shop/session.
- Billing events require backend idempotency enforcement.

## Runtime Compatibility

`shopifyAppEventsAdapter` uses a runtime global fallback when no custom `fetch` is passed. It checks `globalThis`, `window`, `self`, `global`, and a final runtime fallback before requiring callers to provide `fetch`.

For tests or non-browser runtimes, pass `fetch` explicitly:

```ts
shopifyAppEventsAdapter({
  endpoint: "/api/shopify/app-events",
  fetch: testFetch
});
```
