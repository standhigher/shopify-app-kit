# Migration Guide: 0.4.x to 0.8.x

This release candidate combines the 0.5 Polaris contract, 0.6 Shopify host adapters, and 0.7 developer experience work.

## Required host setup

Install the peer dependencies in the Embedded App host:

```bash
npm install @shopify/polaris react react-dom
```

Wrap the application with Polaris `AppProvider` and `Frame`, then mount `ShopifyAppKitProvider` inside it. Polaris CSS remains a host responsibility; the package does not bundle it.

## Adapter changes

- App Bridge Save Bar, Navigation, and Resource Picker adapters are available from `@standhigher/shopify-app-kit/shopify-adapters`.
- Adapters are optional and detect missing host APIs safely.
- Resource picker results use `{canceled, selection}` with stable `PickerItem` fields.

## Feedback and save flow

- `AppBanner`, `AppModal`, `ConfirmDialog`, `ToastProvider`, and `AppSaveBar` use Polaris defaults.
- Modal Escape handling, focus restoration, scroll locking, and toast queue limits are now covered by tests.
- Keep `ToastProvider` inside the Polaris/App Kit provider composition.

## Internationalization and customization

- Provider locale supports `en` and `zh-CN` with fallback to English.
- Override user-visible messages through `messages`.
- Use renderer slots only for visual customization; preserve the default interaction and accessibility contract.

## Validation before upgrading

```bash
npm run lint
npm run test
npm run typecheck
npm run build
npm --prefix packages/shopify-app-kit run verify:package
npm run build-storybook
npm --prefix packages/shopify-app-kit run test:e2e
npm run pack:dry-run
```
