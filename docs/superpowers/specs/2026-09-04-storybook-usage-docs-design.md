# Storybook 使用说明设计

> 日期：2026-09-04
>
> 状态：待审核；本阶段只定义文档内容，不开始编码。

## 背景

当前 Storybook 已提供 Provider、Feedback、Save Flow、Navigation、Resource Picker 和 Analytics 的可交互示例，但使用者主要只能通过界面和源码推断参数含义。需要补充面向 Shopify Embedded App 接入者的文字说明，让使用者能理解每个示例的用途、参数、宿主依赖和降级行为。

## 目标

- 在 Storybook 中提供可从导航访问的 Getting Started / 使用说明。
- 为每个功能 Story 增加参数、默认值、交互行为和最小接入示例。
- 明确 Polaris `AppProvider`、`Frame`、CSS 以及 App Bridge 的宿主职责。
- 说明 App Bridge 不可用时的 fallback 行为和本地开发限制。
- 保持现有组件 API、Story 行为和构建部署路径不变。

## 非目标

- 不新增或修改组件运行时 API。
- 不改变 Polaris 默认实现、renderer 或 adapter 行为。
- 不在本阶段增加新的业务 Story 或完整 Shopify 商店 E2E。
- 不把 Storybook 示例改造成通用产品文档站点。

## 信息架构

Storybook Docs 导航按以下顺序组织：

```text
Getting Started / 使用说明
Provider/ShopifyAppKitProvider
Feedback/Polaris Feedback
Save Flow/AppSaveBar
Navigation/useAppNavigation
Resource Picker/useProductPicker
Analytics/createAnalytics
```

### Getting Started / 使用说明

包含：

- 安装 `@standhigher/shopify-app-kit`、React 和 `@shopify/polaris`。
- 宿主提供 `AppProvider`、`Frame` 和 Polaris CSS 的组合方式。
- `ShopifyAppKitProvider` 与 `ToastProvider` 的推荐层级。
- Shopify Embedded App、SSR、本地非 Shopify 环境的边界。
- App Bridge adapter 的可选接入和 host-missing fallback。
- Storybook 中如何使用 Controls、Canvas 和 Docs 面板。

### Provider

说明以下参数和行为：

| 参数 | 说明要求 |
|---|---|
| `appName` | 必填性、展示用途和示例值 |
| `locale` | `en`、`zh-CN`、区域 locale fallback |
| `messages` | 文案覆盖范围和覆盖方式 |
| `analytics` / adapters | 宿主注入和可选能力 |
| `renderers` | banner、modal、toast、saveBar 的定制边界 |

### Feedback

说明：

- `AppBanner` 的 `tone`、`title` 和内容区域。
- `AppModal` 的 `open`、`title`、`onClose`、footer 和 Escape/Backdrop 行为。
- `ToastProvider` 的 `duration`、`maxToasts`、`dedupe`。
- 默认 Polaris 组件要求宿主已提供 `AppProvider` 和 `Frame`。
- 当前 Story 的按钮操作与预期结果。

### Save Flow

说明：

- `AppSaveBar` 的 `dirty`、`onSave`、`onDiscard` 和 adapter。
- dirty 状态、保存成功、保存失败和编辑中再次修改的行为。
- App Bridge Save Bar 可用时的 adapter 路径。
- App Bridge 不可用或调用失败时的 Polaris fallback。
- 浏览器离开保护的适用边界。

### Navigation

说明：

- `navigate` 的应用内路径格式。
- `openAdmin` 的 Shopify Admin 目标限制。
- `openExternal` 的外部 HTTPS URL 安全限制。
- Shopify host 不存在时的本地开发行为。
- App Bridge adapter 的优先级与降级策略。

### Resource Picker

说明：

- `multiple`、`selectionIds` 和 `filter` 参数。
- `PickerResult` 的 selection 与 canceled 结果。
- Product/Collection picker 的能力边界。
- App Bridge 不存在时返回 canceled 的 fallback。
- 示例中“Pick products”按钮和状态文本的变化。

### Analytics

说明：

- event `name` 和标量 `attributes` 的约束。
- `createAnalytics` 的 adapters 和调用顺序。
- `useAnalytics` 与全局 analytics facade 的关系。
- `billing_event` 的 `idempotencyKey` 要求。
- 未初始化、无宿主环境和自定义 adapter 时的行为。

## 内容格式

每个功能 Docs 页面使用统一结构：

1. 用途和适用场景
2. 参数表（名称、类型、默认值、必填性）
3. 当前 Story 的操作步骤和预期结果
4. Shopify Polaris / App Bridge 前置条件
5. 最小 TypeScript/React 接入示例
6. fallback、错误和限制说明
7. 相关 API 文档链接

参数说明以公开类型和实际默认值为准；如果某项能力没有默认值或仅由 adapter 提供，必须明确标记为“宿主配置”。

## 交互与可访问性要求

- 文档示例中的按钮名称、状态文本和 Story 标题保持稳定，便于用户和 E2E 测试定位。
- 参数示例应能通过 Controls 或 Docs 中的代码直接理解，不依赖隐藏的业务上下文。
- 说明应明确 Modal 的关闭方式、Toast 的自动消失和 Save Bar 的状态变化。
- 不以截图替代参数文字；截图仅作为可选补充。

## 验收标准

- Storybook 导航中存在 Getting Started / 使用说明入口。
- 六个功能 Story 均有完整的文字说明和参数表。
- 文档明确说明 Polaris Provider/CSS 和 Shopify host/App Bridge 前置条件。
- 文档明确说明 host-missing、adapter 不可用和 fallback 行为。
- 现有 Storybook 构建、浏览器 smoke 测试和组件测试不因文档变更而改变行为。
- 文档中的链接、参数名称和示例与当前公开 API 一致。

## 后续实现边界

下一阶段实现计划应优先使用 Storybook 的 Docs/autodocs 能力复用现有 metadata；只有在参数表无法表达时，才增加独立 MDX 文档。实现完成后应运行 Storybook build、现有 E2E smoke tests 以及链接和 Markdown 格式检查。
