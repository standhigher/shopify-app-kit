# Shopify App Kit 0.8/1.0 Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前 `0.7.0` 主干推进为可验证的 `0.8.0-rc.0`，再冻结 public API 并准备 `1.0.0` 正式发布。

**Architecture:** 继续使用单包 workspace。兼容性与发布验证通过文档、Node 脚本、Vitest 和 Playwright 分层覆盖；包运行时保持 Polaris peer dependency 和可选 Shopify adapter 边界不变。0.8 与 1.0 使用同一分支但分别提交、分别验收。

**Tech Stack:** TypeScript、React、Vitest、Testing Library、Playwright、Storybook、tsup、GitHub Actions、npm。

---

## Phase 0.8 — Release Candidate

### Task 1: Add compatibility and package-boundary verification

**Files:**
- Create: `packages/shopify-app-kit/docs/compatibility.md`
- Create: `packages/shopify-app-kit/scripts/verify-package-boundary.mjs`
- Modify: `packages/shopify-app-kit/package.json`
- Modify: `packages/shopify-app-kit/docs/release.md`

- [ ] Document supported React, Node, TypeScript, Polaris, module, SSR, and browser versions.
- [ ] Verify built ESM/CJS/DTS files exist, public exports resolve, SSR import does not require `window`/`document`, and Polaris remains external.
- [ ] Add `verify:package` script and include it in the release checklist.

### Task 2: Add browser smoke coverage

**Files:**
- Create: `packages/shopify-app-kit/playwright.config.ts`
- Create: `packages/shopify-app-kit/e2e/storybook.smoke.spec.ts`
- Modify: `packages/shopify-app-kit/package.json`
- Modify: `.github/workflows/ci.yml`
- Modify: `packages/shopify-app-kit/docs/development.md`

- [ ] Run Storybook on a fixed local port for Chromium tests.
- [ ] Cover Polaris feedback rendering, modal open/close, toast display, Save Bar fallback, and analytics interaction.
- [ ] Make CI install Chromium and run the smoke test without requiring Shopify credentials.

### Task 3: Prepare the 0.8.0 RC release

**Files:**
- Modify: `packages/shopify-app-kit/package.json`
- Modify: `package-lock.json`
- Modify: `CHANGELOG.md`
- Modify: `packages/shopify-app-kit/CHANGELOG.md`
- Create: `packages/shopify-app-kit/docs/migration-0.4-to-0.8.md`
- Modify: `.github/workflows/publish.yml`

- [ ] Set package version to `0.8.0-rc.0` and keep lockfile synchronized.
- [ ] Document migration notes and the `next` dist-tag workflow.
- [ ] Ensure CI checks package boundary, browser smoke, Storybook, and pack dry-run before release.
- [ ] Commit and verify the complete 0.8 RC state before starting 1.0 work.

## Phase 1.0 — Stable API

### Task 4: Freeze public API and release metadata

**Files:**
- Create: `packages/shopify-app-kit/src/api-surface.test.ts`
- Create: `packages/shopify-app-kit/docs/api-stability.md`
- Modify: `packages/shopify-app-kit/package.json`
- Modify: `package-lock.json`
- Modify: `CHANGELOG.md`
- Modify: `packages/shopify-app-kit/CHANGELOG.md`
- Modify: `README.md`, `README.zh-CN.md`

- [ ] Assert the supported root and subpath runtime/type exports, adapter interfaces, error types, and Polaris peer contract.
- [ ] Document stable exports, compatibility guarantees, experimental-surface policy, and semver rules.
- [ ] Set package version to `1.0.0` and update release instructions for `latest`.

### Task 5: Final verification and handoff

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `packages/shopify-app-kit/docs/release.md`
- Modify: `SECURITY.md`

- [ ] Run lint, test, typecheck, build, package-boundary verification, Storybook, Chromium smoke, and pack dry-run.
- [ ] Add a release checklist covering README, CHANGELOG, SECURITY, package version, tag, registry, ESM/CJS, and SSR import.
- [ ] Commit the 1.0.0 release-preparation state separately from 0.8 RC.
