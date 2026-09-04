import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AppSaveBar } from "../src/save-flow";

function SaveDemo() { const [dirty, setDirty] = useState(true); return <div style={{ padding: 24 }}><p>Change the draft, then save or discard.</p><button onClick={() => setDirty(true)}>Edit draft</button><AppSaveBar dirty={dirty} onSave={() => setDirty(false)} onDiscard={() => setDirty(false)} />{!dirty ? <p role="status">Saved</p> : null}</div>; }
const meta = {
  title: "Save Flow/AppSaveBar",
  component: SaveDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "AppSaveBar 在 dirty 为 true 时显示保存流程。dirty 控制可见性，onSave 和 onDiscard 分别处理保存与丢弃，saving 可用于禁用操作并展示 loading，id 默认是 app-kit-save-bar。App Bridge Save Bar 可用时优先使用 adapter；不可用或调用失败时回退到 Polaris ContextualSaveBar。",
        story: "示例初始为 dirty。点击 Save 或 Discard 后会显示 Saved；点击 Edit draft 可重新进入 dirty 状态。"
      }
    }
  }
} satisfies Meta<typeof SaveDemo>;
export default meta;
export const DirtyDraft: StoryObj<typeof meta> = { render: () => <SaveDemo /> };
