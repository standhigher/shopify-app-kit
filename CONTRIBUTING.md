# Contributing

Thanks for helping improve `@standhigher/shopify-app-kit`.

## Development Setup

```bash
npm ci --registry=https://registry.npmjs.org
npm run lint
npm run test
npm run typecheck
npm run build
npm run pack:dry-run
```

## Contribution Scope

Good contributions include:

- Bug fixes with focused tests.
- Documentation improvements.
- Type improvements that do not break public API unexpectedly.
- Small feature additions that fit existing subpath boundaries.

Please avoid adding Shopify secrets, Admin API tokens, OAuth flows, webhook handlers, or business-specific backend logic to this frontend package.

## Pull Request Checklist

- Keep changes scoped.
- Add or update tests when behavior changes.
- Update README or docs for user-facing changes.
- Run the quality commands before opening a pull request.
- Describe migration notes when public API changes.

## Release Notes

Maintainers update `CHANGELOG.md` and package versions as part of the release process.
