# Shopify App Bridge adapters

0.6.x 为 Shopify Embedded App 提供可选的 App Bridge 运行时适配。核心包不强依赖 App Bridge：

- 显式传入 Provider 的 adapter 优先级最高。
- 未传入时读取浏览器 `window.shopify`。
- SSR、非 Embedded 环境或宿主能力不存在时安全降级：Save Bar 使用 Polaris fallback，Navigation 使用浏览器导航，Picker 返回 `{ canceled: true, selection: [] }`。
- 宿主 API 抛错会原样返回给调用方；Save Bar 会记录 warning 并切换到 Polaris fallback。

宿主也可以显式创建 adapter：

```tsx
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";
import {
  createShopifyNavigationAdapter,
  createShopifyResourcePickerAdapter,
  createShopifySaveBarAdapter
} from "@standhigher/shopify-app-kit/shopify-adapters";

<ShopifyAppKitProvider
  appName="Products"
  navigation={createShopifyNavigationAdapter()}
  resourcePicker={createShopifyResourcePickerAdapter()}
  saveBar={createShopifySaveBarAdapter()}
>
  {children}
</ShopifyAppKitProvider>;
```

Resource Picker 将 Product/Collection 结果规范化为 `id`、`title`、`handle` 和可选 `imageUrl`，不会在浏览器直接调用 Admin API。`multiple`、`selectionIds` 和 `filter` 分别映射到 App Bridge picker 参数。

所有 adapter 工厂均可在 SSR 中导入；仅在调用时检测浏览器 runtime。
