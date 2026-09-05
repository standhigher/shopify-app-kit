import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ShopifyAppKitProvider } from "../src/providers/ShopifyAppKitProvider";
import { AppSaveBar } from "../src/save-flow";

const storySaveBarAdapter = { show: () => undefined, hide: () => undefined };

function SaveDemo() {
  const [dirty, setDirty] = useState(true);
  return (
    <ShopifyAppKitProvider appName="Storybook" saveBar={storySaveBarAdapter}>
      <div style={{ padding: 24 }}>
        <p>Change the draft, then save or discard.</p>
        <button onClick={() => setDirty(true)}>Edit draft</button>
        <AppSaveBar dirty={dirty} onSave={() => setDirty(false)} onDiscard={() => setDirty(false)} />
        {!dirty ? <p role="status">Saved</p> : null}
      </div>
    </ShopifyAppKitProvider>
  );
}
const meta = {
  title: "Save Flow/AppSaveBar",
  component: SaveDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "AppSaveBar 在 dirty 为 true 时显示 Shopify App Bridge 原生 ui-save-bar。dirty 控制可见性，onSave 和 onDiscard 分别处理保存与丢弃，saving 可用于禁用操作并展示 loading，id 默认是 app-kit-save-bar。没有 adapter 时默认不渲染；如需自定义 UI，请通过 renderers.saveBar 传入。",
        story: "示例初始为 dirty。点击 Save 或 Discard 后会显示 Saved；点击 Edit draft 可重新进入 dirty 状态。"
      }
    }
  }
} satisfies Meta<typeof SaveDemo>;
export default meta;
export const DirtyDraft: StoryObj<typeof meta> = { render: () => <SaveDemo /> };
