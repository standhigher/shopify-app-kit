# Changelog

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
