import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ShopifyAppKitProvider } from "../src/core";
import { useProductPicker } from "../src/resource-picker";
import { FeatureDocs } from "./docs/FeatureDocs";
function PickerDemo() { const picker = useProductPicker(); const [result, setResult] = useState("No selection"); return <div style={{ padding: 24 }}><button onClick={async () => { const value = await picker.open({ multiple: true }); setResult(value.canceled ? "Canceled" : value.selection.map((item) => item.title ?? item.id).join(", ")); }}>Pick products</button><p role="status">{result}</p></div>; }
const meta = {
  title: "Resource Picker/useProductPicker",
  component: PickerDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <FeatureDocs
          summary={<p>通过 Product Picker 让商家选择一个或多个商品，并将标准化结果交给应用处理。</p>}
          parameters={
            <table>
              <thead><tr><th>参数</th><th>类型</th><th>说明</th></tr></thead>
              <tbody>
                <tr><td><code>multiple</code></td><td><code>boolean</code></td><td>是否允许多选。</td></tr>
                <tr><td><code>selectionIds</code></td><td><code>string[]</code></td><td>打开 Picker 时预选的商品 ID。</td></tr>
                <tr><td><code>filter</code></td><td><code>string</code></td><td>传递给宿主 Picker 的筛选条件。</td></tr>
              </tbody>
            </table>
          }
          steps={<ol><li>点击 <strong>Pick products</strong>。</li><li>观察下方状态文本中的选择或取消结果。</li></ol>}
          hostRequirements={<p>生产 Embedded App 需要 Shopify App Bridge 或自定义 <code>resourcePicker</code> adapter；宿主还应提供 Polaris <code>AppProvider</code>、<code>Frame</code> 和 CSS。</p>}
          fallback={<p>当前示例没有连接 Shopify host，因此返回 <code>{"{ canceled: true, selection: [] }"}</code>。这只用于本地开发和测试。</p>}
          notes={<p>Product Picker 与 Collection Picker 共用 <code>PickerOptions</code> 和 <code>PickerResult</code> 类型。</p>}
        />
      ),
      description: {
        component: "选择商品并返回标准化 PickerResult。"
      }
    }
  }
} satisfies Meta<typeof PickerDemo>;
export default meta;
export const HostFallback: StoryObj<typeof meta> = { render: () => <ShopifyAppKitProvider appName="Demo"><PickerDemo /></ShopifyAppKitProvider> };
