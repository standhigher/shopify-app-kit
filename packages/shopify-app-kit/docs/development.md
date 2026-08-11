# Development, Debugging, And Release Guide / 本地开发调试部署文档

## 中文

### 适用对象

这份文档面向维护 `@standhigher/shopify-app-kit` 包的开发者，覆盖本地开发、调试、质量验证、打包和发布流程。

### 仓库结构

```text
.
├── package.json
├── package-lock.json
├── .github/workflows/
│   ├── ci.yml
│   └── publish.yml
└── packages/shopify-app-kit/
    ├── package.json
    ├── src/
    ├── docs/
    ├── examples/
    └── dist/
```

根目录是 npm workspace。实际发布包位于 `packages/shopify-app-kit`。

### 环境要求

- Node.js 22
- npm 10+
- npmjs 账号权限，仅发布时需要

建议始终使用官方 npm registry 生成 lockfile 和发布包：

```bash
npm config get registry
npm ci --registry=https://registry.npmjs.org
```

### 安装依赖

```bash
npm ci --registry=https://registry.npmjs.org
```

如果需要重新生成 lockfile：

```bash
rm package-lock.json
npm install --package-lock-only --include=optional --registry=https://registry.npmjs.org
npm ci --registry=https://registry.npmjs.org
```

`--include=optional` 很重要，因为 Rollup 和 esbuild 会通过 optional dependencies 安装平台相关二进制包。缺少 Linux optional 包时，GitHub Actions 可能在测试或构建阶段报 `Cannot find module @rollup/rollup-linux-x64-gnu`。

### 常用命令

```bash
npm run lint
npm run test
npm run test:ci
npm run typecheck
npm run build
npm run pack:dry-run
```

命令含义：

