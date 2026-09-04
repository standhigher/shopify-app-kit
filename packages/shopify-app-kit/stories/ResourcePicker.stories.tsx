import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ShopifyAppKitProvider } from "../src/core";
import { useProductPicker } from "../src/resource-picker";
function PickerDemo() { const picker = useProductPicker(); const [result, setResult] = useState("No selection"); return <div style={{ padding: 24 }}><button onClick={async () => { const value = await picker.open({ multiple: true }); setResult(value.canceled ? "Canceled" : value.selection.map((item) => item.title ?? item.id).join(", ")); }}>Pick products</button><p role="status">{result}</p></div>; }
const meta = {
  title: "Resource Picker/useProductPicker",
  component: PickerDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "useProductPicker().open(options) 接收 multiple、selectionIds 和 filter。返回 PickerResult，包含 canceled 和 selection；没有 Product Picker adapter 时返回 canceled: true 与空 selection。真实 Embedded App 需要宿主提供 App Bridge 或自定义 resourcePicker adapter。",
        story: "点击 Pick products 查看 host-free fallback。接入真实 adapter 后，multiple、selectionIds 和 filter 会传递给宿主 picker。"
      }
    }
  }
} satisfies Meta<typeof PickerDemo>;
export default meta;
export const HostFallback: StoryObj<typeof meta> = { render: () => <ShopifyAppKitProvider appName="Demo"><PickerDemo /></ShopifyAppKitProvider> };
