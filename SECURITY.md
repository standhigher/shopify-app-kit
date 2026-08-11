# Security Policy

## Supported Versions

Security fixes target the latest published minor version unless otherwise stated.

| Version | Supported |
|---|---|
| `0.2.x` | Yes |
| `<0.2.0` | Best effort |

## Reporting A Vulnerability

Please do not open a public issue for sensitive security reports.

Use GitHub private vulnerability reporting if it is available on the repository, or contact the maintainers through the repository owner profile.

Include:

- Affected package version.
- Impacted API or module.
- Reproduction steps or proof of concept.
- Expected impact and suggested fix, if known.

## Security Boundaries

This package is frontend-only. Shopify secrets, Admin API tokens, OAuth tokens, webhook secrets, and App Events bearer tokens must stay in the business backend and must not be shipped to browsers.
