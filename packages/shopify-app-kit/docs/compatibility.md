# Compatibility Matrix / 兼容矩阵

## Supported baseline

| Area | Supported baseline |
| --- | --- |
| React | 18.x and 19.x |
| Node.js | 20.10+ and 22.x |
| TypeScript | 5.x with `moduleResolution: Bundler` or compatible settings |
| Shopify Polaris | `@shopify/polaris` 13.9.x (`peerDependency`) |
| Module formats | ESM, CommonJS, and generated TypeScript declarations |
| Rendering | Client rendering, SSR-safe module import, Shopify Embedded App host |
| Browser smoke target | Chromium latest stable |

## Host responsibilities

- Install `@shopify/polaris` and provide the Polaris `AppProvider`/styles.
- Provide Shopify App Bridge when using App Bridge adapters.
- Keep React and React DOM on compatible versions.
- Provide server-side data access and authentication; this package does not call Admin APIs directly.

## Known boundaries

- The package does not guarantee behavior for unsupported Polaris major versions.
- Browser smoke tests do not replace a real Shopify store integration test.
- App Bridge adapters degrade to stable local fallbacks when the host API is unavailable.
- CSS is intentionally not bundled into the package; Storybook loads it only for preview rendering.
