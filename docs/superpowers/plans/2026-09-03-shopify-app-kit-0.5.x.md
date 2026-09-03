# Shopify App Kit 0.5.x Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the 0.5.x compatibility and contract release for `@standhigher/shopify-app-kit` without implementing post-0.5.x roadmap features.

**Architecture:** Keep `ShopifyAppKitProvider` as the Kit context provider and make Polaris a peer dependency supplied by the host. Default visual components render Polaris primitives and require the host's `AppProvider`; `ToastProvider` owns only toast/confirm state and composes beneath `AppProvider`. HTTP and Error expose a stable backend-envelope contract with request/trace ids.

**Tech Stack:** TypeScript, React 18+, `@shopify/polaris` 13.x, Vitest, Testing Library, tsup, npm workspaces.

**Spec:** User delegation requirements; the referenced `docs/superpowers/plans/2026-09-03-shopify-app-kit-1.0-roadmap.md` is absent from this checkout and repository history.

## Global Constraints

- Implement only 0.5.x requirements: Polaris peer integration, Provider/ToastProvider composition, Polaris defaults, dirty-state correction, HTTP/Error contracts, public API tests, coverage, docs, and CHANGELOG.
- Do not add 0.6.x or later roadmap features.
- Keep `@shopify/polaris` external in the bundle and list it as a peer dependency.
- Use TDD: each behavior change gets a failing test before production code.
- Preserve existing public subpaths and backend boundary (no OAuth, Admin API, webhooks, or direct App Events API calls).

### Task 1: Polaris dependency and provider composition

**Files:** `packages/shopify-app-kit/package.json`, lockfile, provider types/context/tests, public API type tests.

- [ ] Add `@shopify/polaris` as a 13.x peer dependency and test dependency; keep it external in tsup.
- [ ] Define and test the documented nesting: host `AppProvider` wraps Kit `ShopifyAppKitProvider`, with `ToastProvider` inside the host Polaris provider.
- [ ] Export provider-related public types and stable composition guidance.

### Task 2: Polaris feedback and save-bar defaults

**Files:** `src/feedback/*`, `src/save-flow/AppSaveBar.tsx`, related tests and docs.

- [ ] Add failing tests for Polaris Banner, Modal, Toast, Button, and SaveBar behavior and accessible labels.
- [ ] Implement minimal Polaris-backed defaults while preserving existing callback and prop contracts.
- [ ] Ensure missing required host composition fails clearly where Polaris requires it.

### Task 3: `useDirtyForm` state contract

**Files:** `src/save-flow/useDirtyForm.ts`, `src/save-flow.test.tsx`, save-flow docs/examples.

- [ ] Add failing tests proving external `value` changes update the clean snapshot/status correctly, successful save resets dirty state, and failed save retains dirty state.
- [ ] Implement state transitions without stale callback/value captures; preserve discard behavior and public types.

### Task 4: HTTP/Error contract hardening

**Files:** `src/core/http/*`, `src/core/error/*`, tests, core docs.

- [ ] Add failing tests for non-2xx envelope errors, malformed bodies, timeout/request id propagation, and trace id mapping.
- [ ] Implement the documented `SUCCESS`/business-error envelope and `HTTP_ERROR`/`TIMEOUT`/`NETWORK_ERROR` normalization semantics.

### Task 5: Public API and quality surface

**Files:** package exports, `src/public-api.test.ts`, coverage config/scripts, docs, examples, package and root CHANGELOG.

- [ ] Test runtime exports and generated declaration entry points for root and every supported subpath.
- [ ] Add coverage thresholds/reporting appropriate to the existing suite.
- [ ] Document peer dependency, provider composition, Polaris defaults, HTTP/Error contracts, and 0.5.x scope boundary.
- [ ] Update version/changelog for 0.5.x without changing roadmap documents.

### Task 6: Full verification

- [ ] Run `npm run lint`.
- [ ] Run `npm run test` with coverage.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `npm run pack:dry-run` and inspect package contents.
- [ ] Review diff and commit history; report branch, commits, changed files, and exact verification results.

## Execution Ledger

- Ruling: The referenced 1.0 roadmap is absent in this checkout, so the source-thread 0.5.x requirements are authoritative; post-0.5.x work remains out of scope.
- Ruling: Polaris 13.x is a required peer dependency; the host owns `AppProvider`, `Frame`, and CSS, while Kit keeps `ToastProvider` independent and composable.
- Ruling: `PATCH` remains out of scope for 0.5.x because the existing public HTTP contract only exposes GET/POST/PUT/DELETE.
