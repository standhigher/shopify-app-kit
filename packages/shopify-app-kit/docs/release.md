# Release Guide / 发布说明

## 中文

### npm registry

发布始终使用 npmjs 官方 registry：

```bash
https://registry.npmjs.org
```

不要使用私有镜像或本地 registry 生成发布用 lockfile。

### 发布前检查

```bash
git diff --check
npm run lint
npm run test
npm run typecheck
npm run build
npm run build-storybook
cd packages/shopify-app-kit
npm pack --dry-run --registry=https://registry.npmjs.org/
```

`npm pack --dry-run` 应确认包内容只包含 `dist`、README、docs、examples、package metadata 和必要的 changelog。

### 版本与 tag

版本来自 `packages/shopify-app-kit/package.json`。

tag 使用 `v<version>` 格式：

```bash
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin main
git push origin v0.2.0
```

### Web Auth 手动发布

默认使用 npm web 认证：

```bash
npm login --auth-type=web --registry=https://registry.npmjs.org
npm whoami --registry=https://registry.npmjs.org
cd packages/shopify-app-kit
npm publish --access public --registry=https://registry.npmjs.org
```

npm 可能在 `publish` 阶段再次给出认证链接。请手动打开链接并点击确认，不要依赖当前终端自动打开浏览器。

### tag 发布方式

仓库也保留 tag 触发的 GitHub Actions 发布方式。触发条件：

```text
push tag v*
```

这种方式需要仓库配置 `NPM_TOKEN` secret，且 token 必须有发布 `@standhigher/shopify-app-kit` 的权限。

### dist-tag

默认发布到 `latest`：

```bash
npm publish --access public --tag latest --registry=https://registry.npmjs.org
```

预发布版本建议使用独立 dist-tag：

```bash
npm publish --access public --tag next --registry=https://registry.npmjs.org
```

查看 dist-tags：

```bash
npm dist-tag ls @standhigher/shopify-app-kit --registry=https://registry.npmjs.org
```

## English

### npm registry

Always publish through the public npmjs registry:

```bash
https://registry.npmjs.org
```

Do not use private mirrors or local registries for release lockfiles.

### Pre-release checks

```bash
git diff --check
npm run lint
npm run test
npm run typecheck
npm run build
npm run build-storybook
cd packages/shopify-app-kit
npm pack --dry-run --registry=https://registry.npmjs.org/
```

`npm pack --dry-run` should include only `dist`, README files, docs, examples, package metadata, and the required changelog.

### Version and tag

The package version comes from `packages/shopify-app-kit/package.json`.

Tags use `v<version>`:

```bash
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin main
git push origin v0.2.0
```

### Manual Web Auth publish

The default manual flow uses npm web authentication:

```bash
npm login --auth-type=web --registry=https://registry.npmjs.org
npm whoami --registry=https://registry.npmjs.org
cd packages/shopify-app-kit
npm publish --access public --registry=https://registry.npmjs.org
```

npm may provide another authentication link during `publish`. Open it manually and confirm the publish action.

### Tag-based publishing

The repository also keeps a tag-triggered GitHub Actions publish workflow:

```text
push tag v*
```

This requires the repository secret `NPM_TOKEN`, and the token must be allowed to publish `@standhigher/shopify-app-kit`.

### dist-tag

The default release tag is `latest`:

```bash
npm publish --access public --tag latest --registry=https://registry.npmjs.org
```

Use a separate dist-tag for prereleases:

```bash
npm publish --access public --tag next --registry=https://registry.npmjs.org
```

Inspect dist-tags:

```bash
npm dist-tag ls @standhigher/shopify-app-kit --registry=https://registry.npmjs.org
```
