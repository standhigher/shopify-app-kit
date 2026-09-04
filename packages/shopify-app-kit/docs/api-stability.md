# API Stability / API 稳定性

`1.0.0` freezes the public contract of `@standhigher/shopify-app-kit` for the stable package surface.

## Stable entry points

The following root and subpath exports are supported:

- `@standhigher/shopify-app-kit`
- `/core`
- `/error`
- `/http`
- `/feedback`
- `/save-flow`
- `/navigation`
- `/resource-picker`
- `/analytics`
- `/shopify-adapters`

The generated ESM, CommonJS, and TypeScript declaration files are part of the release contract. Public types include provider options/context, Polaris renderer props, HTTP/Error contracts, dirty-form/save-flow contracts, navigation and picker adapters, and analytics event/client types.

## Compatibility guarantees

- React 18.x/19.x, Node 20.10+/22.x, TypeScript 5.x, and Polaris 13.9.x are the supported baseline.
- `@shopify/polaris` remains a required peer dependency. The host installs Polaris and provides `AppProvider` and styles.
- Shopify App Bridge remains optional. Missing host APIs return stable fallback behavior or `undefined` adapters.
- ESM/CJS imports and SSR module imports must remain safe for the documented baseline.

## Change policy

- Existing stable exports and required fields are not removed in a minor release.
- New optional fields and exports may be added in minor releases.
- Breaking changes require a new major version.
- Internal files, generated chunks, Storybook stories, and test helpers are not public API.
- Renderer slots may replace presentation, but must preserve the component's interaction and accessibility contract.

## Release checklist

Before publishing a stable tag, run lint, unit tests, typecheck, build, package-boundary verification, Storybook build, Chromium smoke tests, and npm pack dry-run. Confirm the package version, changelog, README, security policy, tag, registry, and dist-tag agree.
