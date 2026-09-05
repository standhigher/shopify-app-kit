# Changelog

## 1.0.2 - 2026-09-04

- Added Storybook Getting Started and feature parameter usage guidance.
- Clarified Polaris host setup, App Bridge adapters, and fallback behavior.
- Simplified `AppSaveBar` to use the native App Bridge `ui-save-bar`; custom renderers remain available and missing adapters no longer render a Polaris fallback.

## 1.0.1 - 2026-09-04

- Added the root `npm run login:npm` helper for npmjs web authentication before publishing.
- Added the deployed Storybook URL to package metadata and README links.
- Normalized lockfile tarball sources to the public npmjs registry for CI and Pages installs.
- Hardened the Storybook feedback smoke test against duplicate toast notifications.
- Added Storybook Getting Started and feature parameter usage guidance.

## 1.0.0 - 2026-09-03

- Froze the documented root and public subpath API surface with ESM, CommonJS, and TypeScript declaration coverage.
- Added API stability, compatibility, migration, and final release guidance.
- Prepared the stable `latest` release path after 0.8 RC verification.

## 0.8.0-rc.0 - 2026-09-03

- Added compatibility documentation, package-boundary verification, and Chromium Storybook smoke tests.
- Added migration guidance from 0.4.x through the 0.8.x release candidate.
- Prepared RC publishing through the npm `next` dist-tag.

## 0.7.0 - 2026-09-03

- Added a real Storybook with interactive examples for Provider, Feedback, Save Flow, Navigation, Resource Picker, and Analytics.
- Added `en`/`zh-CN` locale fallback, localized provider messages, and constrained renderer slots.
- Improved modal focus restoration, scroll locking, layered Escape handling, and toast queue controls.
- Loaded Polaris styles in the Storybook preview.

## 0.6.0 - 2026-09-03

- Added optional Shopify App Bridge adapters for Save Bar, Navigation, Product Picker, and Collection Picker.
- Added SSR-safe runtime detection and safe host-missing fallbacks.
- Documented adapter installation, compatibility, and degradation behavior.

## 0.5.0 - 2026-09-03

- Added Polaris 13.x peer dependency and host `AppProvider`/`Frame` composition guidance.
- Migrated default feedback and save-bar implementations to Polaris.
- Corrected dirty-form snapshot/status transitions and HTTP/Error normalization contracts.
