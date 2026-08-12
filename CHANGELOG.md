# Changelog

All notable changes to this project are documented here.

This project follows semantic versioning before `1.0.0` with the usual pre-1.0 caveat: minor versions may introduce API adjustments while the package is stabilizing.

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
