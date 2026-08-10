# @standhigher/shopify-app-kit

Reusable React utilities for Shopify embedded apps.

Phase 1 ships one public npm package with subpath exports. Import only the domain you need instead of pulling every helper from the root entry.

## Install

```bash
npm install @standhigher/shopify-app-kit react react-dom
```

## Quick Start

```tsx
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";

export function App() {
  return (
    <ShopifyAppKitProvider appName="Fulfillment Desk" shop="demo.myshopify.com">
      <YourRoutes />
    </ShopifyAppKitProvider>
  );
}
```

## Subpath Exports

```tsx
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";
import { useToast } from "@standhigher/shopify-app-kit/feedback";
import { useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";
import { useAppNavigation } from "@standhigher/shopify-app-kit/navigation";
import { useProductPicker } from "@standhigher/shopify-app-kit/resource-picker";
import { createAnalytics } from "@standhigher/shopify-app-kit/analytics";
```

## Save Flow Example

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

## Analytics Example

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

The App Events adapter only posts to your backend endpoint. OAuth, webhooks, Admin API tokens, App Events bearer tokens, and Shopify secrets must stay in the business backend.

## Phase 1 Scope

Included: core provider/runtime, feedback, save flow, navigation, product and collection pickers, analytics adapters, docs, examples, and CI quality checks.

Not included: Layout/UI Patterns, ScopeGate, BillingGate, CustomerPicker, complete AI components, OAuth, webhooks, direct Admin API calls, or direct Shopify App Events API calls.
