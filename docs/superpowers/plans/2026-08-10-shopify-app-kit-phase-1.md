# Shopify App Kit Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `@standhigher/shopify-app-kit` Phase 1 public npm package from the Feishu Wiki task brief.

**Architecture:** Create one npm package at `packages/shopify-app-kit` with stable subpath exports for `core`, `feedback`, `save-flow`, `navigation`, `resource-picker`, and `analytics`. Keep Shopify secrets, Admin API tokens, OAuth, webhook, and App Events bearer-token work outside the frontend package by relying on runtime adapters and backend endpoints.

**Tech Stack:** TypeScript, React, tsup, Vitest, Testing Library, GitHub Actions, npm workspace.

---

### Task 1: Package Baseline

**Files:**
- Create root `package.json`, `.gitignore`, `.github/workflows/ci.yml`.
- Create `packages/shopify-app-kit/package.json`, `tsconfig.json`, `tsup.config.ts`, `vitest.config.ts`, `src/test/setup.ts`.

- [ ] Write baseline package configuration with ESM, CJS, declarations, public package metadata, peer dependencies for `react` and `react-dom`, and exports for `.`, `./core`, `./feedback`, `./save-flow`, `./navigation`, `./resource-picker`, and `./analytics`.
- [ ] Add lint, test, typecheck, build, and pack dry-run commands.
- [ ] Verify `npm install`, `npm run typecheck`, and `npm run build`.

### Task 2: Core Provider And Runtime

**Files:**
- Create `src/providers/*`, `src/runtime/*`, `src/i18n/*`, `src/core.ts`, `src/index.ts`.
- Test with `src/core.test.tsx`.

- [ ] Write failing tests for provider defaults, overrides, missing-provider error, and SSR-safe import.
- [ ] Implement `ShopifyAppKitProvider`, `useShopifyAppKit`, runtime detection, messages merge, and invariant helpers.
- [ ] Verify core tests and subpath type exports.

### Task 3: Analytics

**Files:**
- Create `src/analytics/*`, `src/analytics.ts`.
- Test with `src/analytics.test.ts`.

- [ ] Write failing tests for adapter fan-out, error collection, scalar attributes, billing idempotency, and backend adapter request body.
- [ ] Implement `createAnalytics`, noop, console, and `shopifyAppEventsAdapter({ endpoint })`.
- [ ] Verify analytics tests.

### Task 4: Navigation And Pickers

**Files:**
- Create `src/navigation/*`, `src/resource-picker/*`, `src/navigation.ts`, `src/resource-picker.ts`.
- Test with `src/navigation.test.ts`, `src/resource-picker.test.tsx`.

- [ ] Write failing tests for navigation adapter calls, browser fallback, URL validation, admin path validation, picker success/cancel/error.
- [ ] Implement `useAppNavigation`, `useProductPicker`, and `useCollectionPicker` using provider adapters.
- [ ] Verify tests.

### Task 5: Save Flow

**Files:**
- Create `src/save-flow/*`, `src/save-flow.ts`.
- Test with `src/save-flow.test.tsx`.

- [ ] Write failing tests for clean/dirty detection, successful save snapshot updates, failed save retaining dirty state, discard, non-embedded fallback SaveBar, and leave guard registration.
- [ ] Implement `useDirtyForm`, `AppSaveBar`, and `LeaveGuard`.
- [ ] Verify tests.

### Task 6: Feedback

**Files:**
- Create `src/feedback/*`, `src/feedback.ts`.
- Test with `src/feedback.test.tsx`.

- [ ] Write failing tests for toast rendering/closing, banner variants, modal accessible name/Escape close, confirm promise resolution, loading and destructive copy.
- [ ] Implement `ToastProvider`, `useToast`, `AppBanner`, `AppModal`, `ConfirmDialog`, and `useConfirm`.
- [ ] Verify tests.

### Task 7: Docs, Examples, CI, Final Verification

**Files:**
- Create `README.md`, package docs, examples, `.github/workflows/ci.yml`.

- [ ] Document install, Provider, Save Flow, Analytics, subpath exports, backend boundary, and Phase 2 exclusions.
- [ ] Add examples for basic provider, dirty form, and analytics.
- [ ] Run `npm run lint`, `npm run test`, `npm run typecheck`, `npm run build`, and `npm pack --dry-run`.
- [ ] Inspect pack output for only dist, README, package metadata, examples, and docs.
