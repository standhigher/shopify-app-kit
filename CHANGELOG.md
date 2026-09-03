# Changelog

All notable changes to this project are documented here.

This project follows semantic versioning before `1.0.0` with the usual pre-1.0 caveat: minor versions may introduce API adjustments while the package is stabilizing.

## [0.7.0] - 2026-09-03

### Added

- Added a real Storybook with interactive examples for Provider, Feedback, Save Flow, Navigation, Resource Picker, and Analytics.
- Added localized provider messages for `en` and `zh-CN`, locale fallback, and constrained renderer slots for business customization.

### Improved

- Improved modal focus restoration, scroll locking, layered Escape handling, and toast queue controls.
- Loaded Shopify Polaris styles in the Storybook preview so examples render with the expected Polaris visual system.

## [0.6.0] - 2026-09-03

### Added

- Added optional Shopify App Bridge adapters for Save Bar, Navigation, Product Picker, and Collection Picker.
- Added SSR-safe runtime detection and safe host-missing fallbacks for local development and non-Shopify environments.

### Documentation

- Documented adapter installation, compatibility, and degradation behavior.

## [0.5.0] - 2026-09-03

### Added

- Added `@shopify/polaris` 13.x as a peer dependency and documented host `AppProvider`/`Frame` composition.
- Migrated default feedback and save-bar rendering to Polaris components.
- Added public API runtime/type coverage and coverage reporting.

### Fixed

- Corrected `useDirtyForm` snapshot synchronization and dirty status after a successful save is edited again.
- Completed HTTP/Error handling for malformed non-2xx responses, status propagation, request/trace ids, and existing `ApiError` normalization.

## [0.4.0] - 2026-08-21

### Added

- Added a global Analytics facade with one-time initialization helpers for business modules.
- Documented the recommended global Analytics setup in English and Chinese docs.

## [0.3.2] - 2026-08-12

### Added

- Added English and Chinese Analytics usage documentation.
- Added Core HTTP / Error technical design archive documentation.

### Fixed

- Added runtime global fallback for `shopifyAppEventsAdapter` so runtimes without `globalThis` can still resolve `fetch`.

## [0.3.1] - 2026-08-12

### Fixed

- Added runtime global fallback for Core HTTP so older environments without `globalThis` can still resolve `fetch` and request id generation.

## [0.3.0] - 2026-08-12

### Added

- Added Core HTTP and Error modules with public `http` and `error` subpath exports.
- Added backend response envelope unwrapping, `ApiError` normalization, request ids, timeout handling, and GET retry behavior.

## [0.2.0] - 2026-08-11

### Added

- Expanded npm and GitHub-facing package metadata.
- Added English and Chinese README entry points.
- Added collaboration documents for contributing, security, conduct, issues, and pull requests.
- Added release guidance for npm web authentication, tag publishing, dry-run checks, and dist-tags.
- Added documentation surface check through `npm run build-storybook`.

## [0.1.1] - 2026-08-11

### Added

- Added bilingual business usage guide.
- Added bilingual development, debugging, and release guide.

## [0.1.0] - 2026-08-10

### Added

- Initial Phase 1 MVP for `@standhigher/shopify-app-kit`.
- Added subpath exports for `core`, `feedback`, `save-flow`, `navigation`, `resource-picker`, and `analytics`.
- Added package build, tests, docs, examples, and CI.
## 0.6.0

- add optional Shopify App Bridge Save Bar, Navigation, Product, and Collection adapters
- add SSR-safe runtime detection and safe host-missing fallbacks
- document adapter installation, compatibility, and degradation behavior