| 命令 | 用途 |
|---|---|
| `npm run lint` | ESLint 检查源码 |
| `npm run test` | 本地 Vitest 测试 |
| `npm run test:ci` | CI 风格测试，串行执行并输出 verbose reporter |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run build` | tsup 输出 ESM、CJS 和类型声明 |
| `npm run pack:dry-run` | 检查 npm 包内容，不真正发布 |

### 本地调试

测试文件位于 `packages/shopify-app-kit/src/*.test.ts(x)`。测试使用 Vitest、Testing Library 和 `happy-dom`。

只跑单个测试文件：

```bash
npm --prefix packages/shopify-app-kit run test -- src/save-flow.test.tsx
```

调试导出入口时，优先从 public subpath 引入：

```ts
import { useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";
```

Vitest 通过 `packages/shopify-app-kit/vitest.config.ts` 将这些 public subpath 映射到本地源码，避免测试绕过真实导出边界。

### 打包检查

```bash
npm run build
npm run pack:dry-run
```

`pack:dry-run` 输出中应该只包含：

- `dist`
- `README.md`
- `docs`
- `examples`
- `package.json`

不要把源码测试、内部材料、私有链接、token、secret 或本地临时文件放进 npm 包。

### CI 流程

`main` 和 pull request 会触发 `.github/workflows/ci.yml`：

```text
npm ci
npm run lint
npm run test:ci
npm run typecheck
npm run build
npm run pack:dry-run
```

如果 CI 在测试阶段失败，workflow 会把 Vitest 失败摘要写成 GitHub annotation，方便在没有完整日志权限时定位问题。

### 发布流程

当前发布版本由 `packages/shopify-app-kit/package.json` 的 `version` 决定。tag 使用 `v<version>` 格式，例如 `v0.2.0`。

推荐流程：

```bash
npm run lint
npm run test:ci
npm run typecheck
npm run build
npm run pack:dry-run
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin main
git push origin v0.2.0
```

tag 推送会触发 `.github/workflows/publish.yml`。发布到 npmjs 需要 GitHub repository secret：

```text
NPM_TOKEN
```

`NPM_TOKEN` 必须有发布 `@standhigher/shopify-app-kit` 的权限。

### 本地 web 认证发布

如果需要人工通过网页认证发布：

```bash
npm login --auth-type=web --registry=https://registry.npmjs.org
npm whoami --registry=https://registry.npmjs.org
npm publish --access public --registry=https://registry.npmjs.org
```

npm 可能在 `publish` 阶段再次要求网页确认。按命令输出的链接完成认证即可。

### 故障排查

| 问题 | 可能原因 | 处理方式 |
|---|---|---|
| `npm ci` 在 GitHub Actions 失败 | lockfile 写入了私有 registry 地址 | 删除 lockfile，用官方 registry 重新生成 |
| `Cannot find module @rollup/rollup-linux-x64-gnu` | Linux optional dependency 没有被锁定 | 使用 `--include=optional` 重新生成 lockfile，或补充 optional dependency |
| `npm publish` 失败但 lint/test/build 全过 | `NPM_TOKEN` 缺失或权限不足 | 更新 GitHub secret 或改用 web login 手动发布 |
| 本地能过，CI 测试失败 | DOM 环境、平台依赖或并发差异 | 使用 `npm run test:ci` 复现，检查 GitHub annotation |
| 包内容包含不该发布的文件 | `files` 配置或目录结构不正确 | 检查 `packages/shopify-app-kit/package.json` 的 `files` 字段 |

## English

### Audience

This guide is for developers maintaining the `@standhigher/shopify-app-kit` package. It covers local development, debugging, quality checks, packaging, and release.

### Repository Layout

```text
.
├── package.json
├── package-lock.json
├── .github/workflows/
│   ├── ci.yml
│   └── publish.yml
└── packages/shopify-app-kit/
    ├── package.json
    ├── src/
    ├── docs/
    ├── examples/
    └── dist/
```

The repository root is an npm workspace. The publishable package lives in `packages/shopify-app-kit`.

### Requirements

- Node.js 22
- npm 10+
- npmjs publish access, only required for releasing

Use the public npm registry for lockfile generation and publishing:

```bash
npm config get registry
npm ci --registry=https://registry.npmjs.org
```

### Install Dependencies

```bash
npm ci --registry=https://registry.npmjs.org
```

To regenerate the lockfile:

```bash
rm package-lock.json
npm install --package-lock-only --include=optional --registry=https://registry.npmjs.org
npm ci --registry=https://registry.npmjs.org
```

`--include=optional` matters because Rollup and esbuild use optional dependencies for platform-specific binaries. If Linux optional packages are missing, GitHub Actions can fail with `Cannot find module @rollup/rollup-linux-x64-gnu`.

### Common Commands

```bash
npm run lint
npm run test
npm run test:ci
npm run typecheck
npm run build
npm run pack:dry-run
```

| Command | Purpose |
|---|---|
| `npm run lint` | Run ESLint against source files |
| `npm run test` | Run local Vitest tests |
| `npm run test:ci` | Run verbose serial CI-style tests |
| `npm run typecheck` | Run TypeScript checks |
| `npm run build` | Build ESM, CJS, and type declarations with tsup |
| `npm run pack:dry-run` | Inspect npm package contents without publishing |

### Local Debugging

Tests live in `packages/shopify-app-kit/src/*.test.ts(x)`. The suite uses Vitest, Testing Library, and `happy-dom`.

Run one test file:

```bash
npm --prefix packages/shopify-app-kit run test -- src/save-flow.test.tsx
```

When debugging exports, import from public subpaths:

```ts
import { useDirtyForm } from "@standhigher/shopify-app-kit/save-flow";
```

`packages/shopify-app-kit/vitest.config.ts` maps public subpaths to local source files so tests exercise the same boundaries that consumers use.

### Package Inspection

```bash
npm run build
npm run pack:dry-run
```

`pack:dry-run` should include only:

- `dist`
- `README.md`
- `docs`
- `examples`
- `package.json`

Do not publish tests, internal materials, private links, tokens, secrets, or local temporary files.

### CI Flow

Pushes to `main` and pull requests trigger `.github/workflows/ci.yml`:

```text
npm ci
npm run lint
npm run test:ci
npm run typecheck
npm run build
npm run pack:dry-run
```

If tests fail in CI, the workflow writes the Vitest failure summary as a GitHub annotation. This helps debugging even when full job logs are not available.

### Release Flow

The release version comes from `packages/shopify-app-kit/package.json`. Tags use the `v<version>` format, for example `v0.2.0`.

Recommended flow:

```bash
npm run lint
npm run test:ci
npm run typecheck
npm run build
npm run pack:dry-run
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin main
git push origin v0.2.0
```

Pushing a tag triggers `.github/workflows/publish.yml`. Publishing to npmjs requires this GitHub repository secret:

```text
NPM_TOKEN
```

`NPM_TOKEN` must have permission to publish `@standhigher/shopify-app-kit`.

### Manual Web-Auth Publish

To publish manually through npm web authentication:

```bash
npm login --auth-type=web --registry=https://registry.npmjs.org
npm whoami --registry=https://registry.npmjs.org
npm publish --access public --registry=https://registry.npmjs.org
```

npm may ask for another web confirmation during `publish`. Complete the link shown in the command output.

### Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| `npm ci` fails in GitHub Actions | Lockfile contains a private registry URL | Regenerate the lockfile with the public npm registry |
| `Cannot find module @rollup/rollup-linux-x64-gnu` | Linux optional dependency is not locked | Regenerate with `--include=optional` or add the optional dependency |
| `npm publish` fails after lint/test/build pass | Missing or under-scoped `NPM_TOKEN` | Update the GitHub secret or publish manually with web login |
| Tests pass locally but fail in CI | DOM environment, platform dependency, or concurrency difference | Run `npm run test:ci` and inspect GitHub annotations |
| Unexpected files appear in the package | `files` config or directory layout is wrong | Check `files` in `packages/shopify-app-kit/package.json` |
