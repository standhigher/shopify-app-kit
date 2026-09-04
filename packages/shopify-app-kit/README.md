# @standhigher/shopify-app-kit

[![npm version](https://img.shields.io/npm/v/@standhigher/shopify-app-kit.svg)](https://www.npmjs.com/package/@standhigher/shopify-app-kit)
[![npm downloads](https://img.shields.io/npm/dm/@standhigher/shopify-app-kit.svg)](https://www.npmjs.com/package/@standhigher/shopify-app-kit)
[![CI](https://github.com/standhigher/shopify-app-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/standhigher/shopify-app-kit/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@standhigher/shopify-app-kit.svg)](https://github.com/standhigher/shopify-app-kit/blob/main/LICENSE)
[![docs](https://img.shields.io/badge/docs-available-brightgreen.svg)](https://github.com/standhigher/shopify-app-kit/tree/main/packages/shopify-app-kit/docs)

Typed React utilities for Shopify embedded app feedback, save flows, navigation, resource picking, and analytics adapters.

[中文说明](./README.zh-CN.md)

## Links

- [npm package](https://www.npmjs.com/package/@standhigher/shopify-app-kit)
- [GitHub repository](https://github.com/standhigher/shopify-app-kit)
- [Storybook demo](https://standhigher.github.io/shopify-app-kit/)
- [Storybook usage guide](https://standhigher.github.io/shopify-app-kit/?path=/docs/getting-started-使用说明--docs)
- [Examples](https://github.com/standhigher/shopify-app-kit/tree/main/packages/shopify-app-kit/examples)
- [API docs](https://github.com/standhigher/shopify-app-kit/tree/main/packages/shopify-app-kit/docs)
- [Core HTTP and Error](https://github.com/standhigher/shopify-app-kit/blob/main/packages/shopify-app-kit/docs/core.md)
- [Analytics](https://github.com/standhigher/shopify-app-kit/blob/main/packages/shopify-app-kit/docs/analytics.md)
- [Usage docs](https://github.com/standhigher/shopify-app-kit/blob/main/packages/shopify-app-kit/docs/business-users.md)
- [Changelog](https://github.com/standhigher/shopify-app-kit/blob/main/CHANGELOG.md)

## Installation

```bash
npm install @standhigher/shopify-app-kit @shopify/polaris react react-dom
```

`react`, `react-dom`, and `@shopify/polaris` are peer dependencies. The host app provides them.
The host also owns Polaris CSS, for example `import "@shopify/polaris/build/esm/styles.css";`.

## Basic Usage

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

### Polaris provider composition

Shopify App Kit does not create a Polaris context for the host. Put the host's
Polaris `AppProvider` and `Frame` above Kit components, and put
`ToastProvider` inside `Frame` when using `useToast` or `useConfirm`:

```tsx
import { AppProvider, Frame } from "@shopify/polaris";
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";
import { ToastProvider } from "@standhigher/shopify-app-kit/feedback";

export function App() {
  return (
    <AppProvider i18n={{}}>
      <Frame>
        <ShopifyAppKitProvider appName="Fulfillment Desk">
          <ToastProvider>
            <Routes />
          </ToastProvider>
        </ShopifyAppKitProvider>
      </Frame>
    </AppProvider>
  );
}
```

`AppBanner`, `AppModal`, `ConfirmDialog`, and `AppSaveBar` render Polaris
components by default. `AppSaveBar` uses Polaris `ContextualSaveBar`, so it
also belongs below the host `Frame`. The package does not add `AppProvider` or
`Frame` implicitly.

Import only the domain you need through subpath exports:

```tsx
import { useToast } from "@standhigher/shopify-app-kit/feedback";
import { useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";
import { useAppNavigation } from "@standhigher/shopify-app-kit/navigation";
import { useProductPicker } from "@standhigher/shopify-app-kit/resource-picker";
import { analytics, initAnalytics } from "@standhigher/shopify-app-kit/analytics";
import { http } from "@standhigher/shopify-app-kit/http";
import { ApiError } from "@standhigher/shopify-app-kit/error";
```

## Feature Overview

| Subpath | What it provides |
|---|---|
| `@standhigher/shopify-app-kit/core` | `ShopifyAppKitProvider`, runtime detection, message overrides, shared app context |
| `@standhigher/shopify-app-kit/http` | Typed HTTP client for embedded app backend calls, timeout, request id, GET retry, response unwrapping |
| `@standhigher/shopify-app-kit/error` | `ApiError`, backend envelope detection, error normalization |
| `@standhigher/shopify-app-kit/feedback` | Toasts, banners, modals, confirm dialog, promise-based confirmation hook |
| `@standhigher/shopify-app-kit/save-flow` | Dirty form state, save bar fallback, browser leave guard |
| `@standhigher/shopify-app-kit/navigation` | App route navigation, Shopify Admin links, safe external links |
| `@standhigher/shopify-app-kit/resource-picker` | Product and collection picker hooks backed by host adapters |
| `@standhigher/shopify-app-kit/analytics` | Global event facade, event schema validation, adapter fan-out, console/noop/backend adapters |

## Examples

### Save Flow

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

### Analytics

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

`shopifyAppEventsAdapter` only posts to your backend endpoint. OAuth, webhooks, Admin API tokens, App Events bearer tokens, and Shopify secrets must stay in the business backend.

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

The HTTP client unwraps the shared backend envelope, defaults to a `15000ms` timeout, and retries only `GET` requests for network errors, timeout, and HTTP `5xx`. See [Core HTTP and Error](./docs/core.md) or [中文文档](./docs/core.zh-CN.md).

## Compatibility

| Runtime | Support |
|---|---|
| React | `>=18` |
| React DOM | `>=18` |
| TypeScript | Tested with TypeScript 5.x |
| Module formats | ESM, CJS, and type declarations |
| Frameworks | Framework-agnostic React. Next.js is not a hard dependency. |
| SSR import safety | Package entry points avoid browser globals during module import. |

## Examples / Storybook / Demo

Examples live in [`examples`](https://github.com/standhigher/shopify-app-kit/tree/main/packages/shopify-app-kit/examples).

Storybook is configured with interactive stories for the Provider, Polaris feedback, save flow, navigation, resource picker, and analytics. The [Getting Started usage guide](https://standhigher.github.io/shopify-app-kit/?path=/docs/getting-started-使用说明--docs) explains parameters, Polaris host setup, App Bridge adapters, and fallback behavior. Run `npm run storybook` for local interaction or `npm run build-storybook` for a static build.

### Localization and renderer slots

`ShopifyAppKitProvider` supports `en` and `zh-CN` message dictionaries. Regional tags fall back by language, unknown languages fall back to English, and `messages` overrides individual labels. The constrained `renderers` slots for `banner`, `modal`, `toast`, and `saveBar` receive `DefaultComponent`; render it to retain Polaris interaction and accessibility behavior. `AppModal` manages focus, Escape/backdrop close, scroll locking, and topmost-modal handling. `ToastProvider` supports automatic dismissal, `maxToasts`, and duplicate suppression.

## Package Quality

The repository checks:

- ESLint
- Vitest and Testing Library tests
- TypeScript typecheck
- tsup build for ESM/CJS/DTS
- npm package dry-run inspection
- documentation surface check

## Local Development

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

## Release Preparation

Before publishing:

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

Publishing can be done by tag-based GitHub Actions when `NPM_TOKEN` is configured, or manually with npm web authentication:

```bash
npm login --auth-type=web --registry=https://registry.npmjs.org
npm publish --access public --registry=https://registry.npmjs.org
```

See [release documentation](./docs/release.md) for dist-tag and checklist details.

## Scope Boundary

Included in the current public package: core provider/runtime, feedback, save flow, navigation, product and collection pickers, analytics adapters, docs, examples, and quality checks.

Not included: Layout/UI Patterns, ScopeGate, BillingGate, CustomerPicker, complete AI components, OAuth, webhooks, direct Admin API calls, or direct Shopify App Events API calls.
